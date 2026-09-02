import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import CalculatorWizard from '../components/calculator/CalculatorWizard';
import styles from '../style/Calculator.module.css';

export default function Calculator() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const tipoInicial = searchParams.get('tipo'); // 'aereo' | 'impacto' | null

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <main className={styles.page}>
        <CalculatorWizard tipoInicial={tipoInicial} />
      </main>
      <Footer />
    </>
  );
}