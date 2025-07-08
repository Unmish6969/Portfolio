import React from 'react';

const UI = ({ userName }) => {
  return (
    <div className="ui-container">
      <div className="header">
        <h1>
          {userName ? (
            <>Welcome, <span style={{color: '#ffd700', textShadow: '0 0 10px #4ecdc4'}}>{userName}</span></>
          ) : null}
        </h1>
        <p>Hope you are doing great!</p>
      </div>
      
      <div className="controls">
        <h3>Controls</h3>
        <p>🖱️ Click & Drag: Rotate Camera</p>
        <p>🔍 Scroll: Zoom In/Out</p>
        <p>🏠 Click Buildings: View Sections</p>
        <p>⌨️ ESC: Close Modals</p>
      </div>
    </div>
  );
};

export default UI; 