var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

// connect to the mysql server and sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "admin",
    database: "bamazon"
});

// function to display all items available for sale
    // ids, names, department,and prices 
function displayBuy() {
    connection.query('SELECT * FROM products', function(err, res) {
        //creates the table
        var table = new Table({
            head: ['ID', 'Product Name', 'Department', 'Price', 'Stock Quantity']
            //head: ['ID', 'Product Name', 'Department', 'Price']
        });
        console.log("WELCOME TO THE BAMAZON SHOP");
        console.log("=============="+"=============");
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price.toFixed(2), res[i].stock_quantity]);
            //table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price.toFixed(2)]);
        }
        // console.log("-----------------------------------------------");
        // log the table with the database information
        console.log(table.toString());   
       // prompt users with 2 messages:
            // 1. ask them the id of the product they want
            // 2. ask how many units they'd like
         inquirer.prompt([{
            name: "itemId",
            type: "input",
            message: "What is the id of the product you would like to purchase?",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            name: "quantity",
            type: "input",
            message: "How many of this item would you like to buy?",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
// function to check if the store has enough product to fulfill the request
    // 2. if in stock:
        // update SQL database to reflect remaining quantity
        // display total cost of their purchse
        }]).then(function(answer) {
            var chosenId = answer.itemId - 1;
            var chosenProduct = res[chosenId];
            var chosenQuantity = answer.quantity;
            if (chosenQuantity < res[chosenId].stock_quantity) {
                console.log("Your total for " + "(" + answer.quantity + ") " + res[chosenId].product_name +
                 " is: " + res[chosenId].price.toFixed(2)  * chosenQuantity + "\n");
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: answer.itemId.stock_quantity - answer.quantity
                }, {
                    id: res[chosenId].id
                }], function(err, res) {
                    //console.log(err);
                    displayBuy();
                });
// 1. if out of stock - 
    // display "Insufficient Quantity!" and prevent order
            } else {
                console.log("Sorry, insufficient quanity at this time.");
                displayBuy();
            }
        })
    })
}
displayBuy();