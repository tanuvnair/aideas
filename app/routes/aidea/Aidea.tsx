import ProtectedRoute from "~/components/protected-route";
import type { Route } from "../../+types/root";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pen,
  Eraser,
  Square,
  Circle,
  Type,
  Palette,
  Save,
  Share,
  Bot,
  Send,
  Trash2,
  Brain,
  ArrowLeft,
  Sun,
  Moon,
} from "lucide-react";
import { useState } from "react";

// Theme Toggle Component
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // In a real app, you'd integrate with your theme system here
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme}>
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};

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
  const [noteTitle, setNoteTitle] = useState("Untitled Note");
  const [selectedTool, setSelectedTool] = useState("pen");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm here to help you with your note-taking and sketching. What would you like to create today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const tools = [
    { id: "pen", icon: Pen, label: "Pen" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "text", icon: Type, label: "Text" },
    { id: "color", icon: Palette, label: "Color" },
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: chatInput },
      {
        role: "assistant",
        content:
          "I understand you want to " +
          chatInput +
          ". Let me help you with that!",
      },
    ]);
    setChatInput("");
  };

  const navigate = (path: string | number) => {
    // In a real app, you'd use your router's navigate function
    if (typeof path === "number") {
      window.history.go(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-background">
        {/* Improved Navbar */}
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

          {/* Note Title Input */}
          <div className="flex-1 max-w-md mx-8">
            <Input
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="text-center border-none shadow-none text-base font-medium bg-transparent"
              placeholder="Note title..."
            />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <ThemeToggle />
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas Area */}
          <div className="flex-1 relative bg-white border-r">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Pen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg">Start sketching or writing your ideas</p>
                <p className="text-sm mt-2">
                  Select a tool from the sidebar to begin
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-muted/30 flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b bg-background/50">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Drawing Tools
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTool(tool.id)}
                      className="flex flex-col h-14 p-2"
                    >
                      <Icon className="h-4 w-4 mb-1" />
                      <span className="text-xs">{tool.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* AI Chat Area */}
            <div className="flex-1 flex flex-col bg-background/30">
              <div className="p-4 border-b bg-background/50">
                <h3 className="text-sm font-medium flex items-center">
                  <Bot className="h-4 w-4 mr-2 text-primary" />
                  AI Assistant
                </h3>
              </div>

              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-background border shadow-sm"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-4 border-t bg-background/50">
                <div className="flex space-x-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask AI for help..."
                    onKeyUp={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
