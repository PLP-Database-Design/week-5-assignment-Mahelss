const express = require('express');
const app = express();

// DBMS Mysql
const mysql = require('mysql2');

// Environment variable doc
const dotenv = require('dotenv');

// Configuring the package
dotenv.config();

// Connecting to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Checking connection
db.connect((err) => {
    if (err) {
        return console.log("Error connecting to MySQL:", err);
    }
    console.log("Connected to MySQL as id:", db.threadId);
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Question 1 - Retrieve all patients
app.get('/data', (req, res) => {
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error retrieving data');
        } else {
            res.render('data', { results: results });
        }
    });
});

// Question 2 - Retrieve all providers
app.get('/providers', (req, res) => {
    db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
        if (err) {
            console.error('Database error:', err); // Log the error for debugging
            return res.status(500).send('Error retrieving data');
        }
        res.json(results); // Send the results as JSON
    });
});

// Question 3 - Filter patients by first name
app.get('/patients/:firstName', (req, res) => {
    const firstName = req.params.firstName;
    const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    
    db.query(sql, [firstName], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Question 4 - Retrieve all providers by specialty
app.get('/providers/specialty/:specialty', (req, res) => {
    const specialty = req.params.specialty;
    const sql = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';

    db.query(sql, [specialty], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Sending a message to the browser
console.log(`Sending message to browser...`);
app.get('/', (req, res) => {
    res.send('Server Started Successfully!');
});
