import { LineChart, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

interface Props {
  insights: any;
}

function DashBoardView(props: Props) {
  const { insights } = props;
  const salaryData = insights.salaryRanges.map((range: any) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));
  const getDemandColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  const getMarketOutlookInfo = (outlook: string) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };
  return <div>Dashboard View</div>;
}

export default DashBoardView;
