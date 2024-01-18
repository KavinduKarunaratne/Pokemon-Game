const canvas = document.querySelector('canvas');
// Gets Canvas context
const c = canvas.getContext('2d');

// Setting Canvs width and height
canvas.width = 1024;
canvas.height = 576;

// Canvas color and size
c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

// Import and render map
const image = new Image();
image.src = './images/Pellet Town.png';

// Import and render Player
const playerImage = new Image();
playerImage.src = './images/playerDown.png'

// Sprite Object
class Sprite {
    constructor({ position, velocity, image }) {
        this.position = position;
        this.image = image;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

const background = new Sprite({ 
    position: { 
        x: -735, 
        y: -600
    }, 
    image: image});

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

// Animation loop
function animate() {
    window.requestAnimationFrame(animate);
    background.draw()
    c.drawImage(
        // Player Crop
        playerImage,
        0,
        0,
        playerImage.width / 4,
        playerImage.height,
        // Player actual
        canvas.width / 2 - (playerImage.width / 4 / 2), 
        canvas.height / 2 - playerImage.height / 2,
        playerImage.width / 4,
        playerImage.height
    );
    
    // Player movement by moving the bacground
    if (keys.w.pressed && lastKey === 'w') background.position.y += 3;
    else if (keys.a.pressed && lastKey === 'a') background.position.x += 3;
    else if (keys.s.pressed && lastKey === 's') background.position.y -= 3;
    else if (keys.d.pressed && lastKey === 'd') background.position.x -= 3

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
    console.log(keys);
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
    console.log(keys);
})



// console.log(image);