import * as yup from "yup";
import { CommonFormDialog } from "../../components/CommonDialog";
import { DEFAULT_COLOR, TEXT, TOAST } from "../../services/constant";
import { useToast } from "../../config/ToastProvider";
import useApi from "../../hooks/useApi";
import { LoadingOverlay } from "../../components/CustomOverlay";
import { useMemo } from "react";
import { useDialogFormData } from "../../hooks/useFormData";

const schema = yup.object().shape({
  name: yup.string().required("Tên không hợp lệ"),
});

export const TagForm = ({
  open,
  data,
  onClose,
  refreshData,
}: {
  open: boolean;
  data?: any;
  onClose: () => void;
  refreshData: () => void;
}) => {
  const { showToast } = useToast();
  const { tag, loading } = useApi();
  const isUpdate = !!data?.id;
  const fetchData = useDialogFormData(open, data?.id, tag, onClose);

  const handleSubmit = async (formData: any) => {
    const kind = fetchData?.kind ?? 2;
    const color = fetchData?.color ?? DEFAULT_COLOR;
    const payload = isUpdate
      ? { ...formData, color, kind, id: data.id }
      : { ...formData, color, kind };
    const action = isUpdate ? tag.update : tag.create;

    const res = await action(payload);
    if (res.result) {
      await refreshData();
      onClose();
      showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
    } else {
      showToast(res.message || TEXT.REQUEST_FAILED, TOAST.ERROR);
    }
  };

  const defaultValues = useMemo(
    () => ({
      name: fetchData?.name ?? "",
    }),
    [fetchData]
  );

  return (
    <>
      <LoadingOverlay loading={loading} />
      <CommonFormDialog
        open={open}
        title={isUpdate ? TEXT.UPDATE_TAG : TEXT.CREATE_TAG}
        schema={schema}
        defaultValues={defaultValues}
        fields={[{ name: "name", label: "Tên", required: true }]}
        onClose={onClose}
        onSubmit={handleSubmit}
      />
    </>
  );
};
