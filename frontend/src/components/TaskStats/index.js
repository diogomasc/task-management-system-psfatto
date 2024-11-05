import React, { useState, useEffect } from "react";
import axios from "axios";
import { StatsContainer, StatItem } from "./styles";

const TaskStats = ({ updateTrigger }) => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    highValueTasks: 0,
  });

  const fetchStats = async () => {
    try {
      const countResponse = await axios.get("http://localhost:8800/count");

      const tasksResponse = await axios.get("http://localhost:8800/");

      const highValueCount = tasksResponse.data.filter(
        (task) => task.value >= 1000
      ).length;

      setStats({
        totalTasks: countResponse.data.count,
        highValueTasks: highValueCount,
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [updateTrigger]);

  return (
    <StatsContainer>
      <StatItem>
        Total de tarefas:<span>{stats.totalTasks}</span>
      </StatItem>
      <StatItem>
        Tarefas de alto valor (≥ R$ 1.000):<span>{stats.highValueTasks}</span>
      </StatItem>
    </StatsContainer>
  );
};

export default TaskStats;
