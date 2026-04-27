import React from "react";
import { FormDialog } from "@/shared/components/forms/FormDialog";
import { FormTextField } from "@/shared/components/forms/FormFields";
import { LoadingOverlay } from "@/shared/components/feedback/LoadingOverlay";
import { TEXT } from "@/shared/constants";
import { platformSchema, type PlatformForm } from "@/features/platform/types";
import { usePlatformFormLogic } from "@/features/platform/hooks/usePlatformForm";

interface PlatformFormDialogProps {
  open: boolean;
  data?: { id?: number };
  onClose: () => void;
}

export const PlatformFormDialog: React.FC<PlatformFormDialogProps> = ({
  open,
  data,
  onClose,
}) => {
  const { isUpdate, initialData, loading, handleSubmit } = usePlatformFormLogic(
    data?.id,
    onClose,
  );

  return (
    <>
      <LoadingOverlay loading={loading} />
      <FormDialog<PlatformForm>
        open={open}
        title={isUpdate ? TEXT.UPDATE_PLATFORM : TEXT.CREATE_PLATFORM}
        schema={platformSchema}
        defaultValues={{
          name: initialData?.name || "",
          url: initialData?.url || "",
        }}
        onClose={onClose}
        onSubmit={handleSubmit}
        fields={[
          {
            name: "name",
            render: ({ control }) => (
              <FormTextField control={control} name="name" label="Tên" required />
            ),
          },
          {
            name: "url",
            render: ({ control }) => (
              <FormTextField control={control} name="url" label="Đường dẫn" />
            ),
          },
        ]}
      />
    </>
  );
};
