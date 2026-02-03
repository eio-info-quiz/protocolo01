/**
 * Quiz configuration and constants
 */

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Qual a idade do seu bebê?",
    type: "single-choice",
    options: [
      { value: "0-3 months", label: "0-3 meses (Fase de exterogestação)" },
      { value: "4-6 months", label: "4-6 meses (Fase das regressões)" },
      { value: "6-12 months", label: "6-12 meses (Fase da ansiedade de separação)" },
      { value: "1+ years", label: "Acima de 1 ano" },
    ],
  },
  {
    id: 2,
    question: "Quantas vezes seu bebê acorda à noite?",
    type: "single-choice",
    options: [
      { value: "1-3 times", label: "1 a 3 vezes", emoji: "😞" },
      { value: "3-5 times", label: "3 a 5 vezes", emoji: "😰" },
      { value: "many_times", label: "Já Perdi as contas", emoji: "🤯" },
    ],
  },
  {
    id: 3,
    question: "Como seu bebê costuma adormecer na maioria das vezes?",
    type: "single-choice",
    options: [
      { value: "nursing", label: "Mamando (Peito ou mamadeira)" },
      { value: "rocking", label: "Sendo balançado/No colo" },
      { value: "crib_alone", label: "Sozinho no berço (mas acorda logo em seguida)" },
    ],
  },
  {
    id: 4,
    question: "Seu bebê tem uma rotina de sono estabelecida?",
    type: "single-choice",
    options: [
      { value: "somewhat", label: "Mais ou menos" },
      { value: "no", label: "Não, nenhuma rotina" },
      { value: "trying", label: "Estou tentando criar" },
    ],
  },
  {
    id: 5,
    question: "Você sente que o cansaço tem afetado?",
    type: "single-choice",
    options: [
      { value: "patience", label: "Sua paciência e humor" },
      { value: "relationship", label: "Seu relacionamento" },
      { value: "energy", label: "Sua energia durante o dia" },
      { value: "bonding", label: "Seu vínculo com o bebê" },
    ],
  },
  {
    id: 6,
    question: "Já tentou outros métodos para melhorar o sono do seu bebê?",
    type: "single-choice",
    options: [
      { value: "yes_few", label: "Sim, alguns métodos" },
      { value: "no", label: "Não, é a primeira vez" },
      { value: "considering", label: "Estou pesquisando opções" },
    ],
  },
];

export const QUIZ_COLORS = {
  primary: "#B8E5F5", // Azul bebê
  secondary: "#F5B8D8", // Rosa suave
  accent: "#E8D5F2", // Lavanda
  background: "#FFFFFF",
  text: "#2D3436",
  lightText: "#636E72",
  border: "#DFE6E9",
};

export const QUIZ_FONTS = {
  primary: "Poppins, sans-serif",
  secondary: "Nunito, sans-serif",
};

// Delay for CTA button to appear (in seconds)
export const CTA_DELAY = 180; // 3 minutes

// Video player configuration
export const VIDEO_CONFIG = {
  autoplay: false,
  controls: true,
  muted: false,
  width: "100%",
  height: "auto",
};

// You Knew section
export const YOU_KNEW_SECTION = {
  title: "Você Sabia!",
  description: "A falta de sono de qualidade pode afetar não só o bebê, mas também a saúde física e emocional da mãe e até o relacionamento do casal.",
};
