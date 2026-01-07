import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, Star, Zap, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  xp: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: "trophy" | "star" | "zap";
  unlocked: boolean;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the main purpose of an Operating System?",
    options: [
      "To play games",
      "To manage hardware and software resources",
      "To browse the internet",
      "To create documents",
    ],
    correctAnswer: 1,
    explanation: "The OS manages hardware resources and provides services for application software.",
    difficulty: "easy",
    xp: 10,
  },
  {
    id: 2,
    question: "Which scheduling algorithm executes processes in the order they arrive?",
    options: ["Round Robin", "SJF", "FCFS", "Priority Scheduling"],
    correctAnswer: 2,
    explanation: "FCFS (First-Come First-Served) executes processes in arrival order.",
    difficulty: "easy",
    xp: 10,
  },
  {
    id: 3,
    question: "What does LRU stand for in page replacement?",
    options: [
      "Last Recently Used",
      "Least Recently Used",
      "Least Running Used",
      "Last Running Updated",
    ],
    correctAnswer: 1,
    explanation: "LRU replaces the page that hasn't been used for the longest time.",
    difficulty: "easy",
    xp: 10,
  },
  {
    id: 4,
    question: "What is a deadlock?",
    options: [
      "A fast process",
      "A situation where processes wait indefinitely for resources",
      "A type of memory",
      "A scheduling algorithm",
    ],
    correctAnswer: 1,
    explanation: "Deadlock occurs when processes are stuck waiting for resources held by each other.",
    difficulty: "medium",
    xp: 20,
  },
  {
    id: 5,
    question: "Which of the following is NOT a necessary condition for deadlock?",
    options: [
      "Mutual Exclusion",
      "Hold and Wait",
      "Preemption",
      "Circular Wait",
    ],
    correctAnswer: 2,
    explanation: "The four conditions are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.",
    difficulty: "medium",
    xp: 20,
  },
  {
    id: 6,
    question: "What is virtual memory?",
    options: [
      "Memory on the cloud",
      "A technique that uses disk space as RAM extension",
      "Memory for virtual machines only",
      "Cache memory",
    ],
    correctAnswer: 1,
    explanation: "Virtual memory extends RAM by using disk space, allowing larger programs to run.",
    difficulty: "medium",
    xp: 20,
  },
  {
    id: 7,
    question: "What is thrashing in operating systems?",
    options: [
      "A fast disk operation",
      "Excessive page faults causing performance degradation",
      "A type of scheduling",
      "Memory cleanup process",
    ],
    correctAnswer: 1,
    explanation: "Thrashing occurs when the system spends more time swapping pages than executing.",
    difficulty: "hard",
    xp: 30,
  },
  {
    id: 8,
    question: "What is the time complexity of the Banker's algorithm?",
    options: ["O(n)", "O(n²)", "O(n² × m)", "O(log n)"],
    correctAnswer: 2,
    explanation: "Banker's algorithm has O(n² × m) complexity where n is processes and m is resources.",
    difficulty: "hard",
    xp: 30,
  },
  {
    id: 9,
    question: "In FCFS, what is the convoy effect?",
    options: [
      "Processes running in parallel",
      "Short processes waiting behind long processes",
      "Memory fragmentation",
      "CPU overheating",
    ],
    correctAnswer: 1,
    explanation: "Convoy effect occurs when small processes wait behind a large CPU-bound process.",
    difficulty: "medium",
    xp: 20,
  },
  {
    id: 10,
    question: "What is the working set of a process?",
    options: [
      "All pages in memory",
      "Pages referenced in a time window",
      "The process code segment",
      "Available disk space",
    ],
    correctAnswer: 1,
    explanation: "Working set is the set of pages a process has referenced within a recent time period.",
    difficulty: "hard",
    xp: 30,
  },
];

const OSQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: "first", name: "First Steps", description: "Answer your first question", icon: "star", unlocked: false },
    { id: "streak3", name: "On Fire", description: "Get 3 correct answers in a row", icon: "zap", unlocked: false },
    { id: "perfect", name: "OS Master", description: "Score 100% on the quiz", icon: "trophy", unlocked: false },
  ]);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const unlockAchievement = (id: string) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, unlocked: true } : a))
    );
    const achievement = achievements.find((a) => a.id === id);
    if (achievement && !achievement.unlocked) {
      setShowAchievement(achievement);
      toast.success(`Achievement Unlocked: ${achievement.name}!`, {
        description: achievement.description,
      });
      setTimeout(() => setShowAchievement(null), 3000);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    const isCorrect = answerIndex === question.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setXp((prev) => prev + question.xp);
      setStreak((prev) => prev + 1);

      // Check achievements
      if (currentQuestion === 0) {
        unlockAchievement("first");
      }
      if (streak + 1 >= 3) {
        unlockAchievement("streak3");
      }
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizComplete(true);
      if (score + (selectedAnswer === question.correctAnswer ? 1 : 0) === questions.length) {
        unlockAchievement("perfect");
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setXp(0);
    setStreak(0);
    setQuizComplete(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400 bg-green-400/20";
      case "medium":
        return "text-yellow-400 bg-yellow-400/20";
      case "hard":
        return "text-destructive bg-destructive/20";
      default:
        return "text-muted-foreground";
    }
  };

  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case "trophy":
        return Trophy;
      case "star":
        return Star;
      case "zap":
        return Zap;
      default:
        return Star;
    }
  };

  if (quizComplete) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center p-8 max-w-lg">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neon-purple/20 flex items-center justify-center">
            <Trophy className="w-12 h-12 text-neon-purple" />
          </div>

          <h1 className="font-orbitron text-4xl font-bold text-foreground mb-4">
            Quiz Complete!
          </h1>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-lg border border-primary/50 bg-card/50">
              <div className="text-3xl font-orbitron text-primary">{score}/{questions.length}</div>
              <div className="text-xs text-muted-foreground uppercase">Correct</div>
            </div>
            <div className="p-4 rounded-lg border border-neon-purple/50 bg-card/50">
              <div className="text-3xl font-orbitron text-neon-purple">{xp} XP</div>
              <div className="text-xs text-muted-foreground uppercase">Earned</div>
            </div>
          </div>

          <div className="mb-8">
            <div className="text-6xl font-orbitron text-foreground mb-2">
              {percentage.toFixed(0)}%
            </div>
            <div className="text-muted-foreground">
              {percentage >= 80
                ? "Outstanding!"
                : percentage >= 60
                ? "Good job!"
                : "Keep practicing!"}
            </div>
          </div>

          {/* Achievements */}
          <div className="flex justify-center gap-4 mb-8">
            {achievements.map((achievement) => {
              const Icon = getAchievementIcon(achievement.icon);
              return (
                <div
                  key={achievement.id}
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${
                    achievement.unlocked
                      ? "border-neon-purple bg-neon-purple/20 box-glow-purple"
                      : "border-border bg-muted/50 opacity-40"
                  }`}
                  title={`${achievement.name}: ${achievement.description}`}
                >
                  <Icon className={`w-8 h-8 ${achievement.unlocked ? "text-neon-purple" : "text-muted-foreground"}`} />
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-neon-purple text-white font-orbitron text-sm uppercase tracking-wider hover:opacity-90 transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
            <Link
              to="/"
              className="px-6 py-3 rounded-lg border border-muted-foreground text-muted-foreground font-orbitron text-sm uppercase tracking-wider hover:bg-muted transition-all"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 rounded-lg border border-neon-purple/50 text-neon-purple hover:bg-neon-purple hover:text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-orbitron text-2xl font-bold text-neon-purple">
                OS Quiz
              </h1>
              <p className="text-muted-foreground text-sm">
                Test your knowledge
              </p>
            </div>
          </div>

          {/* XP & Streak */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/50">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-orbitron text-sm text-primary">{xp} XP</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/50">
                <span className="text-orange-400">🔥</span>
                <span className="font-orbitron text-sm text-orange-400">{streak}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span className={`px-2 py-0.5 rounded text-xs ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty.toUpperCase()} • +{question.xp} XP
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-neon-purple transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm mb-6">
          <h2 className="font-orbitron text-xl text-foreground mb-6">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === question.correctAnswer;
              const showResult = isAnswered;

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl border text-left transition-all duration-300 flex items-center gap-4 ${
                    showResult
                      ? isCorrect
                        ? "border-green-500 bg-green-500/20 text-green-400"
                        : isSelected
                        ? "border-destructive bg-destructive/20 text-destructive"
                        : "border-border bg-muted/50 text-muted-foreground"
                      : isSelected
                      ? "border-neon-purple bg-neon-purple/20 text-foreground"
                      : "border-border bg-muted/50 text-foreground hover:border-neon-purple/50 hover:bg-neon-purple/10"
                  }`}
                >
                  <span className="w-8 h-8 rounded-full border border-current flex items-center justify-center text-sm font-orbitron">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div className="mt-6 p-4 rounded-lg bg-muted border border-border">
              <div className="text-sm text-muted-foreground mb-1">Explanation:</div>
              <div className="text-foreground">{question.explanation}</div>
            </div>
          )}
        </div>

        {/* Next button */}
        {isAnswered && (
          <button
            onClick={nextQuestion}
            className="w-full py-4 rounded-xl bg-neon-purple text-white font-orbitron text-sm uppercase tracking-wider hover:opacity-90 transition-all box-glow-purple"
          >
            {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
          </button>
        )}
      </div>

      {/* Achievement popup */}
      {showAchievement && (
        <div className="fixed bottom-8 right-8 p-4 rounded-xl border border-neon-purple bg-card/95 backdrop-blur-sm box-glow-purple animate-fade-in">
          <div className="flex items-center gap-3">
            {(() => {
              const Icon = getAchievementIcon(showAchievement.icon);
              return <Icon className="w-8 h-8 text-neon-purple" />;
            })()}
            <div>
              <div className="font-orbitron text-sm text-neon-purple">
                Achievement Unlocked!
              </div>
              <div className="text-foreground font-semibold">
                {showAchievement.name}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OSQuiz;
