import { useTheme } from "@/lib/useTheme";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun } from "lucide-react";

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen text-foreground">
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            <path d="M15 14l5 5" />
            <path d="M20 14l-5 5" />
          </svg>
          <span className="text-lg font-semibold">AIdeas</span>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost">Features</Button>
          <Button>Get Started</Button>
          <Button variant="ghost" onClick={toggleTheme} className=" ">
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      <section className="container mx-auto px-6 py-24 text-center space-y-6">
        <Badge>AI-Powered</Badge>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to AIdeas
          </h1>
          <h2 className="text-2xl font-medium tracking-tight">
            Sketch. Note. Create.
          </h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The minimalist drawing and note-taking app enhanced with AI.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button size="lg">Start Creating</Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>🖊️ Draw Freely</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use intuitive sketching tools to turn ideas into visuals, no
                fuss.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>📝 Smart Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Capture ideas with markdown and keep your thoughts structured.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>🤖 AI Assist</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get real-time enhancements, suggestions, and summarization
                powered by AI.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
