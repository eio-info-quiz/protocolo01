import { useEffect, useState } from "react";

interface TypingEffectProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

// Velocidade padrão: 400ms por palavra (10 segundos para texto completo - leitura confortável)

export default function TypingEffect({
  text,
  speed = 400,
  onComplete,
}: TypingEffectProps) {
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const words = text.split(" ");
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedWords((prev) => [...prev, words[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <div className="text-center text-lg text-gray-700 leading-relaxed">
      <span className="inline">
        {displayedWords.map((word, index) => (
          <span key={index} className="inline mr-1">
            {word}
          </span>
        ))}
      </span>
      {!isComplete && (
        <span className="inline-block w-2 h-6 ml-1 bg-gray-400 animate-pulse" />
      )}
    </div>
  );
}
