/**
 * @module Form
 * @description Módulo que implementa um formulário para criação e edição de tarefas, com validações e formatação de valores
 */

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  FormContainer,
  FormGroup,
  Label,
  Input,
  Button,
  Title,
  LabelContainer,
  ErrorMessage,
  CharCounter,
  ButtonGroup,
} from "./styles";

/**
 * Formata um valor numérico para exibição em formato monetário (R$ X.XXX,XX)
 * @param {number|string} value - Valor a ser formatado
 * @returns {string} Valor formatado em reais
 */
const formatCurrency = (value) => {
  if (!value) return "R$ 0,00";

  let numericValue;
  if (typeof value === "string") {
    const cleanValue = value.replace(/\D/g, "");
    numericValue = parseInt(cleanValue);
  } else {
    numericValue = Math.round(value * 100);
  }

  const formatted = (numericValue / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `R$ ${formatted}`;
};

/**
 * Converte uma string formatada em valor numérico
 * @param {string} value - String formatada em reais
 * @returns {number} Valor numérico
 */
const deformatCurrency = (value) => {
  if (typeof value !== "string") return 0;
  const numbers = value.replace(/[^\d,]/g, "").replace(",", ".");
  return parseFloat(numbers);
};

/**
 * Componente de formulário para criar/editar tarefas
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.task - Tarefa a ser editada (opcional)
 * @param {Function} props.onClose - Função para fechar o formulário
 * @param {Function} props.onSuccess - Função chamada após sucesso na submissão
 * @returns {JSX.Element} Componente renderizado
 */
const Form = ({ task, onClose, onSuccess }) => {
  /**
   * Estado do formulário
   * @type {[Object, Function]} Estado e função para atualizar o formulário
   */
  const [formData, setFormData] = useState({
    description: task?.description || "",
    value: "R$ 0,00",
    deadline: task?.deadline
      ? new Date(task.deadline).toISOString().split("T")[0]
      : "",
  });

  useEffect(() => {
    if (task?.value) {
      setFormData((prev) => ({
        ...prev,
        value: formatCurrency(task.value),
      }));
    }
  }, [task]);

  /**
   * Estado dos erros de validação
   * @type {[Object, Function]} Estado e função para atualizar os erros
   */
  const [errors, setErrors] = useState({});

  /**
   * Estado de submissão do formulário
   * @type {[boolean, Function]} Estado e função para atualizar status de submissão
   */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Valida os campos do formulário
   * @returns {boolean} Indica se o formulário é válido
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = "A descrição é obrigatória";
    } else if (formData.description.length > 100) {
      newErrors.description = "A descrição deve ter no máximo 100 caracteres";
    }

    const currencyValue = deformatCurrency(formData.value);
    if (!formData.value || currencyValue <= 0) {
      newErrors.value = "O valor deve ser maior que zero";
    }

    if (!formData.deadline) {
      newErrors.deadline = "O prazo é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Manipula mudanças nos campos do formulário
   * @param {Object} e - Evento de mudança
   * @param {Object} e.target - Elemento que disparou o evento
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    try {
      if (name === "description") {
        const truncatedValue = value.slice(0, 100);
        setFormData((prev) => ({
          ...prev,
          [name]: truncatedValue,
        }));
      } else if (name === "value") {
        const formattedValue = formatCurrency(value);
        setFormData((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    } catch (error) {
      console.error("Erro ao processar alteração:", error);
      toast.error("Erro ao processar o valor inserido");
    }
  };

  /**
   * Manipula a submissão do formulário
   * @param {Object} e - Evento de submissão
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      toast.error("Por favor, preencha todos os campos corretamente");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = task
        ? `http://localhost:8800/${task.id}`
        : "http://localhost:8800/";
      const method = task ? "put" : "post";

      const currencyValue = deformatCurrency(formData.value);

      await axios[method](endpoint, {
        description: formData.description,
        value: currencyValue,
        deadline: formData.deadline,
      });

      toast.success(
        task ? "Tarefa atualizada com sucesso!" : "Tarefa criada com sucesso!"
      );

      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Erro ao processar a requisição";

      if (error.response?.status === 409) {
        toast.error("Já existe uma tarefa com esta descrição");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isHighValue = deformatCurrency(formData.value) >= 1000;
  const remainingChars = 100 - formData.description.length;
  const isCharLimitReached = remainingChars === 0;

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Title>{task ? "Editar Tarefa" : "Nova Tarefa"}</Title>

      <FormGroup>
        <LabelContainer>
          <Label htmlFor="description">Descrição</Label>
          <CharCounter $isLimit={isCharLimitReached}>
            {remainingChars} caracteres restantes
          </CharCounter>
        </LabelContainer>
        <Input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Digite a descrição da tarefa"
          maxLength={100}
        />
        {errors.description && (
          <ErrorMessage>{errors.description}</ErrorMessage>
        )}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="value">Valor</Label>
        <Input
          type="text"
          id="value"
          name="value"
          value={formData.value}
          onChange={handleChange}
          placeholder="R$ 000,00"
          $isHighValue={isHighValue}
        />
        {errors.value && <ErrorMessage>{errors.value}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="deadline">Prazo</Label>
        <Input
          type="date"
          id="deadline"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
        />
        {errors.deadline && <ErrorMessage>{errors.deadline}</ErrorMessage>}
      </FormGroup>

      <ButtonGroup>
        <Button type="button" onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" $primary disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : task ? "Atualizar" : "Criar"}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default Form;
