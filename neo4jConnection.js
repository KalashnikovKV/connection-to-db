const neo4j = require("neo4j-driver");

// Подключение к Neo4j
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

// CRUD операции
const createPerson = async (name, age) => {
  try {
    const result = await session.run(
      "CREATE (p:Person {name: $name, age: $age}) RETURN p",
      { name, age }
    );
    return result.records[0].get("p").properties;
  } catch (error) {
    console.error("Ошибка при создании узла:", error);
  }
};

const getPersons = async () => {
  try {
    const result = await session.run("MATCH (p:Person) RETURN p");
    return result.records.map((record) => record.get("p").properties);
  } catch (error) {
    console.error("Ошибка при чтении узлов:", error);
  }
};

const updatePerson = async (name, age) => {
  try {
    const result = await session.run(
      "MATCH (p:Person {name: $name}) SET p.age = $age RETURN p",
      { name, age }
    );
    return result.records[0].get("p").properties;
  } catch (error) {
    console.error("Ошибка при обновлении узла:", error);
  }
};

const deletePerson = async (name) => {
  try {
    await session.run("MATCH (p:Person {name: $name}) DELETE p", { name });
    return { message: `Узел с именем ${name} удален.` };
  } catch (error) {
    console.error("Ошибка при удалении узла:", error);
  }
};

module.exports = {
  createPerson,
  getPersons,
  updatePerson,
  deletePerson,
};
