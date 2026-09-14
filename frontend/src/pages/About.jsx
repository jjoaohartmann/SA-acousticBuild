import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import { IconClipboardCheck, IconBulb, IconCircleCheck } from '../components/IconSet';
import cidadeWireframe from '../assets/bg-sobre.jpg';
import grupo2026 from '../assets/team/grupo-2026.jpg';
import grupo2025 from '../assets/team/grupo-2025.jpg';
import fotoFernando from '../assets/team/fernando-rateke.jpg';
import fotoMaria from '../assets/team/maria-eduarda.jpg';
import fotoJulia from '../assets/team/julia-verissimo.jpg';
import fotoSara from '../assets/team/sara-rotenski.jpg';
import styles from '../style/About.module.css';

const PILARES = [
  {
    icon: IconClipboardCheck,
    titulo: 'Nossa missão',
    texto: 'Promover bem-estar e qualidade de vida através de soluções acústicas inteligentes e acessíveis.',
  },
  {
    icon: IconBulb,
    titulo: 'Nossa visão',
    texto: 'Ser referência em tecnologia acústica, contribuindo para cidades mais silenciosas e saudáveis.',
  },
  {
    icon: IconCircleCheck,
    titulo: 'Nossos valores',
    texto: 'Precisão, inovação, ética e compromisso com a saúde e o meio ambiente.',
  },
];

const FERNANDO = {
  nome: 'Fernando Rateke Neto',
  foto: fotoFernando,
  bio: [
    'Fernando Rateke Neto nasceu em Florianópolis em 2008 e atualmente é estudante do 3º ano do Ensino Médio integrado ao curso técnico em Desenvolvimento de Sistemas na Escola SESI. Pretende se candidatar a universidades nos Estados Unidos para cursar uma graduação na área de tecnologia e seguir carreira em programação, com interesse no desenvolvimento full-stack e na área de jogos.',
    'O estudante faz parte do grupo de Iniciação Científica de Matemática de sua escola desde 2025. Foi finalista do Infomatrix 2025 com o AcousticBuild, sendo credenciado para o MILSET 2026, em Fortaleza, Ceará. Em 2026, também participou da FEBRACE, ampliando sua experiência em pesquisa científica e desenvolvimento tecnológico.',
  ],
};

const MARIA = {
  nome: 'Maria Eduarda Tessari',
  foto: fotoMaria,
  bio: [
    'Maria Eduarda Tessari nasceu em Florianópolis em 2008 e atualmente é estudante do 3º ano do Ensino Médio integrado ao curso técnico em Desenvolvimento de Sistemas na Escola SESI. Pretende ingressar em uma universidade para cursar Medicina, construindo uma carreira que integre tecnologia e matemática à área da saúde.',
    'A estudante faz parte do grupo de Iniciação Científica de Matemática de sua escola desde 2025 e foi finalista do Infomatrix 2025 com o AcousticBuild, sendo credenciada para o MILSET 2026, em Fortaleza, Ceará. Em 2026, também participou da FEBRACE, ampliando sua experiência em pesquisa científica e desenvolvimento tecnológico.',
  ],
};

const JULIA = {
  nome: 'Júlia Veríssimo',
  foto: fotoJulia,
  bio: [
    'Júlia Veríssimo nasceu em Florianópolis em 2009, atualmente é estudante do 3º ano do Ensino Médio integrado ao curso técnico em Desenvolvimento de Sistemas na Escola SESI. Pretende ingressar na Universidade Federal de Santa Catarina no curso de Medicina e construir uma carreira na área de Pediatria, com o objetivo de atuar na promoção da saúde e no cuidado de crianças e adolescentes.',
    'A estudante faz parte do grupo de Iniciação Científica de Matemática de sua escola desde 2026.',
  ],
};

const SARA = {
  nome: 'Sara Rotenski Pereira',
  foto: fotoSara,
  bio: [
    'Sara Rotenski Pereira nasceu em Florianópolis em 2007. Em 2025, se formou no Ensino Médio integrado ao curso técnico em Desenvolvimento de Sistemas na Escola SESI e, atualmente, é acadêmica do bacharelado em Ciência de Dados e Inteligência Artificial no UniSENAI.',
    'A estudante fez parte do grupo de Iniciação Científica de Matemática de sua escola de 2023 até 2025 e foi finalista da FEBRACE 2025 graças ao projeto “Desenvolvimento de uma Plataforma Integrada para Análise dos Níveis de Ruído Rodoviário”, que desenvolveu em 2024. Esse mesmo projeto também foi finalista da FENIC 2024, em Salvador e da FEBIC 2024, onde recebeu o prêmio de banner destaque (exposição) da feira e o credenciamento para a Copa Science 2025 no México. Nesse evento, o projeto foi premiado com medalha de ouro na categoria das Ciências Exatas e recebeu mais uma credencial, desta vez para a Colômbia.',
    'O AcousticBuild foi finalista do Infomatrix 2025 e credenciado para o evento MILSET 2026 em Fortaleza, capital do Ceará. Também foi finalista da FEBRACE 2026, em São Paulo. Além disso, Sara possui uma menção honrosa na OBMEP (Olimpíada Brasileira de Matemática) em 2022.',
  ],
};

const EQUIPES = [
  {
    ano: '2026',
    atual: true,
    descricao: 'Equipe responsável pela evolução da plataforma e pela participação na FEBRACE e no MILSET 2026.',
    capa: grupo2026,
    legenda: 'Fernando Rateke Neto, Maria Eduarda Tessari e Júlia Veríssimo',
    integrantes: [FERNANDO, MARIA, JULIA],
  },
  {
    ano: '2025',
    atual: false,
    descricao: 'Equipe que deu origem ao projeto e o levou à final do Infomatrix 2025.',
    capa: grupo2025,
    legenda: 'Maria Eduarda Tessari, Sara Rotenski Pereira e Fernando Rateke Neto',
    integrantes: [FERNANDO, MARIA, SARA],
  },
];

const FONT_GROUPS = [
  {
    title: 'Normas técnicas',
    items: [
      { ref: 'ABNT NBR 10152:2017 (corrigida 2020)', desc: 'Níveis de pressão sonora em ambientes internos.' },
      { ref: 'ABNT NBR 15575 — Partes 3 e 4', desc: 'Desempenho acústico de edificações habitacionais.' },
      { ref: 'ISO 12354-1:2017', desc: 'Estimativa de isolamento de ruído aéreo.' },
      { ref: 'ISO 12354-2:2017', desc: 'Estimativa de isolamento de ruído de impacto.' },
      { ref: 'ISO 16283-1', desc: 'Medição de isolamento aéreo em campo.' },
      { ref: 'ISO 16283-2:2020', desc: 'Medição de isolamento de impacto em campo.' },
      { ref: 'ISO 717-1:2020', desc: 'Classificação e ponderação de isolamento aéreo.' },
      { ref: 'ISO 717-2:2020', desc: 'Classificação e ponderação de isolamento de impacto.' },
      { ref: 'ISO 3382-2:2008', desc: 'Medição de tempo de reverberação.' },
      { ref: 'ISO 12999-1:2020', desc: 'Incerteza de medição em acústica de edificações.' },
      { ref: 'ANSI/ASA S12.60-2010/Part 1', desc: 'Critérios acústicos para escolas.' },
    ],
  },
  {
    title: 'Diretrizes internacionais',
    items: [
      { ref: 'WHO, 2018', desc: 'Environmental Noise Guidelines for the European Region.' },
    ],
  },
  {
    title: 'Literatura científica',
    items: [
      { ref: 'GERGES, S. N. Y.', desc: 'Ruído: fundamentos e controle.' },
      { ref: 'TROCHIDIS & PAPANIKOLAOU, 1984', desc: 'Transmissão sonora por frestas e aberturas.' },
      { ref: 'ASAKURA et al., 2009', desc: 'Transmissão por aberturas tipo fresta e redução por materiais porosos.' },
    ],
  },
];

export default function About() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.page}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <section className={styles.hero}>
        <img src={cidadeWireframe} alt="" aria-hidden="true" className={styles.heroArt} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            Saiba mais sobre <span className={styles.highlight}>nós</span>
          </h1>
          <p className={styles.heroText}>
            A AcousticBuild nasceu da união entre tecnologia, engenharia e propósito: transformar a
            forma como o desempenho acústico é pensado nas edificações.
          </p>
        </div>

        <div className={styles.pilaresGrid}>
          {PILARES.map(({ icon: Icon, titulo, texto }, index) => (
            <Reveal key={titulo} delay={index * 100}>
              <div className={styles.pilarCard}>
                <div className={styles.pilarIcon}>
                  <Icon size={34} color="#2F6FFF" />
                </div>
                <h2 className={styles.pilarTitulo}>{titulo}</h2>
                <p className={styles.pilarTexto}>{texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={styles.projeto}>
        <Reveal className={styles.bloco}>
          <span className={styles.label}>O projeto</span>
          <h2 className={styles.sectionTitle}>Ciência aplicada à acústica de edificações</h2>
          <p>
            O AcousticBuild é um projeto científico e tecnológico que investiga e desenvolve uma
            ferramenta computacional para estimar e analisar o desempenho acústico de sistemas
            construtivos. Combina fundamentação teórica em acústica de edificações, normas técnicas,
            experimentação com medições em ambientes reais e desenvolvimento de software.
          </p>
          <p>
            Sua proposta é transformar dados físicos e acústicos em análises compreensíveis,
            permitindo avaliar situações de ruído aéreo e de impacto, visualizar os resultados e
            entender os métodos, fontes e limitações envolvidos.
          </p>
        </Reveal>
      </section>

      <section className={styles.equipe}>
        <Reveal className={styles.bloco}>
          <span className={styles.label}>Equipe</span>
          <h2 className={styles.sectionTitle}>Quem constrói o AcousticBuild</h2>
          <p>
            Somos estudantes e pesquisadores do grupo de Iniciação Científica de Matemática da Escola
            SESI, em Florianópolis.
          </p>
        </Reveal>

        {EQUIPES.map((equipe, ei) => (
          <div key={equipe.ano} className={styles.anoBloco}>
            <Reveal>
              <div className={styles.anoHeader}>
                <div className={styles.anoTituloLinha}>
                  <span className={styles.anoNumero}>{equipe.ano}</span>
                  {equipe.atual && <span className={styles.anoBadge}>Equipe atual</span>}
                </div>
                <p className={styles.anoDesc}>{equipe.descricao}</p>
              </div>
            </Reveal>

            <Reveal>
              <figure className={styles.capa}>
                <img src={equipe.capa} alt={`Equipe de ${equipe.ano}`} loading="lazy" />
                <figcaption>{equipe.legenda}</figcaption>
              </figure>
            </Reveal>

            <div className={styles.integrantesGrid}>
              {equipe.integrantes.map((pessoa, index) => {
                // Quem participou dos dois anos já teve a biografia lida acima —
                // repetir os mesmos dois parágrafos cansa quem está lendo a página.
                const jaApresentado = EQUIPES.slice(0, ei)
                  .some((e) => e.integrantes.includes(pessoa));
                return (
                  <Reveal key={`${equipe.ano}-${pessoa.nome}`} delay={index * 80}>
                    <article className={styles.pessoaCard}>
                      <img src={pessoa.foto} alt={pessoa.nome} className={styles.pessoaFoto} loading="lazy" />
                      <h3 className={styles.pessoaNome}>{pessoa.nome}</h3>
                      {jaApresentado ? (
                        <p className={styles.pessoaRepetido}>
                          Também integra a equipe atual — biografia na seção de 2026.
                        </p>
                      ) : (
                        pessoa.bio.map((paragrafo, i) => (
                          <p key={i} className={styles.pessoaBio}>{paragrafo}</p>
                        ))
                      )}
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section id="metodologia" className={styles.fontes}>
        <Reveal className={styles.bloco}>
          <span className={styles.label}>Metodologia</span>
          <h2 className={styles.sectionTitle}>Em que os cálculos se baseiam</h2>
          <p>
            Cada cálculo da plataforma é fundamentado em normas técnicas e literatura científica
            reconhecida. Abaixo estão as principais referências usadas no motor de cálculo e nos
            critérios normativos de classificação.
          </p>
        </Reveal>

        <div className={styles.fontesGrid}>
          {FONT_GROUPS.map((group, gi) => (
            <Reveal key={group.title} delay={gi * 100}>
              <div className={styles.fonteGrupo}>
                <h3 className={styles.fonteGrupoTitulo}>{group.title}</h3>
                <ul className={styles.fonteLista}>
                  {group.items.map((item) => (
                    <li key={item.ref}>
                      <strong>{item.ref}</strong>
                      <span>{item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
