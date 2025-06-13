import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Brain } from "lucide-react";
import { useNavigate } from "react-router";
import { ThemeToggle } from "~/components/theme-toggle";
import type { Route } from "../../+types/root";
import { Button } from "~/components/ui/button";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Terms of Service - AIdeas" },
    {
      name: "description",
      content: "Terms and conditions for using AIdeas services.",
    },
  ];
};

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-foreground">
      <nav className="flex items-center justify-between p-6 border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="flex items-center gap-2">
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
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-muted-foreground">
            Last Updated: June 14, 2025
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              By accessing or using the AIdeas application, you agree to be
              bound by these Terms of Service. If you do not agree to all of
              these terms, you may not use our services.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>2. Description of Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              AIdeas provides an AI-powered sketching and note-taking platform
              that allows users to create, edit, and organize digital content.
              The service may change or be updated from time to time at our
              discretion.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3. User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>You must be at least 13 years old to use our services</li>
              <li>
                You are responsible for maintaining the confidentiality of your
                account
              </li>
              <li>
                You agree not to use the service for any illegal or unauthorized
                purpose
              </li>
              <li>You are solely responsible for your conduct and content</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>4. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              AIdeas retains all rights, title, and interest in and to the
              service, including all related intellectual property rights. Your
              content remains yours, but you grant us a license to use it to
              provide the service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>5. Termination</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including
              without limitation if you breach the Terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with
              the laws of the jurisdiction where AIdeas is established, without
              regard to its conflict of law provisions.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
