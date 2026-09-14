import { Link } from 'react-router-dom';
import { IconCalculator } from './IconSet';
import Reveal from './Reveal';
import styles from '../style/AccessCalculatorButton.module.css';

export default function AccessCalculatorButton() {
  return (
    <div className={styles.wrap}>
      <Reveal>
        <Link to="/calculadora" className={styles.button}>
          Acessar Calculadora
          <IconCalculator size={22} color="#FFFFFF" />
        </Link>
      </Reveal>
    </div>
  );
}
