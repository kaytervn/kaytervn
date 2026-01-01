import { useToast } from "../../config/ToastProvider";
import useApi from "../../hooks/useApi";
import { usePageFormData } from "../../hooks/useFormData";
import { TEXT, TOAST } from "../../services/constant";
import { useEffect, useState } from "react";
import {
  CommonDisplayField,
  CommonFormContainer,
  CommonPasswordField,
  CommonTextAreaField,
  CommonTextField,
  FieldsContainer,
} from "../../components/CommonForm";
import { useLocation, useParams } from "react-router-dom";
import { PAGE_CONFIG } from "../../config/PageConfig";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { CommonFormActions } from "../../components/Toolbar";
import { Stack } from "@mui/material";
import { SelectPlatformField } from "../../components/SelectBox";
import useEncryption from "../../hooks/useEncryption";
import { CommonJsonListField } from "../../components/JsonFieldList";
import { comparePath } from "../../hooks/usePageLabel";
import { useAccountSchema } from "../../hooks/useSchema";

export const AccountForm = () => {
  const { pathname } = useLocation();
  const { id } = useParams();
  const { showToast } = useToast();
  const { account, loading } = useApi();
  const { userEncrypt, userDecrypt } = useEncryption();
  const [fetchedData, setFetchedData] = useState<any>(undefined);

  const isCreate = comparePath(pathname, PAGE_CONFIG.CREATE_ACCOUNT.path);
  const isUpdate = comparePath(pathname, PAGE_CONFIG.UPDATE_ACCOUNT.path);
  const isLink = comparePath(pathname, PAGE_CONFIG.LINK_ACCOUNT.path);
  const isParent = isCreate || fetchedData?.kind === 1;
  const schema = useAccountSchema(isCreate, isUpdate, isParent);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { isDirty },
  } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
      platformId: undefined,
      note: "",
      codes: "[]",
    },
  });

  const {
    data: fetchData,
    onClose,
    forceBack,
  } = usePageFormData(isDirty, PAGE_CONFIG.ACCOUNT.path, id, account);

  useEffect(() => {
    if (isLink && fetchData?.kind === 2) {
      forceBack();
    }
  }, [fetchData?.kind, forceBack, isLink]);

  const parent = isLink ? fetchData : fetchData?.parent;
  const isChildren = fetchData?.kind === 2;
  const isLinkOrChildren = isLink || isChildren;

  useEffect(() => {
    if (fetchData) {
      setFetchedData(fetchData);
      reset({
        username: isLink ? "" : fetchData.username ?? "",
        password: isLink ? "" : userDecrypt(fetchData.password) ?? "",
        note: isLink ? "" : fetchData.note ?? "",
        platformId: isLink ? undefined : fetchData.platform?.id ?? undefined,
        codes: isLink ? "[]" : userDecrypt(fetchData.codes) ?? "[]",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  const onSubmit = async (formData: any) => {
    const parentId = isLink
      ? id
      : isChildren
      ? fetchData?.parent?.id
      : undefined;
    const tagId = isLink ? undefined : fetchData?.tag?.id ?? undefined;
    const kind = isLinkOrChildren ? 2 : 1;
    const password = userEncrypt(formData.password);
    const codes = userEncrypt(formData.codes);
    const defaultFields = { tagId, kind, password, codes, parentId };
    const payload = isUpdate
      ? { ...formData, ...defaultFields, id }
      : { ...formData, ...defaultFields };
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
    <CommonFormContainer loading={loading} isDirty={isDirty}>
      <Stack rowGap={3} direction={"column"}>
        <FieldsContainer>
          {isLinkOrChildren && (
            <CommonDisplayField
              label={"Tài khoản gốc"}
              value={`${parent?.platform?.name}: ${parent?.username}`}
            />
          )}
          {isUpdate ? (
            <CommonDisplayField
              label={"Nền tảng"}
              value={fetchData?.platform?.name}
            />
          ) : (
            <SelectPlatformField control={control} />
          )}
        </FieldsContainer>
        {(isCreate || (isUpdate && isParent)) && (
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
        )}
        <CommonTextAreaField
          control={control}
          name={"note"}
          label={"Ghi chú"}
          required={false}
        />
        <CommonJsonListField
          control={control}
          setValue={setValue}
          name={"codes"}
          label={"Mã khôi phục"}
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
