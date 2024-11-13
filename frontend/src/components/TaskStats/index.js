/**
 * @module TaskStats
 * @description Módulo que implementa um componente de estatísticas de tarefas, exibindo totais e métricas importantes
 */

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { StatsContainer, StatItem } from "./styles";

/**
 * Componente que exibe estatísticas das tarefas
 * @param {Object} props - Propriedades do componente
 * @param {number} props.updateTrigger - Gatilho para atualização das estatísticas
 * @returns {JSX.Element} Componente renderizado
 */
const TaskStats = ({ updateTrigger }) => {
  /**
   * Estado para armazenar as estatísticas
   * @type {[Object, Function]} Estado e função para atualizar as estatísticas
   */
  const [stats, setStats] = useState({
    totalTasks: 0,
    highValueTasks: 0,
  });

  /**
   * Busca as estatísticas das tarefas na API
   * @returns {Promise<void>} Promise que resolve quando os dados são obtidos
   */
  const fetchStats = useCallback(async () => {
    try {
      const [countResponse, tasksResponse] = await Promise.all([
        axios.get("http://localhost:8800/count"),
        axios.get("http://localhost:8800/"),
      ]);

      const highValueCount = tasksResponse.data.reduce(
        (count, task) => (task.value >= 1000 ? count + 1 : count),
        0
      );

      setStats({
        totalTasks: countResponse.data.count,
        highValueTasks: highValueCount,
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [updateTrigger, fetchStats]);

  return (
    <StatsContainer>
      <StatItem>
        Total de tarefas:<span>{stats.totalTasks}</span>
      </StatItem>
      <StatItem isHighValue>
        Tarefas de alto valor (≥ R$ 1.000):<span>{stats.highValueTasks}</span>
      </StatItem>
    </StatsContainer>
  );
};

export default TaskStats;
