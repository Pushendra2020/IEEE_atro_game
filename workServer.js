//  const http = require('http');
// const fs = require('fs');
// const path = require('path');

// const server = http.createServer((req, res) => {
//   let filePath = '.' + req.url;
//   if (filePath === './') filePath = './Asteroid Game Working/working_game.html';

//   const extname = String(path.extname(filePath)).toLowerCase();
//   const mimeTypes = {
//    '.html': 'text/html',
//     '.js': 'application/javascript',
//     '.css': 'text/css',
//     '.png': 'image/png',
//     '.jpg': 'image/jpeg',
//     '.gif': 'image/gif',
//   };

//   const contentType = mimeTypes[extname] || 'application/octet-stream';

//   fs.readFile(filePath, (error, content) => {
//     if (error) {
//       if (error.code === 'ENOENT') {
//         res.writeHead(404, { 'Content-Type': 'text/html' });
//         res.end('404: File Not Found', 'utf-8');
//       } else {
//         res.writeHead(500);
//         res.end(`Sorry, there was an error: ${error.code} ..\n`);
//       }
//     } else {
//       res.writeHead(200, { 'Content-Type': contentType });
//       res.end(content, 'utf-8');
//     }
//   });
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });





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
        leaderboard.push(data);
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10);
        io.emit('leaderboard_update', leaderboard);
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
                // updateLeaderboard();
                // if (res) res.json({ success: true });
            });
        }
    });
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});





