import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { useToastStore } from "@/shared/stores/useToastStore";
import { TEXT, TOAST } from "@/shared/constants";
import { AUTH_ROUTES } from "@/shared/constants";
import { useResetPasswordMutation } from "../services/auth.service";
import { resetPasswordSchema, type ResetPasswordForm } from "../types";

export const useResetPasswordForm = () => {
  const showToast = useToastStore((s) => s.showToast);
  const { state } = useLocation();
  const navigate = useNavigate();
  const mutation = useResetPasswordMutation();

  useEffect(() => {
    if (!state?.userId) {
      navigate(AUTH_ROUTES.FORGOT_PASSWORD.path);
    }
  }, [state, navigate]);

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { code: "", newPassword: "", confirmPassword: "" },
  });

  const handleSubmit = async (data: ResetPasswordForm) => {
    const res = await mutation.mutateAsync({
      userId: state?.userId,
      code: data.code,
      password: data.newPassword,
    });

    if (res?.result) {
      showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
      navigate(AUTH_ROUTES.LOGIN.path);
    } else {
      showToast(res.message || TEXT.REQUEST_FAILED, TOAST.ERROR);
    }
  };

  const handleBack = () => navigate(AUTH_ROUTES.LOGIN.path);

  return {
    form,
    handleSubmit,
    handleBack,
    loading: mutation.isPending,
  };
};
