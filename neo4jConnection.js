const neo4j = require("neo4j-driver");

const URI = "neo4j+s://4a2bc87b.databases.neo4j.io";
const USER = "neo4j";
const PASSWORD = "LvhxgCVYilA7RtE9PN__vmYhnROfvio0KW8GLQVvjCA";

let driver;

(async () => {
  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    const serverInfo = await driver.getServerInfo();
    console.log("Connection established");
    console.log(serverInfo);
  } catch (err) {
    console.error(`Connection error\n${err}\nCause: ${err.cause}`);
  }
})();

const session = driver.session();

// Создание узла
const createNode = async (label, properties) => {
  try {
    const result = await session.run(
      `CREATE (n:${label} $properties) RETURN n`,
      { properties }
    );
    return result.records[0].get("n").properties;
  } catch (error) {
    console.error(`Ошибка при создании узла ${label}:`, error);
  }
};

// Чтение всех узлов указанной сущности
const getNodes = async (label) => {
  try {
    const result = await session.run(`MATCH (n:${label}) RETURN n`);
    return result.records.map((record) => record.get("n").properties);
  } catch (error) {
    console.error(`Ошибка при чтении узлов ${label}:`, error);
  }
};

// Обновление узла
const updateNode = async (label, oldProps, newProps) => {
  try {
    const result = await session.run(
      `
      MATCH (n:${label} {name: $oldName})
      SET n += $newProps
      RETURN n
      `,
      { oldName: oldProps.name, newProps }
    );
    return result.records[0].get("n").properties;
  } catch (error) {
    console.error(`Ошибка при обновлении узла ${label}:`, error);
  }
};

// Удаление узла
const deleteNode = async (label, properties) => {
  try {
    await session.run(
      `
      MATCH (n:${label} {name: $name})
      DETACH DELETE n
      `,
      { name: properties.name }
    );
    return { message: `Узел ${properties.name} удален.` };
  } catch (error) {
    console.error(`Ошибка при удалении узла ${label}:`, error);
  }
};

// Создание связи между узлами
const createRelationship = async (
  fromLabel,
  fromProps,
  toLabel,
  toProps,
  relType
) => {
  try {
    const result = await session.run(
      `
      MATCH (a:${fromLabel} {name: $fromName})
      MATCH (b:${toLabel} {name: $toName})
      CREATE (a)-[r:${relType}]->(b)
      RETURN r
      `,
      { fromName: fromProps.name, toName: toProps.name }
    );
    return result.records[0].get("r").type;
  } catch (error) {
    console.error(`Ошибка при создании связи ${relType}:`, error);
  }
};

// Удаление связи между узлами
const deleteRelationship = async (
  fromLabel,
  fromProps,
  toLabel,
  toProps,
  relType
) => {
  try {
    await session.run(
      `
      MATCH (a:${fromLabel} {name: $fromName})-[r:${relType}]->(b:${toLabel} {name: $toName})
      DELETE r
      `,
      { fromName: fromProps.name, toName: toProps.name }
    );
    return { message: `Связь ${relType} удалена.` };
  } catch (error) {
    console.error(`Ошибка при удалении связи ${relType}:`, error);
  }
};

// Получение графа узлов и связей
const getGraph = async () => {
  try {
    const result = await session.run("MATCH (n)-[r]->(m) RETURN n, r, m");
    return result.records.map((record) => ({
      from: record.get("n").properties,
      relationship: record.get("r").type,
      to: record.get("m").properties,
    }));
  } catch (error) {
    console.error("Ошибка при чтении графа:", error);
  }
};

module.exports = {
  createNode,
  getNodes,
  updateNode,
  deleteNode,
  createRelationship,
  deleteRelationship,
  getGraph,
};
