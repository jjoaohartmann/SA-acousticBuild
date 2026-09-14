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
  const [form, setForm] = useState({
    tipo: tipoInicial === 'impacto' ? 'impacto' : 'aereo',
    cenario: tipoInicial === 'impacto' ? 'laje_entre_unidades' : 'parede_entre_unidades',
  });

  const handleCalculate = () => {
    const isImpacto = form.elemento === 'piso_laje' || form.tipo === 'impacto';
    const payload = {
      tipo_analise: isImpacto ? 'impacto' : 'aereo',
      cenario: form.cenario,
      ambiente_emissor: form.emissor || '',
      ambiente_receptor: form.receptor || '',
      // eixo NBR 10152 (conforto) — independente do cenário NBR 15575 (exigência legal)
      ambiente_receptor_tipo: form.ambiente_receptor_tipo || undefined,
      elemento_separador: form.elemento || '',
      volume_receptor: Number(form.volume ?? 36),
      reverberacao: Number(form.t ?? 0.6),
      area_elemento: Number(form.area ?? 15),
      sistema_codigo: form.sistema_codigo || undefined,
      sistema_id: form.sistema_id || undefined,
      camadas: form.camadas || undefined,
    };

    if (!isImpacto) {
      // Para ruído aéreo: sempre enviar l1 (usar 85 como padrão razoável)
      payload.l1 = Number(form.l1 ?? 85);

      if (form.possuiMedicaoL2 && form.l2 !== undefined && form.l2 !== '') {
        payload.l2 = Number(form.l2);
      } else if (form.r !== undefined && form.r !== '') {
        payload.reducao_sonora = Number(form.r);
      }
    } else {
      if (form.li !== undefined && form.li !== '') {
        payload.nivel_impacto = Number(form.li);
        payload.li = Number(form.li);
      }
    }

    calcular(payload).then(() => {
      // useAcousticCalculator define resultado no sucesso
      setStep(3);
    }).catch(() => {});
  };

  return (
    <>
      <CalculatorStepHeader step={step} />
      <div className={styles.wizard}>
        {step === 1 && (
          <Step1Input
            form={form}
            setForm={setForm}
            onAdvanced={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <>
            <Step2Parameters
              form={form}
              setForm={setForm}
              onCalculate={handleCalculate}
            />
            {error && <div className={styles.errorBox}>{error}</div>}
          </>
        )}

        {step === 3 && !loading && (
          <Step3Results
            resultado={resultado}
            user={user}
            salvarSimulacao={salvarSimulacao}
            saved={saved}
            form={form}
          />
        )}

        {loading && <div className={styles.loadingBox}>Processando simulação acústica...</div>}

        <div className={styles.wizardFooter}>
          {step > 1 && (
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => setStep(step - 1)}
            >
              ← Voltar
            </button>
          )}
          {step === 3 && (
            <button
              type="button"
              className={styles.secondaryBtn}
              style={{ marginLeft: '12px' }}
              onClick={() => setStep(1)}
            >
              Nova Simulação
            </button>
          )}
        </div>
      </div>
    </>
  );
}