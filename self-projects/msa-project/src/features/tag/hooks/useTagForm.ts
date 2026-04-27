import { useToastStore } from "@/shared/stores/useToastStore";
import { TEXT, TOAST, DEFAULT_COLOR } from "@/shared/constants";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useTagQuery,
  tagKeys,
} from "../services/tag.service";

export const useTagFormLogic = (id?: number, onClose?: () => void) => {
  const showToast = useToastStore((s) => s.showToast);
  const queryClient = useQueryClient();

  const { data: tagData, isLoading: isFetching } = useTagQuery(id);
  const createMutation = useCreateTagMutation();
  const updateMutation = useUpdateTagMutation();
  const deleteMutation = useDeleteTagMutation();

  const isUpdate = !!id;

  const handleSubmit = async (data: any) => {
    const kind = tagData?.data?.kind ?? 2;
    const color = tagData?.data?.color ?? DEFAULT_COLOR;
    const payload = isUpdate
      ? { ...data, color, kind, id }
      : { ...data, color, kind };
    const mutation = isUpdate ? updateMutation : createMutation;

    try {
      const res = await mutation.mutateAsync(payload);
      if (res?.result) {
        showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
        queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
        onClose?.();
      } else {
        showToast(res?.message || TEXT.REQUEST_FAILED, TOAST.ERROR);
      }
    } catch (e) {
      showToast(TEXT.REQUEST_FAILED, TOAST.ERROR);
    }
  };

  const handleDelete = async (deleteId: number) => {
    try {
      const res = await deleteMutation.mutateAsync(deleteId);
      if (res?.result) {
        showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
        queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
        onClose?.();
      } else {
        showToast(res?.message || TEXT.REQUEST_FAILED, TOAST.ERROR);
      }
    } catch (e) {
      showToast(TEXT.REQUEST_FAILED, TOAST.ERROR);
    }
  };

  return {
    isUpdate,
    initialData: tagData?.data,
    loading:
      isFetching ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    handleSubmit,
    handleDelete,
  };
};
