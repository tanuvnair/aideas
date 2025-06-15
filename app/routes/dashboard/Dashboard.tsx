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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { supabase } from "~/lib/supabase";
import ProtectedRoute from "~/components/protected-route";
import { useNavigate } from "react-router";
import {
  Loader2,
  Plus,
  Lightbulb,
  Settings,
  LogOut,
  Search,
  X,
  Tag,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { useState, useEffect } from "react";
import { AIdeaService } from "~/lib/aideas";
import type { AIdea } from "~/lib/aideas";
import { ThemeToggle } from "~/components/theme-toggle";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import type { Route } from "../../+types/root";
import { Label } from "~/components/ui/label";

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
  const [filteredAideas, setFilteredAideas] = useState<AIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAidea, setEditingAidea] = useState<AIdea | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingAidea, setDeletingAidea] = useState<AIdea | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all aideas on component mount
  useEffect(() => {
    const fetchAideas = async () => {
      setIsLoading(true);
      try {
        // Fetch recent aideas (last 5)
        const { data: recentData } = await AIdeaService.getRecent();
        if (recentData) setRecentAideas(recentData);

        // Fetch all aideas
        const { data: allData } = await AIdeaService.getAll();
        if (allData) {
          setAllAideas(allData);
          setFilteredAideas(allData);
        }
      } catch (error) {
        console.error("Error fetching aideas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAideas();
  }, []);

  // Handle search - client-side filtering
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        const filtered = allAideas.filter(
          (aidea) =>
            aidea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            aidea.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
        setFilteredAideas(filtered);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setFilteredAideas(allAideas);
    }
  }, [searchQuery, allAideas]);

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

      if (error) throw error;
      if (!newAidea) throw new Error("Failed to create AIdea");

      // Update state
      setRecentAideas((prev) => [newAidea, ...prev.slice(0, 4)]);
      setAllAideas((prev) => [newAidea, ...prev]);
      setFilteredAideas((prev) => [newAidea, ...prev]);
    } catch (error) {
      console.error("Error creating aidea:", error);
    } finally {
      setNewAideaTitle("");
      setNewAideaTags([]);
      setTagInput("");
      setIsCreating(false);
    }
  };

  const handleEditAidea = (aidea: AIdea) => {
    setEditingAidea(aidea);
    setEditTitle(aidea.title);
    setEditTags([...aidea.tags]);
    setEditTagInput("");
    setIsEditDialogOpen(true);
  };

  const handleUpdateAidea = async () => {
    if (!editingAidea || !editTitle.trim()) return;

    setIsUpdating(true);
    try {
      const { data: updatedAidea, error } = await AIdeaService.update(
        editingAidea.id,
        {
          title: editTitle,
          tags: editTags,
        }
      );

      if (error) throw error;
      if (!updatedAidea) throw new Error("Failed to update AIdea");

      // Update state
      const updateAideaInArray = (prev: AIdea[]) =>
        prev.map((a) => (a.id === editingAidea.id ? updatedAidea : a));

      setRecentAideas(updateAideaInArray);
      setAllAideas(updateAideaInArray);
      setFilteredAideas(updateAideaInArray);

      setIsEditDialogOpen(false);
      setEditingAidea(null);
    } catch (error) {
      console.error("Error updating aidea:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAideaConfirm = (aidea: AIdea) => {
    setDeletingAidea(aidea);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteAidea = async () => {
    if (!deletingAidea) return;

    setIsDeleting(true);
    try {
      const { success, error } = await AIdeaService.delete(deletingAidea.id);
      if (error) throw error;

      // Update state
      const removeAideaFromArray = (prev: AIdea[]) =>
        prev.filter((a) => a.id !== deletingAidea.id);

      setRecentAideas(removeAideaFromArray);
      setAllAideas(removeAideaFromArray);
      setFilteredAideas(removeAideaFromArray);

      setIsDeleteDialogOpen(false);
      setDeletingAidea(null);
    } catch (error) {
      console.error("Error deleting aidea:", error);
    } finally {
      setIsDeleting(false);
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

  const handleAddEditTag = () => {
    if (editTagInput.trim() && !editTags.includes(editTagInput.trim())) {
      setEditTags([...editTags, editTagInput.trim()]);
      setEditTagInput("");
    }
  };

  const handleRemoveEditTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((tag) => tag !== tagToRemove));
  };

  const handleEditTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEditTag();
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
            <div className="flex-1 space-y-6">
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
                                  {new Date(
                                    aidea.created_at
                                  ).toLocaleDateString()}
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
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditAidea(aidea);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAideaConfirm(aidea);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
                      {isSearching && (
                        <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : filteredAideas.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      {searchQuery.trim()
                        ? "No matching aideas found"
                        : "No aideas found. Create your first one!"}
                    </p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredAideas.map((aidea) => (
                        <ContextMenu key={aidea.id}>
                          <ContextMenuTrigger>
                            <Card
                              className="hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => navigate(`/aidea/${aidea.id}`)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start space-x-3">
                                  <Lightbulb className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0 space-y-2">
                                    <h3 className="font-medium truncate">
                                      {aidea.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(
                                        aidea.created_at
                                      ).toLocaleDateString()}
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
                          </ContextMenuTrigger>
                          <ContextMenuContent>
                            <ContextMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/aidea/${aidea.id}`);
                              }}
                            >
                              Open
                            </ContextMenuItem>
                            <ContextMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditAidea(aidea);
                              }}
                            >
                              Edit
                            </ContextMenuItem>
                            <ContextMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAideaConfirm(aidea);
                              }}
                            >
                              Delete
                            </ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Edit AIdea Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px] text-foreground">
            <DialogHeader>
              <DialogTitle>Edit AIdea</DialogTitle>
              <DialogDescription>
                Make changes to your AIdea here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Enter title..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tags" className="text-sm font-medium">
                  Tags
                </Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="edit-tags"
                      placeholder="Add tags..."
                      value={editTagInput}
                      onChange={(e) => setEditTagInput(e.target.value)}
                      onKeyUp={handleEditTagInputKeyPress}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddEditTag}
                    disabled={!editTagInput.trim()}
                  >
                    Add
                  </Button>
                </div>
                {editTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1 pr-1 cursor-pointer"
                        onClick={() => handleRemoveEditTag(tag)}
                      >
                        <span>{tag}</span>
                        <X className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateAidea}
                disabled={!editTitle.trim() || isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent className="text-foreground">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                AIdea "{deletingAidea?.title}" and remove all of its data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAidea}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  );
}
