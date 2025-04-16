import { getDashboardInsights } from "@/actions/dashboard";
import { getOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";
import DashBoardView from "./_components/DashBoardView";

async function Page() {
  const { isOnBoardingStatus } = await getOnboardingStatus();
  if (!isOnBoardingStatus) redirect("/onboarding");
  const insights = await getDashboardInsights();
  return (
    <div className="container mx-auto">
      <DashBoardView insights={insights} />
    </div>
  );
}

export default Page;
