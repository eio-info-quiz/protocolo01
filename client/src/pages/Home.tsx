import { useState } from "react";
import { useLocation } from "wouter";
import { QUIZ_COLORS, QUIZ_FONTS } from "@/constants/quiz";
import { motion } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();
  const [isHoveringCta, setIsHoveringCta] = useState(false);

  const handleStartQuiz = () => {
    setLocation("/quiz");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ backgroundColor: QUIZ_COLORS.background }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663029970056/NkKUYtlmfICmDrqb.webp"
            alt="Mãe e bebê"
            className="w-48 h-48 object-contain mx-auto drop-shadow-lg"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-3"
          style={{
            fontFamily: QUIZ_FONTS.primary,
            color: "#4868f6",
            lineHeight: "1.2",
          }}
        >
          O seu bebê só dorme no peito ou no colo?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg md:text-xl font-medium mb-8"
          style={{
            fontFamily: QUIZ_FONTS.primary,
            color: "#888888",
            lineHeight: "1.4",
          }}
        >
          Responda 5 perguntas e descubra o erro de rotina que está te deixando
          presa a um ciclo de exaustão.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setIsHoveringCta(true)}
          onMouseLeave={() => setIsHoveringCta(false)}
          onClick={handleStartQuiz}
          className="w-full p-5 rounded-2xl font-bold text-lg text-white transition-all duration-300 shadow-lg mb-6 border-2"
          style={{
            fontFamily: QUIZ_FONTS.primary,
            backgroundColor: "#4868f6",
            borderColor: isHoveringCta ? "#4466ff" : "#4868f6",
            boxShadow: isHoveringCta ? "0 0 12px #4466ff60, 0 4px 12px rgba(72, 104, 246, 0.3)" : "0 4px 12px rgba(72, 104, 246, 0.2)",
          }}
        >
          Começar Agora
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-sm md:text-base"
          style={{
            fontFamily: QUIZ_FONTS.secondary,
            color: QUIZ_COLORS.lightText,
          }}
        >
          O método validado por mais de 30 mil mães para fazer o bebê dormir no berço (sem choro).
        </motion.p>
      </motion.div>
    </div>
  );
}
