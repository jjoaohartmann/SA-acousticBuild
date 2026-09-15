// Glossário sem jargão usado pelos ícones de ajuda da calculadora.
export const GLOSSARIO = {
  R: {
    titulo: 'Isolamento do material (R)',
    texto: 'O quanto a parede sozinha bloqueia de som, medido em laboratório. Quanto maior, melhor.',
    ancora: 'Uma parede de tijolo comum fica perto de 40 dB.',
  },
  Rw: {
    titulo: 'Isolamento do material (Rw)',
    texto: 'O mesmo que o R, mas resumido num único número que representa todas as frequências. É o valor que aparece nos catálogos de fabricante.',
    ancora: 'Drywall com lã de vidro fica perto de 43 dB; concreto de 14 cm passa de 50 dB.',
  },
  DnT: {
    titulo: 'Isolamento real na obra (DnT)',
    texto: 'O isolamento que a parede realmente entrega depois de instalada. Costuma ser diferente do valor de catálogo porque o tamanho e o acabamento do cômodo mudam o resultado.',
    ancora: 'É este valor que a NBR 15575 exige e fiscaliza, não o do catálogo.',
  },
  'DnT,w': {
    titulo: 'Isolamento real na obra (DnT,w)',
    texto: 'O isolamento que a parede entrega instalada, resumido num único número. Quanto maior, melhor.',
    ancora: 'É este valor que a NBR 15575 exige e fiscaliza.',
  },
  LnT: {
    titulo: 'Barulho de passos que chega embaixo (L’nT)',
    texto: 'O nível de ruído que chega no apartamento de baixo quando alguém pisa forte ou derruba algo em cima. Aqui é o contrário: quanto menor, melhor.',
    ancora: 'A NBR 15575 exige no máximo 55 dB entre apartamentos.',
  },
  Lnw: {
    titulo: 'Impacto de laboratório (Ln,w)',
    texto: 'O barulho que chega embaixo quando uma máquina padronizada bate na laje, medido em laboratório e resumido num número só. Como no piso, quanto menor, melhor.',
    ancora: 'Laje de concreto sem tratamento passa de 75 dB; com piso flutuante cai para perto de 55 dB.',
  },
  Ln: {
    titulo: 'Impacto normalizado (L’n)',
    texto: 'O impacto medido no local, ajustado para uma absorção de referência de 10 m², para poder comparar cômodos diferentes. Quanto menor, melhor.',
    ancora: 'Definido pelas ISO 16283-2 e ISO 717-2.',
  },
  L2: {
    titulo: 'Ruído que chega no ambiente (L₂)',
    texto: 'Quanto de barulho sobra do outro lado da parede depois que ela bloqueia parte do som. Quanto menor, melhor.',
    ancora: 'Um dormitório confortável fica em torno de 35 dB.',
  },
  L1: {
    titulo: 'Ruído na origem (L₁)',
    texto: 'O quanto de barulho existe no cômodo vizinho, antes de atravessar a parede.',
    ancora: 'Conversa normal fica perto de 60 dB; TV alta passa de 70 dB.',
  },
  T: {
    titulo: 'Tempo de reverberação (T)',
    texto: 'Quanto tempo o som demora para sumir no cômodo depois que a fonte para. Cômodo vazio e liso "ecoa" mais; com cortina, tapete e sofá, o som some mais rápido.',
    ancora: 'Um quarto mobiliado fica entre 0,4 e 0,6 segundo.',
  },
  A: {
    titulo: 'Absorção do ambiente (A)',
    texto: 'O quanto o cômodo "engole" de som, em vez de devolvê-lo. Depende do tamanho do ambiente e do que tem dentro dele.',
    ancora: 'Calculada pela fórmula de Sabine: A = 0,16 × volume ÷ tempo de reverberação.',
  },
  S: {
    titulo: 'Área do elemento (S)',
    texto: 'O tamanho da parede ou laje que separa os dois ambientes. Quanto maior a área, mais som atravessa.',
    ancora: 'Uma parede de quarto típica tem entre 10 e 15 m².',
  },
  V: {
    titulo: 'Volume do ambiente (V)',
    texto: 'O tamanho do cômodo que recebe o ruído, em metros cúbicos (largura × comprimento × altura).',
    ancora: 'Um quarto de 3 × 4 m com pé-direito de 2,7 m tem cerca de 32 m³.',
  },
  Li: {
    titulo: 'Impacto medido (Li)',
    texto: 'O nível de ruído medido embaixo enquanto uma máquina padronizada bate no piso de cima. É o ensaio oficial de ruído de impacto.',
    ancora: 'Definido pela ISO 16283-2.',
  },
};

