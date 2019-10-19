# Local_Server_Crud

CRUD with Node.js, MySQL, Express and EJS. Start this application in your terminal with “nodemon app.js”.

Focus here was the implementation of CRUD (Create Read Update Delete) logic. CSS and styling was not important at this point. This repository is intended to serve as a guide, a quick reference for future projects.

Database is MySQL to which I connected via MAMP and Sequel Pro is used as a suite. NodeJS is used for the logic/requests/routes and EJS is used to serve our HTML pages. To start the project, go into your terminal and type 'nodemon app.js'. This will start the server on your localhost:3003. Start your MAMP app, and then start Sequel Pro. Through Sequel Pro, log in using a password 'root'. Then create a database inside of your Sequel Pro with the name 'myDataBase'. Inside of your myDataBase create a table named 'users'. And this table will have three columns "id", "first_name", "last_name".

user this syntax to create the table:

CREATE TABLE `users` (
`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
`first_name` varchar(30) NOT NULL DEFAULT '',
`last_name` varchar(30) NOT NULL DEFAULT '',
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8;
