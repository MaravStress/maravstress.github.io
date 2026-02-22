import React from 'react';
import projectsData from '../data/projects.json';
import '../style/Proyectos.css';

const Proyectos: React.FC = () => {
  return (
    <section className="proyectos-section">
      <div className="proyectos-container">
        <h2 className="section-title">Proyectos Recientes</h2>
        <div className="proyectos-grid">
          {projectsData.map((project) => (
            <div key={project.id} className="proyecto-card glass-panel">
              <h3>{project.title}</h3>
              <p className="short-desc">{project.shortDescription}</p>
              <div
                className="long-desc"
                dangerouslySetInnerHTML={{ __html: project.longDescription }}
              />
              <div className="card-actions">
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  {project.linkText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Proyectos;
