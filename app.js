// load our app server using express
var express = require("express");
const app = express();
const morgan = require("morgan");
var mysql = require("mysql");

// npm i body-parser
const bodyParser = require("body-parser");
// to make sure app uses body-parser
// helps process the request easier
app.use(bodyParser.urlencoded({ extended: false }));

// our application server is now going to able to serve all of the files
// inside the "public"
app.use(express.static("./public"));

app.use(morgan("short"));

app.post("/user_create", (req, res) => {
  console.log("Trying to create a new user...");
  console.log("First name: " + req.body.create_first_name);
  // capturing input from a user
  const firstName = req.body.create_first_name;
  const lastName = req.body.create_last_name;

  // first_name last_name the way they are defined in the data base
  const queryString = "INSERT INTO users (first_name, last_name) VALUES (?, ?)";
  // next step is the sequel query to use the input data and place it into the table (data base)
  getConnection().query(
    queryString,
    [firstName, lastName],
    (err, results, fields) => {
      if (err) {
        console.log("Failed to insert new user: " + err);
        res.sendStatus(500);
        return;
      }
      console.log("Inserted a new user with id: ", results.insertedId);
      res.sendFile(__dirname + "/public/user_created.html");
      //   res.end();
    }
  );
});

app.post("/user_delete", (req, res) => {
  console.log("Deleting a user");
  console.log("This is the ID: " + req.body.delete_user);
  res.sendFile(__dirname + "/public/user_deleted.html");
  //   res.end();
});

app.get("/user/:id", (req, res) => {
  console.log("Fetching user with id: " + req.params.id);

  const userId = req.params.id;
  const queryString = "SELECT * FROM users WHERE id = ?";

  getConnection().query(queryString, [userId], (err, rows, fields) => {
    console.log("I think we fetched users successfully");
    if (err) {
      console.log("Failed to query for users: " + err);
      res.sendStatus(500);
      return;
    }
    console.log("Connected");
    res.json(rows);
  });
});

// main route landing page
app.get("/", (req, res) => {
  console.log("Responding to root route");
  //   res.send("Hello from Root");
  res.sendFile(__dirname + "/public/landing_page.html");
});

// getting all the users (all rows from the database table)
app.get("/users", (req, res) => {
  const queryString = "SELECT * FROM users";
  getConnection().query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err);
      res.sendStatus(500);
      return;
    }
    res.json(rows);
  });
});

function getConnection() {
  return mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    socket: "	/Applications/MAMP/tmp/mysql/mysql.sock",
    database: "myDataBase"
  });
}

// localhost:3003
app.listen(3003, () => {
  console.log("Server is up and listening on 3003");
});
