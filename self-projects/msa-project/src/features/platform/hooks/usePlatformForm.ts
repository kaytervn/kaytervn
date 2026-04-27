import { useToastStore } from "@/shared/stores/useToastStore";
import { TEXT, TOAST } from "@/shared/constants";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreatePlatformMutation,
  useUpdatePlatformMutation,
  useDeletePlatformMutation,
  usePlatformQuery,
  platformKeys,
} from "../services/platform.service";

export const usePlatformFormLogic = (
  id?: number,
  onClose?: () => void,
) => {
  const showToast = useToastStore((s) => s.showToast);
  const queryClient = useQueryClient();

  const { data: platformData, isLoading: isFetching } = usePlatformQuery(id);
  const createMutation = useCreatePlatformMutation();
  const updateMutation = useUpdatePlatformMutation();
  const deleteMutation = useDeletePlatformMutation();

  const isUpdate = !!id;

  const handleSubmit = async (data: any) => {
    const payload = isUpdate ? { ...data, id } : data;
    const mutation = isUpdate ? updateMutation : createMutation;

    try {
      const res = await mutation.mutateAsync(payload);
      if (res?.result) {
        showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
        queryClient.invalidateQueries({ queryKey: platformKeys.lists() });
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
        queryClient.invalidateQueries({ queryKey: platformKeys.lists() });
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
    initialData: platformData?.data,
    loading:
      isFetching ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    handleSubmit,
    handleDelete,
  };
};
