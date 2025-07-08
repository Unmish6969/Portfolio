import React, { useState, useEffect, useMemo } from 'react';
import myPic from '../myPic.jpeg';

const PortfolioModal = ({ isOpen, section, onClose }) => {
  console.log('PortfolioModal props:', { isOpen, section }); // Debug log

  const [displayedContent, setDisplayedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const portfolioData = useMemo(() => ({
    central: {
      title: "Personal Info",
      hasPhoto: true,
      content: `Education
Indian Institute of Information Technology Kalyani
Final Year Student
Area of Interest
I am deeply passionate about software development, especially in the realm of full stack web development using the MERN stack (MongoDB, Express.js, React.js, Node.js). I enjoy building scalable, robust, and user-centric applications that solve real-world problems. My interest lies in creating seamless user experiences, architecting efficient backend systems, and continuously learning new technologies to stay at the forefront of the ever-evolving software landscape.`
    },
    home: {
      title: "Education",
      content: `Educational Background

Hello! I'm a passionate learner with a strong academic foundation in Electronics and Communication . My educational journey has equipped me with both theoretical knowledge and practical skills needed for modern software development.

Academic Qualifications:
• Bachelor's Degree in Electronics and Communication Engineering
• Specialization in Software Engineering
• A strong foundation in Web Development and Design

Key Areas of Study:
• Data Structures and Algorithms
• Database Management Systems
• Web Development and Design
• Software Engineering Principles
• Computer Networks and Security
• Artificial Intelligence and Machine Learning

Certifications:
• AWS Hosting certificate-Forage
• Graph Camp certificate-AlgoUniversity`
    },
    projects: {
      title: "Featured Projects",
      content: `My Work

E-Commerce Platform
A full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard.
Tech Stack: React, Node.js, MongoDB, Stripe, AWS

AI-Powered Code Reviewer
Real-time  application with AI-powered responses, sentiment analysis, and multi-language support.
Tech Stack: React.js, Node.js, MongoDB, Express.js, OpenAI API

3D Portfolio Website
Interactive 3D portfolio built with React Three Fiber, featuring modern animations and immersive experience.
Tech Stack: React, Three.js, Framer Motion, React Three Fiber

Pitchify
A platform for creating and sharing pitch decks for startups.
Tech Stack: Next.js, Tailwind CSS, Shadcn UI


Decentralized application 
 A blockchain based file sharing platform.
Tech Stack: React, Solidity, Web3.js, IPFS, Ethereum`
    },
    skills: {
      title: "Skills & Technologies",
      content: `Programming Languages
JavaScript (ES6+), TypeScript, Python, C, C++, Solidity

Frontend Development
React.js, Next.js, Three.js, HTML5, CSS, Tailwind

Backend Development
Node.js, Express.js, FastAPI, REST APIs

Databases & Cloud
MongoDB, MySQL

Other Tools
Docker,  Git,  Linux`
    },
    contact: {
      title: "Get In Touch",
      content: `Let's Connect

I'm always interested in new opportunities and exciting projects. Whether you have a question, want to collaborate, or just want to say hello, feel free to reach out!

📧 Email: unmish.roy.dev@gmailcom
💼 LinkedIn: https://www.linkedin.com/in/unmish-roy-b10710311/
🐙 GitHub: https://github.com/Unmish6969
🌐 Portfolio: yourportfolio.com
📱 Phone: 6294905479

Available For:
• Full-time positions
• Freelance projects
• Contract work
• Open source contributions`
    }
  }), []);

  const currentData = section ? portfolioData[section] : null;
  console.log('Current data:', currentData); // Debug log

  useEffect(() => {
    if (isOpen && currentData) {
      // Show content immediately without typing animation
      setDisplayedContent(currentData.content);
      setIsGenerating(false);
      setCurrentIndex(currentData.content.length);
    }
  }, [isOpen, section, currentData?.content]);

  if (!isOpen || !currentData) {
    return null;
  }

  const formatContent = (content) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      if (line.includes('•')) {
        return <div key={index} className="list-item">{line}</div>;
      }
      
      if (line.includes('Resume: https://')) {
        const url = line.replace('Resume: ', '').trim();
        return (
          <div key={index} style={{ margin: '12px 0' }}>
            <strong>Resume: </strong>
            <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#4a90e2', textDecoration: 'underline', wordBreak: 'break-all' }}>
              {url}
            </a>
          </div>
        );
      }
      // Make email clickable
      if (line.includes('Email:')) {
        const email = line.replace('Email:', '').replace('📧', '').trim();
        return (
          <div key={index} style={{ margin: '8px 0' }}>
            <strong>Email: </strong>
            <a href={`mailto:${email}`} style={{ color: '#4a90e2', textDecoration: 'underline', wordBreak: 'break-all' }}>{email}</a>
          </div>
        );
      }
      // Make LinkedIn clickable
      if (line.includes('LinkedIn:')) {
        const url = line.replace('LinkedIn:', '').replace('💼', '').trim();
        return (
          <div key={index} style={{ margin: '8px 0' }}>
            <strong>LinkedIn: </strong>
            <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#4a90e2', textDecoration: 'underline', wordBreak: 'break-all' }}>{url}</a>
          </div>
        );
      }
      // Make GitHub clickable
      if (line.includes('GitHub:')) {
        const url = line.replace('GitHub:', '').replace('🐙', '').trim();
        return (
          <div key={index} style={{ margin: '8px 0' }}>
            <strong>GitHub: </strong>
            <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#4a90e2', textDecoration: 'underline', wordBreak: 'break-all' }}>{url}</a>
          </div>
        );
      }
      
      if (line.includes(':')) {
        const [title, ...rest] = line.split(':');
        return (
          <div key={index} className="section-title">
            <strong>{title}:</strong> {rest.join(':')}
          </div>
        );
      }
      
      // Handle section titles without colons (like "Frontend Development", "Backend Development")
      if (line.trim() && !line.includes(',') && line.length < 30 && 
          (line.includes('Development') || line.includes('Languages') || line.includes('Tools') || 
           line.includes('Databases') || line.includes('Cloud') || line.includes('Area of Interest'))) {
        return <h3 key={index} className="section-title">{line}</h3>;
      }
      
      if (line.includes('Tech Stack:')) {
        return <div key={index} className="tech-stack">{line}</div>;
      }
      
      if (line.length > 0 && !line.startsWith(' ') && line.length < 50) {
        return <h3 key={index} className="project-title">{line}</h3>;
      }
      
      return <p key={index}>{line}</p>;
    });
  };

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{currentData.title}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="content-generator">
            <div className="generated-content">
              {currentData.hasPhoto && (
                <div className="photo-section">
                  <img 
                    src={myPic} 
                    alt="Profile" 
                    className="profile-photo"
                  />
                </div>
              )}
              <div className="text-content">
                {formatContent(displayedContent)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioModal; 