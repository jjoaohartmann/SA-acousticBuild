import { useState } from 'react';
import Header from '../components/Header';
import ScrollVideoBackground from '../components/ScrollVideoBackground';
import HeroSection from '../components/HeroSection';
import SourcesStrip from '../components/SourcesStrip';
import WhatWeAreSection from '../components/WhatWeAreSection';
import WhoWeAreSection from '../components/WhoWeAreSection';
import ProductSection from '../components/ProductSection';
import AccessCalculatorButton from '../components/AccessCalculatorButton';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <ScrollVideoBackground />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <HeroSection />
      <SourcesStrip />
      <section id="o-que-somos">
        <WhatWeAreSection />
      </section>
      <section id="quem-somos">
        <WhoWeAreSection />
      </section>
      <section id="produto">
        <ProductSection />
        <AccessCalculatorButton />
      </section>
      <Footer />
    </>
  );
}
