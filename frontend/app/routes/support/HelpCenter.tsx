import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Brain,
  ChevronDown,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";
import { useNavigate } from "react-router";
import { ThemeToggle } from "~/components/theme-toggle";
import type { Route } from "../../+types/root";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Help Center - AIdeas" },
    {
      name: "description",
      content:
        "Get help with using AIdeas and find answers to common questions.",
    },
  ];
};

export default function HelpCenter() {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I create a new sketch?",
      answer:
        "Click the '+' button in the toolbar or use the keyboard shortcut Ctrl+N (Cmd+N on Mac) to create a new sketch.",
    },
    {
      question: "Can I export my notes and drawings?",
      answer:
        "Yes, you can export your work in various formats including PNG, JPEG, PDF, and our native .aidea format for future editing.",
    },
    {
      question: "How does the AI assistance work?",
      answer:
        "Our AI analyzes your content and provides suggestions, enhancements, and organization tips based on context. You can enable or disable these features in settings.",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "Currently, AIdeas is web-based with responsive design for mobile browsers. Native apps are planned for future release.",
    },
    {
      question: "How secure is my data?",
      answer:
        "We use industry-standard encryption and security practices to protect your data. For more details, see our Privacy Policy.",
    },
  ];

  const categories = [
    {
      title: "Getting Started",
      icon: <User className="h-5 w-5" />,
      questions: 5,
    },
    {
      title: "Account Settings",
      icon: <Settings className="h-5 w-5" />,
      questions: 8,
    },
    {
      title: "AI Features",
      icon: <Brain className="h-5 w-5" />,
      questions: 6,
    },
    {
      title: "Troubleshooting",
      icon: <MessageSquare className="h-5 w-5" />,
      questions: 4,
    },
  ];

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
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-muted-foreground">
            Find answers and learn how to get the most out of AIdeas
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? Our support team is ready to
              assist you.
            </p>
            <Button onClick={() => navigate("/contact")}>
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
