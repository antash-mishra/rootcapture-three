import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Html } from "@react-three/drei";
import "./taskbar.css";
const Taskbar = () => {
    const minimizeTexture = useLoader(TextureLoader, "/minimize-sign.png"); // Replace with your image path
    console.log(minimizeTexture);
    minimizeTexture.wrapS = THREE.RepeatWrapping;
    minimizeTexture.wrapT = THREE.RepeatWrapping;
    minimizeTexture.repeat.set(1, 1); // Adjust as needed
  
    return (
        <group>
            <mesh position={[0, 2.5, 0]}> {/* Taskbar */}
                <boxGeometry args={[4.0, 0.4, 0.01]} /> 
                <meshStandardMaterial color="#004d69" />
            </mesh>

            <mesh position={[1.28, 2.5, 0.01]}> {/* Close Button */}
                <boxGeometry args={[0.38, 0.24, 0.01]} />
                <meshStandardMaterial color="#19dcdb" />
                <Html position={[-0.11,0.12,0]}  >
                    <img 
                        src="/close.png" 
                        alt="Overlay" 
                        style={{ width: "61px", height: "61px", borderRadius: "5px" }} 
                    />
                </Html>
            </mesh>

            <mesh position={[0.85, 2.5, 0.01]}> {/* Maximize Button */}
                <boxGeometry args={[0.38, 0.24, 0.01]} />
                <meshStandardMaterial color="#19dcdb" />
                <Html position={[-0.11,0.12,0]}  >
                    <img 
                        src="/maximize.png" 
                        alt="Overlay" 
                        style={{ width: "65px", height: "auto", borderRadius: "5px" }} 
                    />
                </Html>
            </mesh>

            <mesh position={[0.42, 2.5, 0.01]}> {/* Minimize Button */}
                <boxGeometry args={[0.30, 0.24, 0.01]} />
                <meshStandardMaterial color="#19dcdb" />
                      {/* HTML Image Overlay */}
                <Html position={[-0.11,0.12,0]}  >
                    <img 
                        src="/minimize-sign.png" 
                        alt="Overlay" 
                        style={{ width: "65px", height: "auto", borderRadius: "5px" }} 
                    />
                </Html>
            </mesh>


            <mesh position={[-0.86, 2.5, 0.01]}> {/* Text Area */}
                <boxGeometry args={[1.2, 0.24, 0.01]} />
                <meshStandardMaterial color="#19dcdb" />
                <Html wrapperClass="label" position={[-0.55,0.12,0]}>
                    <text>USER ACTIVITY</text>
                </Html>
            </mesh>
        </group>
    )
}

export default Taskbar;