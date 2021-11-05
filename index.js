const express = require("express");
const { pool } = require("./db");

const app = express();

app.use(express.json());

const port = 3333;

// ROUTES

// get all todos
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("select * from todo");
    res.json(allTodos.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// get a todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const findTodo = await pool.query("select * from todo where todo_id = $1", [
      id,
    ]);
    if (findTodo.rows.length === 0) {
      res.json({ message: "No todo find on this id" });
    }
    res.json(findTodo.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// create todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo(description) VALUES($1) returning *",
      [description]
    );
    res.json(newTodo);
  } catch (err) {
    console.log(err.message);
  }
});

// update todo
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  const updatedTodo = await pool.query(
    "update todo set description = $1 where todo_id = $2 returning *",
    [description, id]
  );
  if (updatedTodo.rows.length === 0) {
    res.json({ message: "Can't update as requested ID not found" });
  }
  res.json(updatedTodo.rows);
});

// delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await pool.query(
      "delete from todo where todo_id = $1 returning *",
      [id]
    );
    if (deletedTodo.rows.length < 1) {
      res.json({ message: "Can't delete as requested ID not found" });
    }
    res.json({ deletedTodo: deletedTodo.rows });
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server started on port : ${port}`);
});
