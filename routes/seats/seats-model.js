const db = require("../../database/dbConfig.js");

const getAll = () => db("seats")

module.exports = {
  getAll
};