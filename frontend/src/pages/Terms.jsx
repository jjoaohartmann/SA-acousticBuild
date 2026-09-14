import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import styles from '../style/LegalPage.module.css';

export default function Terms() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <Link to="/" className={styles.backLink}>← Início</Link>
        <span className={styles.heroLabel}>Legal</span>
        <h1 className={styles.heroTitle}>Termos de Uso</h1>
        <p className={styles.heroUpdated}>Última atualização: setembro de 2026</p>
      </div>

      <div className={styles.content}>
        <h2>1. Aceitação dos termos</h2>
        <p>
          Ao acessar ou usar a plataforma AcousticBuild, você concorda com estes Termos de Uso.
          Se não concordar com algum ponto, recomendamos não utilizar a plataforma.
        </p>

        <h2>2. Natureza da ferramenta</h2>
        <p>
          O AcousticBuild é um projeto científico e tecnológico, desenvolvido em contexto acadêmico
          (Situação de Aprendizagem e Iniciação Científica), que estima e analisa o desempenho acústico
          de sistemas construtivos com base em normas técnicas e modelos matemáticos reconhecidos.
        </p>
        <p>
          Os resultados apresentados são <strong>estimativas técnicas</strong> calculadas a partir dos
          dados informados pelo usuário. Eles não substituem laudos técnicos emitidos por profissional
          habilitado, nem têm validade como documento oficial de certificação acústica de uma edificação.
        </p>

        <h2>3. Cadastro e conta</h2>
        <p>
          Para salvar simulações e acessar seu histórico, é necessário criar uma conta com nome, e-mail
          e senha. Você é responsável por manter a confidencialidade das suas credenciais e por todas as
          atividades realizadas na sua conta.
        </p>

        <h2>4. Uso permitido</h2>
        <ul>
          <li>Utilizar a calculadora para fins educacionais, acadêmicos ou de planejamento preliminar.</li>
          <li>Salvar e consultar seu próprio histórico de simulações.</li>
        </ul>
        <p>Não é permitido:</p>
        <ul>
          <li>Tentar acessar dados de outros usuários ou burlar mecanismos de autenticação.</li>
          <li>Utilizar a plataforma para fins ilegais ou que violem direitos de terceiros.</li>
          <li>Apresentar os resultados da ferramenta como laudo técnico oficial sem a devida revisão de um profissional habilitado.</li>
        </ul>

        <h2>5. Propriedade intelectual</h2>
        <p>
          O conteúdo, marca, layout e o motor de cálculo do AcousticBuild pertencem aos seus
          desenvolvedores e são disponibilizados para fins educacionais e de pesquisa.
        </p>

        <h2>6. Limitação de responsabilidade</h2>
        <p>
          A AcousticBuild não se responsabiliza por decisões de projeto, obra ou investimento tomadas
          exclusivamente com base nos resultados desta ferramenta. Recomendamos sempre a validação por
          um profissional de engenharia ou arquitetura habilitado.
        </p>

        <h2>7. Alterações</h2>
        <p>
          Estes termos podem ser atualizados conforme o projeto evolui. Alterações relevantes serão
          comunicadas nesta página.
        </p>

        <h2>8. Contato</h2>
        <p>
          Dúvidas sobre estes termos podem ser enviadas para{' '}
          <a href="mailto:suporte@acousticbuild.com">suporte@acousticbuild.com</a>.
        </p>
      </div>

      <Footer />
    </div>
  );
}
