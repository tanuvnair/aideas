import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/LandingPage.tsx"),
  route("/signin", "routes/auth/SignIn.tsx"),
  route("/signup", "routes/auth/SignUp.tsx"),
  route("/dashboard", "routes/dashboard/Dashboard.tsx"),
] satisfies RouteConfig;
