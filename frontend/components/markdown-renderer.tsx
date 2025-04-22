"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const [renderedHtml, setRenderedHtml] = useState("");

  useEffect(() => {
    const parsedContent = parseMarkdown(content);
    setRenderedHtml(parsedContent);
  }, [content]);

  const parseMarkdown = (markdown: string) => {
    let html = markdown
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-6 mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-5 mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-bold mt-3 mb-2">$1</h4>');

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    html = html.replace(/^\s*\*\s(.*$)/gm, '<li class="ml-6 list-disc">$1</li>');
    html = html.replace(
      /(<li[^>]*>.*<\/li>)\s+(<li[^>]*>)/g,
      '$1$2'
    );
    html = html.replace(
      /(<li[^>]*>.*<\/li>)(?!\s+<li)/g,
      '<ul class="my-3">$1</ul>'
    );

    html = html.replace(
      /```([^`]+)```/g,
      '<pre class="bg-secondary p-4 rounded-md my-4 overflow-x-auto"><code>$1</code></pre>'
    );

    html = html.replace(
      /`([^`]+)`/g,
      '<code class="bg-secondary px-1.5 py-0.5 rounded text-sm">$1</code>'
    );

    html = html
      .replace(/^\s*(\n)?([^\n]+)\s*(\n)?$/gm, function(match, p1, p2) {
        const trimmed = p2.trim();
        if (
          trimmed.startsWith('<h') ||
          trimmed.startsWith('<ul') ||
          trimmed.startsWith('<pre') ||
          trimmed === ''
        ) {
          return trimmed;
        }
        return '<p class="my-3 leading-7">' + trimmed + '</p>';
      });

    html = html.replace(
      /^\>\s(.*$)/gm,
      '<blockquote class="pl-4 border-l-4 border-primary/30 italic my-4">$1</blockquote>'
    );

    return html;
  };

  return (
    <div 
      className={cn("prose prose-neutral dark:prose-invert max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}