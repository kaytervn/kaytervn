/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useQueryState from "../../hooks/useQueryState";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import useApi from "../../hooks/useApi";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TAG_KIND_MAP,
  TOAST,
} from "../../types/constant";
import { useEffect, useState } from "react";
import useForm from "../../hooks/useForm";
import Sidebar2 from "../../components/main/Sidebar2";
import { LoadingDialog } from "../../components/form/Dialog";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { SelectField2 } from "../../components/form/SelectTextField";
import { TextAreaField2 } from "../../components/form/TextareaField";

const UpdateNote = () => {
  const { id } = useParams();
  const { setToast } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.NOTE.path,
  });
  const { note, loading } = useApi();
  const { tag } = useApi();

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "Invalid Name";
    }
    if (!form.note.trim()) {
      newErrors.note = "Invalid Note";
    }
    return newErrors;
  };
  const [fetchData, setFetchData] = useState<any>({});
  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm(
      {
        name: "",
        note: "",
        tagId: "",
      },
      validate
    );

  useEffect(() => {
    if (!id) {
      handleNavigateBack();
      return;
    }

    const fetchData = async () => {
      resetForm();
      const res = await note.get(id);
      if (res.result) {
        const data = res.data;
        setFetchData(data);
        setForm({
          ...data,
          tagId: data.tag?.id || "",
        });
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await note.update({
        id,
        ...form,
      });
      if (res.result) {
        setToast(BASIC_MESSAGES.UPDATED, TOAST.SUCCESS);
        handleNavigateBack();
      } else {
        setToast(res.message || BASIC_MESSAGES.FAILED, TOAST.ERROR);
      }
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  return (
    <Sidebar2
      breadcrumbs={[
        {
          label: `${fetchData?.name}`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.UPDATE_NOTE.label,
        },
      ]}
      activeItem={PAGE_CONFIG.NOTE.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.UPDATE_NOTE.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <InputField2
                    title="Name"
                    isRequired={true}
                    placeholder="Enter name"
                    value={form.name}
                    onChangeText={(value: any) => handleChange("name", value)}
                    error={errors.name}
                  />
                  <SelectField2
                    title="Tag"
                    fetchListApi={tag.autoComplete}
                    placeholder="Choose tag"
                    value={form.tagId}
                    onChange={(value: any) => handleChange("tagId", value)}
                    error={errors.tagId}
                    colorCodeField="color"
                    queryParams={{ kind: TAG_KIND_MAP.NOTE.value }}
                    initSearch={fetchData?.tag?.name}
                  />
                </div>
                <TextAreaField2
                  title="Note"
                  isRequired={true}
                  placeholder="Enter note"
                  value={form?.note}
                  onChangeText={(value: any) => handleChange("note", value)}
                  error={errors?.note}
                  height={"500"}
                  maxLength={5000}
                />
                <ActionSection
                  children={
                    <>
                      <CancelButton onClick={handleNavigateBack} />
                      <SubmitButton
                        text={BUTTON_TEXT.UPDATE}
                        onClick={handleSubmit}
                      />
                    </>
                  }
                />
              </div>
            }
          />
        </>
      }
    />
  );
};

export default UpdateNote;
