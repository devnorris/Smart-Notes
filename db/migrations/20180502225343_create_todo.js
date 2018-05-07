exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("todo", function(table) {
      table.increments("todo_id").primary();
      table.string("todo_name");
      table.string("todo_reference");
      table.integer("category_id").unsigned();
      table.integer("user_id").unsigned();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable("todo")]);
};
