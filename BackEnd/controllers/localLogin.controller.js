const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
module.exports = {
  login: (req, res) => {
    let username = req.query.username;
    User.findOne({
      username: username
    }, function(err, user) {

      //If an err is thrown, return 500 with the error object
      if (err) {
        return res.status(500).send('Unknown error in the server! ', err);
      }

      //If user doesnt exist, send 404
      if (!user) {
        return res.status(404).send('No user found, sorry!');
      }

      //Checks to see that the password is valid
      var isPasswordValid = bcrypt.compareSync(req.query.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send({
          auth: false,
          token: null
        });
      }

      var token = jwt.sign({
        id: user._id
      }, 'secret', {
        expiresIn: 86400
      });
      res.status(200).send({
        auth: true,
        token: token
      })
    })
  },

  register: (req, res) => {
    var hashedPassword = bcrypt.hashSync(req.query.password, 8);
    User.findOne({
      username: req.query.username
    }, function(err, obj) {
      if (err) {
        throw err;
      }
      if (obj) {
        return res.status(422).send('User exists!');
      }
      User.create({
        username: req.query.username,
        password: hashedPassword
      }, (err, user) => {
        if (err) {
          return res.status(500).send('There was an issue registering the user');
        }
        var token = jwt.sign({
          id: user._id
        }, 'secret', {
          expiresIn: 86400
        });
        res.status(200).send({
          auth: true,
          token: token
        });
      });

    });
  }
}
