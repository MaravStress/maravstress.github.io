import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import '../style/Contacto.css';
import { FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { SiUpwork } from 'react-icons/si';

// Placeholder 3D component. 
// Uses a simple Box if model fails to load, but attempts to load a placeholder or user model.
const CharacterModel = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#2563eb" />
    </mesh>
  );
};

const Contacto: React.FC = () => {
  return (
    <section className="contacto-section">
      <div className="contacto-container glass-panel">

        <div className="contacto-info">
          <h2>Get in Touch</h2>
          <p>Feel free to reach out to me for any exciting projects or collaborations!</p>

          <div className="social-links">
            <a href="mailto:eliamjesusparedes@gmail.com" className="social-btn" aria-label="Email">
              <FaEnvelope /> Email Me
            </a>
            <a href="https://www.upwork.com/freelancers/~01297e972c464635aa?mp_source=share" target="_blank" rel="noopener noreferrer" className="social-btn upwork-btn">
              <SiUpwork /> Upwork
            </a>
            <a href="https://www.linkedin.com/in/eliam-paredes-803660186/" target="_blank" rel="noopener noreferrer" className="social-btn linkedin-btn">
              <FaLinkedin /> LinkedIn
            </a>
          </div>
        </div>

        <div className="contacto-3d">
          <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            <CharacterModel />
            <OrbitControls enableZoom={false} />
            <Environment preset="city" />
          </Canvas>
        </div>

      </div>
    </section>
  );
};

export default Contacto;
