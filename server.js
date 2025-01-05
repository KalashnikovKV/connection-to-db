const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {
  createNode,
  getNodes,
  updateNode,
  deleteNode,
  createRelationship,
  deleteRelationship,
  getGraph,
} = require("./neo4jConnection");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// CRUD для узлов
app.post("/create-node", async (req, res) => {
  const { label, properties } = req.body;
  const node = await createNode(label, properties);
  res.send(node);
});

app.get("/nodes", async (req, res) => {
  const { label } = req.query;
  const nodes = await getNodes(label);
  res.send(nodes);
});

app.put("/update-node", async (req, res) => {
  const { label, oldProps, newProps } = req.body;
  const updatedNode = await updateNode(label, oldProps, newProps);
  res.send(updatedNode);
});

app.delete("/delete-node", async (req, res) => {
  const { label, properties } = req.body;
  const result = await deleteNode(label, properties);
  res.send(result);
});

// CRUD для связей
app.post("/create-relationship", async (req, res) => {
  const { fromLabel, fromProps, toLabel, toProps, relType } = req.body;
  const relationship = await createRelationship(
    fromLabel,
    fromProps,
    toLabel,
    toProps,
    relType
  );
  res.send({ relationship });
});

app.delete("/delete-relationship", async (req, res) => {
  const { fromLabel, fromProps, toLabel, toProps, relType } = req.body;
  const result = await deleteRelationship(
    fromLabel,
    fromProps,
    toLabel,
    toProps,
    relType
  );
  res.send(result);
});

// Получение графа
app.get("/graph", async (req, res) => {
  const graph = await getGraph();
  res.send(graph);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
