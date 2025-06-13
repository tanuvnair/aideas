import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { AlertCircle, ArrowLeft, Brain, Home, RefreshCw } from "lucide-react";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap",
  },
  {
    rel: "icon",
    href: "/favicon.ico",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-background">
        <ThemeProvider>{children}</ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const navigate = useNavigate();

  let title = "Oops!";
  let message = "An unexpected error occurred.";
  let status = 500;
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    title = error.status === 404 ? "Page Not Found" : "Error";
    message = error.statusText || message;

    if (error.status === 404) {
      message = "The page you're looking for doesn't exist or has been moved.";
    }
  } else if (error instanceof Error) {
    message = error.message;
    stack = import.meta.env.DEV ? error.stack : undefined;
  }

  const handleGoHome = () => navigate("/");
  const handleReload = () => window.location.reload();

  return (
    <div className="min-h-screen text-foreground">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Brain className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">AIdeas</span>
        </div>
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={handleGoHome}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          {/* Error Card */}
          <Card className="border-destructive">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-destructive mt-4">{title}</CardTitle>
              {status && (
                <div className="text-sm font-mono text-muted-foreground">
                  Error {status}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-muted-foreground">{message}</p>

              <div className="flex gap-3 justify-center">
                <Button onClick={handleGoHome} variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
                <Button onClick={handleReload}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
              </div>

              {stack && (
                <div className="mt-6 text-left">
                  <div className="text-sm font-medium mb-2">Error Details:</div>
                  <pre className="text-xs p-4 bg-muted rounded-md overflow-x-auto">
                    <code>{stack}</code>
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Support Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <Button variant="link" className="px-0 text-sm h-auto">
                Contact support
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
