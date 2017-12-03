var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "admin",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    displayItems();
});

// function to display all items available for sale
// ids, names and prices 

function displayItems() {
    var query = "SELECT item_id,product_name,price FROM products GROUP BY stock_quantity HAVING count(*) > 1";
    connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Item Id: " +
                res[i].item_id +
                "Product: " +
                res[i].product_name +
                "Price: " + 
                res[i].price
            );
        }
        promptUser();
    });

}

// prompt users with 2 messages:
// 1. ask them the id of the product they want
// 2. ask how many units they'd like

function promptUser() {
    inquirer
        .prompt([
            name: "id",
            type: "input",
            message: "What is the id of the product you would like to purchase?"
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }, {
            name: "units",
            type: "input",
            message: "How many units would you like to purchase?"
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }])
.then(function(answer) {
    var query = "SELECT item_id,product_name,price FROM products GROUP BY stock_quantity HAVING count(*) > 1";
    connection.query(query, [answer.id, answer.units], function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Item Id: " +
                res[i].id +
                " || Song: " +
                res[i].units
            );
        }

    })

});




// function to check if the store has enough product to fulfill the request
// 1. if out of stock - 
// display "Insufficient Quantity!" and prevent order
// 2. if in stock:
// update SQL database to reflect remaining quantity
// display total cost of their purchse