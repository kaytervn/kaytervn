import { useLocation } from "react-router-dom";
import { ENCRYPT_PATH, PAGE_CONFIG } from "../config/PageConfig";

export const comparePath = (pathname: string, pagePath: string) => {
  if (pagePath === pathname) return true;
  if (pagePath.includes(":")) {
    const base = pagePath.split("/:")[0];
    return pathname.startsWith(base);
  }
  return false;
};

export const usePageLabel = () => {
  const { pathname } = useLocation();

  const page = Object.values(PAGE_CONFIG).find((page) => {
    return comparePath(pathname, page.path);
  });

  return page?.label || "";
};
export const usePageEncryption = () => {
  const { pathname } = useLocation();
  return ENCRYPT_PATH.some((path: string) => comparePath(pathname, path));
};
