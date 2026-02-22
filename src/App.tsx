import { ReactLenis } from 'lenis/react';
import VideoBackground from './components/VideoBackground';
import Intro from './components/Intro';
import Estudios from './components/Estudios';
import Skills from './components/Skills';
import Proyectos from './components/Proyectos';
import Contacto from './components/Contacto';
import ScrollDots from './components/ScrollDots';
import './style/App.css';

function App() {
  const scrollPoints = [0.128, 0.34, 0.5, 0.75, 1];

  return (
    <ReactLenis root options={{ lerp: 0.05, syncTouch: true }}>
      <div className="app-container">
        <VideoBackground />
        <ScrollDots points={scrollPoints} />
        <div className="content-overlay">
          <Intro />
          <Estudios />
          <Skills />
          <Proyectos />
          <Contacto />
        </div>
      </div>
    </ReactLenis>
  );
}

export default App;
