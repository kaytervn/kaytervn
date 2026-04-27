import React from "react";
import { FormDialog } from "@/shared/components/forms/FormDialog";
import { FormTextField } from "@/shared/components/forms/FormFields";
import { LoadingOverlay } from "@/shared/components/feedback/LoadingOverlay";
import { TEXT } from "@/shared/constants";
import { tagSchema, type TagForm as TagFormType } from "@/features/tag/types";
import { useTagFormLogic } from "@/features/tag/hooks/useTagForm";

interface TagFormDialogProps {
  open: boolean;
  data?: { id?: number };
  onClose: () => void;
}

export const TagFormDialog: React.FC<TagFormDialogProps> = ({
  open,
  data,
  onClose,
}) => {
  const { isUpdate, initialData, loading, handleSubmit } = useTagFormLogic(
    data?.id,
    onClose,
  );

  return (
    <>
      <LoadingOverlay loading={loading} />
      <FormDialog<TagFormType>
        open={open}
        title={isUpdate ? TEXT.UPDATE_TAG : TEXT.CREATE_TAG}
        schema={tagSchema}
        defaultValues={{
          name: initialData?.name || "",
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
        ]}
      />
    </>
  );
};
