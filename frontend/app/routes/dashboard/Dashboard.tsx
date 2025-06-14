import { Button } from "~/components/ui/button";
import { supabase } from "~/lib/supabase";
import ProtectedRoute from "~/components/protected-route";
import { useNavigate } from "react-router";

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
  const handleSignOut = () => {
    supabase.auth.signOut();
    navigate("/signin");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen text-foreground">
        <h1>Hello!</h1>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </div>
    </ProtectedRoute>
  );
}
