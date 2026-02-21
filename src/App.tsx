import VideoBackground from './components/VideoBackground';
import Intro from './components/Intro';
import Estudios from './components/Estudios';
import Skills from './components/Skills';
import Proyectos from './components/Proyectos';
import Contacto from './components/Contacto';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <VideoBackground />
      <div className="content-overlay">
        <Intro />
        <Estudios />
        <Skills />
        <Proyectos />
        <Contacto />
      </div>
    </div>
  );
}

export default App;
