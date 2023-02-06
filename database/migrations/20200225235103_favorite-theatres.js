
exports.up = function (knex) {
    return knex.schema.createTable("favoriteTheatre", tbl => {
        tbl.increments();
        tbl.string("theatre", 255)
        tbl
            .string("theatreId", 255)
        tbl
            .string("street", 255)
        tbl
            .string("state", 255);
        tbl
            .string("city", 255)
        tbl
            .integer("zip", 255)
        tbl
            .string("user_id")
            .notNullable()

    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("favoriteTheatre");
};
