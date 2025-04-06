import { generateQuiz, getAssessments } from "@/actions/interview";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import PerformanceChart from "./_components/PerformanceChart";
import QuizResult from "./_components/quiz-result";
import QuizList from "./_components/QuizList";
import StatCard from "@/components/LandingPage/stat-card";
import StatsCards from "./_components/stats-cards";

interface Props {}

async function Page(props: Props) {
  const {} = props;
  const assessments = await getAssessments();
  console.log(assessments);
  return (
    <div>
      <div>
        <PageHeader title="Interview Preparation" size="lg" />
        {/* <Link href={"/interview/mockQuiz"}>Start Quiz</Link> */}
      </div>
      <div>
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}

export default Page;
