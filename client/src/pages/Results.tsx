import { useState, useCallback, useMemo } from "react";
import { QUIZ_COLORS, QUIZ_FONTS } from "@/constants/quiz";
import VideoPlayer from "@/components/VideoPlayer";
import YouKnewSection from "@/components/YouKnewSection";
import { motion } from "framer-motion";

const STYLES = {
  primaryText: {
    fontFamily: QUIZ_FONTS.primary,
    color: "#4868f6",
  },
  secondaryText: {
    fontFamily: QUIZ_FONTS.secondary,
    color: QUIZ_COLORS.text,
  },
  accentText: {
    color: "#22c55e",
  },
  mutedText: {
    color: "#666",
  },
  lightText: {
    color: "#999",
  },
} as const;

export default function Results() {
  const [showCta, setShowCta] = useState(false);

  const handleCtaReady = useCallback(() => {
    setShowCta(true);
  }, []);

  const paymentImageUrl = useMemo(() => 
    "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029970056/rSYOXPvggmmPhFxs.webp",
    []
  );

  const testimonialImageUrl = useMemo(() => 
    "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029970056/baecVWdpacOPDLjq.webp",
    []
  );

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: QUIZ_COLORS.background }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-16">
        {!showCta && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 text-center"
          >
            <p
              className="text-lg md:text-xl leading-relaxed"
              style={STYLES.secondaryText}
            >
              Assista abaixo ao{" "}
              <span style={{ color: "#4868f6", fontWeight: "600" }}>
                passo a passo validado
              </span>{" "}
              por milhares de mães para recuperar suas noites e conquistar a{" "}
              <span style={{ color: "#4868f6", fontWeight: "600" }}>
                autonomia de sono
              </span>{" "}
              do seu bebê.
            </p>
          </motion.div>
        )}

        {!showCta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <VideoPlayer 
              videoUrl="https://player.vimeo.com/video/1159249817?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1"
              onCtaReady={handleCtaReady}
              isVertical={true}
            />
          </motion.div>
        )}

        {showCta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-4 md:mb-6"
            >
              <div className="flex items-center justify-center gap-4 md:gap-6">
                <span className="text-2xl md:text-4xl flex-shrink-0">🎉</span>
                <h1
                  className="text-3xl md:text-5xl font-black text-center flex-1"
                  style={{
                    fontFamily: QUIZ_FONTS.primary,
                    color: "#4868f6",
                    lineHeight: "1.1",
                  }}
                >
                  Seu acesso foi liberado!
                </h1>
                <span className="text-2xl md:text-4xl flex-shrink-0">🎉</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-4 md:mb-6 text-center"
            >
              <p
                className="text-center text-lg md:text-xl font-semibold mb-3"
                style={STYLES.primaryText}
              >
                Valor Original:
              </p>
              <p
                className="text-center text-xl md:text-2xl font-bold mb-4"
                style={{
                  ...STYLES.mutedText,
                  textDecoration: "line-through",
                  fontWeight: "600",
                }}
              >
                R$ 297,90
              </p>
              <div className="text-center">
                <p
                  className="text-lg md:text-2xl font-bold mb-1 md:mb-2 inline-block px-3 py-1 rounded"
                  style={{
                    fontFamily: QUIZ_FONTS.primary,
                    color: "white",
                    backgroundColor: "#4868f6",
                  }}
                >
                  Hoje por apenas:
                </p>
                <p
                  className="text-2xl md:text-4xl font-black mt-2 md:mt-3"
                  style={{
                    fontFamily: QUIZ_FONTS.primary,
                    ...STYLES.accentText,
                    lineHeight: "1.1",
                  }}
                >
                  R$ 47,90 à vista
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-4 md:mb-6"
            >
              <style>{`
                @keyframes pulse-glow {
                  0%, 100% {
                    opacity: 1;
                    box-shadow: 0 0 20px rgba(34, 197, 94, 0.5), 0 0 40px rgba(34, 197, 94, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.2);
                  }
                  50% {
                    opacity: 0.95;
                    box-shadow: 0 0 30px rgba(34, 197, 94, 0.7), 0 0 60px rgba(34, 197, 94, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.3);
                  }
                }
                .pulse-button {
                  animation: pulse-glow 2s ease-in-out infinite;
                }
              `}</style>
              <a
                href="https://pay.hotmart.com/J103234260Q?checkoutMode=10"
                target="_blank"
                rel="noopener noreferrer"
                className="pulse-button block w-full p-4 md:p-6 rounded-2xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 no-underline"
                style={{
                  fontFamily: QUIZ_FONTS.primary,
                  backgroundColor: "#25D366",
                  color: "white",
                }}
              >
                <div className="text-lg md:text-2xl font-black mb-1 md:mb-2 leading-tight text-center">
                  QUERO MEU ACESSO AGORA
                </div>
                <div
                  className="text-xs md:text-base font-semibold text-center"
                  style={{
                    opacity: 0.95,
                  }}
                >
                  Oferta Única: R$ 47,90 + Bônus Gratis
                </div>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mb-4 md:mb-6 px-2"
            >
              <p
                className="text-xs md:text-base leading-relaxed mb-4"
                style={STYLES.secondaryText}
              >
                Compra Segura • Acesso Imediato • Garantia de 7 dias
              </p>
              
              <div className="flex justify-center items-center mt-4">
                <img 
                  src={paymentImageUrl}
                  alt="Métodos de pagamento" 
                  className="h-12 md:h-16 object-contain"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {showCta && (
        <YouKnewSection imageUrls={[testimonialImageUrl]} />
      )}

      {showCta && (
        <footer className="mt-4 md:mt-6 py-4 md:py-6 border-t border-gray-200">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p
              className="text-xs md:text-sm leading-relaxed mb-4"
              style={STYLES.lightText}
            >
              Feito para mamães que merecem descanso ❤️
            </p>
            <p
              className="text-xs md:text-sm"
              style={{
                ...STYLES.secondaryText,
                color: "#bbb",
              }}
            >
              © 2025 Protocolo Neonatal. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
