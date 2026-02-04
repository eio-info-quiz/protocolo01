import { useState, useEffect } from "react";
import { QUIZ_COLORS, QUIZ_FONTS } from "@/constants/quiz";
import VideoPlayer from "@/components/VideoPlayer";
import YouKnewSection from "@/components/YouKnewSection";
import { motion } from "framer-motion";
import { usePixelTrackingV2 } from "@/hooks/usePixelTrackingV2";

export default function Results() {
  const [email, setEmail] = useState("");
  const [showCta, setShowCta] = useState(false);
  const { trackViewContent, trackPurchase } = usePixelTrackingV2();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }

    // Rastrear visualizacao com Redundant Setup (Pixel + API)
    trackViewContent();
  }, [trackViewContent]);

  const handleCtaReady = () => {
    setShowCta(true);
  };

  const handleCtaClick = async () => {
    // Rastrear Purchase com Redundant Setup (Pixel + API com deduplicacao)
    await trackPurchase(47.90, "BRL");
  };

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: QUIZ_COLORS.background }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-16">
        {!showCta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{
                fontFamily: QUIZ_FONTS.primary,
                color: "#4868f6",
              }}
            >
              Seus Resultados
            </h1>
            <p
              className="text-lg md:text-xl mb-8"
              style={{
                fontFamily: QUIZ_FONTS.primary,
                color: "#888888",
              }}
            >
              Baseado nas suas respostas, preparamos um protocolo personalizado para você.
            </p>
          </motion.div>
        )}

        <VideoPlayer onCtaReady={handleCtaReady} />

        {showCta && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-12 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCtaClick}
              className="px-8 py-4 rounded-2xl font-bold text-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg"
              style={{
                fontFamily: QUIZ_FONTS.primary,
              }}
            >
              Acessar Protocolo Completo
            </motion.button>
          </motion.div>
        )}

        <YouKnewSection />
      </div>
    </div>
  );
}
