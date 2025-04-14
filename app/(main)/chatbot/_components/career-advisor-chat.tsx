"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  FileText,
  Sparkles,
  Send,
  Loader2,
  Calendar,
  BarChart,
  User,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
// import CareerPlanGenerator from "./career-plan-generator";
// import ProfileAnalyzer from "./profile-analyzer";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CareerAdvisorChatProps {
  userProfile: {
    resume_content: string;
    cover_letter_content: string;
    skills: string[];
    industry: string;
    experience_years: number;
  };
}

export default function CareerAdvisorChat({
  userProfile,
}: CareerAdvisorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Career Advisor. I can help with career guidance, job search, resume feedback, and creating a career development plan. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize user data
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/initialize-user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userProfile),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to initialize user data");
        }

        const data = await response.json();
        console.log("User data initialized:", data);
      } catch (error) {
        console.error("Error initializing user data:", error);
      }
    };

    initializeUser();
  }, [userProfile]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    // Show loading state
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from career advisor");
      }

      const data = await response.json();

      // Add assistant response to chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get response from career advisor");

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, I encountered an error processing your request. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-primary/10">
                <AvatarImage src="/ai-avatar.png" alt="AI" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">Career Advisor</CardTitle>
                <CardDescription>Powered by AI</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-grow overflow-hidden p-0">
            <ScrollArea className="h-full px-4">
              <div className="space-y-4 pt-4 pb-6">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.role === "assistant" ? (
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
                              <ol
                                {...props}
                                className="list-decimal pl-6 my-2"
                              />
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
                            p: ({ node, ...props }) => (
                              <p {...props} className="my-2" />
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <p>{message.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="border-t p-4">
            <div className="flex w-full items-center space-x-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="gap-1"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Tabs defaultValue="tools" className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="info">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="space-y-4 pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Search className="h-4 w-4 text-primary" />
                  Job Search
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-2">
                  Find job opportunities based on your skills and preferences
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setActiveTab("jobSearch")}
                >
                  Search Jobs
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Career Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-2">
                  Generate a personalized career development plan
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setActiveTab("careerPlan")}
                >
                  Create Plan
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Profile Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-2">
                  Get insights on your resume and career profile
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setActiveTab("profileAnalysis")}
                >
                  Analyze Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium">Industry</p>
                    <p className="text-sm">
                      {userProfile.industry || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium">Experience</p>
                    <p className="text-sm">
                      {userProfile.experience_years || 0} years
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium">Skills</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {userProfile.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {userProfile.skills.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No skills specified
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium">Documents</p>
                    <div className="space-y-1 mt-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm">
                          {userProfile.resume_content
                            ? "Resume uploaded"
                            : "No resume"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm">
                          {userProfile.cover_letter_content
                            ? "Cover letter uploaded"
                            : "No cover letter"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
