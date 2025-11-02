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

export const DIALOG_TYPE = {
  FORM: "FORM",
  DELETE: "DELETE",
} as const;

export type DIALOG_TYPE = (typeof DIALOG_TYPE)[keyof typeof DIALOG_TYPE];

export interface DialogState {
  visible: boolean;
  type: DIALOG_TYPE;
  data?: any;
}

export const useDialogManager = () => {
  const [state, setState] = useState<DialogState>({
    visible: false,
    type: DIALOG_TYPE.FORM,
    data: undefined,
  });

  const open = (data?: any, type: DIALOG_TYPE = DIALOG_TYPE.FORM) => {
    setState({ visible: true, type, data });
  };

  const close = () => {
    setState((prev) => ({ ...prev, visible: false }));
  };

  const reset = () => {
    setState({ visible: false, type: DIALOG_TYPE.FORM, data: undefined });
  };

  return {
    ...state,
    open,
    close,
    reset,
    isForm: state.type === DIALOG_TYPE.FORM,
    isDelete: state.type === DIALOG_TYPE.DELETE,
  };
};
