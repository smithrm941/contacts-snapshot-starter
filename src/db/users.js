const db = require('./db')

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
      user.password
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

module.exports = {
  createUser,
  findUser
}
