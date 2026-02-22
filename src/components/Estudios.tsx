import React from 'react';
import '../style/Estudios.css';

const Estudios: React.FC = () => {
  return (
    <section className="estudios-section">
      <div className="estudios-container">
        <h2 className="section-title">Estudios & Experiencia</h2>

        <div className="estudios-grid">
          {/* Top Row */}
          <div className="estudio-card glass-panel" style={{ gridArea: 'itla' }}>
            <h3>ITLA</h3>
            <p>multimedia technician</p>
            <span>(2020-2024)</span>
          </div>

          <div className="estudio-card glass-panel" style={{ gridArea: 'unapec' }}>
            <h3>UNAPEC</h3>
            <p>Software Engineering</p>
            <span>(2024-Present)</span>
          </div>

          {/* Bottom Full Width block */}
          <div className="estudio-card glass-panel upwork-card" style={{ gridArea: 'upwork' }}>
            <div className="upwork-profile">
              <div className="profile-image"></div>
            </div>
            <div className="upwork-info">
              <h3>Upwork</h3>
              <div className="badges">
                <span className="badge success">100% Job Success</span>
                <span className="badge top-rated">Top Rated</span>
              </div>
              <div className="stars">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Estudios;
