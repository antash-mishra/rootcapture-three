
import { extend, useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CustomObject from "./customObject";

extend({ OrbitControls })

export default function Experience() {
    const cubeRef = useRef();

    const { camera, gl } = useThree();
    

    useFrame((state, delta) => {
        console.log('tick')
        cubeRef.current.rotation.y += delta
    })

    return (
        <>
            <directionalLight position={[1, 2, 3]} intensity={4.5}/>
            <ambientLight intensity={1.5} />
            <orbitControls args={[camera, gl.domElement]} />

            <mesh position-y={-1} rotation-x={-Math.PI / 2} scale={10}>
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh>
            <mesh position-x={-2}> 
                <sphereGeometry />
                <meshStandardMaterial color="orange" />       
            </mesh>
            <mesh ref={cubeRef} position-x={2} rotation-y={Math.PI * 0.25} scale={1.5}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>
            <CustomObject />
        </>
    )
}