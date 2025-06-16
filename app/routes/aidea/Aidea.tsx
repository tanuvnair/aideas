import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
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
import ProtectedRoute from "~/components/protected-route";
import { useNavigate, useParams } from "react-router";
import {
  Loader2,
  ArrowLeft,
  Save,
  Download,
  Trash2,
  Edit,
  Palette,
  Eraser,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  MessageSquare,
  Send,
  X,
  Tag,
  Brain,
  Settings,
  Maximize,
  Minimize,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AIdeaService } from "~/lib/aideas";
import type { AIdea } from "~/lib/aideas";
import { ThemeToggle } from "~/components/theme-toggle";
import type { Route } from "../../+types/root";
import { Label } from "~/components/ui/label";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "AIdeas - Note" },
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

export default function Aidea() {
  const navigate = useNavigate();
  const { id } = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // AIdea state
  const [aidea, setAidea] = useState<AIdea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Edit state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit functionality
  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleSave = () => {};

  const handleUpdateAidea = async () => {
    if (!aidea || !editTitle.trim()) return;

    setIsUpdating(true);
    try {
      const { data: updatedAidea, error } = await AIdeaService.update(
        aidea.id,
        {
          title: editTitle,
          tags: editTags,
        }
      );

      if (error) throw error;
      if (updatedAidea) {
        setAidea(updatedAidea);
      }

      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating aidea:", error);
    } finally {
      setIsUpdating(false);
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

  // Delete functionality
  const handleDelete = async () => {
    if (!aidea) return;

    setIsDeleting(true);
    try {
      const { success, error } = await AIdeaService.delete(aidea.id);
      if (error) throw error;

      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting aidea:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/40 text-foreground">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <h1 className="text-xl font-semibold truncate max-w-96">
                    {aidea?.title}
                  </h1>
                </div>
                <div className="flex gap-1">
                  {aidea?.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {hasUnsavedChanges && (
                  <span className="text-sm text-muted-foreground mr-2">
                    Unsaved changes
                  </span>
                )}
                {lastSaved && (
                  <span className="text-sm text-muted-foreground mr-2">
                    Saved {lastSaved.toLocaleTimeString()}
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving || !hasUnsavedChanges}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
