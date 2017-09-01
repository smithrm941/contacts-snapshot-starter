const db = require('./db')

const createUser = function(user, password){
  return db.query(`
    INSERT INTO
      users (username, password)
    VALUES
      ($1::text, $2::text)
    RETURNING
      *
    `,
    [
      user,
      password
    ])
    .catch(error => error);
}

const findUser = function(user){
  return db.query(`
    SELECT
      *
    FROM
      users
    WHERE
      username = $1`,
      [user]
    )
    .catch(error => error);
}

const getAllUsers = function(){
  return db.any(`
    SELECT
      *
    FROM
      users`)
}

module.exports = {
  createUser,
  findUser,
  getAllUsers
}
