"use client";

import { useState } from "react";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus, Copy, Download, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ResultContainerProps {
  content: string;
  url: string;
  timestamp: string;
  onReset: () => void;
}

export function ResultContainer({ content, url, timestamp, onReset }: ResultContainerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `analysis-${new Date().getTime()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Downloaded markdown file");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "URL Analysis",
          text: content,
          url: window.location.href,
        });
        toast.success("Shared successfully");
      } catch (err) {
        toast.error("Failed to share");
      }
    } else {
      toast.error("Sharing not supported on this browser");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border shadow-lg animate-in fade-in-50 duration-500 bg-card">
      <CardHeader className="border-b">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Analysis Results</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              URL: <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{url}</a>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Analyzed on {timestamp}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReset}
            className="flex items-center gap-1"
          >
            <FilePlus className="h-4 w-4" />
            <span>New Analysis</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          <MarkdownRenderer content={content} />
        </div>
      </CardContent>
      <CardFooter className={cn(
        "flex justify-end gap-2 pt-2 border-t",
        "flex-wrap sm:flex-nowrap"
      )}>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCopy}
          className="flex items-center gap-1 flex-1 sm:flex-none"
        >
          <Copy className="h-4 w-4" />
          <span>{copied ? "Copied" : "Copy"}</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          className="flex items-center gap-1 flex-1 sm:flex-none"
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleShare}
          className="flex items-center gap-1 flex-1 sm:flex-none"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
}