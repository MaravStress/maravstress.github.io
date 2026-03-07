import React, { useEffect } from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  progress: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="loading-screen">
      <div 
        className="loading-bg" 
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}bg/0000.webp)` }}
      />
      <div className="loading-content">
        <div className="loading-indicator">
          <div className="spinner"></div>
          <h2>Cargando...</h2>
        </div>
        
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <p>{progress}%</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
