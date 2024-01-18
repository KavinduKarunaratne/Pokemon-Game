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

image.onload = () => {
    c.drawImage(image, -735, -600);
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
}



// console.log(image);