const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const leaderboardTableBody = document.getElementById('leaderboardTableBody');
    const click_bnt = document.getElementById('click_bnt');
    let previousLeaderboardData = null; // Store the previous leaderboard data
    let noChangeTimer = null; // Timer to track no changes in the leaderboard
    const noChangeDuration = 10 *60 * 1000; // 2 minutes in milliseconds

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

    // Fetch and check the leaderboard data at intervals
    setInterval(() => {
        fetch('/leaderboard')
        .then((res) => res.json())
        .then((data) => {
            console.log('Fetched leaderboard data:', data);

            // Check if the leaderboard data has changed
            if (!previousLeaderboardData || JSON.stringify(data) !== JSON.stringify(previousLeaderboardData)) {
                // Reset the no-change timer and update UI
                console.log('Leaderboard data changed. Resetting timer.');
                resetNoChangeTimer();
                updateLeaderboardUI(data);
                previousLeaderboardData = data;
            }
        })
        .catch((error) => {
            console.error('Error fetching leaderboard data:', error);
        });
    }, 1000);

    // Listen for leaderboard updates
    socket.on('leaderboard_update', (data) => {
        console.log('Leaderboard updated:', data);
        resetNoChangeTimer(); // Reset the timer on updates
        updateLeaderboardUI(data);
        previousLeaderboardData = data; // Update the stored data
    });

    // Function to reset the no-change timer
    function resetNoChangeTimer() {
        if (noChangeTimer) clearTimeout(noChangeTimer);
        noChangeTimer = setTimeout(() => {
            console.log('No changes detected for 2 minutes. Triggering click_bnt.');
            click_bnt.click(); // Trigger the button click
        }, noChangeDuration);
    }

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
