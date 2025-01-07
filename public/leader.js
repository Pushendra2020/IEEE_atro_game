const socket = io();

// Prompt the user for their name
//const playerName = prompt("Enter your name:");

// Example: Send score updates
function updateScore(playerId, score) {
    socket.emit('update_score', { playerId:playerName, score });
}

// Example: Receive leaderboard updates
socket.on('leaderboard_update', (data) => {
    console.log('Leaderboard updated:', data);
    const leaderboardElement = document.getElementById('leaderboardList');
    leaderboardElement.innerHTML = data
        .map((entry) => `<li>${entry.playerId}: ${entry.score}</li>`)
        .join('');
});

// Simulate score updates for testing
setInterval(() => {
    const score = Math.floor(Math.random() * 100);
    updateScore(playerName, score);
}, 5000);