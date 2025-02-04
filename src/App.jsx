import { useState, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import { Canvas } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import MultipleScene from './TorusMultipleObject';
import Scene from './TorusObject';
import Taskbar from './taskbar';
import TopNavbar from './Navbar';


const SceneWrapper = () => {
    const location = useLocation();
    const [isRingVisible, setIsRingVisible] = useState(true);
    const [taskbarScale, setTaskbarScale] = useState(1);
    
    // Animation spring
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
            setTaskbarScale(1.5);
        }
    };

    const handleClose = () => {
        // Hide only the ring, keep taskbar visible
        setIsRingVisible(false);
        // Reset taskbar to normal scale
        setTaskbarScale(1);
    };

    return (
        <>
            <animated.group scale={taskbarSpring}>
                <Taskbar
                    onClose={() => handleClose()}
                    onMaximize={() => handleMaximize()}
                    onMinimize={handleMinimize}
                    text={location.pathname === '/' ? 'USER ACTIVITY' : 'TOTAL USERS'}
                />
            </animated.group>

            <animated.group scale={ringScale}>
                {isRingVisible && (
                    location.pathname === '/' ? <MultipleScene /> : <Scene />
                )}
            </animated.group>
        </>
    );
};


function App() {

    // Adding bg color 
    return (
        <Router>
            <TopNavbar />
            <Canvas
                orthographic
                style={{ backgroundColor: '#000000' }}
                camera={{
                    position: [0, 4, 5],
                    fov: 45,
                    near: 0,
                    far: 1000,
                    zoom: 300
                }}
            >

                <directionalLight position={[3, 3, 3]} intensity={1.5} castShadow />
                <ambientLight intensity={0.3} />
                <SceneWrapper />


                {/* Optional: Add controls if you want to interact with the scene */}
                {/* <OrbitControls /> */}
                

            </Canvas>
        </Router>
    )
}

export default App
