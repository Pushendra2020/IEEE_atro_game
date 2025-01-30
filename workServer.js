const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const bodyParser = require('body-parser');
const QRCode = require("qrcode");
const cors = require('cors');
require('dotenv').config();
const ip = process.env.ip;
const { v4: uuidv4 } = require("uuid");
app.use(cors());
// Serve static files
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.json());

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

let waitingPlayers = {}; 

io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);
    
    // Add player to waiting list
    waitingPlayers[socket.id] = { approved: false };
    socket.emit("waiting"); // Notify the client it's waiting

    // Broadcast updated player list to the host dashboard
    broadcastWaitingPlayers();

    // Handle approval from the host
    socket.on("approve", (playerName) => {
        if (waitingPlayers[playerName]) {
            waitingPlayers[playerName].approved = true;
            io.to(playerName).emit("approved"); // Notify the approved player
            console.log(`Player approved: ${playerName}`);
            delete waitingPlayers[playerName]; // Remove from waiting list
            broadcastWaitingPlayers(); // Update host view
        }
    });


socket.on('rejectPlayer', (playerName) => {
    if (waitingPlayers[playerName]) {
        io.to(playerName).emit('rejected', { redirectUrl: `http://${ip}:5000/pat.html` });
        delete waitingPlayers[playerName];
        console.log(`Player rejected: ${playerName}`);
    }
});


    // Handle disconnections
    socket.on("disconnect", () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete waitingPlayers[socket.id];
        broadcastWaitingPlayers(); // Update host view
    });
});

function broadcastWaitingPlayers() {
    io.emit("waitingPlayers", waitingPlayers);
}


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
                if (res) res.json({ success: true });
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


app.post("/generate_qr", async (req, res) => {
    try {
        // Generate a unique ID
        const qrId = Math.random().toString(36).substring(2, 9);

        // Define the redirect URL with the unique QR ID
        //const validationUrl = `http://192.168.0.102:5000/validate_qr?qr_id=${qrId}`;

        // Set expiration time (20 seconds from now)
        //const expiresAt = new Date(Date.now() + 20 * 1000);

        // Generate the QR code
        const qrCode = await QRCode.toDataURL(`http://${ip}:5000/working_game.html?qr_id=${qrId}`);
console.log(ip)
        // Save the QR code data in the database
        const query = "INSERT INTO qr_codes (qr_id, is_used) VALUES (?, ?)";
        db.query(query, [qrId, false], (err) => {
            if (err) {
                console.error("Error saving QR code:", err);
                return res.status(500).json({ success: false, message: "Database error" });
            }
            // Respond with success and the generated QR code data
            // res.json({ success: true, qrCode: qrCode, qr_id: qrId });
            res.json({ 
                success: true, 
                qrCode: qrCode, 
                qr_id: qrId, 
            });
            
        });
    } catch (error) {
        console.error("Error generating QR code:", error);
        res.status(500).json({ success: false, message: "Failed to generate QR code" });
    }
});



app.get("/validate_qr", (req, res) => {
    const { qr_id } = req.query;
  
    // Query the database for the QR code
    const query = "SELECT * FROM qr_codes WHERE qr_id = ?";
    db.query(query, [qr_id], (err, results) => {
        if (err) {
            console.error("Error validating QR code:", err);
            return res.status(500).send("Server error. Please try again later.");
        }

        if (results.length === 0) {
            return res.status(404).send("QR Code not found.");
        }

        const qrCode = results[0];
        console.log(qrCode);
        const now = new Date();
        console.log(now);

        // Check if the QR code is expired
        // if (now > new Date(qrCode.expires_at)) {
        //     return res.redirect("http://192.168.0.102:5000/pat.html"); // Redirect to expiration page
        // }

        // Check if the QR code has already been used
        if (qrCode.is_used) {
            return res.status(403).send("QR Code has already been used.");
        }

        // Mark the QR code as used (optional)
        // const updateQuery = "UPDATE qr_codes SET is_used = true WHERE qr_id = ?";
        // db.query(updateQuery, [qr_id], (updateErr) => {
        //     if (updateErr) {
        //         console.error("Error updating QR code:", updateErr);
        //     }
        // });

        // Redirect to the intended page
        res.redirect(`http://${ip}:5000/working_game.html`);
    });
});




app.use((req, res, next) => {
    res.once('finish', () => {
        res.locals.responseSent = true;
    });
    next();
});

app.get("/redirect", (req, res) => {
    const { qr_id } = req.query;

    const selectQuery = "SELECT * FROM qr_codes WHERE qr_id = ?";
    db.query(selectQuery, [qr_id], (err, rows) => {
        if (err) {
            console.error("Error querying the database:", err);
            return res.status(500).send("An error occurred. Please try again later.");
        }

        if (rows.length === 0) {
            return res.status(404).send("Invalid QR Code. Access Denied.");
        }

        const qrCode = rows[0];
        if (qrCode.is_used) {
            return res.status(400).send("QR Code already used. Access Denied.");
        }

        // Mark QR Code as used
        const updateQuery = "UPDATE qr_codes SET is_used = TRUE, used_at = NOW() WHERE qr_id = ?";
        db.query(updateQuery, [qr_id], (updateErr, result) => {
            if (updateErr) {
                console.error("Error updating the QR code:", updateErr);
                return res.status(500).send("Failed to validate QR Code. Please try again.");
            }

            // Redirect to the actual destination
            return res.redirect(`http://${ip}:5000/pat.html`);
        });
    });
});



const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});





