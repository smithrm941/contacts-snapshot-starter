const DbContacts = require('../../db/contacts')
const DbUsers = require('../../db/users')
const {renderError} = require('../utils')
const user = require('../auth')
const bcrypt = require('bcrypt')

const router = require('express').Router()

router.get('/flash', (request, response) => {
  request.flash('nameTaken', 'This username is already taken.')
  response.redirect('/contacts/signup')
})

router.get('/signup', (request, response) => {
  response.render('signup', {message: request.flash('nameTaken')})
})

router.post('/signup', (request, response) => {
  const { username, password, confirmedPassword } = request.body
  if(password !== confirmedPassword){
    response.render('signup')
  } else {
    DbUsers.findUser(username).then( users => {
      const userExists = (users[0].username === username)
      if(userExists) {
        response.redirect('/contacts/flash')
      }
    }).catch(err => {
      user.createValidUser(password)
      .then(hash => {
        DbUsers.createUser(username, hash)
        .then(createdUser => {
          request.session.username = createdUser[0].username
          return response.redirect('/')
        })
      })
    })
  }
})


router.get('/login', (request, response) => {
  if(request.session.username !== undefined){
    response.redirect('/')
  } else {
    response.render('login')
  }
})

router.post('/login', (request, response, next) => {
  const { username, password, confirmedPassword } = request.body
  DbUsers.findUser(username)
    .then(users => {
      return user.comparePassword(password, users[0].password)
      .then(match => {
        if(username === users[0].username && match){
          request.session.username = users[0].username
          request.session.role = users[0].role
          response.redirect('/')
        } else {
          response.render('login')
        }
      }).catch(error => next(error))
    })
})

router.get('/logout', (request, response) => {
  request.session.destroy()
  response.redirect('/contacts/login')
})

router.get('/new', (request, response) => {
  if(request.session.username === undefined){
    response.redirect('/contacts/login')
  } else if(request.session.username && request.session.role === 'admin') {
    response.render('new')
  } else{
    response.status(403).send()
  }
})

router.post('/', (request, response, next) => {
    DbContacts.createContact(request.body)
      .then(contact => {
        if (contact) return response.redirect(`/contacts/${contact[0].id}`)
        next()
      })
      .catch( error => renderError(error, response, response) )
})

router.get('/:contactId', (request, response, next) => {
    const contactId = request.params.contactId
    if (!contactId || !/^\d+$/.test(contactId)) return next()
    DbContacts.getContact(contactId)
      .then(contact => {
        if (contact) return response.render('show', { contact })
        next()
      })
      .catch( error => renderError(error, response, response) )
})


router.get('/:contactId/delete', (request, response, next) => {
    const contactId = request.params.contactId
    if(request.session.role !== 'admin'){
      response.status(403).send()
    } else {
      DbContacts.deleteContact(contactId)
      .then(contact => {
        if (contact) return response.redirect('/')
        next()
      })
      .catch( error => renderError(error, response, response) )
    }
})

router.get('/search', (request, response, next) => {
  if(request.session.username === undefined) {
    response.redirect('/contacts/login')
  }
    const query = request.query.q
    DbContacts.searchForContact(query)
      .then(function(contacts) {
        if (contacts) return response.render('index', { query, contacts })
        next()
      })
      .catch( error => renderError(error, response, response) )
})

module.exports = router
