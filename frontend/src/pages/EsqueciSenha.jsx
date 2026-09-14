import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Logo from '../components/Logo';
import { IconEnvelope } from '../components/IconSet';
import styles from '../style/Login.module.css';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/esqueci-senha', { email });
      setEnviado(true);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Não foi possível enviar agora. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>← Início</Link>

      <div className={styles.formSide}>
        <div className={styles.formBox}>
          <h1 className={styles.formTitle}>Recuperar senha</h1>

          {enviado ? (
            <>
              {/* A mensagem é a mesma exista ou não a conta: a tela não pode
                  servir para descobrir quais e-mails estão cadastrados. */}
              <div className={styles.successBox} role="status">
                Se existir uma conta com <strong>{email}</strong>, enviamos um link para criar
                uma nova senha. Ele vale por 30 minutos e só pode ser usado uma vez.
                Confira também a caixa de spam.
              </div>
              <div className={styles.formActions}>
                <Link to="/login" className={styles.button}>Voltar para o login</Link>
                <button type="button" className={styles.textLink} onClick={() => setEnviado(false)}>
                  Não chegou? Enviar de novo
                </button>
              </div>
            </>
          ) : (
            <>
              <p className={styles.formText}>
                Informe o e-mail da sua conta. Vamos enviar um link para você criar uma senha nova.
              </p>

              {error && <div className={styles.errorBox}>{error}</div>}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <span className={styles.inputIcon}>
                    <IconEnvelope size={20} color="#1E5EFF" />
                  </span>
                  <input
                    className={styles.input}
                    type="email"
                    name="email"
                    placeholder="email"
                    aria-label="E-mail da conta"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className={styles.button} disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelContent}>
          <Logo width={300} />
          <h2 className={styles.panelTitle}>Esqueceu a senha?</h2>
          <p className={styles.panelText}>
            Acontece. Com o link que enviamos você cria uma senha nova em menos de um minuto.
          </p>
          <Link to="/login" className={styles.panelLink}>Lembrei a senha</Link>
        </div>
      </div>
    </div>
  );
}
