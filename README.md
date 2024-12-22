# Introduction to the Gravity Simulator

Welcome to the Gravity Simulator! This interactive tool allows you to explore the physics of motion under gravity. By customizing various parameters of a falling object, you can visualize how it behaves and understand the principles of energy transformation, friction, and collisions. The simulator provides a hands-on way to learn about concepts like potential energy, kinetic energy, and energy loss due to friction.

## How the Simulator Works

### 1. Setting Up Your Simulation

At the top of the simulator, you'll find input controls where you can set the parameters for your simulation:

- **Mass (kg)**: Enter the mass of the object in kilograms (kg). The mass can range between 0.1 kg and 10 kg.
- **Initial Velocity (m/s)**: Set the starting vertical velocity of the object in meters per second (m/s). A positive value means the object moves upwards initially, while a negative value indicates it begins moving downwards.
- **Initial Height (m)**: Specify the height from which the object is dropped or thrown, in meters (m).
- **Gravity (m/s²)**: Adjust the acceleration due to gravity. The standard value on Earth is approximately 9.81 m/s², but you can change this to simulate different planetary environments.
- **Friction Coefficient**: Input a value between 0 and 1 to simulate air resistance. A value of 0 means no air resistance, and higher values represent greater frictional forces acting against the object's motion.
- **Simulate Button**: After setting your desired parameters, click the "Simulate" button to start the simulation.

### 2. Observing the Simulation

Upon starting the simulation, several visual and informational components help you understand what's happening:

- **Animation Canvas (Center)**: This area displays a real-time animation of the object (represented as a ball) moving under the influence of gravity. You'll see the ball fall, bounce, and slow down due to friction and collisions.
- **Ball Information Panel (Left Side)**: This panel displays real-time data about the object's state, including:
  - **Mass**: The mass of the object in kilograms.
  - **Velocity**: The current vertical velocity in meters per second. Positive values indicate upward motion.
  - **Height**: The current height above the ground in meters.
  - **Potential Energy (PE)**: Energy due to the object's position above the ground.
  - **Kinetic Energy (KE)**: Energy due to the object's motion.
  - **Heat Energy**: Energy lost due to friction and inelastic collisions.
  - **Total Energy**: The sum of PE, KE, and Heat Energy, representing the total mechanical energy.

### 3. Energy Visualization

- **Energy Bar Graph (Right Side)**: Next to the animation canvas, this graph shows a real-time representation of the object's energy distribution:
  - **Potential Energy (PE)**: Displayed in green. This energy decreases as the object falls and increases when it rises after bouncing.
  - **Kinetic Energy (KE)**: Displayed in blue. This energy increases as the object speeds up and decreases as it slows down.
  - **Heat Energy**: Displayed in red. This energy accumulates due to friction and collisions.

- **Energy Line Graph (Bottom)**: This graph plots the energies over the entire duration of the simulation with respect to time:
  - The x-axis represents time elapsed since the simulation started.
  - The y-axis represents energy values in joules (J).
  - The graph shows how PE, KE, and Heat Energy change over time, providing a dynamic view of energy transformations.

### 4. Understanding the Physics

- **Motion Under Gravity**: The simulator demonstrates how objects accelerate downwards due to gravity, increasing their kinetic energy while decreasing potential energy.
- **Energy Transformation**:
  - **Without Friction**: If the friction coefficient is set to 0, the total mechanical energy (PE + KE) remains constant during free fall, except when the object collides with the ground.
  - **With Friction**: A non-zero friction coefficient simulates air resistance. Friction acts against the object's motion, converting some kinetic energy into heat energy, which is why the object slows down more quickly.
- **Collisions**:
  - The simulator models inelastic collisions with the ground, meaning the object loses some kinetic energy upon impact, which is converted into heat energy. This energy loss reduces the height the object reaches after each bounce.
- **Conservation of Energy**: The total energy (PE + KE + Heat Energy) in the system remains constant throughout the simulation, illustrating the principle of energy conservation.

### 5. Interacting with the Simulator

- **Experiment with Parameters**: Try adjusting different parameters to see how they affect the object's motion and energy:
  - Change the Mass: Observe how varying the mass influences the kinetic and potential energies.
  - Modify Gravity: Simulate conditions on different planets by altering the gravity value.
  - Adjust Friction: See the effect of air resistance on the object's speed and energy loss.
  - Set Initial Velocity: Input an initial upward velocity to simulate throwing the object upwards.

- **Real-Time Observations**: Watch the ball's movement in the animation canvas and monitor the changing values in the Ball Information panel and graphs.

### 6. Educational Insights

- **Visual Learning**: The simulator provides a visual representation of abstract physics concepts, making them easier to understand.
- **Energy Relationships**: By observing the graphs, you can see the inverse relationship between potential and kinetic energy during free fall and how heat energy accumulates due to friction and collisions.
- **Practical Applications**: Understanding these concepts is fundamental in fields like engineering, aeronautics, and environmental science.
