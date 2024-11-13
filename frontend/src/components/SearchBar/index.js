/**
 * @module SearchBar
 * @description Módulo que implementa uma barra de pesquisa com debounce para otimização de requisições e busca de tarefas
 */

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { SearchContainer, SearchInput, SearchIcon } from "./styles.js";

/**
 * Componente de barra de pesquisa com debounce para otimizar requisições
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onSearchResults - Função callback que recebe os resultados da pesquisa
 * @returns {JSX.Element} Componente renderizado
 */
const SearchBar = ({ onSearchResults }) => {
  /**
   * Estado para controlar o termo de busca
   * @type {[string, Function]} Estado e função para atualizar o termo de busca
   */
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Função para buscar tarefas na API
   * @param {string} term - Termo de busca
   * @returns {Promise<void>} Promise que resolve quando a busca é concluída
   */
  const fetchTasks = async (term) => {
    const endpoint = term.trim()
      ? `http://localhost:8800/search?searchTerm=${encodeURIComponent(term)}`
      : "http://localhost:8800/";

    try {
      const { data } = await axios.get(endpoint);
      onSearchResults(data);
    } catch (error) {
      const errorMessage = term.trim()
        ? "Erro ao pesquisar tarefas"
        : "Erro ao carregar todas as tarefas";
      toast.error(errorMessage);
      console.error(error);
    }
  };

  /**
   * Memoriza a função de busca com debounce para evitar requisições desnecessárias
   * @type {Function} Função de busca com debounce aplicado
   */
  const debouncedSearch = useCallback(
    debounce((term) => {
      fetchTasks(term);
    }, 300),
    [onSearchResults]
  );

  /**
   * Efeito para limpar o debounce quando o componente é desmontado
   */
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  /**
   * Handler para atualizar o termo de busca e disparar a pesquisa
   * @param {Object} event - Evento de mudança do input
   * @param {Object} event.target - Elemento que disparou o evento
   * @param {string} event.target.value - Novo valor do input
   */
  const handleSearchChange = ({ target: { value } }) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Pesquisar tarefas..."
        value={searchTerm}
        onChange={handleSearchChange}
        aria-label="Campo de pesquisa de tarefas"
      />
      <SearchIcon />
    </SearchContainer>
  );
};

export default SearchBar;
