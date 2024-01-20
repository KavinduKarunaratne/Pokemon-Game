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

class Boundary {
    static width = 48;
    static height = 48;
    constructor({position}) {
        this.position = position;
        this.width = 48;
        this.height = 48;
    }

    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0)';
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
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

// Import and render Player
const playerImage = new Image();
playerImage.src = './images/playerDown.png'

// Sprite Object
class Sprite {
    constructor({ position, velocity, image, frames = { max: 1 } }) {
        this.position = position;
        this.image = image;
        this.frames = frames;
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height
        }
    }

    draw() {
        c.drawImage(
            // Player Crop
            this.image,
            0,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            // Player actual
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        );
    }
}

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

const movables =  [background, ...boundaries];

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
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw();
        //Player Collision
        
    });
    player.draw();
    
    
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