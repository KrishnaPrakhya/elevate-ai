import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Quiz from "../_components/Quiz";
import { PageHeader } from "@/components/page-header";

export default function MockInterviewPage() {
  return (
    <div className="container mx-auto space-y-4 py-6">
      <div className="flex flex-col space-y-2 mx-2">
        <div>
          <div>
            <Link href="/interview">
              <Button variant="link" className="gap-2 pl-0">
                <ArrowLeft className="h-4 w-4" />
                Back to Interview Preparation
              </Button>
            </Link>
          </div>
          <div>
            <PageHeader title="Mock Interview Quiz" size="lg" />
          </div>
          <p className="text-muted-foreground">
            Test your knowledge with industry-specific questions
          </p>
        </div>
      </div>

      <Quiz />
    </div>
  );
}
