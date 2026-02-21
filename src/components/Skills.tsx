import React from 'react';
import skillsData from '../data/skills.json';
import './Skills.css';

const Skills: React.FC = () => {
  return (
    <section className="skills-section">
      <div className="skills-container">
        <h2 className="section-title" style={{textAlign: 'left'}}>Skills</h2>
        <div className="skills-grid">
          {skillsData.map((category, idx) => (
            <div key={idx} className="skill-category glass-panel">
              <h3>{category.nombre}</h3>
              <ul>
                {category.habilidades.map((skill, sIdx) => (
                  <li key={sIdx}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
