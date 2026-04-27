import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToastStore } from "@/shared/stores/useToastStore";
import { useEncryption } from "@/shared/hooks/useEncryption";
import { useQueryClient } from "@tanstack/react-query";
import { TEXT, TOAST } from "@/shared/constants";
import {
  useCreateBankMutation,
  useUpdateBankMutation,
  useBankQuery,
  bankKeys,
} from "../services/bank.service";
import { bankSchema, updateBankSchema, type BankFormType } from "../types";

export const useBankFormLogic = (
  isUpdate: boolean,
  id?: number,
  onSuccess?: () => void,
) => {
  const showToast = useToastStore((s) => s.showToast);
  const queryClient = useQueryClient();
  const { userEncrypt, userDecrypt } = useEncryption();

  const { data: response, isLoading: isFetching } = useBankQuery(
    isUpdate ? id : undefined
  );
  const fetchData = response?.data;

  const createMutation = useCreateBankMutation();
  const updateMutation = useUpdateBankMutation();

  const schema = isUpdate ? updateBankSchema : bankSchema;

  const form = useForm<BankFormType>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      tagId: undefined,
      username: "",
      password: "",
      pins: "[]",
      numbers: "[]",
    },
  });

  useEffect(() => {
    if (fetchData) {
      form.reset({
        tagId: fetchData.tag?.id,
        username: fetchData.username ?? "",
        password: userDecrypt(fetchData.password || "") ?? "",
        pins: userDecrypt(fetchData.pins || "") ?? "[]",
        numbers: fetchData.numbers ?? "[]",
      });
    }
  }, [fetchData, form, userDecrypt]);

  const handleSubmit = async (formData: BankFormType) => {
    // Encrypt fields
    const password = userEncrypt(formData.password || "");
    const pins = userEncrypt(formData.pins || "[]");

    const defaultFields = { password, pins };
    const payload = isUpdate
      ? { ...formData, ...defaultFields, id }
      : { ...formData, ...defaultFields };

    const mutation = isUpdate ? updateMutation : createMutation;

    try {
      const res = await mutation.mutateAsync(payload);
      if (res?.result) {
        showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
        queryClient.invalidateQueries({ queryKey: bankKeys.lists() });
        onSuccess?.();
      } else {
        showToast(res?.message || TEXT.REQUEST_FAILED, TOAST.ERROR);
      }
    } catch (e) {
      showToast(TEXT.REQUEST_FAILED, TOAST.ERROR);
    }
  };

  return {
    form,
    fetchData,
    loading: isFetching || createMutation.isPending || updateMutation.isPending,
    handleSubmit,
  };
};
