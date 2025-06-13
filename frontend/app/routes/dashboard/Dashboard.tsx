import { Button } from "~/components/ui/button";
import { supabase } from "~/lib/supabase";
import ProtectedRoute from "~/components/protected-route";

export default function Dashboard() {
  const handleSignOut = () => {
    supabase.auth.signOut();
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
