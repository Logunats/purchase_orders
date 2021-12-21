const user_model = require("../models/user.model")
const CryptoJS = require('crypto-js');
const connection = require('../config/db-connect');
const responseMessages = require("../middleware/response-message");

exports.sign_up = (req, res) => {
    try{
        if (!req.body) {
           return res.badRequest({msg: 'Content shold not be empty'})
        }

        var checkPassword = CryptoJS.SHA256(req.body.password).toString();
        const users = new user_model({
            name : req.body.name,
            email : req.body.email,
            mobile : req.body.mobile,
            is_active : 1,
            password : checkPassword,
            cby : req.body.cby,
            mby : req.body.mby,
            cdate : new Date().toISOString().slice(0, 19).replace('T', ' '),
            mdate : new Date().toISOString().slice(0, 19).replace('T', ' ')
        });

        user_model.getUserByEmail(req.body.email, req.body.mobile, (err, rows) => {
            if(err){
                console.log("Error", err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while fetching the record."
                    });
            } else {
                if(rows.length) {
                    res.json({ status: 208, data: rows, message: responseMessages[1003] });
                } else {
                    //create a user
                    user_model.createUser(users, (err1, rows1) => {
                        if (err1) {
                                // res.internalServerError({msg: 'Some error occurred while creating the record.'})
                            res.status(500).send({
                            message:
                                err1.message || "Some error occurred while creating the record."
                            });
                        }
                        else {
                                // res.created({ result: rows, msg: "Success" });
                            res.json({ status: 201, data: rows1, message: "Success" });
                        }
                    });
                }
            }  
        })  
    }
    catch(err){
        throw Error(err);
    }    
}



