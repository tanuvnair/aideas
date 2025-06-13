import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Brain,
  Eye,
  EyeOff,
  Mail,
  User,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { redirect, useNavigate } from "react-router";

import type { Route } from "../../+types/root";
import { supabase } from "~/lib/supabase";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "AIdeas - Sign Up" },
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

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      // Clear any previous errors and success messages
      setAuthError(null);
      setSuccessMessage(null);

      console.log("Sign up:", data);
      const email = data.email.trim().toLowerCase();
      const password = data.password;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${import.meta.env.VITE_FRONTEND_URL}/dashboard`,
          data: {
            name: data.name,
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      // Success - show success message
      setSuccessMessage(
        "Account created successfully! Please check your email to confirm your account before signing in. If you don't see the email, check your spam folder."
      );
      console.log("Sign up successful");
    } catch (error) {
      console.error("Sign up error:", error);
      setAuthError("An unexpected error occurred. Please try again.");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      // Clear any previous errors and success messages
      setAuthError(null);
      setSuccessMessage(null);

      console.log("Google sign up");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${import.meta.env.VITE_FRONTEND_URL}/dashboard`,
        },
      });

      if (error) {
        setAuthError(error.message);
      }
    } catch (error) {
      console.error("Google sign up error:", error);
      setAuthError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen text-foreground">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 border-b">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Brain className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">AIdeas</span>
        </div>
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create your account</h1>
            <p className="text-muted-foreground">
              Join AIdeas to start creating and collaborating
            </p>
          </div>

          {/* Error Alert */}
          {authError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {successMessage && (
            <Alert
              variant="default"
              className="mb-6 border-green-200 bg-green-50 text-green-800"
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Sign Up Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Sign Up</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Social Sign Up */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleGoogleSignUp}
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or sign up with email
                  </span>
                </div>
              </div>

              {/* Sign Up Form */}
              <Form {...form}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="text"
                              placeholder="Enter your full name"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
                              className="pr-10"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1 cursor-pointer"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            I agree to the{" "}
                            <Button
                              variant="link"
                              className="px-0 text-sm h-auto"
                              type="button"
                              onClick={() => navigate("/terms-of-service")}
                            >
                              Terms of Service
                            </Button>{" "}
                            and{" "}
                            <Button
                              variant="link"
                              className="px-0 text-sm h-auto"
                              type="button"
                              onClick={() => navigate("/privacy-policy")}
                            >
                              Privacy Policy
                            </Button>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? "Creating account..."
                      : "Create Account"}
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                className="px-0 text-sm"
                onClick={() => navigate("/signin")}
              >
                Sign in
              </Button>
            </p>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t">
            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Button
                variant="link"
                className="px-0 text-xs h-auto"
                onClick={() => navigate("/terms-of-service")}
              >
                Terms of Service
              </Button>{" "}
              and{" "}
              <Button
                variant="link"
                className="px-0 text-xs h-auto"
                onClick={() => navigate("/privacy-policy")}
              >
                Privacy Policy
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
