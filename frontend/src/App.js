/**
 * @module App
 * @description Módulo principal da aplicação que gerencia o estado global e renderiza os componentes principais
 */

import GlobalStyle from "./styles/global";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import Grid from "./components/Grid/index.js";
import SearchBar from "./components/SearchBar/index.js";
import TaskStats from "./components/TaskStats/index.js";
import { AppContainer, Title, NoResultsMessage } from "./styles/App.styles";
import "react-toastify/dist/ReactToastify.css";

/**
 * Componente principal da aplicação
 * @returns {JSX.Element} Componente renderizado
 */
function App() {
  /**
   * Estado para controlar a abertura/fechamento do modal
   * @type {[boolean, Function]} Estado e função para atualizar o modal
   */
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Estado para armazenar a tarefa selecionada
   * @type {[Object|null, Function]} Estado e função para atualizar a tarefa selecionada
   */
  const [selectedTask, setSelectedTask] = useState(null);

  /**
   * Estado para armazenar as tarefas filtradas
   * @type {[Array|null, Function]} Estado e função para atualizar as tarefas filtradas
   */
  const [filteredTasks, setFilteredTasks] = useState(null);

  /**
   * Estado para controlar a atualização das estatísticas
   * @type {[number, Function]} Estado e função para atualizar o gatilho
   */
  const [statsUpdateTrigger, setStatsUpdateTrigger] = useState(0);

  /**
   * Abre o modal de edição/criação de tarefa
   * @param {Object|null} task - Tarefa a ser editada ou null para criar nova
   */
  const handleOpenModal = (task = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  /**
   * Fecha o modal e atualiza as estatísticas
   */
  const handleCloseModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
    setStatsUpdateTrigger((prev) => prev + 1);
  };

  /**
   * Atualiza as tarefas filtradas com os resultados da busca
   * @param {Array} results - Resultados da busca
   */
  const handleSearchResults = (results) => {
    setFilteredTasks(results);
  };

  /**
   * Atualiza o gatilho de estatísticas quando uma tarefa é modificada
   */
  const handleTaskUpdate = () => {
    setStatsUpdateTrigger((prev) => prev + 1);
  };

  return (
    <AppContainer>
      <Title>Gerenciador de Tarefas</Title>
      <SearchBar onSearchResults={handleSearchResults} />
      <TaskStats updateTrigger={statsUpdateTrigger} />
      {filteredTasks && filteredTasks.length === 0 ? (
        <NoResultsMessage>
          Nenhuma tarefa correspondente foi encontrada.
        </NoResultsMessage>
      ) : (
        <Grid
          isModalOpen={isModalOpen}
          selectedTask={selectedTask}
          onOpenModal={handleOpenModal}
          onCloseModal={handleCloseModal}
          onTaskUpdate={handleTaskUpdate}
          initialTasks={filteredTasks}
        />
      )}
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <GlobalStyle />
    </AppContainer>
  );
}

export default App;
