import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { useConfigStore } from '../store/useConfigStore';
import * as THREE from 'three';

const ProceduralPergola = () => {
  const { type, size, color, blinds } = useConfigStore();
  
  // Parse dimensions (e.g., '3x4' -> w:3, d:4)
  const w = parseInt(size.charAt(0));
  const d = parseInt(size.charAt(2));
  const h = 2.5; // Height is constant 2.5m

  const t = 0.15; // Thickness of legs and beams
  const materialColor = color === 'white' ? '#f0f0f0' : '#2c2e30';

  // Base materials for performance
  const structureMaterial = new THREE.MeshStandardMaterial({ 
    color: materialColor, 
    roughness: 0.3,
    metalness: 0.2
  });

  const blindMaterial = new THREE.MeshStandardMaterial({ 
    color: '#343a40', 
    transparent: true, 
    opacity: 0.85, 
    side: THREE.DoubleSide,
    roughness: 0.7
  });

  // Calculate louver positions (roof slats)
  const louverSpacing = 0.25;
  const louverCount = Math.floor((d - t * 2) / louverSpacing);
  const louvers = Array.from({ length: louverCount }).map((_, i) => {
    const zPos = -d/2 + t + louverSpacing + (i * louverSpacing);
    return zPos;
  });

  return (
    <group>
      {/* --- LEGS --- */}
      {/* Front Left */}
      <mesh position={[-w/2 + t/2, h/2, d/2 - t/2]} material={structureMaterial} castShadow receiveShadow>
        <boxGeometry args={[t, h, t]} />
      </mesh>
      {/* Front Right */}
      <mesh position={[w/2 - t/2, h/2, d/2 - t/2]} material={structureMaterial} castShadow receiveShadow>
        <boxGeometry args={[t, h, t]} />
      </mesh>
      
      {/* Back Legs (Only render if free-standing) */}
      {type === 'free-standing' && (
        <>
          <mesh position={[-w/2 + t/2, h/2, -d/2 + t/2]} material={structureMaterial} castShadow receiveShadow>
            <boxGeometry args={[t, h, t]} />
          </mesh>
          <mesh position={[w/2 - t/2, h/2, -d/2 + t/2]} material={structureMaterial} castShadow receiveShadow>
            <boxGeometry args={[t, h, t]} />
          </mesh>
        </>
      )}

      {/* If Wall Mounted, render a dummy wall to visualize attachment */}
      {type === 'wall-mounted' && (
        <mesh position={[0, h/2 + 0.5, -d/2 - 0.05]} receiveShadow>
          <boxGeometry args={[w + 2, h + 1, 0.1]} />
          <meshStandardMaterial color="#e9ecef" />
        </mesh>
      )}

      {/* --- MAIN BEAMS (Roof Perimeter) --- */}
      {/* Front Beam */}
      <mesh position={[0, h + t/2, d/2 - t/2]} material={structureMaterial} castShadow receiveShadow>
        <boxGeometry args={[w, t, t]} />
      </mesh>
      {/* Back Beam */}
      <mesh position={[0, h + t/2, -d/2 + t/2]} material={structureMaterial} castShadow receiveShadow>
        <boxGeometry args={[w, t, t]} />
      </mesh>
      {/* Left Beam */}
      <mesh position={[-w/2 + t/2, h + t/2, 0]} material={structureMaterial} castShadow receiveShadow>
        <boxGeometry args={[t, t, d - t*2]} />
      </mesh>
      {/* Right Beam */}
      <mesh position={[w/2 - t/2, h + t/2, 0]} material={structureMaterial} castShadow receiveShadow>
        <boxGeometry args={[t, t, d - t*2]} />
      </mesh>

      {/* --- LOUVERS (Roof Slats) --- */}
      {louvers.map((z, idx) => (
        <mesh key={idx} position={[0, h + t/2, z]} material={structureMaterial} castShadow receiveShadow>
          {/* A louver is rotated slightly to act as a sun shade */}
          <boxGeometry args={[w - t*2, 0.04, 0.15]} />
        </mesh>
      ))}

      {/* --- SIDE BLINDS --- */}
      {/* Front (A) */}
      {blinds.A && (
        <mesh position={[0, h/2, d/2 - t/2 + 0.05]} material={blindMaterial} castShadow>
          <planeGeometry args={[w - t*2.2, h - 0.1]} />
        </mesh>
      )}
      {/* Back (B) */}
      {blinds.B && type === 'free-standing' && (
        <mesh position={[0, h/2, -d/2 + t/2 - 0.05]} material={blindMaterial} castShadow rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[w - t*2.2, h - 0.1]} />
        </mesh>
      )}
      {/* Left (C) */}
      {blinds.C && (
        <mesh position={[-w/2 + t/2 - 0.05, h/2, 0]} material={blindMaterial} castShadow rotation={[0, -Math.PI/2, 0]}>
          <planeGeometry args={[d - t*2.2, h - 0.1]} />
        </mesh>
      )}
      {/* Right (D) */}
      {blinds.D && (
        <mesh position={[w/2 - t/2 + 0.05, h/2, 0]} material={blindMaterial} castShadow rotation={[0, Math.PI/2, 0]}>
          <planeGeometry args={[d - t*2.2, h - 0.1]} />
        </mesh>
      )}

      {/* --- FLOOR (Visual grounding) --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[w + 2, d + 2]} />
        <meshStandardMaterial color="#ced4da" roughness={0.8} />
      </mesh>
    </group>
  );
};

const CameraController = () => {
  const { cameraResetSignal } = useConfigStore();
  const controlsRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (cameraResetSignal > 0 && controlsRef.current) {
      camera.position.set(5, 4, 6);
      controlsRef.current.target.set(0, 1.25, 0); // Center on middle of pergola
      controlsRef.current.update();
    }
  }, [cameraResetSignal, camera]);

  return <OrbitControls ref={controlsRef} makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2 - 0.05} target={[0, 1.25, 0]} />;
};

const Scene = () => {
  return (
    <Canvas shadows camera={{ position: [5, 4, 6], fov: 45 }}>
      {/* Lighting for realism */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[8, 12, 5]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]} 
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      
      <ProceduralPergola />
      
      <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={15} blur={1.5} far={4} />
      <Environment preset="city" />
      
      <CameraController />
    </Canvas>
  );
};

export default Scene;
