const canvas = document.querySelector('canvas');
// Gets Canvas context
const c = canvas.getContext('2d');

// Setting Canvs width and height
canvas.width = 1024;
canvas.height = 576;

// Making a 2D array of the collisions data
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70));
}

// Making a 2D array of the battlezones data
const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, i + 70));
}


const offset = {
    x: -735,
    y: -650
}

// Setting the position of each data value
const boundaries = [];
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if ( symbol === 1025){
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }   
    })
});

const battleZones = [];
battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if ( symbol === 1025){
            battleZones.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }   
    })
});


// Import and render map
const image = new Image();
image.src = './images/Pellet Town.png';

// Import and render foreground
const foregroundImage = new Image();
foregroundImage.src = './images/foregroundImage.png'

// Import player movement
const playerUp = new Image();
playerUp.src = './images/playerUp.png'

const playerLeft = new Image();
playerLeft.src = './images/playerLeft.png'

const playerDown = new Image();
playerDown.src = './images/playerDown.png'

const playerRight = new Image();
playerRight.src = './images/playerRight.png'

// Setting the player image position
const player = new Sprite({
    position: {
        x: canvas.width / 2 - (192 / 4 / 2), 
        y: canvas.height / 2 - 68 / 2
    },
    image: playerDown,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUp,
        left: playerLeft,
        down: playerDown,
        right: playerRight
    }
})

// Setting the background image position
const background = new Sprite({ 
    position: { 
        x: offset.x, 
        y: offset.y
    }, 
    image: image
});

// Setting the foreground image postion
const foreground = new Sprite({ 
    position: { 
        x: offset.x, 
        y: offset.y
    }, 
    image: foregroundImage
});

// Key press declaration
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const movables =  [background, ...boundaries, foreground, ...battleZones];

function rectangularCollision({rectangle1, rectangle2}) {
    return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + player.height >= rectangle2.position.y
    )
}

const battle = {
    intiated: false
}

// Animation loop
function animate() {
    const animationID = window.requestAnimationFrame(animate);
    // Background Drawing
    background.draw()
    // Collisions Drawing
    boundaries.forEach(boundary => {
        boundary.draw();
        //Player Collision
        
    });
    // Battlezone Drawing
    battleZones.forEach(battleZone => {
        battleZone.draw();
    });
    // Player Drawing
    player.draw();
    // Foreground Drawing
    foreground.draw();

    console.log(animationID);

    let moving = true;
    player.animate = false;
    
    if (battle.intiated) return
    // Battle activation
    // Player movement by moving the bacground
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for ( let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i];
            // Calculates over lapping area between player and battlezone
            const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) -
                                    Math.max(player.position.x, battleZone.position.x)) *
                                    (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) -
                                    Math.max(player.position.y, battleZone.position.y));
            if ( 
                rectangularCollision ({
                    rectangle1: player,
                    rectangle2: battleZone
                }) &&
                // Checks if atleast half of the players body is covering the battlzone
                overlappingArea > (player.width * player.height) / 2 &&
                // Slowing down rate of battle activation
                Math.random() < 0.01
            ) {
                console.log("battleZone");
                // Deactivate current animation loop
                window.cancelAnimationFrame(animationID);
                battle.intiated = true;
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                                // Activate a new animation loop
                                animateBattle();
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.4
                                });
                            }
                        });
                    }
                });
                break
            }
        }
    }

    
    if (keys.w.pressed && lastKey === 'w') {
        player.animate = true;
        player.image = player.sprites.up;
        for ( let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if ( 
                rectangularCollision ({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }}
                })
            ) {
                console.log('colliding');
                moving = false;
                break
            }
        }
        if (moving)
            movables.forEach(movables => {
                movables.position.y += 3;
        });
    }
    else if (keys.a.pressed && lastKey === 'a') {
        player.animate = true;
        player.image = player.sprites.left;
        for ( let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if ( 
                rectangularCollision ({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y
                    }}
                })
            ) {
                console.log('colliding');
                moving = false;
                break
            }
        }
        if (moving)
            movables.forEach(movables => {
                movables.position.x += 3;
        });
    }
    else if (keys.s.pressed && lastKey === 's') {
        player.animate = true;
        player.image = player.sprites.down;
        for ( let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if ( 
                rectangularCollision ({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }}
                })
            ) {
                console.log('colliding');
                moving = false;
                break
            }
        }if (moving)
            movables.forEach(movables => {
                movables.position.y -= 3;
        });
    }
    else if (keys.d.pressed && lastKey === 'd') {
        player.animate = true;
        player.image = player.sprites.right;
        for ( let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if ( 
                rectangularCollision ({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y
                    }}
                })
            ) {
                console.log('colliding');
                moving = false;
                break
            }
        }
        if (moving)
            movables.forEach(movables => {
                movables.position.x -= 3;
        });
    }

}
// animate();

// Battle animate loop function
const battleBackgroundImage = new Image();
battleBackgroundImage.src = './images/battleBackground.png'
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage,

});

const draggleImage = new Image();
draggleImage.src = './images/draggleSprite.png'
const draggle = new Sprite({
    position: {
        x: 800,
        y: 100
    },
    image: draggleImage,
    frames: {
        max: 4,
        hold: 30
    },
    animate: true
});

function animateBattle() {
    window.requestAnimationFrame(animateBattle);
    battleBackground.draw();
    draggle.draw();
}

animateBattle();

let lastKey = '';

// Listening for keydowns
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w';
            break
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
            break
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            break
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break
    }
})

// Listening for keyups
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false;
            break
        case 'a':
            keys.a.pressed = false;
            break
        case 's':
            keys.s.pressed = false;
            break
        case 'd':
            keys.d.pressed = false;
            break
    }
})