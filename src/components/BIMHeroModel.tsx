import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Layers, Box, Cpu, Grid } from "lucide-react";

const BuildingModel = ({ activeSystem, isAutoPlaying }: { activeSystem: string, isAutoPlaying: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const explodeRef = useRef(0);
  const morphTime = useRef(0);
  const floors = 8;
  const floorHeight = 1.4;

  // Materials
  const materials = useMemo(() => {
    return {
      structural: new THREE.MeshStandardMaterial({ color: "#ff4444", transparent: true, opacity: 0.8 }),
      structuralSecondary: new THREE.MeshStandardMaterial({ color: "#bbbbbb", transparent: true, opacity: 0.8 }),
      mepPrimary: new THREE.MeshStandardMaterial({ color: "#00f2ff", transparent: true, opacity: 0.8 }),
      mepSecondary: new THREE.MeshStandardMaterial({ color: "#00ff88", transparent: true, opacity: 0.8 }),
      facade: new THREE.MeshPhysicalMaterial({ 
        color: "#ffffff", 
        transparent: true, 
        opacity: 0.2,
        roughness: 0.1,
        metalness: 0.8,
        transmission: 0.9,
        ior: 1.5
      })
    };
  }, []);

  useFrame((state, delta) => {
    const isAll = activeSystem === "all";
    const damp = (mat: THREE.Material, targetOpacity: number, speed = 4) => {
      mat.opacity = THREE.MathUtils.damp(mat.opacity, targetOpacity, speed, delta);
    };

    // Structural opacities
    const structActive = isAll || activeSystem === "structural";
    damp(materials.structural, structActive ? 0.9 : 0.05);
    damp(materials.structuralSecondary, structActive ? 0.8 : 0.05);
    materials.structural.wireframe = !structActive;
    materials.structuralSecondary.wireframe = !structActive;

    // MEP opacities
    const mepActive = isAll || activeSystem === "mep";
    damp(materials.mepPrimary, mepActive ? 0.9 : 0.02);
    damp(materials.mepSecondary, mepActive ? 0.8 : 0.02);
    materials.mepPrimary.wireframe = !mepActive;
    materials.mepSecondary.wireframe = !mepActive;

    // Facade opacity
    const facadeActive = activeSystem === "facade";
    const facadeOpacity = facadeActive ? 0.5 : (isAll ? 0.15 : 0.01);
    damp(materials.facade, facadeOpacity);
    materials.facade.wireframe = !isAll && !facadeActive;

    // Explode Animation (hover and separate floors when inspecting a specific system)
    const targetExplode = isAll ? 0 : 0.6;
    explodeRef.current = THREE.MathUtils.damp(explodeRef.current, targetExplode, 3, delta);

    if (groupRef.current) {
      // Advance morph time
      morphTime.current += delta * (isAutoPlaying || isAll ? 0.4 : 0.05);

      // Calculate parametric morphing weights (3 forms blending seamlessly)
      const t = morphTime.current;
      const w1 = Math.max(0, Math.sin(t));
      const w2 = Math.max(0, Math.sin(t + Math.PI * 0.666));
      const w3 = Math.max(0, Math.sin(t + Math.PI * 1.333));
      const sum = w1 + w2 + w3;
      const n1 = w1 / sum;
      const n2 = w2 / sum;
      const n3 = w3 / sum;

      // Form 1: The Helix (Heavy twist, minimal taper)
      // Form 2: The Obelisk (No twist, heavy taper)
      // Form 3: The Bloom (Reverse twist, flared outward taper)
      const targetTwist = (n1 * 0.22) + (n2 * 0.0) + (n3 * -0.15);
      const targetTaper = (n1 * 0.01) + (n2 * 0.06) + (n3 * -0.04);

      const hoverY = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      
      // Apply dynamic parametric transformations to each floor
      groupRef.current.children.forEach((child, index) => {
        if (index < floors) {
          child.position.y = index * (floorHeight + explodeRef.current);
          child.rotation.y = index * targetTwist;
          const s = Math.max(0.1, 1 - (index * targetTaper));
          child.scale.set(s, 1, s);
        } else if (index === floors) {
          // Roof geometry scaling and positioning
          child.position.y = floors * (floorHeight + explodeRef.current) - (floorHeight/2 - 0.05);
          child.rotation.y = floors * targetTwist;
          const s = Math.max(0.1, 1 - (floors * targetTaper));
          child.scale.set(s, 1, s);
        }
      });
      
      // Center the group vertically based on explosion amount
      const verticalOffset = - (floors * floorHeight) / 2 - (explodeRef.current * floors) / 2;
      groupRef.current.position.y = verticalOffset + hoverY + 1.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2.5, 0]}>
      {Array.from({ length: floors }).map((_, i) => {
        return (
          <group key={`floor-${i}`}>
            {/* Structural Core - Hexagonal */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow material={materials.structural}>
              <cylinderGeometry args={[1.2, 1.2, floorHeight, 6]} />
            </mesh>
            
            {/* V-Columns (Diagrid structure) */}
            {Array.from({ length: 12 }).map((_, c) => {
              const angle = (c / 12) * Math.PI * 2;
              const radius = 3.6;
              const cx = Math.cos(angle) * radius;
              const cz = Math.sin(angle) * radius;
              // Alternate tilt for V shape
              const tilt = (c % 2 === 0 ? 1 : -1) * 0.3;
              return (
                <mesh key={`col-${i}-${c}`} position={[cx, 0, cz]} rotation={[0, -angle, tilt]} castShadow receiveShadow material={materials.structural}>
                  <cylinderGeometry args={[0.06, 0.06, floorHeight * 1.05]} />
                </mesh>
              );
            })}

            {/* Slabs - Octagonal */}
            <mesh position={[0, -floorHeight/2 + 0.05, 0]} castShadow receiveShadow material={materials.structuralSecondary}>
              <cylinderGeometry args={[4.0, 4.0, 0.1, 8]} />
            </mesh>

            {/* MEP Systems (Intricate piping) */}
            <group position={[0, floorHeight/2 - 0.25, 0]}>
              {/* Primary Ring Chiller Pipe */}
              <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.mepPrimary}>
                <torusGeometry args={[1.8, 0.08, 8, 24]} />
              </mesh>
              {/* Secondary Outer Ring */}
              <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.mepSecondary}>
                <torusGeometry args={[2.5, 0.04, 8, 24]} />
              </mesh>
              {/* Radial Ducts linking rings */}
              {Array.from({ length: 6 }).map((_, r) => {
                const rAngle = (r / 6) * Math.PI * 2;
                return (
                  <mesh key={`duct-${r}`} rotation={[0, -rAngle, Math.PI / 2]} position={[Math.cos(rAngle)*2.15, 0, Math.sin(rAngle)*2.15]} material={materials.mepPrimary}>
                    <cylinderGeometry args={[0.06, 0.06, 0.7]} />
                  </mesh>
                );
              })}
            </group>

            {/* Architectural / Facade Envelope */}
            {/* Ribbed parametric glass fins */}
            <group>
              <mesh castShadow receiveShadow material={materials.facade}>
                <cylinderGeometry args={[3.85, 3.85, floorHeight, 32, 1, true]} />
              </mesh>
              {Array.from({ length: 24 }).map((_, f) => {
                const fAngle = (f / 24) * Math.PI * 2;
                const fRadius = 3.9;
                return (
                  <mesh key={`fin-${f}`} position={[Math.cos(fAngle)*fRadius, 0, Math.sin(fAngle)*fRadius]} rotation={[0, -fAngle, 0]} material={materials.facade}>
                    <boxGeometry args={[0.05, floorHeight, 0.3]} />
                  </mesh>
                );
              })}
            </group>
          </group>
        );
      })}
      
      {/* Roof */}
      <mesh castShadow receiveShadow material={materials.structuralSecondary}>
        <cylinderGeometry args={[4.0, 4.0, 0.1, 8]} />
      </mesh>
    </group>
  );
};

export const BIMHeroModel = () => {
  const [activeSystem, setActiveSystem] = useState("all");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const systems = [
    { id: "all", label: "Federated Model", icon: Layers, desc: "Complete integrated digital twin assembly" },
    { id: "structural", label: "Structural Core", icon: Box, desc: "Load-bearing elements, columns, and slabs" },
    { id: "mep", label: "MEP Systems", icon: Cpu, desc: "HVAC, plumbing, and electrical routing" },
    { id: "facade", label: "Architectural Envelope", icon: Grid, desc: "Exterior glazing and climate barrier" }
  ];

  React.useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveSystem(prev => {
        const idx = systems.findIndex(s => s.id === prev);
        return systems[(idx + 1) % systems.length].id;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div 
      className="relative w-full h-full min-h-[350px] md:min-h-[450px] overflow-hidden flex flex-col group"
      onPointerDown={() => setIsAutoPlaying(false)}
    >
      <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-[#3B82F6]/50 text-right leading-tight z-20 pointer-events-none">
        BIM_DATA_STREAM_8829<br/>
        LOD: 400<br/>
        MODE: {activeSystem.toUpperCase()}<br/>
        MORPH: PARAMETRIC_BLEND
      </div>

      <div className="absolute inset-0 z-0 cursor-move bg-[#0a0a0c]">
        <Canvas camera={{ position: [10, 8, 10], fov: 45 }}>
          <React.Suspense fallback={null}>
          <color attach="background" args={['#0a0a0c']} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 20, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-10, 5, -5]} intensity={0.5} color="#3b82f6" />
          
          <BuildingModel activeSystem={activeSystem} isAutoPlaying={isAutoPlaying} />
          
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            maxDistance={25} 
            minDistance={6}
            autoRotate={isAutoPlaying || activeSystem === "all"}
            autoRotateSpeed={0.5}
            target={[0, 2.5, 0]}
            maxPolarAngle={Math.PI / 2 - 0.05} // don't go below ground
          />
          <Environment preset="city" />
          </React.Suspense>
        </Canvas>
      </div>

      <div className="absolute bottom-4 inset-x-2 md:inset-x-4 z-20 pointer-events-auto">
        <div className="flex justify-center gap-1.5 md:gap-2">
          {systems.map((sys) => {
            const Icon = sys.icon;
            const isActive = activeSystem === sys.id;
            return (
              <button
                key={sys.id}
                onClick={() => { setActiveSystem(sys.id); setIsAutoPlaying(false); }}
                className={`flex-1 max-w-[120px] flex flex-col items-center justify-center p-2 rounded transition-all duration-300 backdrop-blur-md border ${
                  isActive 
                    ? "bg-[#3B82F6]/20 border-[#3B82F6]/50 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                    : "bg-black/40 border-white/10 text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 mb-1.5 ${isActive ? "text-[#3B82F6]" : ""}`} />
                <span className="text-[8px] md:text-[9px] font-sans font-bold tracking-widest text-center leading-tight uppercase">
                  {sys.id}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
