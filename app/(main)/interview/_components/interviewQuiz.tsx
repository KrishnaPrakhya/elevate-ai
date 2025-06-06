import { getAssessments } from "@/actions/interview";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Brain, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import StatsCards, { assessmentsProps } from "./stats-cards";
import PerformanceChart from "./PerformanceChart";
import QuizList from "./QuizList";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string;
  explanation: string;
  isCorrect: boolean;
}

export interface Assessment {
  id: string;
  userId: string;
  quizScore: number;
  questions: QuizQuestion[];
  category: string;
  improvementTip?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
async function InterviewQuiz() {
  const rawData = await getAssessments();

  // Transform the raw data to ensure correct typing
  const transformedData = rawData.map((assessment) => ({
    ...assessment,
    questions: assessment.questions
      .filter((q): q is Partial<QuizQuestion> => q !== null)
      .map((q) => ({
        id: q.id ?? "",
        question: q.question ?? "",
        options: q.options ?? [],
        correctAnswer: q.correctAnswer ?? "",
        userAnswer: q.userAnswer ?? "",
        explanation: q.explanation ?? "",
        isCorrect: q.isCorrect ?? false,
      })),
  }));
  const assessments: assessmentsProps = { assessments: transformedData };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -z-10"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <PageHeader
              title="Interview Preparation"
              description="Practice and improve your interview skills with AI-powered quizzes"
              size="lg"
              align="left"
            />
          </div>
          <Link href="/interview/mockQuiz">
            <Button size="lg" className="group relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Start New Quiz
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300"></span>
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <StatsCards assessments={assessments.assessments} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <PerformanceChart assessments={assessments.assessments} />
        </div>

        <div className="flex flex-col justify-center">
          <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 p-6 rounded-xl border border-primary/20 h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/20 rounded-full">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Why Practice Matters</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Regular interview practice has been shown to improve confidence
              and performance by up to 70%. Our AI-powered quizzes adapt to your
              industry and skill level.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <p>Personalized questions based on your industry</p>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <p>Detailed explanations to improve understanding</p>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <p>Performance tracking to measure progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <QuizList assessments={assessments.assessments} />
      </div>
    </div>
  );
}

export default InterviewQuiz;
