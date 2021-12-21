const user_model = require("../models/user.model")
const connection = require('../config/db-connect');
const responseMessages = require("../middleware/response-message");
// const orderModel = require('../models/')
const moment = require('moment');

exports.createOrder = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    connection.query(`select user.id as user, products.id as product, products.quantity as product_quantity from user, products where user.name='${req.body.customer}' and products.product_code='${req.body.product}'`,(err, rows) => {
        if (err)
            res.status(500).send({
            message:
                err.message || "Some error occurred while fetching the record."
            });
        else {
            // Create a order
            if(rows[0].product_quantity >= parseInt(req.body.quantity)) {
                const order = {
                    customer : rows[0].user,
                    date : new Date().toISOString().slice(0, 19).replace('T', ' '),
                    status : 'ordered',
                    product : rows[0].product,
                    quantity : parseInt(req.body.quantity),
                    cdate : new Date().toISOString().slice(0, 19).replace('T', ' '),
                    mdate : new Date().toISOString().slice(0, 19).replace('T', ' ')
                };
                connection.query("INSERT INTO orders SET ?", order, (err1, rows1) => {
                    if (err1)
                        res.status(500).send({
                        message:
                            err1.message || "Some error occurred while creating the record."
                        });
                    // else res.send(data);
                    else {
                        let balance = parseInt(rows[0].product_quantity) - parseInt(req.body.quantity);
                        connection.query('UPDATE products SET quantity = ? WHERE id=?',[balance, rows[0].product], (err2, rows2) => {
                            if (err2)
                                res.status(500).send({
                                message:
                                    err2.message || "Some error occurred while creating the record."
                                });
                            // else res.send(data);
                            else {
                                res.json({ status: 201, data: rows1, message: "Success" });
                            }
                        });
                    }
                });
            } else {
                res.json({ status: 200, message: "Stock not available for the product" });
            }
        }
    });
    
        
}
exports.updateOrder = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    connection.query(`select user.id as user, products.id as product,products.quantity as product_quantity from user, products where user.name='${req.body.customer}' and products.product_code='${req.body.product}'`,(err, rows) => {
        if (err)
            res.status(500).send({
            message:
                err.message || "Some error occurred while detching the record."
            });
        else {
            // Create a order
            if(rows[0].product_quantity >= parseInt(req.body.quantity)) {
                const order = {
                    customer : rows[0].user,
                    date : new Date().toISOString().slice(0, 19).replace('T', ' '),
                    status : 'ordered',
                    product : rows[0].product,
                    quantity : parseInt(req.body.quantity),
                    mdate : new Date().toISOString().slice(0, 19).replace('T', ' ')
                };
                connection.query("UPDATE  orders SET ? where id = ?", [order, req.params.id], (err1, rows1) => {
                    if (err1)
                        res.status(500).send({
                        message:
                            err1.message || "Some error occurred while updating the record."
                        });
                    // else res.send(data);
                    else {
                        let balance = parseInt(rows[0].product_quantity) - parseInt(req.body.quantity);
                        connection.query('UPDATE products SET quantity = ? WHERE id=?',[balance, rows[0].product], (err2, rows2) => {
                            if (err2)
                                res.status(500).send({
                                message:
                                    err2.message || "Some error occurred while creating the record."
                                });
                            // else res.send(data);
                            else {
                                res.json({ status: 201, data: rows1, message: "Success" });
                            }
                        });
                    }
                });
            } else {
                res.json({ status: 200, message: "Stock not available for the product" });
            }
        }
    });
    
        
}
exports.cancelOrder = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    connection.query(`select user.id as user, products.id as product,products.quantity as product_quantity from user, products where user.name='${req.body.customer}' and products.product_code='${req.body.product}'`,(err, rows) => {
        if (err)
            res.status(500).send({
            message:
                err.message || "Some error occurred while detching the record."
            });
        else {
            // Create a order
                const order = {
                    status : 'cancelled',
                    mdate : new Date().toISOString().slice(0, 19).replace('T', ' ')
                };
                connection.query("UPDATE  orders SET ? where id = ?", [order, req.params.id], (err1, rows1) => {
                    if (err1)
                        res.status(500).send({
                        message:
                            err1.message || "Some error occurred while updating the record."
                        });
                    // else res.send(data);
                    else {
                        let balance = parseInt(rows[0].product_quantity) + parseInt(req.body.quantity);
                        let total = 0;
                        if(balance == NaN) {
                            total += 0;
                        } else{
                            total += balance;
                        }
                        connection.query('UPDATE products SET quantity = ? WHERE id=?',[total, rows[0].product], (err2, rows2) => {
                            if (err2)
                                res.status(500).send({
                                message:
                                    err2.message || "Some error occurred while creating the record."
                                });
                            // else res.send(data);
                            else {
                                res.json({ status: 201, data: rows1, message: "Success" });
                            }
                        });
                    }
                });
        }
    });    
}
exports.getOrdersbyCustomer = (req, res) => {
    connection.query(`select orders.*, user.name as username, products.product_name as product_name from orders, user, products where user.id= orders.customer and products.id =orders.product and orders.customer=${req.query.customer}`, (err, rows) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Data not found.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving data"
          });
        }
      } else res.json({ status: 200, data: rows, message: "Success" });
    //   else res.send(data);
    });
};
exports.getOrdersCountsbyDate = (req, res) => {
    let date = moment(req.query.date, "DD-MM-YYYY").format("YYYY-MM-DD");
    connection.query(`select sum(quantity) as order_counts from orders where date_format(orders.date, '%Y-%m-%d') = '${date}'`, (err, rows) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Data not found.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving data"
          });
        }
      } else res.json({ status: 200, data: rows, message: "Success" });
    //   else res.send(data);
    });
};
exports.getCustomersbasedonCount = (req, res) => {
    connection.query(`select sum(orders.quantity) as order_counts, user.name as customer from orders, user group by orders.product, orders.customer`, (err, rows) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Data not found.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving data"
          });
        }
      } else res.json({ status: 200, data: rows, message: "Success" });
    //   else res.send(data);
    });
};
exports.getCustomersbasedonGivenCount = (req, res) => {
    connection.query(`select count(*) as product_counts, user.name as customer from orders, user group by orders.product, orders.customer`, (err, rows) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Data not found.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving data"
          });
        }
      } else {
          res.json({ status: 200, data: rows, message: "Success" });
      }
    //   else res.send(data);
    });
};


