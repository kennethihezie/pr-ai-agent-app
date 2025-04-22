"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UrlFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function UrlForm({ onSubmit, isLoading }: UrlFormProps) {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isTouched, setIsTouched] = useState(false);

  const validateUrl = (value: string) => {
    if (!value) return false;
    try {
      new URL(value);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    
    if (isTouched) {
      setIsValid(validateUrl(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTouched(true);
    
    const valid = validateUrl(url);
    setIsValid(valid);
    
    if (valid) {
      onSubmit(url);
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
    setIsValid(validateUrl(url));
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-2xl mx-auto space-y-4"
    >
      <div className="relative group">
        <Input
          type="text"
          placeholder="Enter a PR URL to analyze (e.g., https://github.com/user/repo/pull/2)"
          value={url}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            "pr-12 transition-all duration-300 border-2 h-14 text-base",
            "focus-visible:ring-primary/20 focus-visible:ring-4",
            !isValid && isTouched ? "border-destructive" : "border-input hover:border-primary/50"
          )}
          disabled={isLoading}
          data-invalid={!isValid && isTouched}
          aria-invalid={!isValid && isTouched}
        />
        <LinkIcon 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5"
        />
      </div>
      
      {!isValid && isTouched && (
        <p className="text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-200">
          Please enter a valid URL including http:// or https://
        </p>
      )}
      
      <Button 
        type="submit" 
        className="w-full h-12 text-base font-medium transition-all duration-300 bg-primary hover:bg-primary/90"
        disabled={isLoading || (isTouched && !isValid)}
      >
        {isLoading ? "Analyzing..." : "Analyze URL"}
      </Button>
    </form>
  );
}