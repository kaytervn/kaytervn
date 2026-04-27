import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToastStore } from "@/shared/stores/useToastStore";
import { TEXT, TOAST, LOCAL_STORAGE, GRANT_TYPE } from "@/shared/constants";
import { setStorageData } from "@/shared/services/storage";
import {
  useVerifyCredentialMutation,
  useLoginMutation,
} from "../services/auth.service";
import {
  loginSchema,
  type LoginForm,
  totpSchema,
  type TotpForm,
} from "../types";

export const useLoginForm = () => {
  const showToast = useToastStore((s) => s.showToast);

  const [isMfa, setIsMfa] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const verifyMutation = useVerifyCredentialMutation();
  const loginMutation = useLoginMutation();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "", totp: "" },
  });

  const totpForm = useForm<TotpForm>({
    resolver: zodResolver(totpSchema),
    defaultValues: { totp: "" },
  });

  const handleVerifyCredential = async (data: LoginForm) => {
    const res = await verifyMutation.mutateAsync({
      username: data.username,
      password: data.password,
    });

    if (!res?.result) {
      showToast(TEXT.LOGIN_FAILED, TOAST.ERROR);
      return;
    }

    setIsMfa(true);
    if (res.data?.qrCodeUrl) {
      setQrUrl(res.data.qrCodeUrl);
    }
  };

  const handleLogin = async (data: TotpForm) => {
    const { username, password } = loginForm.getValues();

    const res = await loginMutation.mutateAsync({
      username,
      password,
      totp: data.totp,
      grant_type: GRANT_TYPE.PASSWORD,
    });

    const accessToken = res?.data?.access_token;
    if (res?.result && accessToken) {
      showToast(TEXT.LOGGED_IN, TOAST.SUCCESS);
      setStorageData(LOCAL_STORAGE.ACCESS_TOKEN, accessToken);
      window.location.href = "/";
    } else {
      showToast(TEXT.INVALID_TOTP, TOAST.ERROR);
    }
  };

  const handleCancelMfa = () => {
    setIsMfa(false);
    setQrUrl(null);
    totpForm.reset();
  };

  return {
    isMfa,
    qrUrl,
    loginForm,
    totpForm,
    handleVerifyCredential,
    handleLogin,
    handleCancelMfa,
    loading: verifyMutation.isPending || loginMutation.isPending,
  };
};
