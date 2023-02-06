exports.up = function (knex) {
  return knex.schema.createTable("oauth_consumer", tbl => {
    tbl.increments();
    tbl.string("name", 255).notNullable();
    tbl
      .string("googleId", 255)
      .notNullable()
      .unique();
    tbl
      .string("email", 255)
      .notNullable()
      .unique();
    tbl
      .string("image", 255);
    tbl
      .integer("zipcode", 255)
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("oauth_consumer");
};
