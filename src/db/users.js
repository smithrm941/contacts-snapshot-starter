const db = require('./db')
const bcrypt = require('bcrypt')

const createUser = function(user){
  return db.query(`
    INSERT INTO
      users (username, password)
    VALUES
      ($1::text, $2::text)
    RETURNING
      *
    `,
    [
      user.username,
      user.password,
    ])
    .catch(error => error);
}

module.exports = {
  createUser
}
