"use client";
import React, { useEffect, useState } from "react";
import { assessmentsProps } from "./stats-cards";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CartesianGrid,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { LineChart } from "recharts";
function PerformanceChart(props: assessmentsProps) {
  const [chartData, setChartData] = useState<any>([]);
  const { assessments } = props;
  useEffect(() => {
    if (assessments) {
      const formattedData = assessments.map((assessment) => ({
        date: format(new Date(assessment.createdAt), "MMM dd"),
        score: assessment.quizScore,
      }));
      setChartData(formattedData);
    }
  }, [assessments]);

  return (
    <div className="mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="gradient-title text-3xl md:text-4xl">
            Performance Trend
          </CardTitle>
          <CardDescription>Your quiz scores over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  content={({
                    active,
                    payload,
                  }: {
                    active?: boolean;
                    payload?: any[];
                  }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <p className="text-sm font-medium">
                            Score: {payload[0].value}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payload[0].payload.date}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PerformanceChart;
