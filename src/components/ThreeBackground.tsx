import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

const CharacterModel = () => {
    const group = useRef<THREE.Group>(null);
    const headGroupRef = useRef<THREE.Group>(null);
    const bodyGroupRef = useRef<THREE.Group>(null);

    const { scene: bodyScene } = useGLTF('/Marav_body.glb');
    const { scene: headScene } = useGLTF('/Marav_head.glb');
    const { viewport } = useThree();

    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const globalMousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            globalMousePos.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            globalMousePos.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const applyMaterials = (child: THREE.Object3D) => {
            const mesh = child as THREE.Mesh;
            if (mesh.isMesh && mesh.material) {
                const materialName = Array.isArray(mesh.material)
                    ? mesh.material[0].name
                    : mesh.material.name;

                if (materialName && materialName.toLowerCase().includes('glass')) {
                    const glassMaterial = new THREE.MeshPhysicalMaterial({
                        color: 0xffffff,
                        transmission: 1,     // High transmission
                        opacity: 1,
                        metalness: 0,
                        roughness: 0.2,      // Smooth reflective glass
                        ior: 1.04,            // Index of refraction
                        thickness: 0.5,      // Thickness
                        envMapIntensity: 1,  // Reflect environment
                        transparent: true,
                    });

                    if (Array.isArray(mesh.material)) {
                        mesh.material[0] = glassMaterial;
                    } else {
                        mesh.material = glassMaterial;
                    }
                }
            }
        };

        bodyScene.traverse(applyMaterials);
        headScene.traverse(applyMaterials);
    }, [bodyScene, headScene]);

    useFrame(() => {
        const vectorOffset = new THREE.Vector2(-0.8, 0);

        const targetRotationYHead = (globalMousePos.current.x + vectorOffset.x) * 0.5;
        const targetRotationXHead = (-globalMousePos.current.y + vectorOffset.y) * 0.5;

        const targetRotationYBody = (globalMousePos.current.x + vectorOffset.x) * 0.15;
        const targetRotationXBody = (-globalMousePos.current.y + vectorOffset.y) * 0.1;

        if (headGroupRef.current) {
            headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, targetRotationYHead, 0.1);
            headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, targetRotationXHead, 0.1);
        }

        if (bodyGroupRef.current) {
            bodyGroupRef.current.rotation.y = THREE.MathUtils.lerp(bodyGroupRef.current.rotation.y, targetRotationYBody, 0.05);
            bodyGroupRef.current.rotation.x = THREE.MathUtils.lerp(bodyGroupRef.current.rotation.x, targetRotationXBody, 0.05);
        }
    });

    // Responsively scale and position the model in the canvas
    const posX = isDesktop ? viewport.width * 0.20 : 0;
    const posY = isDesktop ? -0.85 : -0.76;
    const scale = isDesktop ? 0.65 : 0.46;

    return (
        <group ref={group} position={[posX, posY, 0]} scale={scale} dispose={null}>
            <group ref={bodyGroupRef}>
                <primitive object={bodyScene} />
                <group ref={headGroupRef} position={[0, 1.34, 0]}>
                    <primitive object={headScene} />
                </group>
            </group>
        </group>
    );
};

useGLTF.preload('/Marav_body.glb');
useGLTF.preload('/Marav_head.glb');

export default function ThreeBackground({ className }: { className?: string }) {
    return (
        <div className={className || "absolute top-0 left-0 z-0 h-screen w-full overflow-hidden pointer-events-none"}>
            <Canvas camera={{ position: [0, 0, 1], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <Suspense fallback={null}>
                    <CharacterModel />
                </Suspense>
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
