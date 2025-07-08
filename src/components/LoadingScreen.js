import React, { useState, useEffect, useRef } from 'react';

const LoadingScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [showEnter, setShowEnter] = useState(false);
  const [name, setName] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);
  const [error, setError] = useState("");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [showTrail, setShowTrail] = useState(false);
  const trailRef = useRef();
  const [ripples, setRipples] = useState([]);
  const rippleId = useRef(0);

  const loadingTexts = [
    "Initializing portfolio...",
"Loading 3D assets...",
"Fetching creative energy...",
"Warming up shaders...",
"Preparing interactive elements...",
"Almost ready...",
"Welcome to my portfolio!"
  ];

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 85); // 8.5 seconds total

    // Show each loading text only once, in order
    let textIndex = 0;
    setCurrentText(0);
    const textInterval = setInterval(() => {
      textIndex++;
      if (textIndex < loadingTexts.length) {
        setCurrentText(textIndex);
      } else {
        clearInterval(textInterval);
      }
    }, 8500 / loadingTexts.length);

    // Show particles after a delay
    const particleTimer = setTimeout(() => {
      setShowParticles(true);
    }, 1000);

    // Show enter button and input after 8.5 seconds
    const enterTimer = setTimeout(() => {
      setShowEnter(true);
    }, 8500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      clearTimeout(particleTimer);
      clearTimeout(enterTimer);
    };
  }, []);

  // Mouse move handler for fading ripple
  useEffect(() => {
    const handleMove = (e) => {
      const rect = document.body.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = rippleId.current++;
      setRipples((prev) => [...prev, { id, x, y }]);
      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter(r => r.id !== id));
      }, 700);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const handleButtonClick = () => {
    if (!name.trim()) {
      setError("Please enter a valid name");
      return;
    }
    setButtonClicked(true);
    setError("");
    setTimeout(() => {
      if (onFinish) onFinish(name);
    }, 600); // allow animation
  };

  return (
    <div className="loading-screen">
      {/* Mouse Trail Effect */}
      <div
        className={`mouse-trail${showTrail ? ' visible' : ''}`}
        ref={trailRef}
        style={{
          left: mouse.x - 32,
          top: mouse.y - 32,
        }}
      ></div>
      {/* Mouse Ripple Effect */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="mouse-ripple"
          style={{ left: ripple.x - 48, top: ripple.y - 48 }}
        />
      ))}
      {/* Animated Background */}
      <div className="background-animation">
        {/* Aurora/Nebula Layer */}
        <div className="aurora-bg"></div>
        {/* Starfield Layer */}
        <div className="starfield-bg">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 2}px`,
                height: `${2 + Math.random() * 2}px`,
                opacity: 0.5 + Math.random() * 0.5,
                animationDelay: `${Math.random() * 6}s`,
              }}
            ></div>
          ))}
        </div>
        <div className="gradient-bg"></div>
        <div className="floating-shapes">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`floating-shape shape-${i % 4}`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="loading-content">
        {/* Logo/Title */}
        <div className="logo-container">
          <div className="logo">
            {/* Replace logo-rocket with SVG rocket icon */}
            <span className="logo-rocket" role="img" aria-label="rocket">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#shadow)">
                  <path d="M24 4C28 10 36 20 36 28C36 36 28 44 24 44C20 44 12 36 12 28C12 20 20 10 24 4Z" fill="url(#body)"/>
                  <ellipse cx="24" cy="28" rx="6" ry="8" fill="url(#window)"/>
                  <path d="M24 44C23 40 19 36 12 36C16 40 20 44 24 44Z" fill="url(#flame1)"/>
                  <path d="M24 44C25 40 29 36 36 36C32 40 28 44 24 44Z" fill="url(#flame2)"/>
                </g>
                <defs>
                  <linearGradient id="body" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#ffd700"/>
                    <stop offset="0.5" stop-color="#4ecdc4"/>
                    <stop offset="1" stop-color="#667eea"/>
                  </linearGradient>
                  <radialGradient id="window" cx="0" cy="0" r="1" gradientTransform="translate(24 28) scale(6 8)" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#fff"/>
                    <stop offset="1" stop-color="#b0e0ff"/>
                  </radialGradient>
                  <linearGradient id="flame1" x1="18" y1="36" x2="24" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#ffb347"/>
                    <stop offset="1" stop-color="#ffd700"/>
                  </linearGradient>
                  <linearGradient id="flame2" x1="30" y1="36" x2="24" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#ffb347"/>
                    <stop offset="1" stop-color="#ffd700"/>
                  </linearGradient>
                  <filter id="shadow" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#4ecdc4" flood-opacity="0.5"/>
                  </filter>
                </defs>
              </svg>
            </span>
            <div className="logo-text">Portfolio</div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="loading-text-container">
          <div className="loading-text">
            {loadingTexts[currentText]}
          </div>
          <div className="typing-cursor"></div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">{progress}%</div>
        </div>

        {/* Animated Icons */}
        <div className="animated-icons">
          <div className="icon-container">
            <div className="icon">🍴</div>
            <div className="icon-label">Eat</div>
          </div>
          <div className="icon-container">
            <div className="icon">💤</div>
            <div className="icon-label">Sleep</div>
          </div>
          <div className="icon-container">
            <div className="icon">💻</div>
            <div className="icon-label">Code</div>
          </div>
          <div className="icon-container">
            <div className="icon">⚽</div>
            <div className="icon-label">Gym</div>
          </div>
          <div className="icon-container">
            <div className="icon">🔄</div>
            <div className="icon-label">Repeat</div>
          </div>
        </div>

        {/* Cool Enter Button and Input */}
        {showEnter && (
          <div className={`enter-section${buttonClicked ? ' fade-out' : ''}`} style={{ marginTop: 40 }}>
            <input
              className={`name-input${error ? ' input-error' : ''}`}
              type="text"
              placeholder="Enter your name..."
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (error) setError("");
              }}
              autoFocus
            />
            {error && (
              <div className="input-error-msg">{error}</div>
            )}
            <button
              className="enter-btn"
              onClick={handleButtonClick}
              disabled={buttonClicked}
            >
              <span>Enter Portfolio 🚀</span>
            </button>
          </div>
        )}
      </div>

      {/* Particles */}
      {showParticles && (
        <div className="particles">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      )}

      <style jsx>{`
        .loading-screen {
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .mouse-trail {
          pointer-events: none;
          position: fixed;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(102,126,234,0.12) 60%, rgba(78,205,196,0.10) 100%);
          box-shadow: 0 0 32px 12px #ffd70055, 0 0 64px 24px #4ecdc455;
          filter: blur(1.5px) brightness(1.2);
          opacity: 0;
          z-index: 10000;
          transition: opacity 0.3s, transform 0.18s cubic-bezier(0.23,1,0.32,1);
          transform: scale(1);
        }
        .mouse-trail.visible {
          opacity: 1;
          animation: trailPulse 1.2s infinite alternate;
        }
        @keyframes trailPulse {
          0% { transform: scale(1) rotate(-2deg); filter: blur(1.5px) brightness(1.2); }
          100% { transform: scale(1.18) rotate(2deg); filter: blur(2.5px) brightness(1.4); }
        }

        .background-animation {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        .aurora-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse 80% 40% at 60% 20%, rgba(102,126,234,0.18) 0%, transparent 80%),
                      radial-gradient(ellipse 60% 30% at 30% 60%, rgba(78,205,196,0.13) 0%, transparent 80%),
                      radial-gradient(ellipse 50% 20% at 80% 80%, rgba(255,215,0,0.10) 0%, transparent 80%);
          pointer-events: none;
          z-index: 2;
          animation: auroraMove 12s ease-in-out infinite alternate;
        }
        @keyframes auroraMove {
          0% { filter: blur(0px) brightness(1); }
          100% { filter: blur(8px) brightness(1.15); }
        }
        .starfield-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          pointer-events: none;
        }
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          filter: blur(0.5px) drop-shadow(0 0 6px #fff8);
          animation: starTwinkle 6s infinite alternate;
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; filter: blur(1.5px) drop-shadow(0 0 12px #ffd70088); }
        }
        .gradient-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(120deg, #667eea 0%, #4ecdc4 40%, #ffd700 80%, #667eea 100%);
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
          opacity: 0.92;
          z-index: 4;
        }
        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 5;
        }
        .floating-shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.13;
          filter: blur(2.5px) drop-shadow(0 0 12px #fff8);
          animation: float linear infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .floating-shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          animation: float linear infinite;
        }

        .shape-0 { width: 20px; height: 20px; background: #ffffff; }
        .shape-1 { width: 15px; height: 15px; background: #ffd700; }
        .shape-2 { width: 25px; height: 25px; background: #4ecdc4; }
        .shape-3 { width: 10px; height: 10px; background: #667eea; }

        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.1; }
          90% { opacity: 0.1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }

        .loading-content {
          position: relative;
          z-index: 10;
          text-align: center;
          color: white;
        }

        .logo-container {
          margin-bottom: 40px;
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }

        .logo-rocket {
          font-size: 0;
          margin-right: 8px;
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: rocketWiggle 2s infinite ease-in-out;
          filter: drop-shadow(0 0 18px #ffd700) drop-shadow(0 0 8px #4ecdc4);
        }
        @keyframes rocketWiggle {
          0%, 100% { transform: rotate(-8deg) scale(1.08); }
          50% { transform: rotate(8deg) scale(1.18); }
        }

        .logo-text {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(45deg, #ffffff, #f0f0f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .loading-text-container {
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .loading-text {
          font-size: 1.2rem;
          font-weight: 500;
          min-height: 1.5em;
          display: flex;
          align-items: center;
        }

        .typing-cursor {
          width: 2px;
          height: 1.5em;
          background: #ffffff;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .progress-container {
          margin-bottom: 40px;
        }

        .progress-bar {
          width: 300px;
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          overflow: hidden;
          margin: 0 auto 10px;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ffd700, #4ecdc4, #667eea);
          border-radius: 3px;
          transition: width 0.1s ease;
          position: relative;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .progress-text {
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
        }

        .animated-icons {
          display: flex;
          justify-content: center;
          gap: 30px;
        }

        .icon-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          animation: bounce 2s ease-in-out infinite;
        }

        .icon-container:nth-child(2) { animation-delay: 0.5s; }
        .icon-container:nth-child(3) { animation-delay: 1s; }
        .icon-container:nth-child(4) { animation-delay: 1.5s; }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .icon {
          font-size: 2rem;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
        }

        .icon-label {
          font-size: 0.8rem;
          font-weight: 500;
          opacity: 0.9;
        }

        .particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 5;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #ffffff;
          border-radius: 50%;
          animation: particleFloat linear infinite;
        }

        @keyframes particleFloat {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 1; transform: translateY(90vh) scale(1); }
          90% { opacity: 1; transform: translateY(10vh) scale(1); }
          100% { transform: translateY(-10vh) scale(0); opacity: 0; }
        }

        .enter-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          animation: fadeIn 1s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .fade-out {
          opacity: 0;
          transform: scale(0.95) translateY(20px);
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .name-input {
          padding: 12px 22px;
          border-radius: 30px;
          border: none;
          font-size: 1.1rem;
          background: rgba(255,255,255,0.15);
          color: #fff;
          outline: none;
          box-shadow: 0 0 18px #4ecdc4, 0 0 0px #ffd700;
          font-weight: 600;
          letter-spacing: 1px;
          transition: box-shadow 0.3s;
        }
        .name-input:focus {
          box-shadow: 0 0 28px #ffd700, 0 0 10px #4ecdc4;
          background: rgba(255,255,255,0.22);
        }
        .input-error {
          border: 2px solid #ff6b6b;
          box-shadow: 0 0 10px #ff6b6b;
          background: rgba(255, 0, 0, 0.08);
        }
        .input-error-msg {
          color: #ff6b6b;
          font-size: 1rem;
          font-weight: 600;
          margin-top: -8px;
          margin-bottom: 4px;
          letter-spacing: 0.5px;
          text-shadow: 0 0 8px #fff2;
        }
        .enter-btn {
          padding: 14px 38px;
          border-radius: 30px;
          border: none;
          font-size: 1.2rem;
          font-weight: 800;
          background: linear-gradient(90deg, #4ecdc4, #ffd700, #667eea);
          color: #181818;
          box-shadow: 0 0 30px #4ecdc4, 0 0 60px #ffd700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
          margin-top: 8px;
          letter-spacing: 1.5px;
        }
        .enter-btn:hover {
          background: linear-gradient(90deg, #ffd700, #4ecdc4, #667eea);
          color: #fff;
          box-shadow: 0 0 40px #ffd700, 0 0 80px #4ecdc4;
          transform: scale(1.07);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mouse-ripple {
          pointer-events: none;
          position: fixed;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.13) 0%, rgba(102,126,234,0.09) 60%, rgba(78,205,196,0.07) 100%);
          box-shadow: 0 0 48px 18px #ffd70022, 0 0 96px 36px #4ecdc422;
          filter: blur(3.5px) brightness(1.1);
          opacity: 0.55;
          z-index: 10000;
          animation: rippleFade 1.4s cubic-bezier(0.23,1,0.32,1) forwards;
        }
        @keyframes rippleFade {
          0% { opacity: 0.55; transform: scale(0.7); }
          60% { opacity: 0.25; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(2.1); }
        }

        @media (max-width: 768px) {
          .logo-text { font-size: 2rem; }
          .loading-text { font-size: 1rem; }
          .progress-bar { width: 250px; }
          .animated-icons { gap: 20px; }
          .icon { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen; 