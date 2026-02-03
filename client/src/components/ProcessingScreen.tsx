import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

interface ProcessingScreenProps {
  onComplete?: () => void;
}

export default function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Aguardar 3 segundos e depois avançar para a página de resultados
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        setLocation("/results");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [setLocation, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-baby-blue-light to-white px-4">
      <div className="text-center">
        {/* Spinner animado */}
        <motion.div
          className="flex justify-center mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-baby-blue border-t-blue-600 rounded-full" />
        </motion.div>

        {/* Texto principal */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2"
        >
          Analisando suas respostas...
        </motion.h2>

        {/* Pontos animados */}
        <motion.div
          className="flex justify-center gap-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-baby-blue rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
