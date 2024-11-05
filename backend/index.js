import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", taskRoutes);

app.listen(8800, () => {
  console.log("O Backend está sendo excetuado em: http://localhost:8800");
});
