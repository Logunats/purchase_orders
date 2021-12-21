const express = require('express');
const router = express.Router();
const connection = require('../config/db-connect');
const user = require('../controllers/user.controller');
const passport = require('passport');
require('../config/passport')(passport);
const jwt = require('jsonwebtoken');


router.get('/', (req, res) => {
  return res.success({
    result: 'ok',
  });
});

// SIGNUP API
router.post('/sign_up', user.sign_up);

// LOGIN API
router.post('/login', function(req, res, next) {
  passport.authenticate('local-login', function(err, user, info) {
      if (err) {
          return next(err); 
      } else if(!user) {
          return res.json({status: 401, message: 'Invalid username and password'});
      } else if (user) { 
        const body = { _id: user.id, email: user.email };
        const token = jwt.sign({ user: body, iat:Math.floor(Date.now() / 1000) - 30}, 'TOP_SECRET');
        connection.query('UPDATE user SET auth_token = ? WHERE id=?',[token, user.id],(err, rows) => {
            if (err) {
                console.log(" error", err);
            } else {
                console.log(rows);
            }
        })
        return res.json({status: 200, message: 'LoggedIn successfully', data: user, token: token})
      }
  })(req, res, next);
});

router.use('/products', require('./product'));
router.use('/order', require('./order'));



module.exports = router;
