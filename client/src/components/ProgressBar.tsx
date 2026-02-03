import { QUIZ_COLORS } from "@/constants/quiz";
import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div
      className="w-full px-4 py-6"
      style={{ backgroundColor: QUIZ_COLORS.background }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Percentage Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-3"
        >
          <p
            className="text-sm font-semibold"
            style={{ color: QUIZ_COLORS.text }}
          >
            {percentage}%
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: QUIZ_COLORS.border }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: QUIZ_COLORS.primary }}
          />
        </div>
      </div>
    </div>
  );
}
