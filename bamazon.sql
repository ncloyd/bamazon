DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
item_id integer AUTO_INCREMENT NOT NULL,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price decimal(30, 2) NOT NULL,
stock_quantity integer(240),
PRIMARY KEY (item_id)
);

SELECT * FROM bamazon.products;