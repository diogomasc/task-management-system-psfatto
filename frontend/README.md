# Sistema de Lista de Tarefas - Frontend

Este é o frontend do sistema de lista de tarefas, uma aplicação web desenvolvida em React que consome a API do backend para gerenciar as tarefas de forma interativa e intuitiva. A interface foi projetada para ser fácil de usar e atender aos requisitos funcionais especificados.

![image](https://github.com/user-attachments/assets/2195ea2c-338e-44d3-a610-a144ce6df2fa)

## Tecnologias Utilizadas

Este projeto foi construído usando as seguintes tecnologias e bibliotecas:

- **React**: Framework JavaScript para construção de interfaces de usuário reativas.
- **react-toastify**: Biblioteca para exibir notificações elegantes e configuráveis.
- **axios**: Cliente HTTP usado para realizar requisições à API, facilitando o consumo de dados do backend.
- **dnd-kit**: Biblioteca para implementar funcionalidades de drag-and-drop, usada para reordenar as tarefas.
- **react-icons**: Conjunto de ícones para representar visualmente ações, como editar e excluir.
- **lodash**: Biblioteca utilitária para manipulação e tratamento de dados.
- **styled-components**: Biblioteca para estilização dos componentes usando CSS-in-JS, permitindo maior flexibilidade e organização.

## Estrutura de Pastas

Para facilitar a organização e manutenção do código, a estrutura de pastas foi organizada da seguinte forma:

```
frontend/
└── src/
    ├── components/
    │   ├── TaskStats/         # Indicadores das tarefas
    │   ├── SearchBar/         # Barra de busca com atualização dinâmica
    │   ├── Grid/              # Listagem e exibição das tarefas
    │   └── Form/              # Formulário para adição e edição de tarefas
    ├── styles/
    │   └── global.js          # Estilos globais (fonte e cor de fundo)
    ├── App.js                 # Componente principal da aplicação
    └── index.js               # Arquivo de entrada
```

## Como Executar o Projeto

Para executar a aplicação localmente, siga as instruções abaixo:

1. Clone o repositório:

   ```bash
   git clone https://github.com/diogomasc/task-management-system-psfatto.git
   cd frontend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie a aplicação:

   ```bash
   npm start
   ```

4. Acesse a aplicação no navegador em [http://localhost:3000](http://localhost:3000).

## Funcionalidades

### Lista de Tarefas

A página principal da aplicação exibe a lista de tarefas cadastradas. Cada tarefa mostra todas as informações, exceto a "Ordem de apresentação", e é organizada com base nesse campo. Para maior clareza, as tarefas com "Custo" igual ou superior a R$1.000,00 são destacadas com um fundo amarelo.

Ao lado de cada tarefa, há ícones de **Editar** e **Excluir** para facilitar o gerenciamento. No canto inferior direito, você encontra o botão de **Incluir**, que abre um modal centralizado para adicionar uma nova tarefa.

![image](https://github.com/user-attachments/assets/d5579cbe-11ff-4243-b8b9-a998f243a633)

### Incluir Nova Tarefa

Para incluir uma nova tarefa, o usuário preenche um formulário com "Nome da Tarefa", "Custo" e "Data Limite". Todos os campos são validados, e uma notificação é exibida em caso de erro ou sucesso.

As notificações de sucesso e erro aparecem automaticamente no canto inferior esquerdo da tela.

![image](https://github.com/user-attachments/assets/3e57c496-2526-4cf4-8846-f871312391b6)

### Excluir Tarefa

A funcionalidade de exclusão permite ao usuário remover uma tarefa da lista. Ao clicar no ícone de excluir, um popup de confirmação é exibido no topo da tela, solicitando a confirmação da ação.

Se a exclusão for realizada com sucesso, uma notificação de feedback é exibida no canto inferior esquerdo.

![image](https://github.com/user-attachments/assets/aa8a8387-6445-4de0-8a27-302180c7282a)

![image](https://github.com/user-attachments/assets/724826b1-e45c-49c0-b193-a3f74d6d00aa)

### Editar Tarefa

O sistema permite que o usuário edite as informações de "Nome da Tarefa", "Custo" e "Data Limite". Ao tentar salvar as alterações, o sistema verifica se o novo nome já existe. Caso o nome já esteja em uso, uma notificação de erro é exibida. Se o nome for único, a tarefa é atualizada, e uma notificação de sucesso é exibida.

![image](https://github.com/user-attachments/assets/88bfb8c5-45c2-41da-bb2e-0514bd8768f5)

![image](https://github.com/user-attachments/assets/791d3ea3-b332-4991-b760-7d6a462fbade)

### Reordenação das Tarefas

A interface permite que o usuário reordene as tarefas de duas maneiras:

1. **Drag-and-Drop**: O usuário pode arrastar e soltar as tarefas na posição desejada.
2. **Botões de Reordenação**: Cada tarefa possui botões para mover a tarefa para cima ou para baixo na ordem de exibição.

Caso uma tarefa não possa ser movida (por estar na primeira ou última posição), uma notificação informa essa condição.

![Gif-Feito-com-o-Clipchamp](https://github.com/user-attachments/assets/fdb29c0d-23d5-4fb9-88cd-c53ae25a27e0)

### Barra de Busca

A barra de busca atualiza os resultados conforme o usuário digita, implementando uma busca indexada que exibe os resultados em tempo real. Isso permite que o usuário encontre rapidamente as tarefas desejadas.

![image](https://github.com/user-attachments/assets/d1de1bc4-63bf-4177-88de-4f97fd859f06)

![image](https://github.com/user-attachments/assets/7ed02220-bc34-491c-b5dd-0782972c14b4)

### Indicadores de Tarefas

Na aplicação, o usuário encontra um painel com informações de contagem:

- Total de tarefas cadastradas.
- Quantidade de tarefas com custo igual ou superior a R$1.000,00.

No formulário, um contador de caracteres é exibido no campo "Nome da Tarefa".

### Estilização e Destaques Visuais

A aplicação utiliza `styled-components` para definir estilos globais (como fonte e cor de fundo) e estilos específicos para cada componente. Ícones e campos são destacados visualmente para melhorar a usabilidade.

## Notificações

Todas as notificações (de erro, sucesso e validação) são exibidas usando o `react-toastify`. Elas surgem no canto inferior esquerdo da tela e desaparecem automaticamente após 3 segundos, proporcionando feedback imediato ao usuário.

## Autor

Desenvolvido por Diogo Mascarenhas.
LinkedIn: [Perfil no LinkedIn](https://www.linkedin.com/in/diogomasc/)
