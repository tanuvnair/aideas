import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
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
  Search,
  X,
  Tag,
} from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { useState } from "react";

import type { Route } from "../../+types/root";
import { ThemeToggle } from "~/components/theme-toggle";
import { Label } from "@radix-ui/react-label";
import { FormLabel } from "~/components/ui/form";

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
  const [newIdeaTitle, setNewIdeaTitle] = useState("");
  const [newIdeaTags, setNewIdeaTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    navigate("/signin");
  };

  const handleCreateIdea = async () => {
    if (!newIdeaTitle.trim()) return;

    setIsCreating(true);
    // TODO: Add your idea creation logic here
    // For now, just navigate to new note page
    navigate("/new-note", {
      state: { title: newIdeaTitle, tags: newIdeaTags },
    });
    setNewIdeaTitle("");
    setNewIdeaTags([]);
    setTagInput("");
    setIsCreating(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newIdeaTags.includes(tagInput.trim())) {
      setNewIdeaTags([...newIdeaTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewIdeaTags(newIdeaTags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const recentIdeas = [
    {
      id: 1,
      title: "Marketing Campaign Concepts",
      type: "note",
      createdAt: "2 hours ago",
      tags: ["marketing", "campaign", "creative"],
    },
    {
      id: 2,
      title: "Product Sketch",
      type: "drawing",
      createdAt: "Yesterday",
      tags: ["design", "product", "sketch"],
    },
    {
      id: 3,
      title: "Meeting Notes",
      type: "note",
      createdAt: "3 days ago",
      tags: ["meeting", "notes", "project"],
    },
  ];

  const allIdeas = [
    {
      id: 1,
      title: "Marketing Campaign Concepts",
      type: "note",
      createdAt: "2 hours ago",
      tags: ["marketing", "campaign", "creative"],
    },
    {
      id: 2,
      title: "Product Sketch",
      type: "drawing",
      createdAt: "Yesterday",
      tags: ["design", "product", "sketch"],
    },
    {
      id: 3,
      title: "Meeting Notes",
      type: "note",
      createdAt: "3 days ago",
      tags: ["meeting", "notes", "project"],
    },
    {
      id: 4,
      title: "Brand Identity Exploration",
      type: "drawing",
      createdAt: "1 week ago",
      tags: ["branding", "identity", "design"],
    },
    {
      id: 5,
      title: "Project Roadmap",
      type: "note",
      createdAt: "1 week ago",
      tags: ["planning", "roadmap", "strategy"],
    },
    {
      id: 6,
      title: "User Interface Wireframes",
      type: "drawing",
      createdAt: "2 weeks ago",
      tags: ["ui", "wireframes", "design"],
    },
    {
      id: 7,
      title: "Research Notes",
      type: "note",
      createdAt: "2 weeks ago",
      tags: ["research", "analysis", "data"],
    },
    {
      id: 8,
      title: "Architecture Diagram",
      type: "drawing",
      createdAt: "3 weeks ago",
      tags: ["architecture", "diagram", "technical"],
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/40">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full lg:w-72 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Create New AIdea</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Enter your idea title..."
                    value={newIdeaTitle}
                    onChange={(e) => setNewIdeaTitle(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && !tagInput && handleCreateIdea()
                    }
                  />

                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Add tags..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyUp={handleTagInputKeyPress}
                          className="pl-10"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                      >
                        Add
                      </Button>
                    </div>

                    {newIdeaTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newIdeaTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center gap-1 pr-1"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              className="ml-1 cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleRemoveTag(tag);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleCreateIdea}
                    disabled={!newIdeaTitle.trim() || isCreating}
                  >
                    {isCreating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    Create AIdea
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Navigation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      const element = document.getElementById("my-aideas");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    My AIdeas
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </CardContent>
                <CardFooter className="pt-4">
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
            <div className="flex-1 space-y-8">
              <Card>
                <CardHeader className="pb-4 flex items-center justify-between">
                  <CardTitle>Welcome Back!</CardTitle>
                  <ThemeToggle />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Ready to turn your ideas into reality? Start with a new note
                    or drawing, or continue where you left off.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Recent Ideas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentIdeas.map((idea, index) => (
                      <div key={idea.id}>
                        <div className="group flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                          <div className="flex items-center space-x-4 flex-1 min-w-0">
                            {idea.type === "note" ? (
                              <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <Lightbulb className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0 space-y-1">
                              <span className="font-medium block truncate">
                                {idea.title}
                              </span>
                              <p className="text-sm text-muted-foreground">
                                {idea.createdAt}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {idea.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 flex-shrink-0"
                          >
                            Open
                          </Button>
                        </div>
                        {index < recentIdeas.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card id="my-aideas">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle>All AIdeas</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search ideas..."
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {allIdeas.map((idea) => (
                      <Card
                        key={idea.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start space-x-4">
                            {idea.type === "note" ? (
                              <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            ) : (
                              <Lightbulb className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0 space-y-2">
                              <h3 className="font-medium truncate">
                                {idea.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {idea.createdAt}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {idea.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
