import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToastStore } from "@/shared/stores/useToastStore";
import { TEXT, TOAST } from "@/shared/constants";
import { AUTH_ROUTES } from "@/shared/constants";
import { useForgotPasswordMutation } from "../services/auth.service";
import { forgotPasswordSchema, type ForgotPasswordForm } from "../types";

export const useForgotPasswordForm = () => {
  const showToast = useToastStore((s) => s.showToast);
  const navigate = useNavigate();
  const mutation = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const handleSubmit = async (data: ForgotPasswordForm) => {
    const res = await mutation.mutateAsync(data);
    
    if (res?.result) {
      showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
      navigate(AUTH_ROUTES.RESET_PASSWORD.path, {
        state: { userId: res.data?.userId },
      });
    } else {
      showToast(TEXT.INVALID_EMAIL, TOAST.ERROR);
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
