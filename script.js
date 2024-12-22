// Get references to HTML elements
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const massInput = document.getElementById('mass');
const velocityInput = document.getElementById('velocity');
const heightInput = document.getElementById('height');
const gravityInput = document.getElementById('gravity');
const frictionInput = document.getElementById('friction');
const addObjectBtn = document.getElementById('addObject');

let objects = []; // Array to store the objects
let animationId = null;
let lastTimestamp = 0;

// Scaling factor to convert meters to pixels
const scaleY = canvas.height / 200; // Adjust based on the maximum height you expect

// Event listener for the "Add Object" button
addObjectBtn.addEventListener('click', () => {
    let mass = parseFloat(massInput.value);
    const velocity = parseFloat(velocityInput.value);
    const height = parseFloat(heightInput.value);
    const gravity = parseFloat(gravityInput.value);
    const friction = parseFloat(frictionInput.value);

    // Enforce mass limits
    if (mass < 0.1) mass = 0.1;
    if (mass > 10) mass = 10;

    const obj = new PhysicsObject(mass, velocity, height, gravity, friction);
    objects.push(obj);

    // Start the animation if not already running
    if (!animationId) {
        animate();
    }
});

// Define the PhysicsObject class (as updated above)

class PhysicsObject {
    constructor(mass, velocity, height, gravity, friction) {
        this.mass = mass;
        this.velocity = -velocity; // Negative because canvas y-axis is downwards
        this.x = Math.random() * (canvas.width - 40) + 20; // Random x position
        this.y = canvas.height - height * scaleY; // Convert height to canvas coordinates
        this.gravity = gravity;
        this.friction = friction;
        this.radius = Math.max(5, mass * 2); // Radius proportional to mass
        this.color = this.getRandomColor();
    }

    update(deltaTime) {
        // Update velocity and position
        this.velocity += this.gravity * deltaTime;

        // Apply friction
        this.velocity -= this.velocity * this.friction * deltaTime;

        this.y += this.velocity * deltaTime * scaleY;

        // Check for collision with the ground
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.velocity *= -0.5; // Bounce with energy loss

            // Apply friction upon bouncing
            this.velocity -= this.velocity * this.friction * deltaTime;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    getRandomColor() {
        const letters = '789ABCD';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    }
}

// Animation loop
function animate(timestamp) {
    if (!lastTimestamp) {
        lastTimestamp = timestamp;
    }
    const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds
    lastTimestamp = timestamp;

    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let obj of objects) {
        obj.update(deltaTime);
        obj.draw();
    }
}

addObjectBtn.addEventListener('click', () => {
    // Existing code to create and add PhysicsObject

    // Start the animation if not already running
    if (!animationId) {
        lastTimestamp = 0; // Reset lastTimestamp when starting animation
        animate();
    }
});