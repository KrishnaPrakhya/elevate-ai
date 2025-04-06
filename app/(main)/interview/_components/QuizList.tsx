"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
import { assessmentsProps } from "./stats-cards";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizResult from "./quiz-result";

function QuizList(assessments: assessmentsProps) {
  const assessmentsReview = assessments.assessments;
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  return (
    <div className="mt-4">
      <Card>
        <CardHeader className="flex flex-col">
          <div className="w-full flex justify-between">
            <div className="">
              <CardTitle>Recent Quizzes</CardTitle>
              <CardDescription>
                Review Your past quiz Performance
              </CardDescription>
            </div>
            <div>
              <Button onClick={() => router.push("/interview/mockQuiz")}>
                Start New Quiz
              </Button>
            </div>
          </div>
          <div className="">
            <CardContent className="">
              {assessmentsReview.map((item, index) => (
                <Card
                  key={item.id}
                  onClick={() => setSelectedQuiz(item)}
                  className="mt-4 cursor-pointer transition-colors hover:bg-muted/50 "
                >
                  <div className="flex justify-between mt-4">
                    <div className="flex">
                      <CardHeader>
                        <CardTitle>Quiz {index + 1}</CardTitle>
                        <CardDescription>
                          Score: {item.quizScore}
                        </CardDescription>
                      </CardHeader>
                    </div>
                    <div>
                      <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <CardContent>
                    <p>{item.improvementTip}</p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </div>
        </CardHeader>
      </Card>
      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <QuizResult
            result={selectedQuiz}
            onStartNew={() => router.push("/interview/mock")}
            hideStartNew
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default QuizList;
