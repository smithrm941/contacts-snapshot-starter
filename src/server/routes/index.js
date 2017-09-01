const router = require('express').Router();
const contacts = require('./contacts')
const DbContacts = require('../../db/contacts');

router.get('/', (request, response) => {
  if(request.session.username === undefined) {
    response.redirect('/contacts/login')
  } else {
    DbContacts.getContacts()
      .then((contacts) => {response.render('index', { contacts })})
      .catch( err => console.log('err', err) )
  }
})

router.use('/contacts', contacts); // /contacts/search
// router.use('/users', users);

module.exports = router;
