import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { SearchContainer, SearchInput, SearchIcon } from "./styles.js";

const SearchBar = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (!term.trim()) {
        try {
          const response = await axios.get("http://localhost:8800/");
          onSearchResults(response.data);
        } catch (error) {
          toast.error("Erro ao carregar todas as tarefas");
        }
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8800/search?searchTerm=${term}`
        );
        onSearchResults(response.data);
      } catch (error) {
        toast.error("Erro ao pesquisar tarefas");
      }
    }, 300),
    [onSearchResults]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    debouncedSearch(newSearchTerm);
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Pesquisar tarefas..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <SearchIcon />
    </SearchContainer>
  );
};

export default SearchBar;
