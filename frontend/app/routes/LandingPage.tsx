import { useTheme } from "@/lib/useTheme";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun } from "lucide-react";

import type { Route } from "../+types/root";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "AIdeas - AI-Powered Sketching & Note Taking App" },
    {
      name: "description",
      content:
        "Minimalist drawing and note-taking app enhanced with AI. Sketch, note, and create with intelligent assistance.",
    },
    { property: "og:title", content: "AIdeas - AI-Powered Creativity Tool" },
    {
      property: "og:description",
      content:
        "Transform your ideas into reality with AI-enhanced sketching and note-taking.",
    },
    { property: "og:type", content: "website" },
  ];
};

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen text-foreground">
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <img src="../favicon.ico" className="h-8 w-8" alt="AIdeas Logo" />
          <span className="text-lg font-semibold">AIdeas</span>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline">Sign In</Button>
          <Button>Sign Up</Button>
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
