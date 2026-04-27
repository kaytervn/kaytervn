import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToastStore } from "@/shared/stores/useToastStore";
import { useSessionStore } from "@/shared/stores/useSessionStore";
import { TEXT, TOAST } from "@/shared/constants";
import { useEncryption } from "@/shared/hooks/useEncryption";
import { decryptRSA } from "@/shared/utils/crypto";
import { apiFetch } from "@/shared/services/apiFetch";
import { ENV } from "@/shared/types/env.types";
import { AUTH_TYPE, METHOD } from "@/shared/constants";
import { inputKeySchema, type InputKeyForm } from "../types";
import { useMutation } from "@tanstack/react-query";

interface MyKeyResponse {
  secretKey: string;
}

export const useInputKeyForm = (onClose: () => void) => {
  const showToast = useToastStore((s) => s.showToast);
  const setSessionKey = useSessionStore((s) => s.setSessionKey);
  const refreshSessionTimeout = useSessionStore((s) => s.refreshSessionTimeout);
  const { clientDecryptIgnoreNonce } = useEncryption();

  const myKeyMutation = useMutation({
    mutationFn: () =>
      apiFetch<MyKeyResponse>({
        apiUrl: ENV.API_URL,
        endpoint: "/v1/user/my-key",
        method: METHOD.GET,
        authType: AUTH_TYPE.BEARER,
      }),
  });

  const form = useForm<InputKeyForm>({
    resolver: zodResolver(inputKeySchema),
    defaultValues: { sessionKey: "" },
  });

  const handleSubmit = async (data: InputKeyForm) => {
    try {
      const res = await myKeyMutation.mutateAsync();
      if (!res?.result || !res.data?.secretKey) {
        showToast(TEXT.REQUEST_FAILED, TOAST.ERROR);
        return;
      }

      const secretKey = res.data.secretKey;
      const clientDecrypted = clientDecryptIgnoreNonce(data.sessionKey);
      
      if (!clientDecrypted) {
        form.setError("sessionKey", { message: "Khoá giải mã không hợp lệ" });
        return;
      }

      const decryptedKey = decryptRSA(clientDecrypted, secretKey);

      if (!decryptedKey) {
        form.setError("sessionKey", { message: "Khoá giải mã không hợp lệ" });
        return;
      }

      setSessionKey(decryptedKey);
      refreshSessionTimeout();
      showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
      onClose();
      form.reset();
    } catch (e) {
      showToast(TEXT.REQUEST_FAILED, TOAST.ERROR);
    }
  };

  return {
    form,
    handleSubmit,
    loading: myKeyMutation.isPending,
  };
};
