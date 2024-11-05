Documentação API:

Projeto Backend: API RESTful de Gerenciamento de Tarefas
Descrição do Projeto
Este projeto é uma API RESTful para gerenciamento de tarefas, desenvolvida utilizando Node.js com o framework Express e banco de dados MySQL. A API foi criada com o objetivo de gerenciar tarefas de forma eficiente, utilizando uma estrutura CRUD (Create, Read, Update, Delete) para manipular os dados das tarefas, incluindo funcionalidades avançadas como ordenação dinâmica e pesquisa.

A base de dados é mantida em um servidor MySQL, garantindo persistência e confiabilidade dos dados. O sistema permite o gerenciamento completo de tarefas, incluindo ordem de exibição personalizada, descrição, valor e prazo.

Funcionalidades Principais
A API oferece as seguintes rotas para operações:

GET /: Retorna todas as tarefas cadastradas ordenadas por display_order
POST /: Cria uma nova tarefa
PUT /:id: Atualiza os dados de uma tarefa específica
PUT /:id/order: Atualiza a ordem de exibição de uma tarefa
DELETE /:id: Deleta uma tarefa específica
GET /search: Pesquisa tarefas por descrição
GET /count: Obtém o total de tarefas cadastradas
Estrutura de Dados
Cada tarefa possui os seguintes campos:

id: Identificador único da tarefa (AUTO_INCREMENT)
display_order: Ordem de exibição da tarefa (UNIQUE)
description: Descrição da tarefa (UNIQUE)
value: Valor monetário da tarefa
deadline: Prazo para conclusão da tarefa
Bibliotecas Utilizadas
O projeto utiliza as seguintes bibliotecas:

Express: Framework web para Node.js que facilita a criação de APIs RESTful
Nodemon: Ferramenta que monitora alterações no código e reinicia automaticamente o servidor
MySQL: Driver para conexão com o banco de dados MySQL
Cors: Middleware para habilitar o CORS (Cross-Origin Resource Sharing)
Métodos HTTP e Códigos de Status
A API utiliza os seguintes códigos de status HTTP:

200 OK: Operação realizada com sucesso
201 Created: Novo recurso criado com sucesso
400 Bad Request: Requisição inválida ou nova ordem inválida
404 Not Found: Recurso não encontrado
409 Conflict: Conflito ao tentar criar recurso que já existe
500 Internal Server Error: Erro interno do servidor
Executando e Testando o Backend
Pré-requisitos
Node.js: Versão 14 ou superior
MySQL: Versão 5.7 ou superior
Postman: Para testar as requisições da API
Configuração do Banco de Dados
Abra seu cliente MySQL e execute os seguintes comandos na ordem:
-- Altere o tipo de autenticação do usuário root
ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'SUA_SENHA';

-- Verifique o usuário e o host do root
SELECT user, host FROM mysql.user WHERE user = 'root';

-- Verifique a porta utilizada pelo MySQL
SHOW VARIABLES LIKE 'port';

-- Crie e use o banco de dados
CREATE DATABASE crud_tasks;
USE crud_tasks;

-- Crie a tabela tasks!

CREATE TABLE tasks (
id INT NOT NULL AUTO_INCREMENT,
display_order INT NOT NULL UNIQUE,
description VARCHAR(100) NOT NULL UNIQUE,
value DECIMAL(10,2) NOT NULL,
deadline DATE NOT NULL,
PRIMARY KEY (id)
);

-- Verifique a estrutura da tabela
DESCRIBE tasks;

-- Insira dados de teste
INSERT INTO tasks (display_order, description, value, deadline)
VALUES (1, 'Primeira Tarefa', 800.00, '2024-12-01');

INSERT INTO tasks (display_order, description, value, deadline)
VALUES (2, 'Segunda Tarefa', 1200.00, '2024-12-15');

-- Verifique os dados inseridos
SELECT \* FROM tasks;
Configure o arquivo de conexão

Navegue até a pasta backend/db.js
Atualize as credenciais do MySQL conforme sua configuração:
export const db = mysql.createConnection({
host: "localhost",
user: "root",
password: "SUA_SENHA",
database: "crud_tasks"
});
Instalação e Execução
Clone o Repositório

git clone https://github.com/diogomasc/task-management-system-psfatto.git
cd task-management-system-psfatto
cd backend
Instale as Dependências

npm install
Inicie o Servidor

npm start
O servidor estará rodando em http://localhost:8800

Demonstração das Rotas

1. Criar Tarefa (POST /)
   Descrição: Cria uma nova tarefa.
   Request Body:

{
"description": "Nova tarefa importante",
"value": 1500.00,
"deadline": "2024-12-31"
}
Como testar no Postman:

Selecione o método POST.
Insira a URL: http://localhost:8800/.
Vá até a aba Body, selecione raw e escolha JSON no menu suspenso.
Cole o JSON acima.
image

2. Listar Tarefas (GET /)
   Descrição: Retorna todas as tarefas ordenadas por display_order.
   Como testar no Postman:

Selecione o método GET.
Insira a URL: http://localhost:8800/.
image

3. Atualizar Tarefa (PUT /:id)
   Descrição: Atualiza os detalhes de uma tarefa existente.
   Request Body:

{
"description": "Tarefa atualizada",
"value": 2000.00,
"deadline": "2024-12-31"
}
Como testar no Postman:

Selecione o método PUT.
Insira a URL: http://localhost:8800/:id (substitua :id pelo ID da tarefa que deseja atualizar).
Vá até a aba Body, selecione raw e escolha JSON no menu suspenso.
Cole o JSON acima.
image

4. Atualizar Ordem (PUT /:id/order)
   Descrição: Atualiza a ordem de exibição de uma tarefa.
   Request Body:

{
"newOrder": 3
}
Como testar no Postman:

Selecione o método PUT.
Insira a URL: http://localhost:8800/:id/order (substitua :id pelo ID da tarefa cuja ordem você deseja atualizar).
Vá até a aba Body, selecione raw e escolha JSON no menu suspenso.
Cole o JSON acima.
image image image

5. Deletar Tarefa (DELETE /:id)
   Descrição: Deleta uma tarefa existente.
   Como testar no Postman:

Selecione o método DELETE.
Insira a URL: http://localhost:8800/:id (substitua :id pelo ID da tarefa que deseja deletar).
image

6. Pesquisar Tarefas (GET /search?searchTerm=palavra)
   Descrição: Busca tarefas com base em um termo de busca.
   Como testar no Postman:

Selecione o método GET.
Insira a URL: http://localhost:8800/search?searchTerm=palavra (substitua palavra pelo termo que deseja buscar).
image

7. Contar Tarefas (GET /count)
   Descrição: Retorna o número total de tarefas.
   Como testar no Postman:

Selecione o método GET.
Insira a URL: http://localhost:8800/count.
image

Respostas da API
Sucesso
{
"message": "Operação realizada com sucesso",
"data": [/* dados retornados se aplicável */]
}
Erro
{
"message": "Mensagem descritiva do erro",
"error": "Detalhes técnicos do erro (em ambiente de desenvolvimento)"
}
Considerações Finais
Esta API fornece um conjunto completo de funcionalidades para gerenciamento de tarefas, incluindo ordenação personalizada e pesquisa. Certifique-se de que o servidor MySQL esteja configurado corretamente e que todas as dependências estejam instaladas antes de iniciar o servidor.
