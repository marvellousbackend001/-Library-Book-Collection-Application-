const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const saltRounds = 10;
const app = express();
app.use(cors());
/****************Connecting To  Mysql************************* */
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "CHIDERA001?.1",
    database: "library",
    port: "3306",
});
/*********************************************users authentication and authourizaion************************ */
//creating an endpoint that handles users registration
app.post("/register", bodyParser.json(), function (req, res) {
    const { username, email, password } = req.body;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) throw err;
        const sql = `INSERT INTO users (username, email, password) VALUES (?,?,?)`;
        con.query(sql, [username, email, hash], function (err, result) {
            if (err) throw err;
            res.send("registered");
        });
    });
});
//creating an endpoint that handles users login
app.post("/login", bodyParser.json(), function (req, res) {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    con.query(sql, [username], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    // Implement session management here
                    res.send('Logged in');
                } else {
                    res.send('Incorrect password');
                }
            });
        } else {
            res.send('User not found');
        }
    });
});
// creating an endpoint for adding a book
app.post("/create_book", bodyParser.json(), function (req, res) {
    const { title, author, year_published, isbn } = req.body;
    const sql = `INSERT INTO books (title, author, year_published, isbn) VALUES (?,?,?,?)`;
    con.query(sql, [title, author, year_published, isbn], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
})
// creating an endpoint for getting all books 
app.get("/books", bodyParser.json(), function (req, res) {
    const sql = 'SELECT * FROM books';
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});
//creating an endpoint for  updating books 
app.put("/update_books/:id", bodyParser.json(), function (req, res) {
    const { title, author, year_published, isbn } = req.body;
    const sql = 'UPDATE books SET title = ?, author = ?, year_published = ?, isbn = ? WHERE id = ?';
    con.query(sql, [title, author, year_published, isbn, req.params.id], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});
//creating an endpoint for deleting books
app.delete("/books/:id", bodyParser.json(), function (req, res) {
    const sql = 'DELETE FROM books WHERE id = ?';
    con.query(sql, [req.params.id], function (err, result) {
        if (err) throw err;
        res.send("Book deleted");
    });
});
app.listen(6060)
    , console.log("good job marvellous your server is running at port 6060");