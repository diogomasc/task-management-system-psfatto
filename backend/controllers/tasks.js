import { db } from "../db.js";

// Função para recuperar todas as tarefas ordenadas por display_order
export const getTasks = (_, res) => {
  const query = "SELECT * FROM tasks ORDER BY display_order ASC";
  db.query(query, (err, data) => {
    if (err) {
      console.log("Erro ao recuperar tarefas:", err);
      return res.status(500).json({ message: "Erro ao recuperar tarefas." });
    }
    res.status(200).json(data);
  });
};

export const createTask = (req, res) => {
  const { description, value, deadline } = req.body;

  // Consulta para obter o próximo valor de display_order
  const orderQuery =
    "SELECT COALESCE(MAX(display_order), 0) + 1 AS nextOrder FROM tasks";

  db.query(orderQuery, (err, result) => {
    if (err) {
      console.log("Erro ao obter próximo display_order:", err);
      return res.status(500).json({ message: "Erro ao criar tarefa." });
    }

    const nextOrder = result[0].nextOrder;

    const insertQuery =
      "INSERT INTO tasks (description, value, deadline, display_order) VALUES (?, ?, ?, ?)";
    const values = [description, value, deadline, nextOrder];

    db.query(insertQuery, values, (err, data) => {
      if (err) {
        console.log("Erro ao inserir tarefa:", err);
        return res.status(500).json({ message: "Erro ao inserir tarefa." });
      }
      console.log("Tarefa criada com sucesso:", data.insertId);
      return res
        .status(201)
        .json({ message: "Tarefa criada com sucesso", taskId: data.insertId });
    });
  });
};

// Função para atualizar uma tarefa existente
export const updateTaskData = (req, res) => {
  const { id } = req.params;
  const { description, value, deadline } = req.body;

  // Consulta para atualizar apenas os dados, sem o display_order
  const query = `
    UPDATE tasks 
    SET description = ?, value = ?, deadline = ? 
    WHERE id = ?
  `;

  db.query(query, [description, value, deadline, id], (err, result) => {
    if (err) {
      console.log("Erro ao atualizar tarefa:", err);
      return res.status(500).json({ message: "Erro ao atualizar tarefa." });
    }
    if (result.affectedRows === 0) {
      console.log("Tarefa não encontrada para o ID:", id);
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }
    console.log("Tarefa atualizada com sucesso:", id);
    return res.status(200).json({ message: "Tarefa atualizada com sucesso." });
  });
};

// Função para deletar uma tarefa
export const deleteTask = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM tasks WHERE id = ?";
  db.query(query, [id], (err) => {
    if (err) {
      console.log("Erro ao deletar tarefa:", err);
      return res.status(500).json({ message: "Erro ao deletar tarefa." });
    }
    console.log("Tarefa deletada com sucesso:", id);
    res.status(200).json({ message: "Tarefa deletada com sucesso" });
  });
};

// Função para obter o número total de tarefas
export const getTaskCount = (_, res) => {
  const query = "SELECT COUNT(*) AS count FROM tasks";
  db.query(query, (err, data) => {
    if (err) {
      console.log("Erro ao contar tarefas:", err);
      return res.status(500).json({ message: "Erro ao contar tarefas." });
    }
    res.status(200).json(data[0]);
  });
};

// Função para pesquisar tarefas
export const searchTasks = (req, res) => {
  const { searchTerm } = req.query;

  if (!searchTerm) {
    console.log("Termo de busca vazio.");
    return res
      .status(400)
      .json({ message: "Termo de busca não pode estar vazio." });
  }

  const searchQuery = "SELECT * FROM tasks WHERE description LIKE ?";
  db.query(searchQuery, [`%${searchTerm}%`], (err, results) => {
    if (err) {
      console.log("Erro ao buscar tarefas:", err);
      return res.status(500).json({ message: "Erro ao buscar tarefas." });
    }

    return res.status(200).json(results);
  });
};

// Função para alterar a ordem de uma tarefa
export const updateTaskOrder = (req, res) => {
  const { id } = req.params;
  const { newOrder } = req.body;

  // Verifica se a tarefa existe e obter seu display_order atual
  const checkTaskQuery = "SELECT display_order FROM tasks WHERE id = ?";
  db.query(checkTaskQuery, [id], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Erro ao verificar tarefa.", error: err });

    if (results.length === 0) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    const currentOrder = results[0].display_order;

    // Não fazer nada se a ordem não mudou
    if (currentOrder === newOrder) {
      return res.status(200).json({ message: "Ordem não alterada" });
    }

    // Verifica se a nova ordem é válida
    const countQuery = "SELECT COUNT(*) as total FROM tasks";
    db.query(countQuery, (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Erro ao contar tarefas.", error: err });

      const totalTasks = results[0].total;
      if (newOrder < 1 || newOrder > totalTasks) {
        return res.status(400).json({
          message: "Nova ordem inválida",
          valid_range: { min: 1, max: totalTasks },
        });
      }

      // Obtem todas as tarefas que precisam ser reordenadas
      const getAffectedTasksQuery = `
        SELECT id, display_order
        FROM tasks
        WHERE display_order BETWEEN LEAST(?, ?) AND GREATEST(?, ?)
        ORDER BY display_order ${currentOrder > newOrder ? "DESC" : "ASC"}
      `;

      db.query(
        getAffectedTasksQuery,
        [currentOrder, newOrder, currentOrder, newOrder],
        (err, tasks) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Erro ao obter tarefas afetadas.", error: err });

          // Atualiza temporariamente a tarefa que está sendo movida
          const tempOrder = totalTasks + 1;
          const tempUpdateQuery =
            "UPDATE tasks SET display_order = ? WHERE id = ?";

          db.query(tempUpdateQuery, [tempOrder, id], (err) => {
            if (err)
              return res.status(500).json({
                message: "Erro ao atualizar ordem temporária.",
                error: err,
              });

            // Atualiza cada tarefa afetada sequencialmente
            const updatePromises = tasks.map((task) => {
              return new Promise((resolve, reject) => {
                if (task.id === parseInt(id)) return resolve();

                let newPosition;
                if (currentOrder < newOrder) {
                  // Movendo para baixo
                  newPosition = task.display_order - 1;
                } else {
                  // Movendo para cima
                  newPosition = task.display_order + 1;
                }

                const updateQuery =
                  "UPDATE tasks SET display_order = ? WHERE id = ?";
                db.query(updateQuery, [newPosition, task.id], (err) => {
                  if (err) reject(err);
                  else resolve();
                });
              });
            });

            // Executa todas as atualizações em sequência
            Promise.all(updatePromises)
              .then(() => {
                // Move a tarefa para sua posição final
                const finalUpdateQuery =
                  "UPDATE tasks SET display_order = ? WHERE id = ?";
                db.query(finalUpdateQuery, [newOrder, id], (err) => {
                  if (err)
                    return res.status(500).json({
                      message: "Erro ao mover tarefa para nova posição.",
                      error: err,
                    });

                  return res.status(200).json({
                    message: "Ordem atualizada com sucesso",
                    task: {
                      id,
                      new_order: newOrder,
                      previous_order: currentOrder,
                    },
                  });
                });
              })
              .catch((err) => {
                return res
                  .status(500)
                  .json({ message: "Erro ao atualizar tarefas.", error: err });
              });
          });
        }
      );
    });
  });
};
