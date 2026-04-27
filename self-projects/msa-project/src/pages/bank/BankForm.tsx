import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import {
  DisplayField as CommonDisplayField,
  FormPageContainer as CommonFormContainer,
  FieldsContainer,
  FormPasswordField,
  FormTextField,
} from "@/shared/components/forms/FormFields";
import { CommonJsonListField } from "@/shared/components/forms/JsonFieldList";
import { SelectTagField } from "@/shared/components/forms/SelectBox";
import { FormActions as CommonFormActions } from "@/shared/components/buttons/Buttons";
import { PAGE_CONFIG } from "@/shared/constants";
import { comparePath } from "@/shared/utils/validation";
import { useBankFormLogic } from "@/features/bank/hooks/useBankForm";

export const BankForm: React.FC = () => {
  const { pathname } = useLocation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isUpdate = comparePath(pathname, PAGE_CONFIG.UPDATE_BANK.path);

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
    loading,
    handleSubmit: submitMutation,
  } = useBankFormLogic(
    isUpdate,
    id ? parseInt(id, 10) : undefined,
    handleSuccess
  );

  return (
    <CommonFormContainer loading={loading} isDirty={isDirty}>
      <Stack rowGap={3} direction={"column"}>
        {isUpdate && fetchData?.tag ? (
          <CommonDisplayField label={"Thẻ"} value={fetchData.tag.name} />
        ) : (
          <SelectTagField control={control as any} name="tagId" />
        )}
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
        
        <CommonJsonListField
          control={control as any}
          setValue={setValue as any}
          name={"numbers"}
          label={"Số tài khoản"}
        />
        
        <CommonJsonListField
          control={control as any}
          setValue={setValue as any}
          name={"pins"}
          label={"Mã PIN"}
        />
      </Stack>
      
      <CommonFormActions
        isDirty={isDirty}
        onCancel={() => navigate(-1)}
        onSubmit={handleSubmit(submitMutation as any)}
      />
    </CommonFormContainer>
  );
};
