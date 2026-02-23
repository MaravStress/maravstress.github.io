import React from 'react';
import Contacto3D from './Contacto3D';
import '../style/Contacto.css';
import { FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { SiUpwork } from 'react-icons/si';

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

        <Contacto3D />

      </div>
    </section>
  );
};

export default Contacto;
