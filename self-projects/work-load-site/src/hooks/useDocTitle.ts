/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

const useDocTitle = (title = "MSA") => {
  useEffect(() => {
    document.title = title;
  }, []);
};

export default useDocTitle;
