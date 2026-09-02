import { useState } from 'react';
import { useAcousticCalculator } from '../../hooks/useAcousticCalculator';
import CalculatorStepHeader from './CalculatorStepHeader';
import Step1Input from './Step1Input';
import Step2Parameters from './Step2Parameters';
import Step3Results from './Step3Results';
import styles from '../../style/Calculator.module.css';

export default function CalculatorWizard({ tipoInicial }) {
  const {
    user, resultado, loading, error, calcular, salvarSimulacao, saved,
  } = useAcousticCalculator(tipoInicial);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({});

  const handleCalculate = () => {
    const payload = {
      tipo_analise: form.tipo === 'lnt' ? 'impacto' : 'aereo',
      area_elemento: Number(form.area),
      volume_receptor: Number(form.volume),
      reverberacao: Number(form.t2 || form.t),       // T2 do receptor
      reverberacao_emissor: Number(form.t1),          // T1 do emissor (aereo)
      reducao_sonora: Number(form.r),
      l1: Number(form.l1),
    };
    calcular(payload).then(() => setStep(3));
  };

  return (
    <>
      <CalculatorStepHeader step={step} />
      <div className={styles.wizard}>
        {step === 1 && <Step1Input form={form} setForm={setForm} onAdvanced={() => setStep(2)} />}
        {step === 2 && (
          <>
            <Step2Parameters form={form} setForm={setForm} onCalculate={handleCalculate} />
            {error && <div className={styles.errorBox}>{error}</div>}
          </>
        )}
        {step === 3 && !loading && (
          <Step3Results resultado={resultado} user={user} salvarSimulacao={salvarSimulacao} saved={saved} />
        )}

        {loading && <div className={styles.loadingBox}>Calculando...</div>}

        <div className={styles.wizardFooter}>
          {step > 1 && <button type="button" className={styles.secondaryBtn} onClick={() => setStep(step - 1)}>Voltar</button>}
        </div>
      </div>
    </>
  );
}