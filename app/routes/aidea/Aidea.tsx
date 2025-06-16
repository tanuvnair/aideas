import ProtectedRoute from "~/components/protected-route";
import type { Route } from "../../+types/root";

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
  return (
    <ProtectedRoute>
      <div>
        <h1>Note goes here!</h1>
      </div>
    </ProtectedRoute>
  );
}
