const DbContacts = require('../../db/contacts')
const DbUsers = require('../../db/users')
const {renderError} = require('../utils')

const router = require('express').Router()


router.get('/signup', (request, response) => {
  response.render('signup')
})

router.post('/signup', (request, response, next) => {
  DbUsers.createUser(request.body)
    .then(function(user) {
      if (user) {
        request.session.username = user[0].username
        return response.redirect('/contacts/login')
        next()
      }
    })
    .catch( error => renderError(error, response, response) )
})

router.get('/login', (request, response) => {
  if(request.session.username !== undefined){
    console.log('already logged in')
    response.redirect('/')
  }
    response.render('login')
})

router.post('/login', (request, response, next) => {
  console.log(request.body)
  DbUsers.findUser(request.body.username)
    .then(function(user) {
      console.log(user)
      if(request.body.username === user[0].username){
        console.log('logged in!')
        request.session.username = user[0].username
        response.redirect('/')
      }
    })
})

router.get('/logout', (request, response) => {
  delete request.session.username
  response.render('logout')
})

router.get('/new', (request, response) => {
  console.log(request.session)
  if(request.session.username === undefined){
    response.redirect('/contacts/login')
  }
    response.render('new')
})

router.post('/', (request, response, next) => {
    DbContacts.createContact(request.body)
      .then(function(contact) {
        if (contact) return response.redirect(`/contacts/${contact[0].id}`)
        next()
      })
      .catch( error => renderError(error, response, response) )
})

router.get('/:contactId', (request, response, next) => {
    const contactId = request.params.contactId
    if (!contactId || !/^\d+$/.test(contactId)) return next()
    DbContacts.getContact(contactId)
      .then(function(contact) {
        if (contact) return response.render('show', { contact })
        next()
      })
      .catch( error => renderError(error, response, response) )
})


router.get('/:contactId/delete', (request, response, next) => {
    const contactId = request.params.contactId
    DbContacts.deleteContact(contactId)
      .then(function(contact) {
        if (contact) return response.redirect('/')
        next()
      })
      .catch( error => renderError(error, response, response) )
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
