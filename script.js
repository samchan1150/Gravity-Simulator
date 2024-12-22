// Get references to HTML elements
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const massInput = document.getElementById('mass');
const velocityInput = document.getElementById('velocity');
const heightInput = document.getElementById('height');
const gravityInput = document.getElementById('gravity');
const frictionInput = document.getElementById('friction');
const simulateBtn = document.getElementById('simulateBtn');
const ballInfoDiv = document.getElementById('ballInfo');
const energyCanvas = document.getElementById('energyCanvas');
const energyCtx = energyCanvas.getContext('2d');
const lineGraphCanvas = document.getElementById('lineGraphCanvas');
const lineGraphCtx = lineGraphCanvas.getContext('2d');

let objects = []; // Array to store the objects (will contain only one object)
let animationId = null;
let lastTimestamp = 0;
let energyData = {
    time: [],
    potentialEnergy: [],
    kineticEnergy: [],
    heatEnergy: []
};
let simulationStartTime = null;
let totalSimulationTime = 0;

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
    // Reset energy data and time tracking variables
    energyData = {
        time: [],
        potentialEnergy: [],
        kineticEnergy: [],
        heatEnergy: []
    };
    simulationStartTime = null;
    totalSimulationTime = 0;

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
        this.heatEnergy = 0; // Initialize heat energy
    }

    update(deltaTime) {
        // Save the velocity before updates
        let velocityBefore = this.velocity;
    
        // Calculate gravitational acceleration (positive value)
        let gravityAcceleration = this.gravity;
    
        // Calculate frictional acceleration (opposes motion)
        let frictionAcceleration = -this.friction * this.velocity;
    
        // Total acceleration
        let totalAcceleration = gravityAcceleration + frictionAcceleration;
    
        // Update velocity
        this.velocity += totalAcceleration * deltaTime;
    
        // Calculate average velocity during the time step
        let velocityAvg = (velocityBefore + this.velocity) / 2;
    
        // Update position
        this.y += velocityAvg * deltaTime * scaleY;
    
        // Calculate work done by friction (energy lost)
        let energyLostFriction = this.mass * Math.abs(frictionAcceleration * velocityAvg) * deltaTime;
    
        // Increment heat energy
        this.heatEnergy += energyLostFriction;
    
        // Update energies (PE and KE)
        this.updateEnergies();
    
        // Check for collision with the ground
        if (this.y + this.radius > canvas.height) {
            // Correct position
            this.y = canvas.height - this.radius;
    
            // Kinetic energy before collision
            let kineticEnergyBeforeCollision = 0.5 * this.mass * Math.pow(this.velocity, 2);
    
            // Apply inelastic collision (coefficient of restitution = 0.5)
            this.velocity *= -0.7; // Reverse direction and reduce speed
    
            // Kinetic energy after collision
            let kineticEnergyAfterCollision = 0.5 * this.mass * Math.pow(this.velocity, 2);
    
            // Energy lost during collision
            let energyLostCollision = kineticEnergyBeforeCollision - kineticEnergyAfterCollision;
            if (energyLostCollision < 0) energyLostCollision = 0; // Correct for possible negative values
    
            // Increment heat energy
            this.heatEnergy += energyLostCollision;
    
            // Update energies (PE and KE)
            this.updateEnergies();
        }
    }

    updateEnergies() {
        // Calculate current height in meters
        let currentHeight = (canvas.height - this.y - this.radius) / scaleY;
        if (currentHeight < 0) currentHeight = 0;

        // Potential Energy: PE = m * g * h
        this.potentialEnergy = this.mass * this.gravity * currentHeight;

        // Kinetic Energy: KE = 0.5 * m * v^2
        this.kineticEnergy = 0.5 * this.mass * Math.pow(this.velocity, 2);
    }

    calculateTotalEnergy(height, velocity) {
        const potentialEnergy = this.mass * this.gravity * height;
        const kineticEnergy = 0.5 * this.mass * Math.pow(velocity, 2);
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
    if (simulationStartTime === null) {
        simulationStartTime = timestamp;
    }
    if (!lastTimestamp) {
        lastTimestamp = timestamp;
    }
    const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds
    lastTimestamp = timestamp;
    totalSimulationTime = (timestamp - simulationStartTime) / 1000;

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
        updateBallInfo(objects[0]);
        drawEnergyGraph(objects[0]);
        collectEnergyData(objects[0], totalSimulationTime);
        drawLineGraph();
    }
}


function drawEnergyGraph(obj) {
    const totalEnergy = obj.initialTotalEnergy;

    // Calculating usable canvas height
    const canvasUsableHeight = energyCanvas.height - 60; // Reserve space for title and labels

    // Normalize energies to canvas height
    const peHeight = (obj.potentialEnergy / totalEnergy) * canvasUsableHeight;
    const keHeight = (obj.kineticEnergy / totalEnergy) * canvasUsableHeight;
    const heHeight = (obj.heatEnergy / totalEnergy) * canvasUsableHeight;

    const numBars = 3;
    const totalSpacing = energyCanvas.width * 0.2;
    const spacing = totalSpacing / (numBars + 1);
    const barWidth = (energyCanvas.width - totalSpacing) / numBars;

    const graphBaseY = energyCanvas.height - 20; // Leave space at the bottom for labels

    // Clear the energy canvas
    energyCtx.clearRect(0, 0, energyCanvas.width, energyCanvas.height);

    // Positions for each bar
    const peX = spacing;
    const keX = peX + barWidth + spacing;
    const heX = keX + barWidth + spacing;

    // Potential Energy bar
    energyCtx.fillStyle = '#00FF00'; // Green
    energyCtx.fillRect(peX, graphBaseY - peHeight, barWidth, peHeight);
    // Add label
    energyCtx.fillStyle = '#000';
    energyCtx.font = '14px Arial';
    energyCtx.fillText('PE', peX + barWidth / 2, graphBaseY - peHeight - 10);

    // Kinetic Energy bar
    energyCtx.fillStyle = '#0000FF'; // Blue
    energyCtx.fillRect(keX, graphBaseY - keHeight, barWidth, keHeight);
    // Add label
    energyCtx.fillStyle = '#000';
    energyCtx.fillText('KE', keX + barWidth / 2, graphBaseY - keHeight - 10);

    // Heat/Sound Energy bar
    energyCtx.fillStyle = '#FF0000'; // Red
    energyCtx.fillRect(heX, graphBaseY - heHeight, barWidth, heHeight);
    // Add label
    energyCtx.fillStyle = '#000';
    energyCtx.fillText('Heat', heX + barWidth / 2, graphBaseY - heHeight - 10);

    // Add title to the energy bar graph
    energyCtx.fillStyle = '#000';
    energyCtx.font = '16px Arial';
    energyCtx.textAlign = 'center';
    energyCtx.fillText('Energy Distribution', energyCanvas.width / 2, 30);
}

function collectEnergyData(obj, currentTime) {
    energyData.time.push(currentTime);
    energyData.potentialEnergy.push(obj.potentialEnergy);
    energyData.kineticEnergy.push(obj.kineticEnergy);
    energyData.heatEnergy.push(obj.heatEnergy);
}

function drawLineGraph() {
    // Clear the canvas
    lineGraphCtx.clearRect(0, 0, lineGraphCanvas.width, lineGraphCanvas.height);

    // Set up graph dimensions
    const padding = 40;
    const graphWidth = lineGraphCanvas.width - padding * 2;
    const graphHeight = lineGraphCanvas.height - padding * 2;

    // Draw axes
    lineGraphCtx.strokeStyle = '#000';
    lineGraphCtx.lineWidth = 1;
    lineGraphCtx.beginPath();
    // X-axis
    lineGraphCtx.moveTo(padding, lineGraphCanvas.height - padding);
    lineGraphCtx.lineTo(lineGraphCanvas.width - padding, lineGraphCanvas.height - padding);
    // Y-axis
    lineGraphCtx.moveTo(padding, lineGraphCanvas.height - padding);
    lineGraphCtx.lineTo(padding, padding);
    lineGraphCtx.stroke();

    // Get total time and maximum energy for scaling
    const totalTime = energyData.time[energyData.time.length - 1];
    const maxEnergy = objects[0].initialTotalEnergy;

    // Draw grid lines and labels (optional)
    drawGridLinesAndLabels(lineGraphCtx, totalTime, maxEnergy, padding, graphWidth, graphHeight);

    // Plot the energy lines
    plotEnergyLine(energyData.time, energyData.potentialEnergy, totalTime, maxEnergy, padding, graphWidth, graphHeight, '#00FF00'); // PE in green
    plotEnergyLine(energyData.time, energyData.kineticEnergy, totalTime, maxEnergy, padding, graphWidth, graphHeight, '#0000FF'); // KE in blue
    plotEnergyLine(energyData.time, energyData.heatEnergy, totalTime, maxEnergy, padding, graphWidth, graphHeight, '#FF0000'); // Heat in red

    // Add legend
    drawLegend(lineGraphCtx, padding);
}


function plotEnergyLine(timeData, energyDataArray, totalTime, maxEnergy, padding, graphWidth, graphHeight, color) {
    if (timeData.length < 2) return;

    lineGraphCtx.strokeStyle = color;
    lineGraphCtx.lineWidth = 2;
    lineGraphCtx.beginPath();

    for (let i = 0; i < timeData.length; i++) {
        const x = padding + (timeData[i] / totalTime) * graphWidth;
        const y = lineGraphCanvas.height - padding - (energyDataArray[i] / maxEnergy) * graphHeight;

        if (i === 0) {
            lineGraphCtx.moveTo(x, y);
        } else {
            lineGraphCtx.lineTo(x, y);
        }
    }

    lineGraphCtx.stroke();
}


function drawGridLinesAndLabels(ctx, totalTime, maxEnergy, padding, graphWidth, graphHeight) {
    ctx.strokeStyle = '#ccc';
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';

    // Time intervals (X-axis)
    const timeIntervals = 5;
    for (let i = 0; i <= timeIntervals; i++) {
        const x = padding + (i / timeIntervals) * graphWidth;
        const timeLabel = (totalTime * i / timeIntervals).toFixed(1) + 's';

        // Vertical grid line
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, lineGraphCanvas.height - padding);
        ctx.stroke();

        // Time label
        ctx.fillText(timeLabel, x - 10, lineGraphCanvas.height - padding + 15);
    }

    // Energy intervals (Y-axis)
    const energyIntervals = 5;
    for (let i = 0; i <= energyIntervals; i++) {
        const y = lineGraphCanvas.height - padding - (i / energyIntervals) * graphHeight;
        const energyLabel = (maxEnergy * i / energyIntervals).toFixed(0);

        // Horizontal grid line
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(lineGraphCanvas.width - padding, y);
        ctx.stroke();

        // Energy label
        ctx.fillText(energyLabel, padding - 35, y + 5);
    }
}


function drawLegend(ctx, padding) {
    const legendX = lineGraphCanvas.width - padding - 100;
    const legendY = padding + 10;

    ctx.fillStyle = '#00FF00';
    ctx.fillRect(legendX, legendY, 10, 10);
    ctx.fillStyle = '#000';
    ctx.fillText('Potential Energy', legendX + 15, legendY + 10);

    ctx.fillStyle = '#0000FF';
    ctx.fillRect(legendX, legendY + 20, 10, 10);
    ctx.fillStyle = '#000';
    ctx.fillText('Kinetic Energy', legendX + 15, legendY + 30);

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(legendX, legendY + 40, 10, 10);
    ctx.fillStyle = '#000';
    ctx.fillText('Heat Energy', legendX + 15, legendY + 50);
}

function updateBallInfo(obj) {
    ballInfoDiv.innerHTML = `
        <h2>Ball Information</h2>
        <p><strong>Mass:</strong> ${obj.mass.toFixed(2)} kg</p>
        <p><strong>Velocity:</strong> ${(-obj.velocity).toFixed(2)} m/s</p>
        <p><strong>Height:</strong> ${Math.max(0, ((canvas.height - obj.y - obj.radius) / scaleY)).toFixed(2)} m</p>
    `;
}
