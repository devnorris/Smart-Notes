
module.exports = knex => {
  const registerUser = email =>
    knex("users")
      .insert({ email: email })
      .returning("*");

  const loginUser = email => findByEmail(email);

  // const find = id =>
  //   knex("users")
  //     .where({ id })
  //     .select("*")
  //     .limit(1);

  const findByEmail = email =>
    knex("users")
      .where({ email })
      .select("*")
      .limit(1);

  return {
    register: username =>
      new Promise((resolve, reject) => {
        registerUser(email)
          .then(([user]) => resolve(user))
          .catch(e => reject(e));
      }),
    login: username =>
      new Promise((resolve, reject) => {
        loginUser(email)
          .then(([user]) => resolve(user))
          .catch(e => reject(e));
      }),
    findByEmail
  };
};
