// node server.js

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {
  createPerson,
  getPersons,
  updatePerson,
  deletePerson,
} = require("./neo4jConnection");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Маршрут для создания узла
app.post("/create", async (req, res) => {
  const { name, age } = req.body;
  const person = await createPerson(name, age);
  res.send(person);
});

// Маршрут для получения узлов
app.get("/persons", async (req, res) => {
  const persons = await getPersons();
  res.send(persons);
});

// Маршрут для обновления узла
app.put("/update", async (req, res) => {
  const { name, age } = req.body;
  const person = await updatePerson(name, age);
  res.send(person);
});

// Маршрут для удаления узла
app.delete("/delete", async (req, res) => {
  const { name } = req.body;
  const result = await deletePerson(name);
  res.send(result);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
