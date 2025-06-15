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
import { useState, useEffect } from "react";
import { AIdeaService } from "~/lib/aideas";
import type { AIdea } from "~/lib/aideas";
import type { Route } from "../../+types/root";
import { ThemeToggle } from "~/components/theme-toggle";

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
  const [newAideaTitle, setNewAideaTitle] = useState("");
  const [newAideaTags, setNewAideaTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [recentAideas, setRecentAideas] = useState<AIdea[]>([]);
  const [allAideas, setAllAideas] = useState<AIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch aideas on component mount
  useEffect(() => {
    const fetchAideas = async () => {
      setIsLoading(true);
      try {
        // Fetch recent aideas (last 5)
        const { data: recentData } = await AIdeaService.getRecent();
        if (recentData) {
          setRecentAideas(recentData);
        }

        // Fetch all aideas
        const { data: allData } = await AIdeaService.getAll();
        if (allData) {
          setAllAideas(allData);
        }
      } catch (error) {
        console.error("Error fetching aideas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAideas();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      const search = async () => {
        const { data } = await AIdeaService.search(searchQuery);
        if (data) {
          setAllAideas(data);
        }
      };
      search();
    } else {
      // Reset to all aideas if search is cleared
      const fetchAll = async () => {
        const { data } = await AIdeaService.getAll();
        if (data) {
          setAllAideas(data);
        }
      };
      fetchAll();
    }
  }, [searchQuery]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    navigate("/signin");
  };

  const handleCreateAidea = async () => {
    if (!newAideaTitle.trim()) return;

    setIsCreating(true);
    try {
      const { data: newAidea, error } = await AIdeaService.create({
        title: newAideaTitle,
        tags: newAideaTags,
      });

      if (error) {
        console.error("Error creating aidea:", error);
        return;
      }

      if (newAidea) {
        // Update the recent aideas and all aideas lists
        setRecentAideas((prev) => [newAidea, ...prev.slice(0, 4)]);
        setAllAideas((prev) => [newAidea, ...prev]);
      }
    } catch (error) {
      console.error("Error creating aidea:", error);
    } finally {
      setNewAideaTitle("");
      setNewAideaTags([]);
      setTagInput("");
      setIsCreating(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newAideaTags.includes(tagInput.trim())) {
      setNewAideaTags([...newAideaTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewAideaTags(newAideaTags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

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
                    placeholder="Enter your aidea title..."
                    value={newAideaTitle}
                    onChange={(e) => setNewAideaTitle(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && !tagInput && handleCreateAidea()
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

                    {newAideaTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newAideaTags.map((tag) => (
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
                    onClick={handleCreateAidea}
                    disabled={!newAideaTitle.trim() || isCreating}
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
                    Ready to turn your aideas into reality? Start with a new
                    note or drawing, or continue where you left off.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Recent AIdeas</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : recentAideas.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No recent aideas found. Create your first one!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {recentAideas.map((aidea, index) => (
                        <div key={aidea.id}>
                          <div
                            className="group flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => navigate(`/aidea/${aidea.id}`)}
                          >
                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                              <Lightbulb className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0 space-y-1">
                                <span className="font-medium block truncate">
                                  {aidea.title}
                                </span>
                                <p className="text-sm text-muted-foreground">
                                  {aidea.created_at}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {aidea.tags.map((tag) => (
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
                          {index < recentAideas.length - 1 && <Separator />}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card id="my-aideas">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle>All AIdeas</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search aideas..."
                        className="pl-10 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : allAideas.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No aideas found. Create your first one!
                    </p>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {allAideas.map((aidea) => (
                        <Card
                          key={aidea.id}
                          className="hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => navigate(`/aidea/${aidea.id}`)}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start space-x-4">
                              <Lightbulb className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0 space-y-2">
                                <h3 className="font-medium truncate">
                                  {aidea.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {aidea.created_at}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {aidea.tags.map((tag) => (
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
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
