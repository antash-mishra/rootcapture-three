import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useState, useRef } from 'react';
import { OrbitControls, QuadraticBezierLine, Edges, Float, Text} from '@react-three/drei'
import { useControls, button, useStoreContext, folder } from 'leva';
import MainCurvedLines from './curveline';


const CurvedLine = ({ startPoint, angle, length = 0.5, color, progress, text }) => {
    const textAreaRef = useRef()

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
            
            {/* Group mesh and text together */}
            <group position={points.end} ref={textAreaRef}>
                {/* Mesh as parent */}
                {/* Adding a helper function to check axis */}
                <mesh rotation = {[0, 0, 0]} position={[0.00, 0, 0.012]} >
                    <planeGeometry args={[0.20, 0.50, 64, 64]} />
                    <meshBasicMaterial 
                        color={color}
                        metalness={0.8}
                        roughness={0.5}
                        side={THREE.DoubleSide}
                    />
                </mesh>
                {/* <TransformControls object={textAreaRef} /> */}
                {/* </TransformControls> */}
                {/* Text as child, positioned relative to the mesh */}
                <Text
                    position={[0.0, 0.0, 0.014]} // Adjust to place text slightly above
                    rotation={[0, 0, -Math.PI/2]}
                    fontSize={0.1}
                    fontWeight={500}
                    fontFamily={"Inter"}
                    color={"white"}
                    anchorX="center"
                    anchorY="middle"
                >
                    {progress*100}% {text}
                </Text>
            </group>
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
        { progress: 0.75, color: '#67129b', text: 'JSX'}, // Purple - 30%
        { progress: 0.25, color: '#3d4148', text: 'CSS'}, // Gray - 30%
        
    ],
    gap = 0.10 // Gap in radians between segments
  }) => {

    const groupRef = useRef();
    
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

            // Store segment geometry and color
            portions.push({
                geometry: geometry,
                color: segmentData[i].color
            });

            // Store points for curved lines
            points.push({
                point: centerPoint,
                angle: centerAngle,
                color: segmentData[i].color,
                progress: segmentData[i].progress,
                text: segmentData[i].text
            });
            
            startAngle += segmentAngle + gap;
        }
        return {
            portions: portions,
            points: points
        };
    }, [radius, thickness, segments, gap]);

    useFrame(() => {
        groupRef.current.rotation.z = Math.sin(performance.now() * 0.0001);
    });
  
    return (
    
      <group rotation={[-Math.PI / 2, 0, 0]} ref={groupRef}>

        <OrbitControls enableRotate={false} enableZoom={true} enablePan={true} />
        
        <group>
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
        </group>
        {segmentGeometries.points.map((point, index) => (
            <CurvedLine
                key={`line-${index}`}
                startPoint={point.point}
                angle={point.angle}
                length={0.5}
                color={point.color}
                progress={point.progress}
                text={point.text}
            />
        ))}
      </group>
    );
};


// Scene Component
const Scene = () => {
    const [segmentData, setSegmentData] = useState([
        { progress: 0.4, color: '#8a2be2', text: 'JSX'},
        { progress: 0.4, color: '#404040', text: 'CSS'},
        { progress: 0.2, color: '#ff4040', text: 'HTML'},
        // { progress: 0.2, color: '#ff4040' }
    ]);

    const numberOfSegments = segmentData.length;

    return (
      <>
        <directionalLight position={[1,2,3]} intensity={4.5}/>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <group>
            <MainCurvedLines />
        </group>
        <group position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
            <MainCurvedLines />
        </group>
        <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
                <ProgressRing 
                    segmentData={segmentData}
                    noOfSegments={numberOfSegments}
                />
            </group>

      </>
    );
};
  
export default Scene;