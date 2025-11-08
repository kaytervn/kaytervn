import * as yup from "yup";
import { useToast } from "../../config/ToastProvider";
import useApi from "../../hooks/useApi";
import { usePageFormData } from "../../hooks/useFormData";
import { TEXT, TOAST } from "../../services/constant";
import { useMemo } from "react";
import { LoadingOverlay } from "../../components/CustomOverlay";
import { CommonForm } from "../../components/CommonForm";
import { useParams } from "react-router-dom";
import { PAGE_CONFIG } from "../../config/PageConfig";

const schema = yup.object().shape({
  name: yup.string().required("Tên không hợp lệ"),
  url: yup.string().url("URL không hợp lệ").nullable(),
});

export const AccountForm = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const { account, loading } = useApi();
  const isUpdate = !!id;
  const { data: fetchData, onClose } = usePageFormData(
    PAGE_CONFIG.ACCOUNT.path,
    id,
    account
  );

  const handleSubmit = async (formData: any) => {
    const payload = isUpdate ? { ...formData, id } : formData;
    const action = isUpdate ? account.update : account.create;

    const res = await action(payload);
    if (res.result) {
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
      <CommonForm
        title={
          isUpdate
            ? PAGE_CONFIG.UPDATE_ACCOUNT.label
            : PAGE_CONFIG.CREATE_ACCOUNT.label
        }
        schema={schema}
        defaultValues={defaultValues}
        fields={[
          { name: "name", label: "Tên", required: true, size: 6 },
          { name: "url", label: "Đường dẫn", size: 3 },
        ]}
        onClose={onClose}
        onSubmit={handleSubmit}
      />
    </>
  );
};
