const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'testerusernetmx',
  password: '1234',
  database: 'pedestrian_traffic_db'
});

// Check MySQL connection
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit the process if the database connection fails
  }
  console.log('Connected to MySQL database.');
});

// Endpoint to submit client data
app.post('/submit-client-data', (req, res) => {
  console.log("Received client data:", req.body); // Log the received data
  const { entryTimestamp, employees, dailySales, openingTime, closingTime } = req.body;

  // Validate incoming data
  if (!entryTimestamp || !employees || !dailySales || !openingTime || !closingTime) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const sql = 'INSERT INTO client (entry_timestamp, employees, daily_sales, opening_time, closing_time) VALUES (?, ?, ?, ?, ?)';
  
  db.query(sql, [entryTimestamp, employees, dailySales, openingTime, closingTime], (err, result) => {
    if (err) {
      console.error('Error inserting client data:', err); // Log the error
      return res.status(500).json({ message: 'Failed to save client data', error: err.message }); // Send back a more descriptive error
    }
    
    res.json({ dailyDataId: result.insertId });  // Return the inserted `daily_data_id`
  });
});

// Endpoint to submit hourly sales data
app.post('/submit-hourly-sales', (req, res) => {
  console.log("Received hourly sales data:", req.body); // Log the received data
  const { hourlySales } = req.body;

  // Validate incoming data
  if (!hourlySales || !Array.isArray(hourlySales)) {
    return res.status(400).json({ message: 'Invalid or missing hourly sales data' });
  }

  const sql = 'INSERT INTO hourly_sales (daily_data_id, hourly_timestamp, hourly_sales, breaks) VALUES ?';
  
  const values = hourlySales.map(({ dailyDataId, hourlyTimestamp, hourlySales, breaks }) => [
    dailyDataId, hourlyTimestamp, hourlySales, breaks
  ]);

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Error inserting hourly sales data:', err); // Log the error
      return res.status(500).json({ message: 'Failed to save hourly sales data', error: err.message }); // Send back a more descriptive error
    }

    res.json({ message: 'Hourly sales data inserted successfully' });
  });
});

// Start the server
app.listen(5000, () => {
  console.log('Backend server is running on port 5000');
});
