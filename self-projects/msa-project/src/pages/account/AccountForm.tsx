import React, { useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import {
  DisplayField as CommonDisplayField,
  FormPageContainer as CommonFormContainer,
  FieldsContainer,
  FormPasswordField,
  FormTextAreaField,
  FormTextField,
} from "@/shared/components/forms/FormFields";
import { CommonJsonListField } from "@/shared/components/forms/JsonFieldList";
import { SelectPlatformField } from "@/shared/components/forms/SelectBox";
import { FormActions as CommonFormActions } from "@/shared/components/buttons/Buttons";
import { PAGE_CONFIG } from "@/shared/constants";
import { comparePath } from "@/shared/utils/validation";
import { useAccountFormLogic } from "@/features/account/hooks/useAccountForm";

export const AccountForm: React.FC = () => {
  const { pathname } = useLocation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isCreate = comparePath(pathname, PAGE_CONFIG.CREATE_ACCOUNT.path);
  const isUpdate = comparePath(pathname, PAGE_CONFIG.UPDATE_ACCOUNT.path);
  const isLink = comparePath(pathname, PAGE_CONFIG.LINK_ACCOUNT.path);

  const handleSuccess = () => {
    navigate(-1);
  };

  const {
    form: {
      control,
      handleSubmit,
      setValue,
      formState: { isDirty },
    },
    fetchData,
    parentData,
    isParent,
    isLinkOrChildren,
    loading,
    handleSubmit: submitMutation,
  } = useAccountFormLogic(
    isCreate,
    isUpdate,
    isLink,
    id ? parseInt(id, 10) : undefined,
    handleSuccess
  );

  useEffect(() => {
    if (isLink && fetchData?.kind === 2) {
      handleSuccess();
    }
  }, [fetchData?.kind, isLink]);

  return (
    <CommonFormContainer loading={loading} isDirty={isDirty}>
      <Stack rowGap={3} direction={"column"}>
        <FieldsContainer>
          {isLinkOrChildren && parentData && (
            <CommonDisplayField
              label={"Tài khoản gốc"}
              value={`${parentData.platform?.name}: ${parentData.username}`}
            />
          )}
          {isUpdate && fetchData?.platform ? (
            <CommonDisplayField
              label={"Nền tảng"}
              value={fetchData.platform.name}
            />
          ) : (
            <SelectPlatformField control={control} name="platformId" />
          )}
        </FieldsContainer>
        
        {(isCreate || (isUpdate && isParent)) && (
          <FieldsContainer>
            <FormTextField
              control={control}
              name={"username"}
              label={"Tài khoản"}
              required
            />
            <FormPasswordField
              control={control}
              name={"password"}
              label={"Mật khẩu"}
              required
            />
          </FieldsContainer>
        )}
        
        <FormTextAreaField
          control={control}
          name={"note"}
          label={"Ghi chú"}
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
        onCancel={() => navigate(-1)}
        onSubmit={handleSubmit(submitMutation)}
      />
    </CommonFormContainer>
  );
};
