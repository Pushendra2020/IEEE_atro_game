// const canvas = document.getElementById('gameCanvas');
// const ctx = canvas.getContext('2d');
// const resetButton = document.getElementById('resetButton');
// const upgradeMessage = document.getElementById('upgradeMessage');



// const gameSpace = {
//     x: 50,
//     y: 50,
//     size: 400,
// };

// let squares = [];
// let bullets = []; // Store bullets
// let stars = []; // Store stars
// let hasPlusAppeared = false;
// let upgradedBullets = 0; // 0: no upgrade, 1: double bullets, 2: five bullets
// let upgradeTimeout = null; // Timeout for bullet upgrade

// const ship = {
//     x: gameSpace.x + gameSpace.size / 2,
//     y: gameSpace.y + gameSpace.size - 30,
//     width: 40,
//     height: 20,
//     speed: 200, // Adjusted speed for consistent movement
//     direction: 0,
// };

// let counter = 0; // Tracks asteroids avoided
// let level = 1; // Current level
// let isGameOver = false;
// let spawnInterval = 1000; // Initial spawn rate (ms)

// const asteroidImage = new Image();
// asteroidImage.src = 'Photos/astro_pho2.png'; // Path to the asteroid image

// const powerUpImage = new Image();
// powerUpImage.src = 'Photos/powerup_pho1.png'; // Path to the power-up image

// function createSquare() {
//     if (isGameOver) return;
//     const numSquares = level; // Create a number of squares equal to the current level
//     for (let i = 0; i < numSquares; i++) {
//         const size = 20;
//         const speedY = 50 + (level - 1) * 50 + Math.random() * (50 * level); // Progressive speed increase
//         const x = Math.random() * (gameSpace.size - size) + gameSpace.x;
//         const y = gameSpace.y;
//         squares.push({ x, y, size, speedY, type: 'normal' });
//     }
// }

// function drawScore() {
//     ctx.fillStyle = 'white'; // Set score color
//     ctx.font = '20px Arial'; // Set score font
//     ctx.fillText(`Score: ${score}`, 10, 30); // Position the score at the top-left corner
// }


// function createStars() {
//     stars = []; // Clear the stars array to ensure randomness on restart
//     for (let i = 0; i < 100; i++) {
//         const x = Math.random() * canvas.width;
//         const y = Math.random() * canvas.height;
//         const speedY = 20; // Increased speed for stars (2x the original speed)
//         stars.push({ x, y, speedY });
//     }
// }

// function drawStars() {
//     ctx.fillStyle = '#ffffff';
//     stars.forEach(star => {
//         ctx.fillRect(star.x, star.y, 1, 1);
//     });
// }

// function updateStars(deltaTime) {
//     stars.forEach(star => {
//         star.y += star.speedY * deltaTime;
//         if (star.y > canvas.height) {
//             star.y = 0;
//             star.x = Math.random() * canvas.width;
//         }
//     });
// }

// function drawGameSpace() {
//     ctx.strokeStyle = '#000';
//     ctx.lineWidth = 2;
//     ctx.strokeRect(gameSpace.x, gameSpace.y, gameSpace.size, gameSpace.size);
// }

// function drawSquares() {
//     squares.forEach(square => {
//         if (square.type === 'normal') {
//             if (asteroidImage.complete) {
//                 ctx.drawImage(asteroidImage, square.x, square.y, square.size * 1.5, square.size * 1.5);
//             }
//         } else if (square.type === 'plus') {
//             if (powerUpImage.complete) {
//                 ctx.drawImage(powerUpImage, square.x, square.y, square.size, square.size);
//             }
//         }
//     });
// }

// const shipImage = new Image();
// shipImage.src = 'Photos/ship_pho2.png'; // Replace with the path to your image



// function drawShip() {
//     if (shipImage.complete) {
//         ctx.drawImage(shipImage, ship.x - ship.width / 1, ship.y - ship.height / 1, ship.width * 1.5, ship.height * 3.0);
//     } else {
//         shipImage.onload = () => {
//             ctx.drawImage(shipImage, ship.x - ship.width / 2, ship.y, ship.width, ship.height);
//         };
//     }
// }

// // function drawShip() {
// //     ctx.fillStyle = '#ffffff';
// //     ctx.beginPath();
// //     ctx.moveTo(ship.x, ship.y);
// //     ctx.lineTo(ship.x - ship.width / 2, ship.y + ship.height);
// //     ctx.lineTo(ship.x + ship.width / 2, ship.y + ship.height);
// //     ctx.closePath();
// //     ctx.fill();
// // }

// const bulletImage = new Image();
// bulletImage.src = 'Photos/fire_pho1.png'; // Path to the bullet image
// bulletImage.onerror = () => {
//     console.error('Failed to load bullet image');
// };

// function drawBullets() {
//     bullets.forEach(bullet => {
//         if (bulletImage.complete && bulletImage.naturalWidth !== 0) {
//             ctx.drawImage(bulletImage, bullet.x-15, bullet.y-65, bullet.width * 15, bullet.height * 15);
//         } else {
//             console.error('Bullet image is not loaded or is broken');
//         }
//     });
// }

// function drawGameInfo() {
//     ctx.fillStyle = '#ffffff';
//     ctx.font = '16px Arial';
//     ctx.fillText(`Asteroids Avoided: ${counter}`, 10, 20);
//     ctx.fillText(`Level: ${level}`, 10, 40);
//     ctx.fillText(`Score: ${score}`, 10, 60);
// }

// function updateSquares(deltaTime) {
//     squares.forEach((square, index) => {
//         square.y += square.speedY * deltaTime;
//         if (checkCollision(square, ship)) {
//             if (square.type === 'plus') {
//                 squares.splice(index, 1);
//                 upgradedBullets = 2;
               
//                 if (upgradeTimeout) clearTimeout(upgradeTimeout);
//                 upgradeTimeout = setTimeout(() => {
//                     upgradedBullets = 1;
//                 }, 6000);
//                 showUpgradeMessage();
//             } else {
//                 endGame();
//             }
//         }
//         if (square.y > gameSpace.y + gameSpace.size) {
//             squares.splice(index, 1);
//             counter++;
           
//             checkLevelUp();
//             checkWinCondition();
//             if (counter === 10 && !hasPlusAppeared) {
//                 createPlusSquare();
//             }
//             if (counter >= 30 && (counter - 10) % 20 === 0) {
//                 createPlusSquare();
//             }
//         }
//     });
// }

// function checkCollision(square, ship) {
//     return (
//         square.x < ship.x + ship.width / 2 &&
//         square.x + square.size > ship.x - ship.width / 2 &&
//         square.y < ship.y + ship.height &&
//         square.y + square.size > ship.y
//     );
// }

// function checkWinCondition() {
//     if (counter >= 201) {
//         endGame();
//     }
// }

// function createPlusSquare() {
//     const size = 30;
//     const speedY = 100;
//     const x = Math.random() * (gameSpace.size - size) + gameSpace.x;
//     const y = gameSpace.y;
//     squares.push({ x, y, size, speedY, type: 'plus' });
//     hasPlusAppeared = true;
// }

// function updateBullets(deltaTime) {
//     bullets.forEach((bullet, index) => {
//         bullet.y -= bullet.speed * deltaTime;
//         if (bullet.y < gameSpace.y) {
//             bullets.splice(index, 1);
//         }
//     });
// }

// function checkBulletCollision() {
//     bullets.forEach((bullet, bulletIndex) => {
//         squares.forEach((square, squareIndex) => {
//             if (
//                 bullet.x < square.x + square.size &&
//                 bullet.x + bullet.width > square.x &&
//                 bullet.y < square.y + square.size &&
//                 bullet.y + bullet.height > square.y
//             ) {
//                 if (square.type === 'plus') {
//                     squares[squareIndex].type = 'plus';
//                 } else {
//                     squares.splice(squareIndex, 1);
//                     bullets.splice(bulletIndex, 1);
//                    // counter++;
//                     score++;
//                     document.getElementById('scoreContainer').innerText = `Score: ${score}`;
//                     checkLevelUp();
//                     checkWinCondition();
//                     if (counter === 10 && !hasPlusAppeared) {
//                         createPlusSquare();
//                     }
//                     if (counter >= 30 && (counter - 10) % 20 === 0) {
//                         createPlusSquare();
//                     }
//                 }
//             }
//         });
//     });
// }

// function updateShip(deltaTime) {
//     ship.x += ship.speed * ship.direction * deltaTime;
//     if (ship.x - ship.width / 2 < gameSpace.x) {
//         ship.x = gameSpace.x + ship.width / 2;
//     } else if (ship.x + ship.width / 2 > gameSpace.x + gameSpace.size) {
//         ship.x = gameSpace.x + gameSpace.size - ship.width / 2;
//     }
// }

// function checkLevelUp() {
//     const levelThresholds = [20, 40, 60, 80, 100];
//     if (score >= levelThresholds[level - 1] && level < levelThresholds.length) {
//         level++;
//         adjustLevel();
//     }
// }

// function adjustLevel() {
//     spawnInterval = Math.max(200, spawnInterval - 150);
//     clearInterval(spawnTimer);
//     spawnTimer = setInterval(createSquare, spawnInterval);
// }

// function showUpgradeMessage() {
//     upgradeMessage.style.display = 'block';
//     setTimeout(() => {
//         upgradeMessage.style.display = 'none';
//     }, 2000);
// }

// function endGame(isWin = false) {
//     isGameOver = true;
//     if (isWin) {
//         drawWinScreen();
//     } else {
//         drawGameOverScreen();
//     }
//     resetButton.style.display = 'block';
//     clearInterval(spawnTimer);
// }

// function drawGameOverScreen() {
//     ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
//     ctx.fillRect(gameSpace.x, gameSpace.y, gameSpace.size, gameSpace.size);
//     ctx.fillStyle = 'white';
//     ctx.font = '48px Arial';
//     ctx.textAlign = 'center';
//     ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
//     ctx.font = '24px Arial';
//     ctx.fillText('Click Restart Game to Try Again', canvas.width / 2, canvas.height / 2 + 50);
// }

// function drawWinScreen() {
//     ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
//     ctx.fillRect(gameSpace.x, gameSpace.y, gameSpace.size, gameSpace.size);
//     ctx.fillStyle = 'white';
//     ctx.font = '36px Arial';
//     ctx.textAlign = 'center';
//     ctx.fillText('Nice Flying!', canvas.width / 2, canvas.height / 2 - 20);
//     ctx.fillText('You made it out', canvas.width / 2, canvas.height / 2 + 20);
//     ctx.fillText('of the asteroid belt, captain!', canvas.width / 2, canvas.height / 2 + 50);
// }

// document.addEventListener('keydown', (e) => {
//     if (e.key === 'a' || e.key === 'ArrowLeft') {
//         ship.direction = -1;
//     } else if (e.key === 'd' || e.key === 'ArrowRight') {
//         ship.direction = 1;
//     } else if (e.key === ' ' || e.key === 'w') {
//         fireBullet();
//     }
// });

// document.addEventListener('keyup', (e) => {
//     if (e.key === 'a' || e.key === 'ArrowLeft' || e.key === 'd' || e.key === 'ArrowRight') {
//         ship.direction = 0;
//     }
// });
// let leftbnt = document.getElementById('leftbnt')
// let rightbnt =document.getElementById('rightbnt')
// leftbnt.addEventListener("touchstart",(e)=>{
//     ship.direction = -1;

// })
// leftbnt.addEventListener("touchend", (e) => {
//     ship.direction = 0;
// });
// rightbnt.addEventListener("touchstart",(e)=>{
//     ship.direction = 1;

// })

// rightbnt.addEventListener("touchend", (e) => {
//     ship.direction = 0;
// });

// function fireBullet() {
//     if (upgradedBullets === 2) {
//         bullets.push({ x: ship.x - ship.width / 2 - 5, y: ship.y, width: 2, height: 5, speed: 800 });
//         bullets.push({ x: ship.x - ship.width / 4, y: ship.y, width: 2, height: 5, speed: 800 });
//         bullets.push({ x: ship.x - 1, y: ship.y, width: 2, height: 5, speed: 800 });
//         bullets.push({ x: ship.x + ship.width / 4 - 2, y: ship.y, width: 2, height: 5, speed: 800 });
//         bullets.push({ x: ship.x + ship.width / 2, y: ship.y, width: 2, height: 5, speed: 800 });
//     } else if (upgradedBullets === 1) {
//         bullets.push({ x: ship.x - ship.width / 4, y: ship.y, width: 2, height: 5, speed: 800 });
//         bullets.push({ x: ship.x + ship.width / 4 - 2, y: ship.y, width: 2, height: 5, speed: 800 });
//     } else {
//         bullets.push({ x: ship.x - 1, y: ship.y, width: 2, height: 5, speed: 800 });
//     }
// }

// // Set up automatic firing
// setInterval(() => {
//     if (!isGameOver) {
//         fireBullet();
//     }
// }, 500); // Adjust the interval (in milliseconds) as needed

// resetButton.addEventListener('click', () => {
//     isGameOver = false;
//     score = 0;
//     counter = 0;
//     level = 1;
//     squares = [];
//     bullets = [];
//     lastTimestamp = 0;
//     document.getElementById('scoreContainer').innerText = `Score: ${score}`;
//     // Clear any existing intervals or timeouts
//     clearInterval(spawnTimer);
//     if (upgradeTimeout) clearTimeout(upgradeTimeout);
//     // Restart the game
//     spawnTimer = setInterval(createSquare, spawnInterval);
//     requestAnimationFrame(animate);
// });

// let spawnTimer = setInterval(createSquare, spawnInterval);
// createStars();
// requestAnimationFrame(animate);
// let lastTimestamp = 0;
// let score = 0;

// function animate(timestamp) {
//     if (isGameOver) return;
//     const deltaTime = (timestamp - lastTimestamp) / 1000;
//     lastTimestamp = timestamp;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     drawStars();
//     drawGameSpace();
//     drawSquares();
//     drawShip();
//     drawBullets();
//     drawGameInfo();
//     updateStars(deltaTime);
//     updateSquares(deltaTime);
//     updateBullets(deltaTime);
//     updateShip(deltaTime);
//     checkBulletCollision();
//     requestAnimationFrame(animate);
// }








const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const upgradeMessage = document.getElementById('upgradeMessage');

//const socket = io();
const playerName = prompt("Enter your name:");

const gameSpace = {
    x: 50,
    y: 50,
    size: 400,
};

let squares = [];
let bullets = []; // Store bullets
let stars = []; // Store stars
let hasPlusAppeared = false;
let upgradedBullets = 0; // 0: no upgrade, 1: double bullets, 2: five bullets
let upgradeTimeout = null; // Timeout for bullet upgrade

const ship = {
    x: gameSpace.x + gameSpace.size / 2,
    y: gameSpace.y + gameSpace.size - 30,
    width: 40,
    height: 20,
    speed: 200, // Adjusted speed for consistent movement
    direction: 0,
};

let counter = 0; // Tracks asteroids avoided
let level = 1; // Current level
let isGameOver = false;
let spawnInterval = 1000; // Initial spawn rate (ms)

const asteroidImage = new Image();
asteroidImage.src = 'Photos/astro_pho2.png'; // Path to the asteroid image

const powerUpImage = new Image();
powerUpImage.src = 'Photos/powerup_pho1.png'; // Path to the power-up image

function createSquare() {
    if (isGameOver) return;
    const numSquares = level; // Create a number of squares equal to the current level
    for (let i = 0; i < numSquares; i++) {
        const size = 20;
        const speedY = 50 + (level - 1) * 50 + Math.random() * (50 * level); // Progressive speed increase
        const x = Math.random() * (gameSpace.size - size) + gameSpace.x;
        const y = gameSpace.y;
        squares.push({ x, y, size, speedY, type: 'normal' });
    }
}

function drawScore() {
    ctx.fillStyle = 'white'; // Set score color
    ctx.font = '20px Arial'; // Set score font
    ctx.fillText(`Score: ${score}`, 10, 30); // Position the score at the top-left corner
}

function createStars() {
    stars = []; // Clear the stars array to ensure randomness on restart
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedY = 20; // Increased speed for stars (2x the original speed)
        stars.push({ x, y, speedY });
    }
}

function drawStars() {
    ctx.fillStyle = '#ffffff';
    stars.forEach(star => {
        ctx.fillRect(star.x, star.y, 1, 1);
    });
}

function updateStars(deltaTime) {
    stars.forEach(star => {
        star.y += star.speedY * deltaTime;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

function drawGameSpace() {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(gameSpace.x, gameSpace.y, gameSpace.size, gameSpace.size);
}

function drawSquares() {
    squares.forEach(square => {
        if (square.type === 'normal') {
            if (asteroidImage.complete) {
                ctx.drawImage(asteroidImage, square.x, square.y, square.size * 1.5, square.size * 1.5);
            }
        } else if (square.type === 'plus') {
            if (powerUpImage.complete) {
                ctx.drawImage(powerUpImage, square.x, square.y, square.size, square.size);
            }
        }
    });
}

const shipImage = new Image();
shipImage.src = 'Photos/ship_pho2.png'; // Replace with the path to your image

function drawShip() {
    if (shipImage.complete) {
        ctx.drawImage(shipImage, ship.x - ship.width / 1, ship.y - ship.height / 1, ship.width * 1.5, ship.height * 3.0);
    } else {
        shipImage.onload = () => {
            ctx.drawImage(shipImage, ship.x - ship.width / 2, ship.y, ship.width, ship.height);
        };
    }
}

const bulletImage = new Image();
bulletImage.src = 'Photos/fire_pho1.png'; // Path to the bullet image
bulletImage.onerror = () => {
    console.error('Failed to load bullet image');
};

function drawBullets() {
    bullets.forEach(bullet => {
        if (bulletImage.complete && bulletImage.naturalWidth !== 0) {
            ctx.drawImage(bulletImage, bullet.x-15, bullet.y-65, bullet.width * 15, bullet.height * 15);
        } else {
            console.error('Bullet image is not loaded or is broken');
        }
    });
}

function drawGameInfo() {
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText(`Asteroids Avoided: ${counter}`, 10, 20);
    ctx.fillText(`Level: ${level}`, 10, 40);
    ctx.fillText(`Score: ${score}`, 10, 60);
}

function updateSquares(deltaTime) {
    squares.forEach((square, index) => {
        square.y += square.speedY * deltaTime;
        if (checkCollision(square, ship)) {
            if (square.type === 'plus') {
                squares.splice(index, 1);
                upgradedBullets = 2;
                if (upgradeTimeout) clearTimeout(upgradeTimeout);
                upgradeTimeout = setTimeout(() => {
                    upgradedBullets = 1;
                }, 6000);
                showUpgradeMessage();
            } else {
                endGame();
            }
        }
        if (square.y > gameSpace.y + gameSpace.size) {
            squares.splice(index, 1);
            counter++;
            checkLevelUp();
            checkWinCondition();
            if (counter === 10 && !hasPlusAppeared) {
                createPlusSquare();
            }
            if (counter >= 30 && (counter - 10) % 20 === 0) {
                createPlusSquare();
            }
        }
    });
}

function checkCollision(square, ship) {
    return (
        square.x < ship.x + ship.width / 2 &&
        square.x + square.size > ship.x - ship.width / 2 &&
        square.y < ship.y + ship.height &&
        square.y + square.size > ship.y
    );
}

function checkWinCondition() {
    if (counter >= 201) {
        endGame();
    }
}

function createPlusSquare() {
    const size = 30;
    const speedY = 100;
    const x = Math.random() * (gameSpace.size - size) + gameSpace.x;
    const y = gameSpace.y;
    squares.push({ x, y, size, speedY, type: 'plus' });
    hasPlusAppeared = true;
}

function updateBullets(deltaTime) {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed * deltaTime;
        if (bullet.y < gameSpace.y) {
            bullets.splice(index, 1);
        }
    });
}

function checkBulletCollision() {
    bullets.forEach((bullet, bulletIndex) => {
        squares.forEach((square, squareIndex) => {
            if (
                bullet.x < square.x + square.size &&
                bullet.x + bullet.width > square.x &&
                bullet.y < square.y + square.size &&
                bullet.y + bullet.height > square.y
            ) {
                if (square.type === 'plus') {
                    squares[squareIndex].type = 'plus';
                } else {
                    squares.splice(squareIndex, 1);
                    bullets.splice(bulletIndex, 1);
                    score++;
                    document.getElementById('scoreContainer').innerText = `Score: ${score}`;
                    checkLevelUp();
                    checkWinCondition();
                    if (counter === 10 && !hasPlusAppeared) {
                        createPlusSquare();
                    }
                    if (counter >= 30 && (counter - 10) % 20 === 0) {
                        createPlusSquare();
                    }
                }
            }
        });
    });
}

function updateShip(deltaTime) {
    ship.x += ship.speed * ship.direction * deltaTime;
    if (ship.x - ship.width / 2 < gameSpace.x) {
        ship.x = gameSpace.x + ship.width / 2;
    } else if (ship.x + ship.width / 2 > gameSpace.x + gameSpace.size) {
        ship.x = gameSpace.x + gameSpace.size - ship.width / 2;
    }
}

function checkLevelUp() {
    const levelThresholds = [20, 40, 60, 80, 100];
    if (score >= levelThresholds[level - 1] && level < levelThresholds.length) {
        level++;
        adjustLevel();
    }
}

function adjustLevel() {
    spawnInterval = Math.max(200, spawnInterval - 150);
    clearInterval(spawnTimer);
    spawnTimer = setInterval(createSquare, spawnInterval);
}

function showUpgradeMessage() {
    upgradeMessage.style.display = 'block';
    setTimeout(() => {
        upgradeMessage.style.display = 'none';
    }, 2000);
}

function endGame(isWin = false) {
    isGameOver = true;
    if (isWin) {
        drawWinScreen();
    } else {
        drawGameOverScreen();
    }
    resetButton.style.display = 'block';
    clearInterval(spawnTimer);
    postScore(playerName, score); // Post the score when the game ends
}

function drawGameOverScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(gameSpace.x, gameSpace.y, gameSpace.size, gameSpace.size);
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    ctx.font = '24px Arial';
    ctx.fillText('Click Restart Game to Try Again', canvas.width / 2, canvas.height / 2 + 50);
}

function drawWinScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(gameSpace.x, gameSpace.y, gameSpace.size, gameSpace.size);
    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Nice Flying!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText('You made it out', canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('of the asteroid belt, captain!', canvas.width / 2, canvas.height / 2 + 50);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'a' || e.key === 'ArrowLeft') {
        ship.direction = -1;
    } else if (e.key === 'd' || e.key === 'ArrowRight') {
        ship.direction = 1;
    } else if (e.key === ' ' || e.key === 'w') {
        fireBullet();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'a' || e.key === 'ArrowLeft' || e.key === 'd' || e.key === 'ArrowRight') {
        ship.direction = 0;
    }
});

let leftbnt = document.getElementById('leftbnt');
let rightbnt = document.getElementById('rightbnt');
leftbnt.addEventListener("touchstart", (e) => {
    ship.direction = -1;
});
leftbnt.addEventListener("touchend", (e) => {
    ship.direction = 0;
});
rightbnt.addEventListener("touchstart", (e) => {
    ship.direction = 1;
});
rightbnt.addEventListener("touchend", (e) => {
    ship.direction = 0;
});

function fireBullet() {
    if (upgradedBullets === 2) {
        bullets.push({ x: ship.x - ship.width / 2 - 5, y: ship.y, width: 2, height: 5, speed: 800 });
        bullets.push({ x: ship.x - ship.width / 4, y: ship.y, width: 2, height: 5, speed: 800 });
        bullets.push({ x: ship.x - 1, y: ship.y, width: 2, height: 5, speed: 800 });
        bullets.push({ x: ship.x + ship.width / 4 - 2, y: ship.y, width: 2, height: 5, speed: 800 });
        bullets.push({ x: ship.x + ship.width / 2, y: ship.y, width: 2, height: 5, speed: 800 });
    } else if (upgradedBullets === 1) {
        bullets.push({ x: ship.x - ship.width / 4, y: ship.y, width: 2, height: 5, speed: 800 });
        bullets.push({ x: ship.x + ship.width / 4 - 2, y: ship.y, width: 2, height: 5, speed: 800 });
    } else {
        bullets.push({ x: ship.x - 1, y: ship.y, width: 2, height: 5, speed: 800 });
    }
}

// Set up automatic firing
setInterval(() => {
    if (!isGameOver) {
        fireBullet();
    }
}, 500); // Adjust the interval (in milliseconds) as needed

resetButton.addEventListener('click', () => {
    isGameOver = false;
    score = 0;
    counter = 0;
    level = 1;
    squares = [];
    bullets = [];
    lastTimestamp = 0;
    document.getElementById('scoreContainer').innerText = `Score: ${score}`;
    // Clear any existing intervals or timeouts
    clearInterval(spawnTimer);
    if (upgradeTimeout) clearTimeout(upgradeTimeout);
    // Restart the game
    spawnTimer = setInterval(createSquare, spawnInterval);
    requestAnimationFrame(animate);
});

let spawnTimer = setInterval(createSquare, spawnInterval);
createStars();
requestAnimationFrame(animate);
let lastTimestamp = 0;
let score = 0;

function animate(timestamp) {
    if (isGameOver) return;
    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawGameSpace();
    drawSquares();
    drawShip();
    drawBullets();
    drawGameInfo();
    updateStars(deltaTime);
    updateSquares(deltaTime);
    updateBullets(deltaTime);
    updateShip(deltaTime);
    checkBulletCollision();
    requestAnimationFrame(animate);
}

function postScore(playerName, score) {
    console.log('Posting score:', playerName, score);
    fetch('/EnterScore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerName, score })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Score posted successfully:', data);
    })
    .catch(error => {
        console.error('Error posting score:', error);
    });
}
