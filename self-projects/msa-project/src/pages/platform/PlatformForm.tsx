import * as yup from "yup";
import { CommonFormDialog } from "../../components/CommonDialog";
import { TEXT, TOAST } from "../../services/constant";
import { useToast } from "../../config/ToastProvider";
import useApi from "../../hooks/useApi";
import { LoadingOverlay } from "../../components/CustomOverlay";
import { useFormData } from "../../hooks/useFormData";
import { useMemo } from "react";

const schema = yup.object().shape({
  name: yup.string().required("Tên không hợp lệ"),
  url: yup.string().url("URL không hợp lệ").nullable(),
});

export const PlatformForm = ({
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
  const { platform, loading } = useApi();
  const isUpdate = !!data?.id;
  const fetchData = useFormData(open, data?.id, platform, onClose);

  const handleSubmit = async (formData: any) => {
    const payload = isUpdate ? { ...formData, id: data.id } : formData;
    const action = isUpdate ? platform.update : platform.create;

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
      url: fetchData?.url ?? "",
    }),
    [fetchData]
  );

  return (
    <>
      <LoadingOverlay loading={loading} />
      <CommonFormDialog
        open={open}
        title={isUpdate ? TEXT.UPDATE_PLATFORM : TEXT.CREATE_PLATFORM}
        schema={schema}
        defaultValues={defaultValues}
        fields={[
          { name: "name", label: "Tên", required: true },
          { name: "url", label: "Đường dẫn" },
        ]}
        onClose={onClose}
        onSubmit={handleSubmit}
      />
    </>
  );
};
