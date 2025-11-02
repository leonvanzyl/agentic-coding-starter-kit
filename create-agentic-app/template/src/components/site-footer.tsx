import { GitHubStars } from "./ui/github-stars";

export function SiteFooter() {
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-3">
          <GitHubStars repo="leonvanzyl/agentic-coding-starter-kit" />
          <p>
            Built using Agentic Coding Boilerplate by{" "}
            <a
              href="https://youtube.com/@leonvanzyl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Leon van Zyl
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
