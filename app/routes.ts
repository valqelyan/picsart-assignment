import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/photo/:photoId", "routes/photo.tsx"),
] satisfies RouteConfig;
