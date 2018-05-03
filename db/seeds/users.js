exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({user_id: 1, email: 'Alice@gmail.com', password: 'lost'}),
        knex('users').insert({user_id: 2, email: 'Bob@gmail.com', password: 'help'}),
        knex('users').insert({user_id: 3, email: 'Charlie@gmail.com', password: 'cool'})
      ]);
    });
};
