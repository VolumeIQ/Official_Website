import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowTo from './components/HowTo';
import Shortcuts from './components/Shortcuts';
import Support from './components/Support';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import { Privacy, Terms } from './components/Legal';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // No unobserve here to allow it to trigger again if needed, 
          // or keep unobserve if we want it only once. 
          // The request implies "loading as you scroll", so once is typical.
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Re-scan whenever currentPage changes, with a slight delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.animate');
      elements.forEach(el => {
        if (!el.classList.contains('visible')) {
          observer.observe(el);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [currentPage]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#privacy') setCurrentPage('privacy');
      else if (hash === '#terms') setCurrentPage('terms');
      else setCurrentPage('home');
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();

    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const showMain = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <Navbar onShowMain={showMain} onShowPage={showPage} />
      
      {currentPage === 'home' && (
        <main id="main-content">
          <Hero />
          <Features />
          <HowTo />
          <Shortcuts />
          <Support />
          <FAQ />
          <CTA />
        </main>
      )}

      {currentPage === 'privacy' && <Privacy onBack={showMain} />}
      {currentPage === 'terms' && <Terms onBack={showMain} />}

      <Footer onShowMain={showMain} onShowPage={showPage} />
    </div>
  );
}

export default App;
