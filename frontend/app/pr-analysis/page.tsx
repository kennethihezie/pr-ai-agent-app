"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UrlForm } from "@/components/url-form";
import { LoadingAnimation } from "@/components/loading-animation";
import { ResultContainer } from "@/components/result-container";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { analyzePr } from "@/lib/services/api";

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState("");

  const handleLogout = async () => {
    try {
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSubmit = async (submittedUrl: string) => {    
    setUrl(submittedUrl);
    setIsLoading(true);
    setResult(null);
    
    try {
      const res = await analyzePr({ prUrl: submittedUrl });
      setResult(res.data.data);
      setTimestamp(new Date().toLocaleString());
    } catch (error) {
      console.error("Error analyzing URL:", error);
      setResult("# Error\nThere was an error analyzing this URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrl("");
    setResult(null);
  };

  return (
    <main className="min-h-screen">
      <Toaster position="top-center" />
      <div className="container px-4 py-16 mx-auto max-w-6xl">
        <div className="flex justify-end mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300">
            Pull Request Analyzer
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter a Pull Request URL to analyze and receive a detailed markdown report about its content, structure, and performance metrics.
          </p>
        </div>

        <div className="space-y-12">
          {!result && (
            <div className="bg-card border rounded-lg shadow-sm p-6 sm:p-8">
              <div className="max-w-2xl mx-auto">
                <UrlForm onSubmit={handleSubmit} isLoading={isLoading} />
              </div>
            </div>
          )}

          {isLoading && (
            <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-8 mt-8">
              <LoadingAnimation />
            </div>
          )}

          {result && !isLoading && (
            <ResultContainer 
              content={result} 
              url={url} 
              timestamp={timestamp} 
              onReset={handleReset} 
            />
          )}
        </div>
      </div>
    </main>
  );
}