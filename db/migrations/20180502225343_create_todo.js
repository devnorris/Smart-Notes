
exports.up = function(knex, Promise) {
  return Promise.all ([
    knex.schema.createTable('todo', function(table) {
      table.increments('todo_id');
      table.string('todo_email');
      table.integer('category_id').unsigned();
      table.foreign('category_id').references('category.category_id');
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.user_id');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('todo')
  ])
};
