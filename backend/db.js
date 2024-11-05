import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0103",
  database: "crud_tasks",
  port: 3308,
});
