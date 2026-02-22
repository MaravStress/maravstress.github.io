import React from 'react';
import '../style/Intro.css';

const Intro: React.FC = () => {
  return (
    <section className="intro-section">
      <div className="intro-content glass-panel">
        <h1>Hi, my name is Eliam</h1>
        <p>Welcome to my portfolio. Scroll down to see my work and experience.</p>
      </div>
    </section>
  );
};

export default Intro;
