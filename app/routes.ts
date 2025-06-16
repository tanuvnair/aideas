import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/LandingPage.tsx"),
  route("/privacy-policy", "routes/legal/PrivacyPolicy.tsx"),
  route("/terms-of-service", "routes/legal/TermsOfService.tsx"),
  route("/contact-us", "routes/support/ContactUs.tsx"),
  route("/help-center", "routes/support/HelpCenter.tsx"),
  route("/signin", "routes/auth/SignIn.tsx"),
  route("/signup", "routes/auth/SignUp.tsx"),
  route("/reset-password", "routes/auth/ResetPassword.tsx"),
  route("/dashboard", "routes/dashboard/Dashboard.tsx"),
] satisfies RouteConfig;
