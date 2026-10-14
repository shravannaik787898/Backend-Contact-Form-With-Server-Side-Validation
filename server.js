const express = require('express');
const mysql = require('mysql2/promise');

const app = express();

// 1. Parse incoming form data
app.use(express.urlencoded({ extended: true }));

// 2. Serve your HTML form from the 'public' folder
app.use(express.static('public'));

// 3. Connect to your database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin', // Put your MySQL password here if any
    database: 'ex_db'
});

// 4. Handle form submission and save to MySQL
app.post('/submit-inquiry', async (req, res) => {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim();
    const subject = (req.body.subject || "").trim();
    const message = (req.body.message || "").trim();

    // Basic validation
    if (!name || !subject || !message) {
        return res.status(400).send("All fields are required.");
    }

    try {
        const query = `
            INSERT INTO inquiries (name, email, subject, message)
            VALUES (?, ?, ?, ?)
        `;
        
        // This command stores the details into your MySQL table
        await pool.execute(query, [name, email, subject, message]);

        res.send("Inquiry submitted and stored in MySQL successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Unable to submit inquiry.");
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});