// Update with your config settings.
require("dotenv").config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "postgresql",
    useNullAsDefault: true,
    connection: {
      database: "movie_knight",
      user: "postgres",
      password: process.env.PASSWORD,
    },
    pool: {
      min: 0,
      max: 20,
    },
    migrations: {
      directory: "./database/migrations",
    },
    seeds: {
      directory: "./database/seeds",
    },
  },

  production: {
    client: "pg",
    connection: process.env.DB_URL,
    migrations: {
      directory: "./dataBase/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./dataBase/seeds",
      tableName: "knex_seeds",
    },
  },
};
