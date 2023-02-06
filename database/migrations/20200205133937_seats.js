exports.up = function(knex) {
  return knex.schema.createTable("seats", tbl => {
    tbl.increments();
    tbl.string("row", 255).notNullable();
    tbl.integer("column").notNullable();
    tbl.string("seatName", 255).notNullable();
    tbl.boolean("available").notNullable();
    tbl.boolean("handicap").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("seats");
};
