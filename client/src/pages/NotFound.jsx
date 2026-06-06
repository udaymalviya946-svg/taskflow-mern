import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  // ➡️ Browser core mechanics window history pop sequence for true 'Go Back' action
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="notfound-container">
      <div className="dashboard-grid-overlay"></div>
      <div className="dashboard-ambient-glow"></div>

      <div className="notfound-glass-wrapper">
        {/* Core Tech Visual Elements */}
        <div className="notfound-header-tag">
          <span className="pulse-indicator-dot"></span>
          <span className="tag-routing-text">SYSTEM_ERROR // ROUTE_UNRESOLVED</span>
        </div>

        <h1 className="huge-glitch-text">404</h1>
        <h2 className="notfound-subheading">Lost in Space</h2>
        
        <p className="notfound-description-para">
          The requested parameter node track does not exist in your active workspace configuration database.
        </p>

        {/* ➡️ Premium Meta Tags Segment */}
        <div className="error-meta-tags-row">
          <span className="meta-pill-tag">#status_404</span>
          <span className="meta-pill-tag">#null_pointer</span>
          <span className="meta-pill-tag">#flow_broken</span>
        </div>

        {/* ➡️ FIXED: Dynamic Go Back Trigger Layout Control */}
        <button 
          type="button" 
          onClick={handleGoBack} 
          className="notfound-action-btn-back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="arrow-left-svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;