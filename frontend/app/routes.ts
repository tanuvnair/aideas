import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/LandingPage.tsx"),
  route("/signin", "routes/SignIn.tsx"),
] satisfies RouteConfig;
