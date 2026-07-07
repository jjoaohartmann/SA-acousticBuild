import { useState } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import WhatWeAreSection from '../components/WhatWeAreSection';
import WhoWeAreSection from '../components/WhoWeAreSection';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <HeroSection />
      <section id="o-que-somos">
        <WhatWeAreSection />
      </section>
      <section id="quem-somos">
        <WhoWeAreSection />
      </section>
      <Footer />
    </>
  );
}
