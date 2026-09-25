import React, { useState, useEffect } from 'react';
import { Page } from './types';
import { Navbar } from './components/Navbar';
import { DockNav } from './components/DockNav';
import { Footer } from './components/Footer';
import { AsciiLoader } from './components/AsciiLoader';
import { HomePage } from './pages/HomePage';
import { AakashavaniPage } from './pages/AakashavaniPage';
import { ApproachPage } from './pages/ApproachPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

export default function App() {
  const getPageFromPath = (pathname: string): Page => {
    const cleanPath = pathname.toLowerCase().replace(/\/$/, '') || '/';
    if (cleanPath === '/aakashavani') return 'aakashavani';
    if (cleanPath === '/approach') return 'approach';
    if (cleanPath === '/applications') return 'applications';
    if (cleanPath === '/about') return 'about';
    if (cleanPath === '/contact') return 'contact';
    return 'home';
  };

  const getPathFromPage = (page: Page): string => {
    switch (page) {
      case 'aakashavani': return '/aakashavani';
      case 'approach': return '/approach';
      case 'applications': return '/applications';
      case 'about': return '/about';
      case 'contact': return '/contact';
      default: return '/';
    }
  };

  const getTitleFromPage = (page: Page): string => {
    switch (page) {
      case 'aakashavani': return 'Aakashavani — Financial World Model | VEIRON';
      case 'approach': return 'The World-Model Approach | VEIRON';
      case 'applications': return 'Institutional Applications | VEIRON';
      case 'about': return 'Mission & Philosophy | VEIRON';
      case 'contact': return 'Contact & Briefing | VEIRON';
      default: return 'VEIRON — World Models for Institutions';
    }
  };

  const [currentPage, setCurrentPage] = useState<Page>(() => {
    return getPageFromPath(window.location.pathname);
  });
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionLabel, setTransitionLabel] = useState<string>('SYNCHRONIZING WORLD MODEL...');

  useEffect(() => {
    const handlePopState = () => {
      const page = getPageFromPath(window.location.pathname);
      setCurrentPage(page);
      document.title = getTitleFromPage(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (page: Page) => {
    if (page === currentPage) return;
    setTransitionLabel(`RESOLVING VEIRON [${page.toUpperCase()}] RECURSIVE STATE...`);
    setIsTransitioning(true);
    setCurrentPage(page);
    const path = getPathFromPage(page);
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    document.title = getTitleFromPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setIsTransitioning(false);
    }, 450);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#141413] selection:bg-[#E5182B]/20 selection:text-[#141413]">
      {/* Top Navbar */}
      <Navbar 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        isTransitioning={isTransitioning}
        transitionLabel={transitionLabel}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'aakashavani' && <AakashavaniPage onNavigate={handleNavigate} />}
        {currentPage === 'approach' && <ApproachPage onNavigate={handleNavigate} />}
        {currentPage === 'applications' && <ApplicationsPage onNavigate={handleNavigate} />}
        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentPage === 'contact' && <ContactPage onNavigate={handleNavigate} />}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Application Dock */}
      <DockNav currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}
