import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { supabase } from "~/lib/supabase";
import ProtectedRoute from "~/components/protected-route";
import { useNavigate } from "react-router";
import {
  Loader2,
  Plus,
  FileText,
  Lightbulb,
  Settings,
  LogOut,
} from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { useState } from "react";

import type { Route } from "../../+types/root";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "AIdeas - Dashboard" },
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    navigate("/signin");
  };

  const recentIdeas = [
    { id: 1, title: "Marketing Campaign Concepts", type: "note" },
    { id: 2, title: "Product Sketch", type: "drawing" },
    { id: 3, title: "Meeting Notes", type: "note" },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/40">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/new-note")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New AIdea
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Navigation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    My AIdeas
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                  >
                    {isSigningOut ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2 h-4 w-4" />
                    )}
                    Sign Out
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Ready to turn your ideas into reality? Start with a new note
                    or drawing, or continue where you left off.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Ideas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentIdeas.map((idea) => (
                      <div key={idea.id} className="group">
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                          <div className="flex items-center space-x-3">
                            {idea.type === "note" ? (
                              <FileText className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <Lightbulb className="h-5 w-5 text-muted-foreground" />
                            )}
                            <span>{idea.title}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100"
                          >
                            Open
                          </Button>
                        </div>
                        <Separator />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
