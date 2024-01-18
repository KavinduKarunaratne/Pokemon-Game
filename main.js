const canvas = document.querySelector('canvas');
// Gets Canvas context
const c = canvas.getContext('2d');

// Setting Canvs width and height
canvas.width = 1024;
canvas.height = 576;

// Canvas color and size
c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

//Import and render map
const image = new Image();
image.src = './images/Pellet Town.png';

image.onload = () => {
    c.drawImage(image, -750, -550);
}


// console.log(image);