import { useLocation } from "react-router-dom";
import { PAGE_CONFIG, ENCRYPT_PATH } from "@/shared/constants";
import { comparePath } from "@/shared/utils/validation";

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
