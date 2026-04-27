import React from "react";
import {
  FormTextField,
  DisplayField,
} from "@/shared/components/forms/FormFields";
import { FormDialog } from "@/shared/components/forms/FormDialog";
import { TEXT } from "@/shared/constants";
import { profileSchema } from "@/features/auth/types";
import { useProfileForm } from "@/features/auth/hooks/useProfileForm";

interface ProfileProps {
  isVisible: boolean;
  onClose: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ isVisible, onClose }) => {
  const { handleSubmit, profileData } = useProfileForm(isVisible, onClose);

  return (
    <FormDialog
      open={isVisible}
      title={TEXT.PROFILE}
      schema={profileSchema}
      defaultValues={{ fullName: "", email: "" }}
      onClose={onClose}
      onSubmit={handleSubmit}
      fields={[
        {
          name: "fullName",
          render: ({ control }) => (
            <FormTextField
              control={control}
              name="fullName"
              label={"Họ và tên"}
            />
          ),
        },
        {
          name: "username" as any,
          render: () => (
            <DisplayField
              label={"Tài khoản"}
              value={profileData?.username}
            />
          ),
        },
        {
          name: "email",
          render: ({ control }) => (
            <FormTextField
              control={control}
              name="email"
              label={"Địa chỉ e-mail"}
            />
          ),
        },
      ]}
    />
  );
};
