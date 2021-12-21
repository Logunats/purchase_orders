const connection = require("../config/db-connect");
const Authenticate = {};
const jwt = require('jsonwebtoken');
const user_model = require('../models/user.model');

Authenticate.authenticateToken = function(){
    return function(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)
        jwt.verify(token,'TOP_SECRET', (err, user) => {
            console.log(err)
            if (err) {
                return res.sendStatus(403)
            } else {
                console.log("data", user);
                user_model.getUserById(user.user['_id'], (err, rows) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send({
                          message: "Error retrieving user with id " 
                        })
                    } else {
                console.log("data res", rows);

                        if(token == rows[0].auth_token) {
                            next()
                        } else {
                            return res.json({status: 401, message: 'Unauthorized access'})
                        }
                    }
                });
            }
        
        })
    }
}

module.exports = Authenticate;