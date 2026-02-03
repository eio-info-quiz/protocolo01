import { motion } from "framer-motion";
import { QUIZ_COLORS, QUIZ_FONTS, YOU_KNEW_SECTION } from "@/constants/quiz";

interface YouKnewSectionProps {
  imageUrls?: string[];
}

export default function YouKnewSection({ imageUrls = [] }: YouKnewSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full px-4 py-6 md:py-8"
      style={{ backgroundColor: QUIZ_COLORS.accent + "20" }}
    >
      <div className="max-w-2xl mx-auto">
        <h3
          className="text-2xl md:text-3xl font-bold mb-4 text-center"
          style={{
            fontFamily: QUIZ_FONTS.primary,
            color: QUIZ_COLORS.text,
          }}
        >
          {YOU_KNEW_SECTION.title}
        </h3>

        <p
          className="text-lg text-center mb-8"
          style={{
            fontFamily: QUIZ_FONTS.secondary,
            color: QUIZ_COLORS.text,
            lineHeight: "1.6",
          }}
        >
          {YOU_KNEW_SECTION.description}
        </p>

        {imageUrls.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {imageUrls.map((url, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="rounded-2xl overflow-hidden shadow-lg"
              >
                <img
                  src={url}
                  alt={`Reportagem ${idx + 1}`}
                  className="w-full h-auto min-h-48 md:h-56 lg:h-64 object-contain hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        )}

        {imageUrls.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="rounded-2xl h-48 flex items-center justify-center"
                style={{ backgroundColor: QUIZ_COLORS.border }}
              >
                <p
                  className="text-center text-sm"
                  style={{
                    fontFamily: QUIZ_FONTS.secondary,
                    color: QUIZ_COLORS.lightText,
                  }}
                >
                  Imagem {idx}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
