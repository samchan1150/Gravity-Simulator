// Get references to HTML elements
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const massInput = document.getElementById('mass');
const velocityInput = document.getElementById('velocity');
const heightInput = document.getElementById('height');
const gravityInput = document.getElementById('gravity');
const frictionInput = document.getElementById('friction');
const simulateBtn = document.getElementById('simulateBtn');

const energyCanvas = document.getElementById('energyCanvas');
const energyCtx = energyCanvas.getContext('2d');

let objects = []; // Array to store the objects (will contain only one object)
let animationId = null;
let lastTimestamp = 0;

// Scaling factor to convert meters to pixels
const scaleY = canvas.height / 200; // Adjust based on the maximum height you expect

// Event listener for the "Add Object" button
simulateBtn.addEventListener('click', () => {
    console.log('Simulate button clicked');
    // Cancel any existing animation frames
    if (animationId !== null) {
        console.log('Cancelling existing animation');
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    // Reset the objects array to remove any existing objects
    objects = [];

    // Create the new object
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
    console.log('Object created:', obj);
    

    // Start the animation
    lastTimestamp = 0; // Reset timestamp
    animationId = requestAnimationFrame(animate);
});

// Define the PhysicsObject class (as updated above)

class PhysicsObject {
    constructor(mass, velocity, height, gravity, friction) {
        this.mass = mass;
        this.velocity = -velocity; // Negative because canvas y-axis is downwards
        this.x = canvas.width / 2; // Center the object horizontally
        this.y = canvas.height - height * scaleY; // Convert height to canvas coordinates
        this.gravity = gravity;
        this.friction = friction;
        this.radius = Math.max(5, mass * 2); // Radius proportional to mass
        this.color = this.getRandomColor();

        // Energies
        this.initialHeight = height;
        this.initialVelocity = velocity;
        this.initialTotalEnergy = this.calculateTotalEnergy(height, velocity);
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

        // Update energies
        this.updateEnergies();
    }

    updateEnergies() {
        // Calculate current height in meters
        let currentHeight = (canvas.height - this.y - this.radius) / scaleY;
        if (currentHeight < 0) currentHeight = 0;

        // Potential Energy: PE = m * g * h
        this.potentialEnergy = this.mass * this.gravity * currentHeight;

        // Kinetic Energy: KE = 0.5 * m * v^2
        this.kineticEnergy = 0.5 * this.mass * Math.pow(this.velocity / scaleY, 2);

        // Heat/Sound Energy: Difference from initial total energy
        this.heatEnergy = this.initialTotalEnergy - (this.potentialEnergy + this.kineticEnergy);

        // Correct for small negative values due to floating-point inaccuracies
        if (this.heatEnergy < 0) this.heatEnergy = 0;
    }

    calculateTotalEnergy(height, velocity) {
        const potentialEnergy = this.mass * this.gravity * height;
        const kineticEnergy = 0.5 * this.mass * velocity * velocity;
        return potentialEnergy + kineticEnergy;
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
    energyCtx.clearRect(0, 0, energyCanvas.width, energyCanvas.height);

    for (let obj of objects) {
        obj.update(deltaTime);
        obj.draw();
        console.log('Object updated:', obj);
    }

    // Draw energy bar graph
    if (objects.length > 0) {
        drawEnergyGraph(objects[0]);
    }
}


function drawEnergyGraph(obj) {
    const totalEnergy = obj.initialTotalEnergy;

    // Normalize energies to canvas height
    const peHeight = (obj.potentialEnergy / totalEnergy) * energyCanvas.height;
    const keHeight = (obj.kineticEnergy / totalEnergy) * energyCanvas.height;
    const heHeight = (obj.heatEnergy / totalEnergy) * energyCanvas.height;

    const barWidth = energyCanvas.width / 4;
    const spacing = energyCanvas.width / 8;

    // Potential Energy bar
    energyCtx.fillStyle = '#00FF00'; // Green
    energyCtx.fillRect(spacing, energyCanvas.height - peHeight, barWidth, peHeight);
    // Add label
    energyCtx.fillStyle = '#000';
    energyCtx.font = '14px Arial';
    energyCtx.fillText('PE', spacing + barWidth / 4, energyCanvas.height - peHeight - 10);

    // Kinetic Energy bar
    energyCtx.fillStyle = '#0000FF'; // Blue
    energyCtx.fillRect(spacing * 3 + barWidth, energyCanvas.height - keHeight, barWidth, keHeight);
    // Add label
    energyCtx.fillStyle = '#000';
    energyCtx.fillText('KE', spacing * 3 + barWidth + barWidth / 4, energyCanvas.height - keHeight - 10);

    // Heat/Sound Energy bar
    energyCtx.fillStyle = '#FF0000'; // Red
    energyCtx.fillRect(spacing * 5 + barWidth * 2, energyCanvas.height - heHeight, barWidth, heHeight);
    // Add label
    energyCtx.fillStyle = '#000';
    energyCtx.fillText('Heat', spacing * 5 + barWidth * 2 + barWidth / 8, energyCanvas.height - heHeight - 10);
}


