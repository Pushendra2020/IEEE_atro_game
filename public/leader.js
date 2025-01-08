const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const leaderboardTableBody = document.getElementById('leaderboardTableBody');
const click_bnt = document.getElementById('click_bnt');


click_bnt.addEventListener('click', () => {
    fetch('/deleteExceptHighest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Data deleted successfully');
            // Optionally, refresh the leaderboard
            fetch('/leaderboard')
                .then((res) => res.json())
                .then((data) => {
                    console.log('Leaderboard data:', data);
                    updateLeaderboardUI(data);
                })
                .catch((error) => {
                    console.error('Error fetching leaderboard data:', error);
                });
        } else {
            console.error('Error deleting data:', data.error);
        }
    })
    .catch(error => {
        console.error('Error deleting data:', error);
    });
});


    // Fetch the initial leaderboard data
setInterval(() => {
    fetch('/leaderboard')
    .then((res) => res.json())
    .then((data) => {
        console.log('Leaderboard data:', data);
        updateLeaderboardUI(data);
    })
    .catch((error) => {
        console.error('Error fetching leaderboard data:', error);
    });
}, 1000);

    

    // Listen for leaderboard updates
    socket.on('leaderboard_update', (data) => {
        console.log('Leaderboard updated:', data);
        updateLeaderboardUI(data);
    });

    // Function to update the leaderboard UI
    function updateLeaderboardUI(data) {
        leaderboardTableBody.innerHTML = data
            .map((entry) => `
                <tr class="bg-white dark:bg-gray-800">
                    <td class="px-4 py-4">${entry.user_name}</td>
                    <td class="px-6 py-4">${entry.user_score}</td>
                </tr>
            `)
            .join('');
    }
});