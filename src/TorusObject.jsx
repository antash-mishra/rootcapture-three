import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import { OrbitControls, QuadraticBezierLine, Edges, Float, Text} from '@react-three/drei'

const CurvedLine = ({ startPoint, angle, length = 0.5, color }) => {
    const points = useMemo(() => {
    // Start point is where the line connects to the ring
    const start = new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z);
    
        // End point is extended outward at an angle (on the same plane as ring)
        const end = new THREE.Vector3(
            startPoint.x + Math.cos(angle) * length * 1.5,
            startPoint.y + Math.sin(angle) * length * 1.5,
            startPoint.z
        );
    
        // Control point for the quadratic curve
        const control = new THREE.Vector3(
            startPoint.x + Math.cos(angle) * length * 0.8,
            startPoint.y + Math.sin(angle) * length * 0.8,
            startPoint.z + length * 0.5 // Lift only the control point for curve shape
        );

        return {
            start,
            end,
            control
        };
    }, [startPoint, angle, length]);
  
    return (
        <group>
            <QuadraticBezierLine
              start={points.start}
              end={points.end}
              control={points.control}
              color={color}
              lineWidth={2}
              dashed={false}
            />
            <mesh position={points.end}>
                <capsuleGeometry args={[0.05, 0.1, 4, 8]} />
                <meshBasicMaterial 
                    color={color}
                    metalness={0.8}
                    roughness={0.5}
                />
            </mesh>
            {/* Text label */}
            <Text
                position={[
                    points.end.x + Math.cos(angle) * 0.15, // Offset from capsule
                    points.end.y + Math.sin(angle) * 0.15,
                    points.end.z
                ]}
                // rotation={[-Math.PI / 2, 0, -angle]} // Align with view
                fontSize={0.15}
                color={color}
                anchorX="center"
                anchorY="middle"
            >
                {`100%`}
            </Text>
        </group>
    );
};


class SquareRingGeometry extends THREE.BufferGeometry {
    constructor(radius = 2, thickness = 0.4, segments = 128, progress = 0.6, startAngle = 0, arcLength) {
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
    segments = 128,
    noOfSegments = 2,
    firstSegmentColor = '#8a2be2',
    secondSegmentColor = '#404040',
    segmentData = [
        { progress: 0.8, color: '#8a2be2' }, // Purple - 30%
        { progress: 0.2, color: '#404040' }, // Gray - 30%
        
    ],
    gap = 0.10 // Gap in radians between segments
  }) => {
    const segmentGeometries = useMemo(() => {
      
        // Calculate total available angle (full circle minus `noOfSegments` gaps)
        const totalAvailableAngle = Math.PI * 2 - (gap * noOfSegments);
        const portions = [];
        const points = [];
        // Calculate segment angles based on progress split of available angle
        let startAngle = gap
        for (let i = 0; i < noOfSegments; i++) {
            const segmentAngle = totalAvailableAngle * segmentData[i].progress;
            
            console.log(`Segment ${i + 1}: Start Angle = ${startAngle}, Segment Angle = ${segmentAngle}`);
        
            const geometry = new SquareRingGeometry(
                radius, 
                thickness, 
                segments, 
                segmentData[i].progress, 
                startAngle, 
                segmentAngle
            );

            // Calculate center point of the segment
            const centerAngle = startAngle + (segmentAngle / 2);
            const centerPoint = new THREE.Vector3(
                (radius + thickness/2) * Math.cos(centerAngle),
                (radius + thickness/2) * Math.sin(centerAngle),
                0+thickness/2
            );

            const segment = {
                geometry: geometry,
                color: segmentData[i].color
            }
            portions.push(segment);

            points.push({
                point: centerPoint,
                angle: centerAngle,
                color: segmentData[i].color
            });
            
            startAngle += segmentAngle + gap;
        }
        return {
            portions: portions,
            points: points
        };
    }, [radius, thickness, segments, gap]);
  
    return (
      <group rotation={[-Math.PI / 2, 0, 0]}>
        
        <OrbitControls enableZoom={true}/>
        {segmentGeometries.portions.map((segment, index) => (
            <mesh key={index} geometry={segment.geometry}>
                {/* <Edges color="#a03ed6" /> */}
                <meshBasicMaterial
                    side={THREE.DoubleSide}
                    color={segment.color}
                    metalness={0.75}
                    roughness={0.65}
                    wireframe={false}
                />
            </mesh>
        ))}
        {segmentGeometries.points.map((point, index) => (
            <CurvedLine
                key={`line-${index}`}
                startPoint={point.point}
                angle={point.angle}
                length={0.5}
                color={point.color}
            />
        ))}
      </group>
    );
};
  
// Scene Component
const Scene = () => {
    return (
      <>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Float scale={0.75} position={[0, 0.65, 0]} rotation={[0, 0.6, 0]}>
            <ProgressRing />
        </Float>
      </>
    );
};
  
export default Scene;