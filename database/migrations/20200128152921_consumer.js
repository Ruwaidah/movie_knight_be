exports.up = function (knex) {
  return knex.schema.createTable("consumer", tbl => {
    tbl.increments();
    tbl
      .string("username", 255)
      .notNullable()
      .unique();
    tbl
      .string("image", 255)
    tbl
      .string("email", 255)
      .notNullable()
      .unique();
    tbl.string("password", 255).notNullable();
    tbl
      .integer("zipcode", 255)
  })
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("consumer")
};
