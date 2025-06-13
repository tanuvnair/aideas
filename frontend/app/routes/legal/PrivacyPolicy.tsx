import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Brain } from "lucide-react";
import { useNavigate } from "react-router";
import { ThemeToggle } from "~/components/theme-toggle";
import type { Route } from "../../+types/root";
import { Button } from "~/components/ui/button";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Privacy Policy - AIdeas" },
    {
      name: "description",
      content: "Learn how AIdeas collects, uses, and protects your data.",
    },
  ];
};

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-foreground">
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
        <div className="flex items-center gap-4">
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

      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground">
            Last Updated: June 14, 2025
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              At AIdeas, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our AI-powered sketching and note-taking
              application.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Personal Information</h3>
                <p className="text-muted-foreground">
                  When you register for an account, we may collect your name,
                  email address, and other contact details.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Usage Data</h3>
                <p className="text-muted-foreground">
                  We automatically collect information about how you interact
                  with our services, including features you use and time spent
                  on the app.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Content Data</h3>
                <p className="text-muted-foreground">
                  Your sketches, notes, and other content you create are stored
                  securely on our servers to provide you with our services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>To provide and maintain our service</li>
              <li>To improve and personalize your experience</li>
              <li>To develop new features and functionality</li>
              <li>To communicate with you about updates and offers</li>
              <li>To prevent fraud and enhance security</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to
              protect your personal data against unauthorized access,
              alteration, disclosure, or destruction.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last Updated" date.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
