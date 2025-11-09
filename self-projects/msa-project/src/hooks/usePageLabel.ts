import { useLocation } from "react-router-dom";
import { ENCRYPT_PATH, PAGE_CONFIG } from "../config/PageConfig";

export const usePageLabel = () => {
  const { pathname } = useLocation();

  const page = Object.values(PAGE_CONFIG).find((page) => {
    if (page.path === pathname) return true;
    if (page.path.includes(":")) {
      const base = page.path.split("/:")[0];
      return pathname.startsWith(base);
    }
    return false;
  });

  return page?.label || "";
};
export const usePageEncryption = () => {
  const { pathname } = useLocation();
  return ENCRYPT_PATH.some((path: string) => path === pathname);
};
