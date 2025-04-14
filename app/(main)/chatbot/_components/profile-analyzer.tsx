"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileText, User } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

interface ProfileAnalyzerProps {
  onBack: () => void;
  userProfile: {
    resume_content: string;
    cover_letter_content: string;
    skills: string[];
    industry: string;
    experience_years: number;
  };
}

export default function ProfileAnalyzer({
  onBack,
  userProfile,
}: ProfileAnalyzerProps) {
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [isAnalyzingCoverLetter, setIsAnalyzingCoverLetter] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState<string | null>(null);
  const [coverLetterAnalysis, setCoverLetterAnalysis] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("resume");

  const handleAnalyzeResume = async () => {
    if (!userProfile.resume_content) {
      toast.error("No resume available to analyze");
      return;
    }

    setIsAnalyzingResume(true);
    setResumeAnalysis(null);

    try {
      const response = await fetch("http://localhost:5000/api/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_content: userProfile.resume_content,
          target_role: "",
          industry: userProfile.industry,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      const data = await response.json();
      setResumeAnalysis(data.analysis);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast.error("Failed to analyze resume");
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  const handleAnalyzeCoverLetter = async () => {
    if (!userProfile.cover_letter_content) {
      toast.error("No cover letter available to analyze");
      return;
    }

    setIsAnalyzingCoverLetter(true);
    setCoverLetterAnalysis(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/analyze-cover-letter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cover_letter_content: userProfile.cover_letter_content,
            job_description: "",
            company_name: "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze cover letter");
      }

      const data = await response.json();
      setCoverLetterAnalysis(data.analysis);
    } catch (error) {
      console.error("Error analyzing cover letter:", error);
      toast.error("Failed to analyze cover letter");
    } finally {
      setIsAnalyzingCoverLetter(false);
    }
  };

  return (
    <Card className="h-[calc(100vh-200px)] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Profile Analysis
        </CardTitle>
        <CardDescription>
          Get insights on your resume and cover letter
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="px-6 border-b">
            <TabsList className="w-full justify-start h-12 bg-transparent p-0">
              <TabsTrigger
                value="resume"
                className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-2 h-12"
              >
                <FileText className="h-4 w-4 mr-2" />
                Resume Analysis
              </TabsTrigger>
              <TabsTrigger
                value="coverLetter"
                className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-2 h-12"
              >
                <FileText className="h-4 w-4 mr-2" />
                Cover Letter Analysis
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="resume" className="h-[calc(100%-3rem)] p-6 m-0">
            {!userProfile.resume_content ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No Resume Available
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Please upload a resume in the Resume Builder section to get an
                  analysis.
                </p>
              </div>
            ) : !resumeAnalysis ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <FileText className="h-12 w-12 text-primary/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Analyze Your Resume
                </h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Get AI-powered feedback on your resume's strengths and
                  weaknesses, with personalized improvement suggestions.
                </p>
                <Button
                  onClick={handleAnalyzeResume}
                  disabled={isAnalyzingResume}
                  className="gap-1"
                >
                  {isAnalyzingResume ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Analyze Resume
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  <ReactMarkdown
                    className="prose dark:prose-invert prose-sm max-w-none"
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul {...props} className="list-disc pl-6 my-2" />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol {...props} className="list-decimal pl-6 my-2" />
                      ),
                      li: ({ node, ...props }) => (
                        <li {...props} className="my-1" />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          {...props}
                          className="text-base font-semibold mt-4 mb-2"
                        />
                      ),
                      h4: ({ node, ...props }) => (
                        <h4
                          {...props}
                          className="text-sm font-semibold mt-3 mb-1"
                        />
                      ),
                    }}
                  >
                    {resumeAnalysis}
                  </ReactMarkdown>
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent
            value="coverLetter"
            className="h-[calc(100%-3rem)] p-6 m-0"
          >
            {!userProfile.cover_letter_content ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No Cover Letter Available
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Please create a cover letter in the Cover Letter Builder
                  section to get an analysis.
                </p>
              </div>
            ) : !coverLetterAnalysis ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <FileText className="h-12 w-12 text-primary/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Analyze Your Cover Letter
                </h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Get AI-powered feedback on your cover letter's effectiveness,
                  with personalized improvement suggestions.
                </p>
                <Button
                  onClick={handleAnalyzeCoverLetter}
                  disabled={isAnalyzingCoverLetter}
                  className="gap-1"
                >
                  {isAnalyzingCoverLetter ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Analyze Cover Letter
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  <ReactMarkdown
                    className="prose dark:prose-invert prose-sm max-w-none"
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul {...props} className="list-disc pl-6 my-2" />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol {...props} className="list-decimal pl-6 my-2" />
                      ),
                      li: ({ node, ...props }) => (
                        <li {...props} className="my-1" />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          {...props}
                          className="text-base font-semibold mt-4 mb-2"
                        />
                      ),
                      h4: ({ node, ...props }) => (
                        <h4
                          {...props}
                          className="text-sm font-semibold mt-3 mb-1"
                        />
                      ),
                    }}
                  >
                    {coverLetterAnalysis}
                  </ReactMarkdown>
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="border-t p-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </CardFooter>
    </Card>
  );
}
