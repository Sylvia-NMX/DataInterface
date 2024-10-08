const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'testerusernetmx',  // Your MySQL user
  password: '1234',  // Your MySQL password
  database: 'client_data'
});

db.connect(err => {
  if (err) {
    console.log('Database connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Endpoint to handle form submission
app.post('/submit-data', (req, res) => {
  const { startTime, endTime, employees, dailySales, hourlySales, breaks } = req.body;

  const query = `
    INSERT INTO daily_metrics (start_time, end_time, employees, daily_sales, hourly_sales, breaks)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    startTime,
    endTime,
    employees,
    dailySales,
    JSON.stringify(hourlySales),
    JSON.stringify(breaks)
  ], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error saving data');
    } else {
      res.status(200).send('Data saved successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
