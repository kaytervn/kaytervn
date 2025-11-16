import * as yup from "yup";
import { useToast } from "../../config/ToastProvider";
import useApi from "../../hooks/useApi";
import { usePageFormData } from "../../hooks/useFormData";
import { TEXT, TOAST } from "../../services/constant";
import { useEffect } from "react";
import {
  CommonFormContainer,
  CommonPasswordField,
  CommonTextField,
  FieldsContainer,
} from "../../components/CommonForm";
import { useParams } from "react-router-dom";
import { PAGE_CONFIG } from "../../config/PageConfig";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { CommonFormActions } from "../../components/Toolbar";
import { Stack } from "@mui/material";
import { SelectTagField } from "../../components/SelectBox";
import useEncryption from "../../hooks/useEncryption";
import { CommonJsonListField } from "../../components/JsonFieldList";

const schema = yup.object().shape({
  tagId: yup.number().required("Thẻ không hợp lệ"),
  username: yup.string().required("Tài khoản không hợp lệ"),
  password: yup.string().required("Mật khẩu không hợp lệ"),
});

export const BankForm = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const { bank, loading } = useApi();
  const { userEncrypt, userDecrypt } = useEncryption();
  const isUpdate = !!id;

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: {
      tagId: undefined,
      username: "",
      password: "",
      pins: "[]",
      numbers: "[]",
    },
  });

  const {
    data: fetchData,
    onClose,
    forceBack,
  } = usePageFormData(isDirty, PAGE_CONFIG.BANK.path, id, bank);

  useEffect(() => {
    if (fetchData) {
      reset({
        tagId: fetchData.tag?.id ?? undefined,
        username: fetchData.username ?? "",
        password: userDecrypt(fetchData.password) ?? "",
        pins: userDecrypt(fetchData.pins) ?? "[]",
        numbers: fetchData.numbers ?? "[]",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  const onSubmit = async (formData: any) => {
    const password = userEncrypt(formData.password);
    const pins = userEncrypt(formData.pins);
    const defaultFields = { password, pins };
    const payload = isUpdate
      ? { ...formData, ...defaultFields, id }
      : { ...formData, ...defaultFields };
    const action = isUpdate ? bank.update : bank.create;
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
        <SelectTagField control={control} />
        <FieldsContainer>
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
        </FieldsContainer>
        <CommonJsonListField
          control={control}
          name={"numbers"}
          label={"Số tài khoản"}
        />
        <CommonJsonListField control={control} name={"pins"} label={"Mã PIN"} />
      </Stack>
      <CommonFormActions
        isDirty={isDirty}
        onCancel={onClose}
        onSubmit={handleSubmit(onSubmit)}
      />
    </CommonFormContainer>
  );
};
