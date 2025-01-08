const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const bodyParser = require('body-parser');

// Serve static files
app.use(express.static('public'));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'IEEE_astro',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});


let leaderboard = [];

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });

    socket.on('update_score', (data) => {
        console.log('Score update:', data);
        const { playerName, score } = data;
        handleScoreUpdate(playerName, score);
    });
});

app.post('/EnterScore', (req, res) => {
    const { playerName, score } = req.body;
    console.log('Received score:', playerName, score);
    handleScoreUpdate(playerName, score, res);
});

function handleScoreUpdate(playerName, score, res = null) {
    const selectQuery = 'SELECT * FROM userInfo WHERE user_name = ?';
    db.query(selectQuery, [playerName], (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            if (res) res.status(500).json({ success: false, error: 'Database error' });
            return;
        }

        if (results.length > 0) {
            // User exists, update their score and chance
            const updateQuery = 'UPDATE userInfo SET user_score = ?, user_chance = user_chance + 1 WHERE user_name = ?';
            db.query(updateQuery, [score, playerName], (err, result) => {
                if (err) {
                    console.error('Error updating score in MySQL:', err);
                    if (res) res.status(500).json({ success: false, error: 'Database error' });
                    return;
                }
                updateLeaderboard();
                if (res) res.json({ success: true });
            });
        } else {
            // User does not exist, insert new user
            const insertQuery = 'INSERT INTO userInfo (user_name, user_score, user_chance) VALUES (?, ?, 1)';
            db.query(insertQuery, [playerName, score], (err, result) => {
                if (err) {
                    console.error('Error inserting new user into MySQL:', err);
                    if (res) res.status(500).json({ success: false, error: 'Database error' });
                    return;
                }
                
            });
        }
    });
}

app.get('/leaderboard', (req, res) => {
    const selectQuery = 'SELECT user_name, user_score FROM userInfo ORDER BY user_score DESC LIMIT 10';
    db.query(selectQuery, (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            res.status(500).json({ success: false, error: 'Database error' });
            return;
        }
        res.json(results);
    });
});


app.post('/deleteExceptHighest', (req, res) => {
    const deleteQuery = `
        DELETE FROM userInfo
        WHERE user_score < (
            SELECT MAX(user_score) FROM (
                SELECT user_score FROM userInfo
            ) AS subquery
        )
    `;
    db.query(deleteQuery, (err, result) => {
        if (err) {
            console.error('Error deleting data from MySQL:', err);
            res.status(500).json({ success: false, error: 'Database error' });
            return;
        }
        res.json({ success: true });
    });
});


const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});





