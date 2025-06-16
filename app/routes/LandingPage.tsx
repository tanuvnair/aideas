import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Moon,
  Sun,
  ArrowUp,
  Sparkles,
  Zap,
  Brain,
  Star,
  Users,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ThemeToggle } from "~/components/theme-toggle";

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
  const navigate = useNavigate();
  const [showScrollButton, setShowScrollButton] = useState(false);

  const checkScrollTop = () => {
    if (!showScrollButton && window.pageYOffset > 400) {
      setShowScrollButton(true);
    } else if (showScrollButton && window.pageYOffset <= 400) {
      setShowScrollButton(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      checkScrollTop();
    };

    // Add event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showScrollButton]);

  const handleSignInClick = () => () => navigate("/signin");
  const handleSignUpClick = () => () => navigate("/signup");

  return (
    <div className="min-h-screen text-foreground relative">
      <nav className="flex items-center justify-between p-6 border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Brain className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">AIdeas</span>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/signin")}>
            Sign In
          </Button>
          <Button onClick={() => navigate("/signup")}>Sign Up</Button>
          <ThemeToggle />
        </div>
      </nav>

      <main>
        <section className="container mx-auto px-6 min-h-screen flex flex-col justify-center items-center text-center space-y-8">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            AI-Powered
          </Badge>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Welcome to AIdeas
            </h1>
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-muted-foreground">
              Sketch. Note. Create.
            </h2>
          </div>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The minimalist drawing and note-taking app enhanced with AI
            intelligence.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => navigate("/signup")}
            >
              <Zap className="h-4 w-4" />
              Start Creating
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const element = document.getElementById("how-it-works");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Learn More
            </Button>
          </div>

          <Separator className="my-8 max-w-xs mx-auto" />

          {/* Stats section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-2">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">N/A</div>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-2">
                  <Star className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">N/A</div>
                <p className="text-sm text-muted-foreground">User Rating</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-2">
                  <Shield className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">N/A</div>
                <p className="text-sm text-muted-foreground">Secure</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="container mx-auto px-6 py-24" id="how-it-works">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to unlock your creativity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">🖊️</span>
                  </div>
                </div>
                <CardTitle className="text-xl">Draw Freely</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Use intuitive sketching tools to turn ideas into visuals, no
                  fuss. Express yourself with precision and creativity.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                </div>
                <CardTitle className="text-xl">Smart Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Capture ideas with markdown and keep your thoughts structured.
                  Organize and connect your ideas seamlessly.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                </div>
                <CardTitle className="text-xl">AI Assist</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Get real-time enhancements, suggestions, and summarization
                  powered by cutting-edge AI technology.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <footer className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-3 justify-items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <Brain className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="font-semibold">AIdeas</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered creativity tools for modern creators.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => navigate("/terms-of-service")}
                  >
                    Terms Of Service
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => navigate("/privacy-policy")}
                  >
                    Privacy Policy
                  </Button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => navigate("/help-center")}
                  >
                    Help Center
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => navigate("/contact-us")}
                  >
                    Contact Us
                  </Button>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="text-center text-sm text-muted-foreground">
            © 2025 AIdeas. All rights reserved.
          </div>
        </footer>
      </main>

      {/* Back to Top Button */}
      {showScrollButton && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-16 h-16 p-0"
          variant="outline"
          size="icon"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
