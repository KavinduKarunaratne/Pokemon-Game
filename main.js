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

// Import and render map
const image = new Image();
image.src = './images/Pellet Town.png';

// Import and render foreground
const foregroundImage = new Image();
foregroundImage.src = './images/foregroundImage.png'

// Import and render Player
const playerImage = new Image();
playerImage.src = './images/playerDown.png'

// Setting the player image position
const player = new Sprite({
    position: {
        x: canvas.width / 2 - (192 / 4 / 2), 
        y: canvas.height / 2 - 68 / 2
    },
    image: playerImage,
    frames: {
        max: 4
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

const movables =  [background, ...boundaries, foreground];

function rectangularCollision({rectangle1, rectangle2}) {
    return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + player.height >= rectangle2.position.y
    )
}

// Animation loop
function animate() {
    window.requestAnimationFrame(animate);
    // Background Drawing
    background.draw()
    // Collisions Drawing
    boundaries.forEach(boundary => {
        boundary.draw();
        //Player Collision
        
    });
    // Player Drawing
    player.draw();
    // Foreground Drawing
    foreground.draw();
    
    // Player movement by moving the bacground
    let moving = true;
    if (keys.w.pressed && lastKey === 'w') {
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
animate();

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


// console.log(collisions);
// console.log(image);