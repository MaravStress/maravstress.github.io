import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

export const PlayerModel = () => {
    const groupRef = useRef<THREE.Group>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const { scene, animations } = useGLTF('/player.glb');
    const { actions } = useAnimations(animations, groupRef);
    const { viewport } = useThree();

    // Traverse the 3D scene and apply physical glass materials to glass elements
    useEffect(() => {
        if (!scene) return;
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                
                materials.forEach((mat, index) => {
                    if (mat.name && mat.name.toLowerCase().includes('glass')) {
                        const glassMaterial = new THREE.MeshPhysicalMaterial({
                            color: mat.color || new THREE.Color('#ffffff'),
                            roughness: 0.1,
                            metalness: 0.1,
                            transmission: 0.9, // high transmission makes it transparent glass
                            ior: 1.5,          // index of refraction for real glass
                            thickness: 1.0,    // glass thickness
                            transparent: true,
                            opacity: 1,
                            clearcoat: 1.0,
                            clearcoatRoughness: 0.1,
                        });
                        
                        if (Array.isArray(mesh.material)) {
                            mesh.material[index] = glassMaterial;
                        } else {
                            mesh.material = glassMaterial;
                        }
                    }
                });
            }
        });
    }, [scene]);

    // Track cursor coordinates globally on the window
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Setup and play the idle animation
    useEffect(() => {
        const idleActionName = Object.keys(actions).find(
            (name) => name.toLowerCase().includes('idle')
        );
        
        if (idleActionName && actions[idleActionName]) {
            actions[idleActionName].reset().fadeIn(0.5).play();
        } else {
            // Fallback: play the first animation if idle is not found
            const firstAction = Object.keys(actions)[0];
            if (firstAction && actions[firstAction]) {
                actions[firstAction].reset().fadeIn(0.5).play();
            }
        }

        return () => {
            if (idleActionName && actions[idleActionName]) {
                actions[idleActionName].fadeOut(0.5);
            }
        };
    }, [actions]);

    // Smoothly rotate the character to face the cursor
    useFrame(() => {
        if (groupRef.current) {
            const targetRotationY = mouseRef.current.x * 0.4;
            const targetRotationX = -mouseRef.current.y * 0.15;
            
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
        }
    });

    // Responsively scale and position the model in the canvas
    const isDesktop = viewport.width > 6;
    const posX = isDesktop ? viewport.width * 0.22 : 0;
    const posY = isDesktop ? -1.8 : -1.4;
    const scale = isDesktop ? 2.5 : 1.9;

    return (
        <group ref={groupRef} position={[posX, posY, 0]} scale={scale} dispose={null}>
            <primitive object={scene} />
        </group>
    );
};

// Preload player GLTF model asset
useGLTF.preload('/player.glb');

export default function ThreeBackground({ className }: { className?: string }) {
    return (
        <div className={className || "absolute inset-0 z-0 h-screen w-full overflow-hidden pointer-events-none"}>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00ffff" />
                <directionalLight position={[-10, -10, -5]} intensity={1} color="#d946ef" />
                <PlayerModel />
            </Canvas>
        </div>
    );
}
