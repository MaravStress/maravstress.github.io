import { useState, useEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import VideoBackground from './components/VideoBackground';
import LoadingScreen from './components/LoadingScreen';
import Estudios from './components/Estudios';
import Skills from './components/Skills';
import Proyectos from './components/Proyectos';
import Contacto from './components/Contacto';
import ScrollDots from './components/ScrollDots';
import './style/App.css';

function App() {
  const scrollPoints = [0.128, 0.34, 0.5, 0.75, 1];
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      window.scrollTo(0, 0);
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && <LoadingScreen progress={progress} />}
      <ReactLenis root options={{ lerp: 0.05, syncTouch: true }}>
        <div className="app-container">
          <VideoBackground 
            onProgress={setProgress} 
            onComplete={() => setIsLoading(false)} 
          />
        <ScrollDots points={scrollPoints} />
        <div className="content-overlay">
          <div style={{ height: '212.5vh' }}></div>
          <Estudios />
          <Skills />
          {/* <div style={{ height: '56.25vh' }}></div> */}
          <Proyectos />
          <Contacto />
        </div>
      </div>
    </ReactLenis>
    </>
  );
}

export default App;
