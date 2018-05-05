
exports.up = function(knex, Promise) {
  return Promise.all ([
    knex.schema.createTable('category', function(table) {
      table.increments('category_id');
      table.string('category_name');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all ([
    knex.schema.dropTable('category')
  ])
};
