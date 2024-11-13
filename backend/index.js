import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks.js";

// Configurações do app
const app = express();
const PORT = process.env.PORT || 8800;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use("/", taskRoutes);

// Tratamento de erro para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
});

// Tratamento de erros não capturados
process.on("unhandledRejection", (error) => {
  console.error("Erro não tratado:", error);
  process.exit(1);
});
