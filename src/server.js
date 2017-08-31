const express = require('express')
const bodyParser = require('body-parser')
const dbContacts = require('./db/contacts')
const dbUsers = require('./db/users')
const app = express()
const {renderError} = require('./server/utils')
const routes = require('./server/routes');
const session = require('express-session')

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use((request, response, next) => {
  response.locals.query = ''
  next()
})
app.use(session({
  key: 'user_id',
  secret: 'thin lizzy',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}))

app.use('/', routes)

app.use((request, response) => {
  response.render('not_found')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
