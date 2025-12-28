import type { RouteObject } from "react-router-dom";
import { AUTH_CONFIG, PAGE_CONFIG } from "./config/PageConfig";
import NotFound from "./pages/others/NotFound";

export const buildRoutes = (profile: any): RouteObject[] => {
  const routes = profile ? PAGE_CONFIG : AUTH_CONFIG;

  return [
    ...Object.values(routes).map(({ path, element }: any) => ({
      path,
      element,
    })),
    {
      path: "*",
      element: <NotFound />,
    },
  ];
};

