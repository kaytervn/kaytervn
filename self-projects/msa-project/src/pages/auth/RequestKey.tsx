import React, { useEffect } from "react";
import { FormPasswordField } from "@/shared/components/forms/FormFields";
import { FormDialog } from "@/shared/components/forms/FormDialog";
import { TEXT } from "@/shared/constants";
import { requestKeySchema } from "@/features/auth/types";
import { useRequestKeyForm } from "@/features/auth/hooks/useRequestKeyForm";

interface RequestKeyProps {
  isVisible: boolean;
  onClose: () => void;
}

export const RequestKey: React.FC<RequestKeyProps> = ({
  isVisible,
  onClose,
}) => {
  const { form, handleSubmit } = useRequestKeyForm(onClose);

  useEffect(() => {
    if (!isVisible) {
      form.reset();
    }
  }, [isVisible, form]);

  return (
    <FormDialog
      open={isVisible}
      title={TEXT.REQUEST_KEY}
      schema={requestKeySchema}
      defaultValues={{ password: "" }}
      onClose={onClose}
      onSubmit={handleSubmit}
      fields={[
        {
          name: "password",
          render: ({ control }) => (
            <FormPasswordField
              control={control}
              name="password"
              label={TEXT.PASSWORD}
            />
          ),
        },
      ]}
    />
  );
};
