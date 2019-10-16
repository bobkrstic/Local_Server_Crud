// Create request on the route "/user/:id"
app.get("/user/:id", (req, res) => {
  // Connect to the data base and get the data
  getConnection().query(
    "SELECT * FROM users WHERE id = ?",
    [userId],
    (err, rows, fields) => {
      // user that data to send it back to HTML
      res.render("test", {
        userId: rows[0].id,
        userName: rows[0].first_name,
        userLastName: rows[0].last_name
      });
    }
  );
});
