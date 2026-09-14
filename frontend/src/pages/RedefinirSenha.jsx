import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Logo from '../components/Logo';
import { IconLock } from '../components/IconSet';
import styles from '../style/Login.module.css';

const SENHA_MINIMA = 6;

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Lido uma vez só: logo em seguida o token sai da barra de endereço.
  const [token] = useState(() => searchParams.get('token') || '');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [linkInvalido, setLinkInvalido] = useState(!token);

  // Tirar o token da URL evita que ele fique no histórico do navegador.
  useEffect(() => {
    if (searchParams.has('token')) {
      navigate('/redefinir-senha', { replace: true });
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (senha.length < SENHA_MINIMA) {
      setError(`A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.`);
      return;
    }
    if (senha !== confirmacao) {
      setError('As duas senhas não são iguais.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/redefinir-senha', { token, nova_senha: senha });
      setConcluido(true);
    } catch (err) {
      if (err.response?.status === 400) {
        setLinkInvalido(true);
      } else {
        const detail = err.response?.data?.detail;
        setError(typeof detail === 'string' ? detail : 'Não foi possível redefinir agora. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  let conteudo;
  if (concluido) {
    conteudo = (
      <>
        <div className={styles.successBox} role="status">
          Senha redefinida. Você já pode entrar com a senha nova.
        </div>
        <div className={styles.formActions}>
          <Link to="/login" className={styles.button}>Entrar</Link>
        </div>
      </>
    );
  } else if (linkInvalido) {
    conteudo = (
      <>
        <div className={styles.errorBox} role="alert">
          Este link é inválido ou expirou. Os links valem por 30 minutos, servem uma vez só,
          e pedir um link novo cancela os anteriores.
        </div>
        <div className={styles.formActions}>
          <Link to="/esqueci-senha" className={styles.button}>Pedir um novo link</Link>
        </div>
      </>
    );
  } else {
    conteudo = (
      <>
        <p className={styles.formText}>Escolha a sua nova senha.</p>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>
              <IconLock size={20} color="#1E5EFF" />
            </span>
            <input
              className={styles.input}
              type="password"
              placeholder="nova senha"
              aria-label="Nova senha"
              autoComplete="new-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <p className={styles.fieldHint}>Mínimo de {SENHA_MINIMA} caracteres.</p>

          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>
              <IconLock size={20} color="#1E5EFF" />
            </span>
            <input
              className={styles.input}
              type="password"
              placeholder="repita a nova senha"
              aria-label="Repita a nova senha"
              autoComplete="new-password"
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </form>
      </>
    );
  }

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>← Início</Link>

      <div className={styles.formSide}>
        <div className={styles.formBox}>
          <h1 className={styles.formTitle}>Nova senha</h1>
          {conteudo}
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelContent}>
          <Logo width={300} />
          <h2 className={styles.panelTitle}>Quase lá</h2>
          <p className={styles.panelText}>
            Depois de salvar, a senha antiga deixa de funcionar e qualquer outro link de
            recuperação pendente é cancelado.
          </p>
          <Link to="/login" className={styles.panelLink}>Voltar para o login</Link>
        </div>
      </div>
    </div>
  );
}
