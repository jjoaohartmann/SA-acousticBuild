import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import styles from '../style/LegalPage.module.css';

export default function Privacy() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <Link to="/" className={styles.backLink}>← Início</Link>
        <span className={styles.heroLabel}>Legal</span>
        <h1 className={styles.heroTitle}>Política de Privacidade</h1>
        <p className={styles.heroUpdated}>Última atualização: setembro de 2026</p>
      </div>

      <div className={styles.content}>
        <h2>1. Quais dados coletamos</h2>
        <ul>
          <li>Dados de cadastro: nome e e-mail.</li>
          <li>Senha, armazenada apenas na forma de hash criptográfico (bcrypt) — nunca em texto puro.</li>
          <li>Histórico de simulações acústicas, quando você opta por salvar um cálculo estando logado.</li>
        </ul>

        <h2>2. Para que usamos esses dados</h2>
        <p>
          Usamos seus dados exclusivamente para autenticar seu acesso, manter seu histórico de
          simulações e permitir a edição do seu perfil. Não usamos seus dados para fins publicitários
          nem os vendemos a terceiros.
        </p>

        <h2>3. Como armazenamos e protegemos seus dados</h2>
        <p>
          As senhas são protegidas com hash bcrypt e a autenticação é feita por token JWT. Os dados são
          armazenados em banco de dados do projeto e o acesso é restrito às rotas autenticadas da conta
          de cada usuário.
        </p>

        <h2>4. Compartilhamento com terceiros</h2>
        <p>
          Não compartilhamos, vendemos ou alugamos seus dados pessoais a terceiros. Por ser um projeto
          acadêmico, nenhum dado é utilizado para fins comerciais.
        </p>

        <h2>5. Armazenamento local no navegador</h2>
        <p>
          Ao fazer login, um token de sessão (JWT) é guardado no armazenamento local do seu navegador
          para manter você autenticado. Esse token pode ser removido a qualquer momento ao fazer logout
          ou limpar os dados do site no navegador.
        </p>

        <h2>6. Seus direitos</h2>
        <p>
          Você pode solicitar a qualquer momento a correção ou exclusão dos seus dados e da sua conta,
          entrando em contato pelo e-mail abaixo.
        </p>

        <h2>7. Alterações nesta política</h2>
        <p>
          Esta política pode ser atualizada conforme o projeto evolui. Recomendamos revisitar esta
          página periodicamente.
        </p>

        <h2>8. Contato</h2>
        <p>
          Para exercer seus direitos ou tirar dúvidas sobre privacidade, escreva para{' '}
          <a href="mailto:suporte@acousticbuild.com">suporte@acousticbuild.com</a>.
        </p>
      </div>

      <Footer />
    </div>
  );
}
