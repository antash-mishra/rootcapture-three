# Three.js Interactive Visualization

This project is an interactive 3D visualization built using React, Three.js, and Vite. It features a dynamic ring visualization with customizable segments, allowing users to adjust the progress, color, and labels of each segment.

## Features

- Interactive 3D scenes using Three.js and React Three Fiber.
- Customizable ring segments with adjustable progress, color, and labels.
- Responsive design with a top navigation bar for switching between different views.

## Prerequisites

- Node.js (version 20.18.0 or later)
- npm (version 6.0.5 or later)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

## Running the Project

To start the development server, run:

```bash
npm run dev
```

This will start the Vite development server, and you can view the project in your browser at `http://localhost:3000`.

## Building the Project

To build the project for production, run:

```bash
npm run build
```

This will create a `dist` directory with the production build of the project.

## Main Files

- **src/main.jsx**: Entry point of the application, responsible for rendering the main React component.
  ```javascript:src/main.jsx
  startLine: 1
  endLine: 10
  ```

- **src/App.jsx**: Main application component that sets up the router and canvas for rendering 3D scenes.
  ```javascript:src/App.jsx
  startLine: 1
  endLine: 113
  ```

- **src/TorusMultipleObject.jsx**: Component for rendering multiple ring segments with interactive controls.
  ```javascript:src/TorusMultipleObject.jsx
  startLine: 1
  endLine: 496
  ```

- **src/TorusObject.jsx**: Component for rendering a single ring segment with interactive controls.
  ```javascript:src/TorusObject.jsx
  startLine: 9
  endLine: 436
  ```

- **src/Navbar.jsx**: Navigation bar component for switching between different views.
  ```javascript:src/Navbar.jsx
  startLine: 1
  endLine: 27
  ```

## Configuration

- **vite.config.js**: Configuration file for Vite.
  ```javascript:vite.config.js
  startLine: 1
  endLine: 7
  ```

- **eslint.config.js**: Configuration file for ESLint.
  ```javascript:eslint.config.js
  startLine: 1
  endLine: 38
  ```



