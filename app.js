// load our app server using express
var express = require("express");
var http = require("http");
const app = express();
const morgan = require("morgan");
var mysql = require("mysql");
const bodyParser = require("body-parser");
// to make sure app uses body-parser
// helps process the request easier
app.use(bodyParser.urlencoded({ extended: true }));

// our application server is now going to able to serve all of the files
// inside the "public"
app.use(express.static("./public"));

app.use(morgan("short"));

var dateFormat = require("dateformat");
var now = new Date();

// the view engine Template parsing, using EJS types

app.set("view engine", "ejs");

// using the bootstrap
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use("/js", express.static(__dirname + "/node_modules/tether/dist/js"));
app.use("/js", express.static(__dirname + "/node_modules/jquery/dist"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));

// create connection
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
      userID = results.insertId;
      console.log("Inserted a new user with id: ", results.insertId);
      //   res.sendFile(__dirname + "/public/user_created.html");
      res.render("userCreated", {
        userUiID: userID,
        userFirstName: firstName,
        userLastName: lastName
        //   console.log(firstName + "  " + lastName);
        //   res.end()
      });
    }
  );
});

app.post("/user_delete", (req, res) => {
  console.log("Deleting a user");
  console.log("This is the ID: " + req.body.delete_user_id);

  const userID = req.body.delete_user_id;

  const queryString = "DELETE FROM users WHERE id = ?";

  getConnection().query(queryString, [userID], (err, rows, fields) => {
    console.log("I think we deleted user successfully");
    if (err) {
      console.log("Failed to query for users: " + err);
      res.sendStatus(500);
      return;
    }
    console.log("User Deleted");
  });
  res.sendFile(__dirname + "/public/user_deleted.html");

  //   res.end();
});

// another way DELETING a row
app.get("/user/delete/:id", (req, res) => {
  const userId = req.params.id;
  getConnection().query(
    "DELETE FROM users WHERE id = " + userId + "",
    (err, rows, fields) => {
      res.render("/public/form.html");
    }
  );
});

// app.get("/user/:id", (req, res) => {
//   console.log("Fetching user with id: " + req.params.id);

//   const userId = req.params.id;
//   const queryString = "SELECT * FROM users WHERE id = ?";

//   getConnection().query(queryString, [userId], (err, rows, fields) => {
//     console.log("I think we fetched users successfully");
//     if (err) {
//       console.log("Failed to query for users: " + err);
//       res.sendStatus(500);
//       return;
//     }
//     console.log("Connected");
//     console.log(rows);
//     res.json(rows);
//     // res.render()
//   });
// });

app.get("/user/:id", (req, res) => {
  console.log("Fetching user with id: " + req.query.get_user_id);
  //   console.log(req);

  const userId = req.query.get_user_id;
  const queryString = "SELECT * FROM users WHERE id = ?";

  console.log(queryString + " " + userId);

  getConnection().query(queryString, [userId], (err, rows, fields) => {
    console.log("I think we fetched users successfully");
    if (err) {
      console.log("Failed to query for users: " + err);
      res.sendStatus(500);
      return;
    }
    console.log("Connected");
    console.log(
      rows[0].id + " " + rows[0].first_name + " " + rows[0].last_name
    );

    const userID = rows[0].id;

    // on "/user/:id" route render this page "test.ejs"
    res.render("test", {
      userId: userID,
      userName: rows[0].first_name,
      userLastName: rows[0].last_name
    });

    // console.log(RowDataPacket);
    // res.json(rows);
    // console.log(rows);
  });
});

// get the chosen user and display the data in the form
// this data will be edited and submitted in the POST method below
app.get("/user/edit/:id", (req, res) => {
  //   console.log("Fetching user with id: " + req.query.get_user_id);
  //   const userId = req.query.get_user_id;
  const userId = req.params.id;
  const queryString = "SELECT * FROM users WHERE id = ?";

  console.log(queryString + " " + userId);

  getConnection().query(queryString, [userId], (err, rows, fields) => {
    const userID = rows[0].id;

    // on "/user/:id" route render this page "test.ejs"
    res.render("pages/updateUser.ejs", {
      userId: userID,
      userName: rows[0].first_name,
      userLastName: rows[0].last_name
    });
  });
});

app.post("/user/edit/:id", (req, res) => {
  console.log("Trying to update a user with user id = " + req.params.id);
  console.log(req.params.id);
  console.log("First name: " + req.body.userName);
  // capturing input from a user

  const userId = req.params.id;
  const firstName = req.body.userName;
  const lastName = req.body.userLastName;

  // first_name last_name the way they are defined in the data base
  const queryString =
    "UPDATE users SET first_name = ?, last_name = ? WHERE id = " + userId + "";
  // next step is the sequel query to use the input data and place it into the table (data base)
  getConnection().query(
    queryString,
    [firstName, lastName],
    (err, results, fields) => {
      if (err) {
        console.log("Failed to update user: " + err);
        res.sendStatus(500);
        return;
      }

      console.log("Edited a new user with id: " + req.body.userId);
      res.sendFile(__dirname + "/public/form.html");
      //   if (results.affectedRows) {
      //     res.redirect(baseURL);
      //   }
    }
  );
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
    // res.json(rows);
    res.render("allUsers", {
      users: rows
      //   userId: rows[0].id,
      //   userName: rows[0].first_name,
      //   userLastName: rows[0].last_name
    });
  });
});

// localhost:3003
app.listen(3003, () => {
  console.log("Server is up and listening on 3003");
});
