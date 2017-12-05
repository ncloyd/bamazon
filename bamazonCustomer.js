var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "admin",
    database: "bamazon"
});

// purchases
var productPurchased = [];

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    displayItems();
});

// function to display all items available for sale
// ids, names and prices 

function displayItems() {
    connection.query("SELECT item_id,product_name,price FROM products",
        function(err, res) {
            for (var i = 0; i < res.length; i++) {
                console.log(
                    "\n" + "Item Id: " +
                    res[i].item_id +
                    " | Product: " +
                    res[i].product_name +
                    " | Price: " +
                    res[i].price);
            }
        })
    promptUser();
};

// prompt users with 2 messages:
// 1. ask them the id of the product they want
// 2. ask how many units they'd like

function promptUser() {
    inquirer
        .prompt([{
                name: "id",
                type: "input",
                message: "What is the id of the product you would like to purchase?",
                validate: function(value) {
                    if (isNaN(value) == false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many of this item do you want to purchase?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        ])
        .then(function(answer) {
            var chosenId = answer.id - 1;
            var chosenItem = res[chosenId];
            var chosenQuantity = answer.quantity;

            if (chosenQuantity < res[chosenId].stock_quantity) {
                console.log("Your total for " + "(" + answer.Quantity + ")" + " - " + res[chosenId].ProductName + " is: " + res[chosenId].Price.toFixed(2) * chosenQuantity);
                connection.query("UPDATE products SET ? WHERE ?", [{
                    StockQuantity: res[chosenId].stock_quantity - chosenQuantity
                }, {
                    id: res[chosenId].id
                }], function(err, res) {
                    //console.log(err);
                    promptUser();
                });
            } else {
                console.log("Sorry, insufficient quantity!");
                promptUser();
            }
        })
};







//             connection.query("SELECT * FROM products WHERE ?", {
//                 id: answers.id
//             }, function(err, res) {
//                 if (currentUnits > res[0].Stock_Quantity) {
//                     console.log("Insufficient Quantity");
//                     promptUser();
//                 } else {
//                     console.log("Order Placed!");
//                     var newQuantity = (res[i].stock_quantity - currentUnits);
//                     var totalCost = res[i].Price * currentUnits;
//                     connection.query('UPDATE products SET ? WHERE ?', [{
//                             Stock_Quantity: newQuantity
//                         }, {
//                             id: currentItem
//                         }],
//                         function(err, res) {
//                             console.log("You were charged $" + totalCost);
//                             promptUser();
//                         });
//                 }
//             })
//         });
// };


// console.log(
//                     "Item Id: " +
//                    answer[i].id +
//                     " || Song: " +
//                     answer[i].units

// function to check if the store has enough product to fulfill the request
// 1. if out of stock - 
// display "Insufficient Quantity!" and prevent order
// 2. if in stock:
// update SQL database to reflect remaining quantity
// display total cost of their purchse