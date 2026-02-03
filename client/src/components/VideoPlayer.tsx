import { useState, useEffect, useRef } from "react";
import { QUIZ_COLORS, QUIZ_FONTS } from "@/constants/quiz";
import { motion } from "framer-motion";

interface VideoPlayerProps {
  videoUrl?: string;
  onCtaReady: () => void;
  isVertical?: boolean;
}

declare global {
  interface Window {
    Vimeo?: any;
  }
}

export default function VideoPlayer({ videoUrl, onCtaReady, isVertical = false }: VideoPlayerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [fakeProgress, setFakeProgress] = useState(0);
  const [isCtaVisible, setIsCtaVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const vimeoPlayerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateFakeProgress = (currentTime: number, duration: number) => {
    if (duration === 0) return 0;
    
    const progress = currentTime / duration; // 0 to 1
    
    if (progress < 0.3) {
      // First 30% of video: bar rises to 50% quickly
      return (progress / 0.3) * 0.5;
    } else if (progress < 0.7) {
      // Middle of video: rises from 50% to 80% slowly
      return 0.5 + ((progress - 0.3) / 0.4) * 0.3;
    } else {
      // End of video: rises from 80% to 100%
      return 0.8 + ((progress - 0.7) / 0.3) * 0.2;
    }
  };

  // Initialize Vimeo player
  useEffect(() => {
    if (isVertical && iframeRef.current) {
      // Load Vimeo Player API
      if (!window.Vimeo) {
        const script = document.createElement("script");
        script.src = "https://player.vimeo.com/api/player.js";
        script.async = true;
        document.body.appendChild(script);
        
        script.onload = () => {
          if (window.Vimeo) {
            initVimeoPlayer();
          }
        };
      } else {
        initVimeoPlayer();
      }
    }
  }, [isVertical]);

  const initVimeoPlayer = () => {
    if (iframeRef.current && window.Vimeo) {
      try {
        const player = new window.Vimeo.Player(iframeRef.current);
        vimeoPlayerRef.current = player;

        player.on("timeupdate", (data: any) => {
          const currentTime = data.seconds;
          setElapsedTime(Math.floor(currentTime));
          
          // Calculate and update fake progress
          const progress = calculateFakeProgress(currentTime, data.duration);
          setFakeProgress(progress);
        });

        player.on("ended", () => {
          if (!isCtaVisible) {
            setIsCtaVisible(true);
            onCtaReady();
          }
        });
      } catch (error) {
        console.error("Error initializing Vimeo player:", error);
      }
    }
  };

  useEffect(() => {
    if (!isVertical) {
      intervalRef.current = setInterval(() => {
        if (videoRef.current) {
          const currentTime = videoRef.current.currentTime;
          const duration = videoRef.current.duration;
          setElapsedTime(Math.floor(currentTime));
          const progress = calculateFakeProgress(currentTime, duration);
          setFakeProgress(progress);

          // Check if video has ended
          if (videoRef.current.ended && !isCtaVisible) {
            setIsCtaVisible(true);
            onCtaReady();
          }
        }
      }, 100);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isCtaVisible, isVertical]);

  useEffect(() => {
    if (isCtaVisible) {
      onCtaReady();
    }
  }, [isCtaVisible, onCtaReady]);

  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  return (
    <div className="w-full">
      <div className={`relative bg-black rounded-2xl overflow-hidden mb-6 ${isVertical ? 'flex justify-center' : ''}`}>
        {videoUrl ? (
          <>
            {isVertical ? (
              // Vimeo iframe for vertical format
              <div className="relative w-full max-w-sm mx-auto" style={{ aspectRatio: "9/16" }}>
                <iframe
                  ref={iframeRef}
                  src={videoUrl}
                  className="w-full h-full rounded-2xl"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="VSL"
                />
                
                {/* Fake Progress Bar for Vimeo */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 bg-opacity-50 rounded-b-2xl">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-b-2xl"
                    initial={{ width: "0%" }}
                    animate={{ width: `${fakeProgress * 100}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              </div>
            ) : (
              // Regular video for horizontal format
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  autoPlay

                  className="w-full h-auto max-h-96"
                  style={{ aspectRatio: "16/9" }}
                />
                
                {/* Fake Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 bg-opacity-50">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                    initial={{ width: "0%" }}
                    animate={{ width: `${fakeProgress * 100}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              </>
            )}

            {/* Time indicator - only for non-vertical */}
            {!isVertical && (
              <div
                className="absolute bottom-4 right-4 bg-black bg-opacity-70 px-3 py-1 rounded-full text-white text-sm"
                style={{ fontFamily: QUIZ_FONTS.secondary }}
              >
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
            )}
          </>
        ) : (
          <div
            className="w-full h-96 flex items-center justify-center text-white text-center"
            style={{ backgroundColor: QUIZ_COLORS.text }}
          >
            <div>
              <p
                style={{
                  fontFamily: QUIZ_FONTS.primary,
                  fontSize: "18px",
                }}
              >
                Vídeo será aqui
              </p>
              <p
                style={{
                  fontFamily: QUIZ_FONTS.secondary,
                  fontSize: "14px",
                  marginTop: "8px",
                }}
              >
                Hospede seu vídeo no Vimeo ou Supabase
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Loading message while video is playing */}
      {!isCtaVisible && isVertical && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-6 text-center"
        >
          <p
            className="text-lg"
            style={{
              fontFamily: QUIZ_FONTS.secondary,
              color: QUIZ_COLORS.lightText,
            }}
          >
            Aguarde o término do vídeo... ⏳
          </p>
        </motion.div>
      )}
    </div>
  );
}
