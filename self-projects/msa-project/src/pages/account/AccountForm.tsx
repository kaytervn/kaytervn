import * as yup from "yup";
import { useToast } from "../../config/ToastProvider";
import useApi from "../../hooks/useApi";
import { usePageFormData } from "../../hooks/useFormData";
import { TEXT, TOAST } from "../../services/constant";
import { useEffect } from "react";
import {
  CommonFormContainer,
  CommonPasswordField,
  CommonTextAreaField,
  CommonTextField,
} from "../../components/CommonForm";
import { useParams } from "react-router-dom";
import { PAGE_CONFIG } from "../../config/PageConfig";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { CommonFormActions } from "../../components/Toolbar";
import { Stack } from "@mui/material";
import { SelectPlatformField } from "../../components/SelectBox";
import useEncryption from "../../hooks/useEncryption";
import { CommonJsonListField } from "../../components/JsonFieldList";

const schema = yup.object().shape({
  username: yup.string().required("Tài khoản không hợp lệ"),
  password: yup.string().required("Mật khẩu không hợp lệ"),
  platformId: yup.number().required("Nền tảng không hợp lệ"),
});

export const AccountForm = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const { account, loading } = useApi();
  const { userEncrypt } = useEncryption();
  const isUpdate = !!id;
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
      platformId: undefined,
      note: "",
    },
  });
  const {
    data: fetchData,
    onClose,
    forceBack,
  } = usePageFormData(isDirty, PAGE_CONFIG.ACCOUNT.path, id, account);
  useEffect(() => {
    if (fetchData) {
      reset({
        username: fetchData.username ?? "",
        password: fetchData.password ?? "",
        note: fetchData.note ?? "",
      });
    }
  }, [fetchData, reset]);

  const onSubmit = async (formData: any) => {
    const password = userEncrypt(formData.password);
    const payload = isUpdate
      ? { ...formData, password, id }
      : { ...formData, password, kind: 1 };
    const action = isUpdate ? account.update : account.create;

    const res = await action(payload);
    if (res.result) {
      forceBack();
      showToast(TEXT.REQUEST_SUCCESS, TOAST.SUCCESS);
    } else {
      showToast(res.message || TEXT.REQUEST_FAILED, TOAST.ERROR);
    }
  };

  return (
    <CommonFormContainer loading={loading}>
      <Stack rowGap={3} direction={"column"}>
        <SelectPlatformField control={control} />
        <Stack direction={{ xs: "column", md: "row" }} columnGap={1} rowGap={3}>
          <CommonTextField
            control={control}
            name={"username"}
            label={"Tài khoản"}
            required
          />
          <CommonPasswordField
            control={control}
            name={"password"}
            label={"Mật khẩu"}
            required
          />
        </Stack>
        <CommonJsonListField control={control} name={"codes"} label={"Code"} />
        <CommonTextAreaField
          control={control}
          name={"note"}
          label={"Ghi chú"}
          required={false}
        />
      </Stack>
      <CommonFormActions
        isDirty={isDirty}
        onCancel={onClose}
        onSubmit={handleSubmit(onSubmit)}
      />
    </CommonFormContainer>
  );
};
