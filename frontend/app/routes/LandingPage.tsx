import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
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
        </div>
      </nav>

      <section className="container mx-auto px-6 py-20 text-center">
        <Badge className="mb-4">AI-Powered</Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Sketch. Note. Create.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          The minimalist drawing and note-taking app enhanced with AI.
        </p>
        <div className="flex justify-center gap-4">
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

      <footer className="border-t py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
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
              <span className="font-medium">AIdeas</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AIdeas. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
