import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import { QUIZ_QUESTIONS, QUIZ_COLORS, QUIZ_FONTS } from "@/constants/quiz";
import ProgressBar from "@/components/ProgressBar";
import QuizQuestion from "@/components/QuizQuestion";
import ProcessingScreen from "@/components/ProcessingScreen";
import BackButton from "@/components/BackButton";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface QuizAnswers {
  [key: number]: string;
}

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const submitQuizMutation = trpc.quiz.submitResponse.useMutation();

  const handleSelectAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: value,
    });

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleSubmitQuiz({
          babyAge: answers[0] || "",
          wakeUps: answers[1] || "",
          sleepMethod: answers[2] || "",
          hasRoutine: answers[3] || "",
          motherFeeling: answers[4] || "",
          triedOtherMethods: answers[5] || "",
        });
      }
    }, 300);
  };

  const handleSubmitQuiz = async (finalAnswers: any) => {
    setIsProcessing(true);

    try {
      const response = await submitQuizMutation.mutateAsync({
        email: `lead-${Date.now()}@quiz.local`,
        name: undefined,
        babyAge: finalAnswers.babyAge,
        wakeUps: finalAnswers.wakeUps,
        sleepMethod: finalAnswers.sleepMethod,
        hasRoutine: finalAnswers.hasRoutine,
        motherFeeling: finalAnswers.motherFeeling,
        triedOtherMethods: finalAnswers.triedOtherMethods || "",
      });

      if (response.success) {
        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Redirect to results page using Wouter for SPA navigation
        setLocation("/results");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Erro ao enviar suas respostas. Tente novamente.");
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return <ProcessingScreen />;
  }

  const currentQuestionData = QUIZ_QUESTIONS[currentQuestion];

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: QUIZ_COLORS.background }}
    >
      <BackButton />
      <ProgressBar current={currentQuestion + 1} total={QUIZ_QUESTIONS.length} />

      <div className="flex-1 flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          <QuizQuestion
            key={currentQuestion}
            question={currentQuestionData.question}
            options={currentQuestionData.options}
            onSelect={handleSelectAnswer}
            selectedValue={answers[currentQuestion]}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
