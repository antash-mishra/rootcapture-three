import { Canvas } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

export default function MainCurvedLines() {
  // Define curved paths using THREE.CatmullRomCurve3
  const leftLargeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.1, 2.45, 0),
    new THREE.Vector3(-2.5, 2.4, 0),
    new THREE.Vector3(-2.7, 2.3, 0),
    new THREE.Vector3(-2.8, 1.0, 0),
    new THREE.Vector3(-2.7, 0.05, 0),
    new THREE.Vector3(-2.5, -0.05, 0),
    new THREE.Vector3(-2.1, -0.1, 0),
  ]);

  const leftSmallCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.5, 0.70, 0),
    new THREE.Vector3(-1.9, 0.65, 0),
    new THREE.Vector3(-2.0, 0.4, 0),
    new THREE.Vector3(-2.0, -0.4, 0),
    // new THREE.Vector3(-1.8, -0.5, 0),
    new THREE.Vector3(-1.9, -0.80, 0),
    new THREE.Vector3(-1.5, -0.85, 0),
    // new THREE.Vector3(-2.7, 0.3, 0),
    // new THREE.Vector3(-2.5, 0.1, 0),
    // new THREE.Vector3(-2.1, 0.0, 0),
  ]);

  const leftLargePoints = leftLargeCurve.getPoints(50); // Increase for a smoother curve
  const leftSmallPoints = leftSmallCurve.getPoints(50); // Increase for a smoother curve

  return (
    <>
        <mesh position={[-2.1, 2.45, 0]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color="cyan" />
        </mesh>
        <mesh position={[-2.1, -0.1, 0]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color="cyan" />
        </mesh>
        <mesh position={[-1.5, 0.70, 0]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color="cyan" />
        </mesh>
        <mesh position={[-1.5, -0.85, 0]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color="cyan" />
        </mesh>
        <Line points={leftLargePoints} color="cyan" lineWidth={2} />
        <Line points={leftSmallPoints} color="cyan" lineWidth={2} />
    </>
  );
}