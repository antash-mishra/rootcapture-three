import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import { OrbitControls } from '@react-three/drei'

class SquareRingGeometry extends THREE.BufferGeometry {
    constructor(radius = 2, thickness = 0.4, segments = 64, progress = 0.6, startAngle = 0, arcLength) {
      super();
      
      const vertices = [];
      const indices = [];
      // Use the provided arcLength directly
      const segmentAngle = arcLength / segments;
      
      // Create vertices for the square cross-section at each segment
      for (let i = 0; i <= segments; i++) {
        const angle = startAngle + (i * segmentAngle);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        // Calculate the four corners of the square cross-section
        const points = [
          [(radius + thickness/2) * cos, (radius + thickness/2) * sin, thickness/2],  // outer top
          [(radius + thickness/2) * cos, (radius + thickness/2) * sin, -thickness/2], // outer bottom
          [(radius - thickness/2) * cos, (radius - thickness/2) * sin, thickness/2],  // inner top
          [(radius - thickness/2) * cos, (radius - thickness/2) * sin, -thickness/2]  // inner bottom
        ];
        
        points.forEach(point => {
          vertices.push(...point);
        });
        
        if (i < segments) {
          const base = i * 4;
          // Front face
          indices.push(
            base, base + 4, base + 6,
            base, base + 6, base + 2
          );
          // Back face
          indices.push(
            base + 1, base + 7, base + 5,
            base + 1, base + 3, base + 7
          );
          // Top face
          indices.push(
            base, base + 5, base + 4,
            base, base + 1, base + 5
          );
          // Bottom face
          indices.push(
            base + 2, base + 6, base + 7,
            base + 2, base + 7, base + 3
          );
        }
      }
  
      this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      this.setIndex(indices);
      this.computeVertexNormals();
    }
  }
  
  

  const ProgressRing = ({
    radius = 1,
    thickness = 0.3,
    segments = 64,
    firstSegmentColor = '#8a2be2',
    secondSegmentColor = '#404040',
    gap = 0.15 // Gap in radians between segments
  }) => {
    const { firstGeometry, secondGeometry, thirdGeometry } = useMemo(() => {
      
        // Calculate total available angle (full circle minus two gaps)
      const totalAvailableAngle = Math.PI * 2 - (gap * 3);
      
      // Calculate segment angles based on 60/40 split of available angle
      const firstSegmentAngle = totalAvailableAngle * 0.3;
      const secondSegmentAngle = totalAvailableAngle * 0.5;
      const thirdSegmentAngle = totalAvailableAngle * 0.2;
      // First segment starts after first gap
      const firstStartAngle = gap;
      // Second segment starts after first segment plus second gap
      const secondStartAngle = firstStartAngle + firstSegmentAngle + gap;
      const thirdStartAngle = secondStartAngle + secondSegmentAngle + gap;
      return {
        firstGeometry: new SquareRingGeometry(
          radius, 
          thickness, 
          segments, 
          0.3, 
          firstStartAngle, 
          firstSegmentAngle
        ),
        secondGeometry: new SquareRingGeometry(
          radius, 
          thickness, 
          segments, 
          0.5, 
          secondStartAngle, 
          secondSegmentAngle
        ),
        thirdGeometry: new SquareRingGeometry(
            radius, 
            thickness, 
            segments, 
            0.2, 
            thirdStartAngle, 
            thirdSegmentAngle
          )
      };
    }, [radius, thickness, segments, gap]);
  
    return (
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <OrbitControls enableZoom={true}/>
        <mesh geometry={firstGeometry}>
          <meshBasicMaterial
            side={THREE.DoubleSide}
            color={"#ff4040"}
            metalness={0.8}
            roughness={0.5}
          />
        </mesh>
        
        <mesh geometry={secondGeometry}>
          <meshBasicMaterial
            side={THREE.DoubleSide}
            color={"#404040"}
            metalness={0.8}
            roughness={0.5}
          />
        </mesh>

        <mesh geometry={thirdGeometry}>
            <meshBasicMaterial
                side={THREE.DoubleSide}
                color={"#8a2be2"}
                metalness={0.8}
                roughness={0.5}
            />
        </mesh>
      </group>
    );
  };
  
  // Main Scene Component
  const Scene = () => {
    return (
      <>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <ProgressRing />
      </>
    );
  };
  
  export default Scene;