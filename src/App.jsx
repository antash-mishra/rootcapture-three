import { useState } from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber';
import Experience from './Experience';
import Scene from './TorusMultipleObject';

function App() {
  
  // Adding bg color 
  return (
    <Canvas 
      style={{ backgroundColor: '#000000' }}
      camera={{ 
        position: [0, 4, 6],
        fov: 45,
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
