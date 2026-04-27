import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToastStore } from "@/shared/stores/useToastStore";
import { TEXT, TOAST } from "@/shared/constants";
import { useRequestKeyMutation } from "../services/auth.service";
import { requestKeySchema, type RequestKeyForm } from "../types";

export const useRequestKeyForm = (onClose: () => void) => {
  const showToast = useToastStore((s) => s.showToast);
  const mutation = useRequestKeyMutation();

  const form = useForm<RequestKeyForm>({
    resolver: zodResolver(requestKeySchema),
    defaultValues: { password: "" },
  });

  const handleSubmit = async (data: RequestKeyForm) => {
    const res = await mutation.mutateAsync({
      password: data.password,
    });

    if (res?.result) {
      showToast(TEXT.REQUEST_KEY_SUCCESS, TOAST.SUCCESS);
      onClose();
      form.reset();
    } else {
      showToast(TEXT.INVALID_PASSWORD, TOAST.ERROR);
    }
  };

  return {
    form,
    handleSubmit,
    loading: mutation.isPending,
  };
};
