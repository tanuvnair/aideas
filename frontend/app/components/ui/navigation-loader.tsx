import { useState, useEffect } from "react";
import { useNavigation } from "react-router";
import { Loader2 } from "lucide-react";

export function NavigationLoader() {
  const navigation = useNavigation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (navigation.state === "loading") {
      setIsNavigating(true);
      // Small delay before showing loader to avoid flickering on fast navigations
      const timer = setTimeout(() => setShowLoader(true), 150);
      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
      // Small delay before hiding to allow fade-out animations
      const timer = setTimeout(() => setIsNavigating(false), 150);
      return () => clearTimeout(timer);
    }
  }, [navigation.state]);

  if (!isNavigating) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}
