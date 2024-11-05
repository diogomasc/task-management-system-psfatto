import GlobalStyle from "./styles/global";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import Grid from "./components/Grid/index.js";
import SearchBar from "./components/SearchBar/index.js";
import TaskStats from "./components/TaskStats/index.js";
import "react-toastify/dist/ReactToastify.css";

const AppContainer = styled.div`
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const NoResultsMessage = styled.p`
  text-align: center;
  color: #777;
  margin-top: 2rem;
  font-size: 1.1rem;
`;

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState(null);
  const [statsUpdateTrigger, setStatsUpdateTrigger] = useState(0);

  const handleOpenModal = (task = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
    setStatsUpdateTrigger((prev) => prev + 1);
  };

  const handleSearchResults = (results) => {
    setFilteredTasks(results);
  };

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
