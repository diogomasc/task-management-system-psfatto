<div align="center">
  <h1>Task Management System</h1>
  <h3>Processo Seletivo Fatto Consultoria e Sistemas 2024</h3>

  <a href="https://github.com/topics/react">
    <img src="https://img.shields.io/badge/Frontend-React-61dafb.svg" alt="React">
  </a>
  <a href="https://github.com/topics/nodejs">
    <img src="https://img.shields.io/badge/Backend-Node.js-339933.svg" alt="Node.js">
  </a>
  <a href="https://github.com/topics/mysql">
    <img src="https://img.shields.io/badge/Database-MySQL-4479A1.svg" alt="MySQL">
  </a>
  <a href="https://github.com/topics/javascript">
    <img src="https://img.shields.io/badge/Language-JavaScript-3178C6.svg" alt="JavaScript">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
  </a>
  <br>
  <a href="https://www.linkedin.com/in/diogomasc/">
    <img src="https://img.shields.io/badge/LinkedIn-Diogo_Mascarenhas-0077B5.svg" alt="LinkedIn">
  </a>
</div>

## 📑 Documentação

### <a href="./frontend/README.md"><img src="https://img.shields.io/badge/Frontend-Documentation-61dafb.svg" alt="Frontend Docs"/></a> 
Contém o código React, incluindo componentes de listagem, busca, formulários e notificações.

### <a href="./backend/README.md"><img src="https://img.shields.io/badge/Backend-Documentation-339933.svg" alt="Backend Docs"/></a>
Contém o código Node.js e Express para gerenciamento das APIs REST e integração com o banco MySQL. Documentação completa das rotas.


## Descrição

Este é um sistema web para gerenciamento de tarefas, desenvolvido utilizando React no frontend, Node.js no backend e MySQL para armazenamento de dados. A aplicação permite criar, editar, excluir e reordenar tarefas com uma interface moderna e intuitiva. Possui funcionalidades avançadas, como drag-and-drop para reorganização e validações personalizadas. Cada tarefa conta com um identificador único, nome, custo, data limite e uma ordem de apresentação definida pelo usuário. Tarefas com custo igual ou superior a R$1.000,00 são destacadas visualmente para facilitar a identificação.

## Tecnologias

- **Frontend**: React
- **Backend**: Node.js + Express
- **Banco de Dados**: MySQL

## Funcionalidades Principais

- **CRUD Completo**: Criação, leitura, atualização e exclusão de tarefas.
- **Reordenação por Drag-and-Drop**: O usuário pode arrastar e soltar tarefas para mudar sua ordem.
- **Reordenação por Botões**: Alternativa para usuários que preferem reorganizar sem arrastar.
- **Validação de Dados**: Verificação de duplicidade no nome da tarefa e obrigatoriedade dos campos.
- **Interface Responsiva**: Adaptada para diversos dispositivos, mantendo a usabilidade.
- **Destaque Visual para Tarefas com Custo Elevado**: Tarefas com custo ≥ R$1.000,00 têm fundo amarelo para fácil identificação.

Para obter mais informações sobre cada parte do sistema, consulte os `README.md` dentro de cada diretório.

## Como Clonar e Testar a Aplicação Full-Stack

1. Clone o repositório:

   ```bash
   git clone https://github.com/diogomasc/task-management-system-psfatto.git
   cd task-management-system-psfatto
   ```

2. Configure o **Backend**:

   - Acesse a pasta do backend:
     ```bash
     cd backend
     ```
   - Instale as dependências:
     ```bash
     npm install
     ```
   - Configure o banco de dados MySQL, criando um banco de dados conforme as instruções no [README.md do backend](./backend/README.md).
   - Inicie o servidor:
     ```bash
     npm start
     ```

3. Configure o **Frontend**:

   - Acesse a pasta do frontend:
     ```bash
     cd ../frontend
     ```
   - Instale as dependências:
     ```bash
     npm install
     ```
   - Inicie o servidor de desenvolvimento:
     ```bash
     npm start
     ```

4. Acesse a aplicação no navegador em [http://localhost:3000](http://localhost:3000).

A aplicação full-stack estará pronta para uso e permitirá interação com todas as funcionalidades do sistema de gerenciamento de tarefas.

## Autor

Desenvolvido por Diogo Mascarenhas.
LinkedIn: [Perfil no LinkedIn](https://www.linkedin.com/in/diogomasc/)
