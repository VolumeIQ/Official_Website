import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import NotFound from './components/NotFound';
import AdSense from './components/AdSense';
import AdBlockModal from './components/AdBlockModal';
import './App.css';

const Home = () => {
  return (
    <main id="main-content">
      <Hero />
      <div className="container">
         <AdSense slot="HOME_TOP_AD" />
      </div>
      <Features />
      <HowTo />
      <Shortcuts />
      <Support />
      <div className="container" style={{ margin: '4rem auto' }}>
         <AdSense slot="HOME_BOTTOM_AD" />
      </div>
      <FAQ />
      <CTA />
    </main>
  );
};

function App() {
  const location = useLocation();

  useEffect(() => {
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Re-scan whenever location changes (pathname or hash)
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.animate');
      elements.forEach(el => {
        if (!el.classList.contains('visible')) {
          observer.observe(el);
        }
      });

      // Handle hash scrolling if on Home page
      if (location.pathname === '/' && location.hash) {
        const el = document.querySelector(location.hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 150); // Slight delay to ensure React has rendered the new route

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [location.pathname, location.hash]);

  // Scroll to top on route change (if no hash)
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className="app">
      <Navbar />
      <AdBlockModal />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
