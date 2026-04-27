import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToastStore } from "@/shared/stores/useToastStore";
import { TEXT, TOAST } from "@/shared/constants";
import { useChangePasswordMutation } from "../services/auth.service";
import { changePasswordSchema, type ChangePasswordForm } from "../types";

export const useChangePasswordForm = (onClose: () => void) => {
  const showToast = useToastStore((s) => s.showToast);
  const mutation = useChangePasswordMutation();

  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const handleSubmit = async (data: ChangePasswordForm) => {
    const res = await mutation.mutateAsync({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });

    if (res?.result) {
      showToast(TEXT.CHANGE_PASSWORD_SUCCESS, TOAST.SUCCESS);
      onClose();
      form.reset();
    } else {
      showToast(res.message || TEXT.REQUEST_FAILED, TOAST.ERROR);
    }
  };

  return {
    form,
    handleSubmit,
    loading: mutation.isPending,
  };
};
