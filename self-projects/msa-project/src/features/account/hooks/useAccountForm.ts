import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToastStore } from "@/shared/stores/useToastStore";
import { useEncryption } from "@/shared/hooks/useEncryption";
import { useQueryClient } from "@tanstack/react-query";
import { TEXT, TOAST } from "@/shared/constants";
import {
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useAccountQuery,
  accountKeys,
} from "../services/account.service";
import {
  baseAccountSchema,
  createParentAccountSchema,
  updateParentAccountSchema,
  childAccountSchema,
  type AccountFormType,
} from "../types";

export const useAccountFormLogic = (
  isCreate: boolean,
  isUpdate: boolean,
  isLink: boolean,
  id?: number,
  onSuccess?: () => void,
) => {
  const showToast = useToastStore((s) => s.showToast);
  const queryClient = useQueryClient();
  const { userEncrypt, userDecrypt } = useEncryption();

  const { data: response, isLoading: isFetching } = useAccountQuery(
    !isCreate ? id : undefined
  );
  const fetchData = response?.data;

  const createMutation = useCreateAccountMutation();
  const updateMutation = useUpdateAccountMutation();

  const isParent = isCreate || fetchData?.kind === 1;
  const isChildren = fetchData?.kind === 2;
  const isLinkOrChildren = isLink || isChildren;

  // Determine which schema to use
  const schema = useMemo(() => {
    if (isLinkOrChildren) return childAccountSchema;
    if (isCreate) return createParentAccountSchema;
    if (isUpdate && isParent) return updateParentAccountSchema;
    return baseAccountSchema;
  }, [isCreate, isUpdate, isParent, isLinkOrChildren]);

  const form = useForm<AccountFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
      platformId: undefined,
      note: "",
      codes: "[]",
    },
  });

  useEffect(() => {
    if (fetchData) {
      form.reset({
        username: isLink ? "" : fetchData.username ?? "",
        password: isLink ? "" : userDecrypt(fetchData.password || "") ?? "",
        note: isLink ? "" : fetchData.note ?? "",
        platformId: isLink ? undefined : fetchData.platform?.id,
        codes: isLink ? "[]" : userDecrypt(fetchData.codes || "") ?? "[]",
      });
    }
  }, [fetchData, isLink, form, userDecrypt]);

  const handleSubmit = async (formData: AccountFormType) => {
    const parentId = isLink
      ? id
      : isChildren
      ? fetchData?.parent?.id
      : undefined;
    const tagId = isLink ? undefined : fetchData?.tag?.id;
    const kind = isLinkOrChildren ? 2 : 1;
    
    // Always encrypt password and codes
    const password = userEncrypt(formData.password || "");
    const codes = userEncrypt(formData.codes || "[]");

    const defaultFields = { tagId, kind, password, codes, parentId };
    const payload = isUpdate
      ? { ...formData, ...defaultFields, id }
      : { ...formData, ...defaultFields };

    const mutation = isUpdate ? updateMutation : createMutation;

    try {
      const res = await mutation.mutateAsync(payload);
      if (res?.result) {
        showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
        queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
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
    parentData: isLink ? fetchData : fetchData?.parent,
    isParent,
    isChildren,
    isLinkOrChildren,
    loading: isFetching || createMutation.isPending || updateMutation.isPending,
    handleSubmit,
  };
};
