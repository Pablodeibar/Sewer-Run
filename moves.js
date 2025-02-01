
function jump() {
    if (isJumping || isSliding) return;
    isJumping = true;

    const playerPosition = player.object3D.position;
    const jumpHeight = 5;

    const jumpUp = setInterval(() => {
        playerPosition.y += 0.1;
        if (playerPosition.y >= 1.6 + jumpHeight) {
            clearInterval(jumpUp);
            const fallDown = setInterval(() => {
                playerPosition.y -= 0.1;
                if (playerPosition.y <= 1.6) {
                    clearInterval(fallDown);
                    playerPosition.y = 1.6;
                    isJumping = false;
                }
            }, 20);
        }
    }, 20);
}

function slide() {
    if (isSliding || isJumping) return;
    isSliding = true;

    const playerBox = document.getElementById("player-box");
    playerBox.setAttribute("scale", "1 0.5 1");
    playerBox.setAttribute("position", "0 -0.5 0");

    setTimeout(() => {
        playerBox.setAttribute("scale", "1 1 1");
        playerBox.setAttribute("position", "0 0 0");
        isSliding = false;
    }, 1000);
}

window.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "q" && currentLane > 0) {
        currentLane--;
        updatePlayerPosition();
    }
    if (event.key.toLowerCase() === "d" && currentLane < lanes.length - 1) {
        currentLane++;
        updatePlayerPosition();
    }
    if (event.key.toLowerCase() === "w") jump();
    if (event.key.toLowerCase() === "s") slide();
});

function detectCollision() {
    const playerPosition = player.object3D.position;
    const obstacleElements = document.querySelectorAll(".obstacle");
    const sideObstacleElements = document.querySelectorAll(".side-obstacle");

    obstacleElements.forEach((obstacle) => {
        const obstaclePosition = obstacle.object3D.position;
        const distance = Math.abs(playerPosition.z - obstaclePosition.z);

        if (
            obstacle.getAttribute("gltf-model") &&
            obstacle.getAttribute("gltf-model").includes("rat_animated.glb")
        ) {
            if (playerPosition.x === obstaclePosition.x && distance < 1) {
                if (!isJumping) {
                    gameOver();
                }
            }
        }

        if (
            obstacle.getAttribute("gltf-model") &&
            obstacle.getAttribute("gltf-model").includes("concrete_pipe_game_ready.glb")
        ) {
            if (playerPosition.x === obstaclePosition.x && distance < 1 && !isSliding) {
                const sound = document.getElementById('slidable-death-sound');
                sound.play();
                gameOver();
            }
        }
    });

    sideObstacleElements.forEach((sideObstacle) => {
        const sideObstaclePosition = sideObstacle.object3D.position;
        const distance = Math.abs(playerPosition.z - sideObstaclePosition.z);

        if (
            (sideObstaclePosition.x === -4 || sideObstaclePosition.x === 4) &&
            playerPosition.x === sideObstaclePosition.x &&
            distance < 1
        ) {
            gameOver();
        }
    });
}

let isPlatformerView = false;

document.addEventListener("keydown", (event) => {
    if (event.key === "g" || event.key === "G") {
        if (!isPlatformerView) {
            camera.setAttribute("position", "-17 7 -20");
            camera.setAttribute("rotation", "0 -90 0");
            camera.setAttribute("look-controls", "enabled: false");
            isPlatformerView = true;
        }
    }

    if (event.key === "r" || event.key === "R") {
        camera.setAttribute("position", "0 5 5");
        camera.setAttribute("rotation", "0 180 0");
        camera.setAttribute("look-controls", "enabled: true");
        isPlatformerView = false;
    }
});

let isSwitching = false;

function randomCameraSwitch() {
    if (isSwitching) return;

    isSwitching = true;
    const switchInterval = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;

    setTimeout(() => {
        if (isPlatformerView) {
            camera.setAttribute("position", "0 5 5");
            camera.setAttribute("rotation", "0 180 0");
            camera.setAttribute("look-controls", "enabled: true");
            isPlatformerView = false;
        } else {
            camera.setAttribute("position", "-17 7 -20");
            camera.setAttribute("rotation", "0 -90 0");
            camera.setAttribute("look-controls", "enabled: false");
            isPlatformerView = true;
        }

        isSwitching = false;
        randomCameraSwitch();
    }, Math.max(10000, switchInterval));
}
