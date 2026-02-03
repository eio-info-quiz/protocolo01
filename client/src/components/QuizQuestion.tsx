import { QUIZ_COLORS, QUIZ_FONTS } from "@/constants/quiz";
import { motion } from "framer-motion";
import { useState } from "react";

interface QuestionOption {
  value: string;
  label: string;
  emoji?: string;
}

interface QuizQuestionProps {
  question: string;
  options: QuestionOption[];
  onSelect: (value: string) => void;
  selectedValue?: string;
}

export default function QuizQuestion({
  question,
  options,
  onSelect,
  selectedValue,
}: QuizQuestionProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md px-4 py-8 flex flex-col items-center justify-center"
    >
      {/* Question */}
      <h2
        className="text-2xl md:text-3xl font-bold mb-8 text-center leading-relaxed"
        style={{
          fontFamily: QUIZ_FONTS.primary,
          color: QUIZ_COLORS.text,
        }}
      >
        {question}
      </h2>

      {/* Options */}
      <div className="space-y-3 w-full">
        {options.map((option, idx) => {
          const isSelected = selectedValue === option.value;
          const isHovered = hoveredOption === option.value;
          
          // Para a pergunta 2 (emojis 3D), mostrar apenas o emoji
          const isEmojiQuestion = question.includes("Quantas vezes");
          
          return (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setHoveredOption(option.value)}
              onMouseLeave={() => setHoveredOption(null)}
              onClick={() => onSelect(option.value)}
              className={`w-full p-4 rounded-2xl font-semibold border-2 touch-manipulation flex flex-col items-center justify-center ${
                isEmojiQuestion ? "min-h-24" : ""
              }`}
              style={{
                fontFamily: QUIZ_FONTS.secondary,
                backgroundColor: isSelected
                  ? QUIZ_COLORS.primary
                  : QUIZ_COLORS.background,
                borderColor: isHovered
                  ? "#4466ff"
                  : isSelected
                  ? QUIZ_COLORS.primary
                  : QUIZ_COLORS.border,
                color: isSelected
                  ? "#FFFFFF"
                  : QUIZ_COLORS.text,
                boxShadow: isSelected
                  ? `0 8px 16px ${QUIZ_COLORS.primary}40`
                  : isHovered
                  ? "0 4px 12px #4466ff40"
                  : "none",
                transition: "all 0.2s ease",
              }}
            >
              {isEmojiQuestion && option.emoji ? (
                <div className="flex flex-col items-center gap-2">
                  <span
                    className="text-5xl"
                    style={{
                      filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))",
                      textShadow: "0 3px 6px rgba(0,0,0,0.25)",
                    }}
                  >
                    {option.emoji}
                  </span>
                  <span className="text-sm text-center">{option.label}</span>
                </div>
              ) : (
                <span className="text-center">{option.label}</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
