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

  const handleEdit = (e) => {
    e.stopPropagation();
    onOpenModal(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task);
  };

  const handleMoveUp = (e) => {
    e.stopPropagation();
    onMove(task.id, "up");
  };

  const handleMoveDown = (e) => {
    e.stopPropagation();
    onMove(task.id, "down");
  };

  const formatCurrency = (value) => {
    if (!value) return "R$ 0,00";

    let numericValue;

    if (typeof value === "string") {
      const cleanValue = value.replace(/\D/g, "");
      numericValue = parseInt(cleanValue);
    } else {
      numericValue = value;
    }

    const formatted = numericValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatted;
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

function Grid({
  isModalOpen,
  selectedTask,
  onOpenModal,
  onCloseModal,
  onTaskUpdate,
  initialTasks,
}) {
  const [tasks, setTasks] = useState([]);
  const [deleteTask, setDeleteTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (initialTasks) {
      setTasks(initialTasks);
    } else {
      fetchTasks();
    }
  }, [initialTasks]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8800/");
      setTasks(response.data);
    } catch (error) {
      toast.error("Erro ao carregar tarefas");
    }
  };

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

      setTasks((tasks) => arrayMove(tasks, oldIndex, newIndex));

      await axios.put(`http://localhost:8800/${taskId}/order`, {
        newOrder: newOrder,
      });

      toast.success("Ordem atualizada com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar ordem");
      fetchTasks();
    }
  };

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

      setTasks((tasks) => arrayMove(tasks, taskIndex, newIndex));
      toast.success("Ordem atualizada com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar ordem");
      fetchTasks();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTask) return;

    try {
      await axios.delete(`http://localhost:8800/${deleteTask.id}`);
      setTasks(tasks.filter((t) => t.id !== deleteTask.id));
      onTaskUpdate();
      toast.success("Tarefa excluída com sucesso");
    } catch (error) {
      toast.error("Erro ao excluir tarefa");
    }
    setDeleteTask(null);
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
}

export default Grid;
