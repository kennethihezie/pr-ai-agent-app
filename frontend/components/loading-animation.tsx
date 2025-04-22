"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingAnimationProps {
  message?: string;
  className?: string;
}

export function LoadingAnimation({ 
  message = "Analyzing content...", 
  className 
}: LoadingAnimationProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-4 py-8", 
      className
    )}>
      <div className="relative">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent rounded-full blur-sm -z-10" />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-foreground">{message}</p>
        <p className="text-sm text-muted-foreground mt-1">This may take a moment</p>
      </div>
      <div className="w-64 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full animate-pulse"
          style={{ 
            width: '40%',
            animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }} 
        />
      </div>
    </div>
  );
}