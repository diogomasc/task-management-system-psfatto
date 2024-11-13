/**
 * @module Grid
 * @description Módulo que implementa uma grade de tarefas com funcionalidades de drag and drop e ordenação
 */

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FaArrowUp,
  FaArrowDown,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import Form from "../Form/index.js";
import {
  TaskRow,
  TaskInfo,
  TaskDescription,
  TaskDetails,
  ButtonGroup,
  IconButton,
  GridContainer,
  AddButton,
  Overlay,
  Modal,
  DeleteDialog,
  DialogButtons,
  DialogButton,
} from "./styles.js";

/**
 * Componente que representa um item de tarefa ordenável
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.task - Objeto contendo os dados da tarefa
 * @param {number} props.index - Índice da tarefa na lista
 * @param {Function} props.onOpenModal - Função para abrir o modal de edição
 * @param {Function} props.onDelete - Função para deletar a tarefa
 * @param {Function} props.onMove - Função para mover a tarefa
 * @param {number} props.tasksLength - Quantidade total de tarefas
 * @returns {JSX.Element} Componente renderizado
 */
const SortableTaskItem = ({
  task,
  index,
  onOpenModal,
  onDelete,
  onMove,
  tasksLength,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  /**
   * Handler para edição de tarefa
   * @param {Event} e - Evento do click
   */
  const handleEdit = async (e) => {
    e.stopPropagation();
    await onOpenModal(task);
  };

  /**
   * Handler para exclusão de tarefa
   * @param {Event} e - Evento do click
   */
  const handleDelete = async (e) => {
    e.stopPropagation();
    await onDelete(task);
  };

  /**
   * Handler para mover tarefa para cima
   * @param {Event} e - Evento do click
   */
  const handleMoveUp = async (e) => {
    e.stopPropagation();
    await onMove(task.id, "up");
  };

  /**
   * Handler para mover tarefa para baixo
   * @param {Event} e - Evento do click
   */
  const handleMoveDown = async (e) => {
    e.stopPropagation();
    await onMove(task.id, "down");
  };

  /**
   * Formata valor monetário para o padrão brasileiro
   * @param {number|string} value - Valor a ser formatado
   * @returns {string} Valor formatado
   */
  const formatCurrency = (value) => {
    if (!value) return "R$ 0,00";

    try {
      const numericValue =
        typeof value === "string" ? parseInt(value.replace(/\D/g, "")) : value;

      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericValue);
    } catch (error) {
      console.error("Erro ao formatar moeda:", error);
      return "R$ 0,00";
    }
  };

  return (
    <TaskRow ref={setNodeRef} style={style} $value={task.value}>
      <div
        {...attributes}
        {...listeners}
        style={{ flex: 1, display: "flex", alignItems: "center" }}
      >
        <TaskInfo>
          <TaskDescription>{task.description}</TaskDescription>
          <TaskDetails>
            Valor: {formatCurrency(task.value)} | Prazo:{" "}
            {new Date(task.deadline).toLocaleDateString()}
          </TaskDetails>
        </TaskInfo>
      </div>
      <ButtonGroup>
        <IconButton
          onClick={handleMoveUp}
          $disabled={index === 0}
          title="Mover para cima"
        >
          <FaArrowUp />
        </IconButton>
        <IconButton
          onClick={handleMoveDown}
          $disabled={index === tasksLength - 1}
          title="Mover para baixo"
        >
          <FaArrowDown />
        </IconButton>
        <IconButton
          onClick={handleEdit}
          $color="#007bff"
          $hoverColor="#0056b3"
          title="Editar"
        >
          <FaEdit />
        </IconButton>
        <IconButton
          onClick={handleDelete}
          $color="#dc3545"
          $hoverColor="#c82333"
          title="Excluir"
        >
          <FaTrash />
        </IconButton>
      </ButtonGroup>
    </TaskRow>
  );
};

/**
 * Componente principal que gerencia a grade de tarefas
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isModalOpen - Estado do modal
 * @param {Object} props.selectedTask - Tarefa selecionada para edição
 * @param {Function} props.onOpenModal - Função para abrir o modal
 * @param {Function} props.onCloseModal - Função para fechar o modal
 * @param {Function} props.onTaskUpdate - Função para atualizar tarefas
 * @param {Array} props.initialTasks - Lista inicial de tarefas
 * @returns {JSX.Element} Componente renderizado
 */
const Grid = ({
  isModalOpen,
  selectedTask,
  onOpenModal,
  onCloseModal,
  onTaskUpdate,
  initialTasks,
}) => {
  const [tasks, setTasks] = useState([]);
  const [deleteTask, setDeleteTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Busca tarefas da API
   */
  const fetchTasks = async () => {
    try {
      const { data } = await axios.get("http://localhost:8800/");
      setTasks(data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
      toast.error("Erro ao carregar tarefas");
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      if (initialTasks) {
        setTasks(initialTasks);
      } else {
        await fetchTasks();
      }
    };

    loadTasks();
  }, [initialTasks]);

  /**
   * Handler para finalizar o drag and drop
   * @param {Object} event - Evento do drag and drop
   */
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex(
      (task) => task.id.toString() === active.id
    );
    const newIndex = tasks.findIndex((task) => task.id.toString() === over.id);

    if (oldIndex === newIndex) return;

    try {
      const taskId = tasks[oldIndex].id;
      const newOrder = tasks[newIndex].display_order;

      setTasks((prevTasks) => arrayMove(prevTasks, oldIndex, newIndex));

      await axios.put(`http://localhost:8800/${taskId}/order`, { newOrder });
      toast.success("Ordem atualizada com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar ordem:", error);
      toast.error("Erro ao atualizar ordem");
      await fetchTasks();
    }
  };

  /**
   * Handler para mover tarefas com botões
   * @param {number} taskId - ID da tarefa
   * @param {string} direction - Direção do movimento ('up' ou 'down')
   */
  const handleMove = async (taskId, direction) => {
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    const newIndex = direction === "up" ? taskIndex - 1 : taskIndex + 1;

    if (newIndex < 0 || newIndex >= tasks.length) {
      toast.warning(
        `Não é possível mover a tarefa para ${
          direction === "up" ? "cima" : "baixo"
        }`
      );
      return;
    }

    try {
      await axios.put(`http://localhost:8800/${taskId}/order`, {
        newOrder: tasks[newIndex].display_order,
      });

      setTasks((prevTasks) => arrayMove(prevTasks, taskIndex, newIndex));
      toast.success("Ordem atualizada com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar ordem:", error);
      toast.error("Erro ao atualizar ordem");
      await fetchTasks();
    }
  };

  /**
   * Confirma e executa a exclusão de uma tarefa
   */
  const confirmDelete = async () => {
    if (!deleteTask) return;

    try {
      await axios.delete(`http://localhost:8800/${deleteTask.id}`);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== deleteTask.id));
      onTaskUpdate();
      toast.success("Tarefa excluída com sucesso");
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      toast.error("Erro ao excluir tarefa");
    } finally {
      setDeleteTask(null);
    }
  };

  return (
    <div className="grid-container">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tasks.map((task) => task.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          <GridContainer>
            {tasks.map((task, index) => (
              <SortableTaskItem
                key={task.id}
                task={task}
                index={index}
                onOpenModal={onOpenModal}
                onDelete={setDeleteTask}
                onMove={handleMove}
                tasksLength={tasks.length}
              />
            ))}
          </GridContainer>
        </SortableContext>
      </DndContext>

      <AddButton onClick={() => onOpenModal(null)}>
        <FaPlus /> Adicionar Tarefa
      </AddButton>

      {isModalOpen && (
        <>
          <Overlay onClick={onCloseModal} />
          <Modal>
            <Form
              task={selectedTask}
              onClose={onCloseModal}
              onSuccess={fetchTasks}
            />
          </Modal>
        </>
      )}

      {deleteTask && (
        <>
          <Overlay onClick={() => setDeleteTask(null)} />
          <DeleteDialog>
            <h3>Confirmar exclusão</h3>
            <p>Deseja realmente excluir a tarefa "{deleteTask.description}"?</p>
            <DialogButtons>
              <DialogButton onClick={() => setDeleteTask(null)}>
                Cancelar
              </DialogButton>
              <DialogButton $primary onClick={confirmDelete}>
                Confirmar
              </DialogButton>
            </DialogButtons>
          </DeleteDialog>
        </>
      )}
    </div>
  );
};

export default Grid;
