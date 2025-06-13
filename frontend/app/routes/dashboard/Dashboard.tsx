import { Button } from "~/components/ui/button";
import { supabase } from "~/lib/supabase";
import ProtectedRoute from "~/components/protected-route";
import { useNavigate } from "react-router";

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
