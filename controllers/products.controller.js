const user_model = require("../models/user.model")
const connection = require('../config/db-connect');
const responseMessages = require("../middleware/response-message");
// const moment = require('moment');
const async = require("async");
const config = require('../config/config')
const readXlsxFile = require("read-excel-file/node");
const path = require('path');
const base = path.resolve('.');

exports.saveProducts = (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send("Please upload an excel file!");
        }
    
        let path = `${base}${config.fileLocationUrl}/${req.file.filename}`;
        async.waterfall(
            [
              function (callback) {
                let products = [];
                readXlsxFile(path).then((rows) => {
                    // skip header
                    rows.shift();
                    rows.forEach((row) => {
                        let product = {
                            product_name: row[0],
                            product_code: row[1],
                            quantity: row[2],
                            status: 'available'
                        };
                        products.push(product);
                    }); 
                    console.log("products", products)
                    callback(null, products);
                });
              },
              function (products, callback) {
                async.forEachSeries(products,
                  (product, productcbk) => {
                    connection.query("select * from products where product_code = ?", product.product_code,  (err, rows) => {
                        if (err) {
                            console.log("Error", err);
                            productcbk()
                        } else {
                            let query = '';
                            if(rows.length) {
                              query += `UPDATE products SET ? where product_code = '${product.product_code}'`;
                              product.mdate = new Date().toISOString().slice(0, 19).replace('T', ' ')
                            } else {
                                query += 'INSERT INTO products SET ?';
                                product.cdate = new Date().toISOString().slice(0, 19).replace('T', ' '),
                                product.mdate = new Date().toISOString().slice(0, 19).replace('T', ' ')
                            }
                            connection.query(query, product,  (pr_err, pr_rows) => {
                                if (pr_err) {
                                    console.log("Error", pr_err);
                                    productcbk()
                                } else {
                                    productcbk()
                                }
                            });
                        }
                    });
                  },
                  function () {
                    callback();
                  }
                );
              },
            ],
            function () {
              return res.json({ status: 200, message: "Success" });
            }
          );
       
    } catch (error) {
        console.log(error);
        res.status(500).send({
        message: "Could not upload the file: " + req.file.originalname,
        });
    }    
}



