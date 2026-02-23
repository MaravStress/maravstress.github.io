import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const CharacterModel = () => {
    const group = useRef<THREE.Group>(null);
    const headGroupRef = useRef<THREE.Group>(null);
    const bodyGroupRef = useRef<THREE.Group>(null);

    const { scene: bodyScene } = useGLTF('Marav_body.glb');
    const { scene: headScene } = useGLTF('Marav_head.glb');

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
        // Aplicar material de vidrio a la malla correspondiente
        const applyMaterials = (child: THREE.Object3D) => {
            const mesh = child as THREE.Mesh;
            if (mesh.isMesh && mesh.material) {
                // Manejar si el material es un arreglo o uno simple
                const materialName = Array.isArray(mesh.material)
                    ? mesh.material[0].name
                    : mesh.material.name;

                if (materialName && materialName.toLowerCase().includes('glass')) {
                    // Crear un material tipo vidrio
                    mesh.material = new THREE.MeshPhysicalMaterial({
                        color: 0xffffff,
                        transmission: 1,     // Qué tanta luz atraviesa (0 a 1)
                        opacity: 1,          // Mantener en 1 cuando hay transmisión
                        metalness: 0,
                        roughness: 0.2,      // Entre más bajo, más liso y reflectivo (vidrio claro)
                        ior: 1.1,            // Índice de refracción (1.5 aprox para vidrio común)
                        thickness: 0.5,      // Grosor para calcular refracciones
                        envMapIntensity: 1,  // Intensidad del reflejo del entorno
                        transparent: true,
                    });
                }
            }
        };

        bodyScene.traverse(applyMaterials);
        headScene.traverse(applyMaterials);
    }, [bodyScene, headScene]);

    useFrame(() => {
        // En lugar de state.pointer (restringido al Canvas), usamos la posición global del mouse
        const targetRotationYHead = globalMousePos.current.x * 0.5;
        const targetRotationXHead = -globalMousePos.current.y * 0.5;

        const targetRotationYBody = globalMousePos.current.x * 0.15;
        const targetRotationXBody = -globalMousePos.current.y * 0.1;

        if (headGroupRef.current) {
            // Si el punto de pivote (origen) de la cabeza está en el cuello, esto rotará naturalmente.
            headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, targetRotationYHead, 0.1);
            headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, targetRotationXHead, 0.1);
        }

        if (bodyGroupRef.current) {
            // Rotación suave para el cuerpo
            bodyGroupRef.current.rotation.y = THREE.MathUtils.lerp(bodyGroupRef.current.rotation.y, targetRotationYBody, 0.05);
            bodyGroupRef.current.rotation.x = THREE.MathUtils.lerp(bodyGroupRef.current.rotation.x, targetRotationXBody, 0.05);
        }
    });

    return (
        <group ref={group} dispose={null} position={[0, -1.3, 0]}>
            <group ref={bodyGroupRef}>
                <primitive object={bodyScene} />
                <group ref={headGroupRef} position={[0, 1.34, 0]}>
                    <primitive object={headScene} />
                </group>
            </group>

        </group>
    );
};

useGLTF.preload('Marav_body.glb');
useGLTF.preload('Marav_head.glb');

const Contacto3D: React.FC = () => {
    return (
        <div className="contacto-3d">
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
};

export default Contacto3D;
