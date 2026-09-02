import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { IconMail, IconHelp, IconShieldCheck, IconChevronDownDark } from '../components/IconSet';
import styles from '../style/Support.module.css';

const channels = [
  {
    icon: IconMail,
    label: 'E-mail',
    value: 'suporte@acousticbuild.com',
    hint: 'Respondemos em até 24h úteis',
    href: 'mailto:suporte@acousticbuild.com',
  },
  {
    icon: IconHelp,
    label: 'Horário de atendimento',
    value: 'Segunda a sexta, 9h às 18h',
    hint: 'Atendimento em horário comercial',
    href: null,
  },
  {
    icon: IconShieldCheck,
    label: 'Central de Ajuda',
    value: 'Perguntas frequentes',
    hint: 'Clique para ver as respostas',
    href: '#faq',
  },
];

const faqs = [
  {
    q: 'Como crio uma conta na AcousticBuild?',
    a: 'Clique em "Cadastrar" no menu superior e preencha nome, e-mail e senha. Em instantes você terá acesso à plataforma.',
  },
  {
    q: 'O que a plataforma prevê?',
    a: 'A AcousticBuild prevê e otimiza o desempenho acústico de edificações, calculando isolamento e absorção sonora a partir dos dados do seu projeto.',
  },
  {
    q: 'Preciso instalar algum software?',
    a: 'Não. A plataforma funciona direto no navegador — basta acessar sua conta em qualquer dispositivo com internet.',
  },
  {
    q: 'Como entro em contato com o suporte?',
    a: 'Envie um e-mail para suporte@acousticbuild.com ou utilize os canais da seção "Fale Conosco". Retornamos em até 24h úteis.',
  },
  {
    q: 'Meus dados estão seguros?',
    a: 'Sim. Utilizamos protocolos de segurança e armazenamento protegido. Seus dados são usados apenas para a operação da plataforma.',
  },
];

export default function Support() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>← Início</Link>

      {/* Lado escuro — Central de Suporte + Fale Conosco */}
      <div className={styles.panel}>
        <div className={styles.panelContent}>
          <Logo width={260} light={true} />
          <h1 className={styles.panelTitle}>Central de Suporte</h1>
          <p className={styles.panelSubtitle}>
            Estamos aqui para ajudar você a aproveitar ao máximo a plataforma. 
            Entre em contato pelos canais abaixo ou confira as perguntas frequentes.
          </p>

          <h2 className={styles.channelsTitle}>Fale Conosco</h2>
          <div className={styles.channelList}>
            {channels.map((channel, index) => {
              const Icon = channel.icon;
              const content = (
                <>
                  <span className={styles.channelIcon}>
                    <Icon size={22} color="#FFFFFF" />
                  </span>
                  <span className={styles.channelText}>
                    <span className={styles.channelLabel}>{channel.label}</span>
                    <span className={styles.channelValue}>{channel.value}</span>
                    <span className={styles.channelHint}>{channel.hint}</span>
                  </span>
                </>
              );
              return channel.href ? (
                <a key={index} href={channel.href} className={styles.channel}>
                  {content}
                </a>
              ) : (
                <div key={index} className={styles.channel}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lado claro — Perguntas Frequentes */}
      <div id="faq" className={styles.faqSide}>
        <div className={styles.faqBox}>
          <span className={styles.faqLabel}>Dúvidas comuns</span>
          <h2 className={styles.faqTitle}>Perguntas Frequentes</h2>
          <div className={styles.faqList}>
            {faqs.map((item, index) => (
              <div key={index} className={`${styles.faqItem} ${openIndex === index ? styles.faqItemOpen : ''}`}>
                <button className={styles.faqQuestion} onClick={() => toggleFaq(index)}>
                  <span>{item.q}</span>
                  <span className={styles.faqIcon}>
                    <IconChevronDownDark size={18} color="#001A41" />
                  </span>
                </button>
                {openIndex === index && <p className={styles.faqAnswer}>{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
