import React, { useState } from "react";
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

const deformatCurrency = (value) => {
  const numbers = value.replace(/[^\d,]/g, "").replace(",", ".");
  return parseFloat(numbers);
};

function Form({ task, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    description: task?.description || "",
    value: task?.value ? formatCurrency(task.value) : "R$ 0,00",
    deadline: task?.deadline
      ? new Date(task.deadline).toISOString().split("T")[0]
      : "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = "A descrição é obrigatória";
    } else if (formData.description.length > 100) {
      newErrors.description = "A descrição deve ter no máximo 100 caracteres";
    }

    if (!formData.value || deformatCurrency(formData.value) <= 0) {
      newErrors.value = "O valor deve ser maior que zero";
    }

    if (!formData.deadline) {
      newErrors.deadline = "O prazo é obrigatório";
    } else {
      const selectedDate = new Date(formData.deadline);
      if (selectedDate < new Date(new Date().setHours(0, 0, 0, 0))) {
        newErrors.deadline = "O prazo não pode ser anterior à data atual";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos corretamente");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = task
        ? `http://localhost:8800/${task.id}`
        : "http://localhost:8800/";
      const method = task ? "put" : "post";

      await axios[method](endpoint, {
        description: formData.description,
        value: deformatCurrency(formData.value),
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
}

export default Form;
