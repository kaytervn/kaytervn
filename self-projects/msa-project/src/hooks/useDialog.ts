import { useState } from "react";

export const useDialog = () => {
  const [isVisible, setIsVisible] = useState(false);

  const onOpen = () => {
    setIsVisible(true);
  };

  const onClose = () => {
    setIsVisible(false);
  };

  return { isVisible, onOpen, onClose };
};
