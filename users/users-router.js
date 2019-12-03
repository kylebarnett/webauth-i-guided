const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('./users-model.js');

//req.headers should have a correct username/password
//req.headers.username, req.headers.password. If we send the correct username and password we should see this endpoint. If they are incorrect, the should be blocked.
//this would be an example of authorization
router.get('/', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

function restricted(req, res, next) {
  let { username, password } = req.headers;
  if (username && password) {
    Users.findBy({ username })
    .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next()
        } else {
          res.status(401).json({ message: 'Invalid credentials.' })
        }
      })
      .catch(err => {
        res.status(500).json({ message: "Unexpected error." })
      })
  } else {
    res.status(400).json({ message: 'Please provide username and password.' })
  }
}

module.exports = router;
