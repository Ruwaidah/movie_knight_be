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
    // Hostname : process.env.HOST,
    // port: process.env.DB_PORT,
    // Username: "movies_knight_user",
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB,

    // connection: "postgres://movies_knight_user:hBqU1Y11ToQhAt86BDOFa2rdi6ffhaq9@dpg-cfhd12l3t3991c659m7g-a/movies_knight",
    // ssl: {rejectUnauthorized: false}
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
