import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="dashboard-grid-overlay"></div>
      <div className="dashboard-ambient-glow"></div>

      <div className="notfound-card">
        {/* Neon Error Code Graphic Box */}
        <div className="error-code-badge">
          <h1 className="error-number">404</h1>
        </div>

        <h2 className="notfound-title">Lost in the Flow?</h2>
        <p className="notfound-text">
          The page you are looking for doesn't exist or has been shifted to another chronological milestone workspace track.
        </p>

        {/* Action button to return back safely */}
        <button 
          type="button" 
          onClick={() => navigate('/dashboard')} 
          className="task-btn-primary return-home-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="home-icon-mini">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;