"use client";

import { useState, useEffect } from "react";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GitHubStarsProps {
  repo: string;
}

export function GitHubStars({ repo }: GitHubStarsProps) {
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStars() {
      try {
        const response = await fetch(`https://api.github.com/repos/${repo}`);
        if (response.ok) {
          const data = await response.json();
          setStars(data.stargazers_count);
        }
      } catch (error) {
        console.error("Failed to fetch GitHub stars:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStars();
  }, [repo]);

  const formatStars = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Button variant="outline" size="sm" asChild>
      <a
        href={`https://github.com/${repo}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        <Github className="h-4 w-4" />
        {loading ? "..." : stars !== null ? formatStars(stars) : "0"}
      </a>
    </Button>
  );
}