import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import './App.css';
import * as THREE from 'three';

// Components
import Scene from './components/Scene';
import UI from './components/UI';
import PortfolioModal from './components/PortfolioModal';
import LoadingScreen from './components/LoadingScreen';

// Custom Keyboard Controls Component
const KeyboardControls = () => {
  const { camera, controls } = useThree();
  const [isMoving, setIsMoving] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
        setIsMoving(true);
        
        const moveSpeed = 0.5;
        const direction = new THREE.Vector3();
        
        // Get the camera's current look direction
        camera.getWorldDirection(direction);
        
        // Get the camera's right vector
        const right = new THREE.Vector3();
        right.crossVectors(camera.up, direction).normalize();
        
        let movement = new THREE.Vector3();
        
        switch(event.code) {
          case 'KeyW':
            // Move forward
            movement.copy(direction).multiplyScalar(moveSpeed);
            break;
          case 'KeyS':
            // Move backward
            movement.copy(direction).multiplyScalar(-moveSpeed);
            break;
          case 'KeyA':
            // Move left
            movement.copy(right).multiplyScalar(-moveSpeed);
            break;
          case 'KeyD':
            // Move right
            movement.copy(right).multiplyScalar(moveSpeed);
            break;
        }
        
        // Apply movement
        camera.position.add(movement);
        
        // Update the camera
        camera.updateMatrixWorld();
      }
    };

    const handleKeyUp = (event) => {
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
        setIsMoving(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [camera]);

  // Disable OrbitControls when moving with keyboard
  useEffect(() => {
    if (controls) {
      if (isMoving) {
        controls.enabled = false;
      } else {
        controls.enabled = true;
      }
    }
  }, [isMoving, controls]);

  return null;
};

function App() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const controlsRef = useRef();

  // Remove old loading timer logic
  // useEffect(() => {
  //   // Show loading screen for 4 seconds
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 4000);
  //   return () => clearTimeout(timer);
  // }, []);

  const handleFinishLoading = (name) => {
    setUserName(name);
    setIsLoading(false);
  };

  const handleSectionClick = (sectionId) => {
    console.log('Section clicked in App:', sectionId); // Debug log
    setSelectedSection(sectionId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedSection(null);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <LoadingScreen onFinish={handleFinishLoading} />;
  }

  return (
    <Router>
      <div className="App">
        <Canvas
          camera={{ position: [0, 15, 25], fov: 60 }}
          shadows
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={['#0a0a0a']} />
          <fog attach="fog" args={['#0a0a0a', 10, 50]} />
          
          <Environment preset="night" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} intensity={0.3} levels={6} mipmapBlur />
          </EffectComposer>
          
          <Scene onSectionClick={handleSectionClick} isModalOpen={isModalOpen} />
          
          <KeyboardControls />
          
          <OrbitControls 
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={50}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
            panSpeed={1}
            zoomSpeed={1}
            rotateSpeed={0.5}
          />
        </Canvas>
        
        <UI userName={userName} />
        
        {selectedSection && (
          <PortfolioModal 
            isOpen={!!selectedSection}
            section={selectedSection}
            onClose={handleCloseModal}
          />
        )}

        {/* Instruction Panel */}
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: 1000,
            pointerEvents: 'auto',
            transform: 'none',
            width: 'auto',
            height: 'auto'
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(20, 20, 20, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(74, 144, 226, 0.3)',
            borderRadius: '15px',
            padding: '15px',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '200px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(74, 144, 226, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Glow effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(74, 144, 226, 0.1), rgba(147, 89, 182, 0.1))',
              borderRadius: '15px',
              pointerEvents: 'none'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{
                margin: '0 0 12px 0',
                color: '#4a90e2',
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                textShadow: '0 0 8px rgba(74, 144, 226, 0.5)'
              }}>
                🎮 Controls
              </h3>
              
              <div style={{ marginBottom: '10px' }}>
                <div style={{
                  fontSize: '12px',
                  lineHeight: '1.4',
                  color: '#e0e0e0'
                }}>
                  <div>• <strong>Click buildings</strong> to open sections</div>
                  <div>• <strong>Drag to rotate</strong> camera view</div>
                  <div>• <strong>Scroll to zoom</strong> in and out</div>
                  <div>• <strong>WASD keys</strong> to move camera</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
