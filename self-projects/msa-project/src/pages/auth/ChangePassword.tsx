import React, { useEffect } from "react";
import {
  FormPasswordField,
} from "@/shared/components/forms/FormFields";
import { FormDialog } from "@/shared/components/forms/FormDialog";
import { TEXT } from "@/shared/constants";
import { changePasswordSchema } from "@/features/auth/types";
import { useChangePasswordForm } from "@/features/auth/hooks/useChangePasswordForm";

interface ChangePasswordProps {
  isVisible: boolean;
  onClose: () => void;
}

export const ChangePassword: React.FC<ChangePasswordProps> = ({
  isVisible,
  onClose,
}) => {
  const { form, handleSubmit } = useChangePasswordForm(onClose);

  useEffect(() => {
    if (!isVisible) {
      form.reset();
    }
  }, [isVisible, form]);

  return (
    <FormDialog
      open={isVisible}
      title={TEXT.CHANGE_PASSWORD}
      schema={changePasswordSchema}
      defaultValues={{ oldPassword: "", newPassword: "", confirmPassword: "" }}
      onClose={onClose}
      onSubmit={handleSubmit}
      fields={[
        {
          name: "oldPassword",
          render: ({ control }) => (
            <FormPasswordField
              control={control}
              name="oldPassword"
              label={TEXT.CURRENT_PASSWORD}
            />
          ),
        },
        {
          name: "newPassword",
          render: ({ control }) => (
            <FormPasswordField
              control={control}
              name="newPassword"
              label={TEXT.NEW_PASSWORD}
            />
          ),
        },
        {
          name: "confirmPassword",
          render: ({ control }) => (
            <FormPasswordField
              control={control}
              name="confirmPassword"
              label={TEXT.CONFIRM_PASSWORD}
            />
          ),
        },
      ]}
    />
  );
};
