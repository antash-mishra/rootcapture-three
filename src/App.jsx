import { useState, useRef } from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import Experience from './Experience';
import Scene from './TorusMultipleObject';
import Taskbar from './taskbar';

function App() {
  
  const [isRingVisible, setIsRingVisible] = useState(true);
  const [taskbarScale, setTaskbarScale] = useState(1);
  
  const cameraRef = useRef();
  
  // Spring animation for ring
  const { ringScale } = useSpring({
    ringScale: isRingVisible ? taskbarScale : 0,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  const { taskbarSpring } = useSpring({
    taskbarSpring: taskbarScale,
    config: { mass: 1, tension: 280, friction: 60 }
  });



  const handleMinimize = () => {
    if (!isRingVisible) {
        // If ring is hidden, show it at normal scale
        setIsRingVisible(true);
        setTaskbarScale(1);
    } else {
        // Minimize both ring and taskbar
        cameraRef.current.zoom = 200;
        setTaskbarScale(1);
    }
  };

  const handleMaximize = () => {
      if (!isRingVisible) {
          // If ring is hidden, show it at normal scale
          setIsRingVisible(true);
          setTaskbarScale(1);
      } else {
          // Maximize both ring and taskbar
            cameraRef.current.zoom = 250; // Set zoom level
            setTaskbarScale(1.5);
      }
  };

  const handleClose = () => {
      // Hide only the ring, keep taskbar visible
      setIsRingVisible(false);
      // Reset taskbar to normal scale
      setTaskbarScale(1);
  };



  // Get camera position
  console.log("Hello: ", cameraRef);

  // Adding bg color 
  return (
    <Canvas
      orthographic
      ref={cameraRef}
      style={{ backgroundColor: '#000000' }}
      camera={{
        position: [0, 4, 5],
        fov: 45,
        near: 0,
        far: 1000,
        zoom: 250
      }}
    >
      
      <directionalLight position={[3, 3, 3]} intensity={1.5} castShadow />
      <ambientLight intensity={0.3} />

        <animated.group scale={taskbarSpring}>
          <Taskbar
            onClose={() => handleClose()}
            onMaximize={() => handleMaximize()}
            onMinimize={handleMinimize}
          />
        </animated.group>
          
        <animated.group scale={ringScale}>
          {isRingVisible && <Scene />}
        </animated.group>
        

      {/* Optional: Add controls if you want to interact with the scene */}
      {/* <OrbitControls /> */}
    </Canvas>

  )
}

export default App
