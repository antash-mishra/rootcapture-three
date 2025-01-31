import { useState, useRef } from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber';
import Experience from './Experience';
import Scene from './TorusMultipleObject';

function App() {

  const cameraRef = useRef();

  // Get camera position
  console.log( "Hello: ",cameraRef);
  
  // Adding bg color 
  return (
    <Canvas 
    orthographic
    ref={cameraRef}
      style={{ backgroundColor: '#000000' }}
      camera={{ 
        position: [0,4, 6],
        fov: 45,
        near: 0,
        far: 1000,
        zoom: 300
      }}
    >
      <directionalLight position={[3, 3, 3]} intensity={1.5} castShadow />
      <ambientLight intensity={0.3} />

      <Scene />
      
      {/* Optional: Add controls if you want to interact with the scene */}
      {/* <OrbitControls /> */}
    </Canvas>

  )
}

export default App
