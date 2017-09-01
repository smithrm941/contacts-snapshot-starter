const bcrypt = require('bcrypt')

const saltRounds = 10;

const createValidUser = (password) => {
  return bcrypt.hash(password, saltRounds).then(function(hashedPassword) {
    return hashedPassword; // notice that all of these methods are asynchronous!
  })
}

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword)
}

module.exports = {
  createValidUser,
  comparePassword
}
