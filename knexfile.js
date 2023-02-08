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
    // client: "postgresql",
    // connection: {
    //   database: "movie_knight",
    //   user: "username",
    //   password: "password",
    // },
    client: "pg",
    // connection: process.env.DATABASE_URL,
    connection: {
      host: process.env.HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      schema: 'public',
      // connection: process.env.DATABASE_URL,
      ssl: {rejectUnauthorized: false}
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
