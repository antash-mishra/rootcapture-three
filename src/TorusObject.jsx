import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { OrbitControls, QuadraticBezierLine, Edges, Float, Text} from '@react-three/drei'
import { useControls, button, useStoreContext, folder } from 'leva';

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
                <capsuleGeometry args={[0.06, 0.3, 12, 12]} />
                <meshBasicMaterial 
                    color={color}
                    metalness={0.8}
                    roughness={0.5}
                />
            </mesh>
            {/* Text label
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
            </Text> */}
        </group>
    );
};


class SquareRingGeometry extends THREE.BufferGeometry {
    constructor(radius = 2, thickness = 0.4, segments = 128, progress = 0.6, startAngle = 0, arcLength, edgeSegments = 128) {
        super();
        
        const vertices = [];
        const indices = [];
        const segmentAngle = arcLength / segments;
        
        // Helper function to create a point on the rounded corner
        const createCornerPoint = (centerX, centerY, cornerRadius, angle, height) => {
            const x = centerX + cornerRadius * Math.cos(angle);
            const y = centerY + cornerRadius * Math.sin(angle);
            return [x, y, height];
        };
        
        // Create vertices for the detailed cross-section at each segment
        for (let i = 0; i <= segments; i++) {
            const angle = startAngle + (i * segmentAngle);
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            
            const cornerRadius = thickness * 0.1; // Size of rounded corners
            const innerRadius = radius - thickness/2;
            const outerRadius = radius + thickness/2;
            
            // Create points for each edge of the cross-section
            const edgePoints = [];
            
            // Add points for each edge (top, right, bottom, left)
            for (let edge = 0; edge < 4; edge++) {
                const startAngle = (edge * Math.PI/2);
                for (let j = 0; j <= edgeSegments; j++) {
                    const t = j / edgeSegments;
                    const cornerAngle = startAngle + (Math.PI/2) * t;
                    
                    let point;
                    if (edge === 0) { // Top edge
                        point = [
                            (innerRadius + thickness * t) * cos,
                            (innerRadius + thickness * t) * sin,
                            thickness/2
                        ];
                    } else if (edge === 1) { // Right edge
                        point = [
                            outerRadius * cos,
                            outerRadius * sin,
                            thickness/2 - thickness * t
                        ];
                    } else if (edge === 2) { // Bottom edge
                        point = [
                            (outerRadius - thickness * t) * cos,
                            (outerRadius - thickness * t) * sin,
                            -thickness/2
                        ];
                    } else { // Left edge
                        point = [
                            innerRadius * cos,
                            innerRadius * sin,
                            -thickness/2 + thickness * t
                        ];
                    }
                    
                    vertices.push(...point);
                    edgePoints.push(vertices.length/3 - 1);
                }
            }
            
            // Create faces between current and next segment
            if (i < segments) {
                const segmentVertCount = (edgeSegments + 1) * 4;
                const currentStart = i * segmentVertCount;
                const nextStart = (i + 1) * segmentVertCount;
                
                // Create faces for each edge
                for (let e = 0; e < 4; e++) {
                    const edgeStart = e * (edgeSegments + 1);
                    for (let j = 0; j < edgeSegments; j++) {
                        const current = currentStart + edgeStart + j;
                        const next = nextStart + edgeStart + j;
                        
                        // Create two triangles for each quad
                        indices.push(
                            current, next, current + 1,
                            current + 1, next, next + 1
                        );
                    }
                }
            }
        }
        
        this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.setIndex(indices);
        this.computeVertexNormals();
    }
}

const ProgressRing = ({
    radius = 0.75,
    thickness = 0.3,
    segments = 264,
    noOfSegments = 2,
    firstSegmentColor = '#8a2be2',
    secondSegmentColor = '#404040',
    segmentData = [
        { progress: 0.75, color: '#67129b' }, // Purple - 30%
        { progress: 0.25, color: '#3d4148' }, // Gray - 30%
        
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
                <meshStandardMaterial
                    side={THREE.DoubleSide}
                    color={segment.color}
                    metalness={0.50}
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
  
const generateRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
};

const generateRandomProgress = (segments) => {
    const rawValues = Array(segments).fill(0).map(() => Math.random());
    const total = rawValues.reduce((sum, val) => sum + val, 0);
    return rawValues.map(val => val / total);
};


// Scene Component
const Scene = () => {
    const [segmentData, setSegmentData] = useState([
        { progress: 0.4, color: '#8a2be2' },
        { progress: 0.4, color: '#404040' },
        { progress: 0.2, color: '#ff4040' },
        // { progress: 0.2, color: '#ff4040' }
    ]);

    const numberOfSegments = segmentData.length;

    return (
      <>
        <directionalLight position={[1,2,3]} intensity={4.5}/>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Float scale={0.75} position={[0, 0.65, 0]} rotation={[0, 0.6, 0]}>
        <ProgressRing 
                segmentData={segmentData}
                noOfSegments={numberOfSegments}
            />
        </Float>
      </>
    );
};
  
export default Scene;