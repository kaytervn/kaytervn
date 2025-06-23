import { useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TAG_KIND,
  TOAST,
  VALID_PATTERN,
} from "../../services/constant";
import useForm from "../../hooks/useForm";
import {
  DECRYPT_FIELDS,
  PAGE_CONFIG,
} from "../../components/config/PageConfig";
import Sidebar from "../../components/page/Sidebar";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { ImageUploadField } from "../../components/form/OtherField";
import { InputField, TextAreaField } from "../../components/form/InputField";
import { SelectFieldLazy } from "../../components/form/SelectField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { LoadingDialog } from "../../components/page/Dialog";
import { useEffect, useState } from "react";
import useQueryState from "../../hooks/useQueryState";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { decryptData } from "../../services/utils";

const UpdateProject = () => {
  const { id } = useParams();
  const { setToast, sessionKey } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.PROJECT.path,
    requireSessionKey: true,
  });
  const { project, loading } = useApi();
  const { organization, tag } = useApi();

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.NAME.test(form.name)) {
      newErrors.name = "Tên không hợp lệ";
    }
    return newErrors;
  };
  const [fetchData, setFetchData] = useState<any>({});

  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm(
      {
        logo: "",
        name: "",
        note: "",
        organizationId: "",
        tagId: "",
      },
      validate
    );

  useEffect(() => {
    if (!id || !sessionKey) {
      handleNavigateBack();
      return;
    }

    const fetchData = async () => {
      resetForm();
      const res = await project.get(id);
      if (res.result) {
        const data = decryptData(sessionKey, res.data, DECRYPT_FIELDS.PROJECT);
        setFetchData(data);
        setForm({
          logo: data.logo,
          name: data.name,
          note: data.note,
          organizationId: data.organization?.id,
          tagId: data.tag?.id,
        });
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await project.update({
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
    <Sidebar
      breadcrumbs={[
        {
          label: `${fetchData?.name}`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.UPDATE_PROJECT.label,
        },
      ]}
      activeItem={PAGE_CONFIG.PROJECT.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.UPDATE_PROJECT.label}
            children={
              <div className="flex flex-col space-y-4">
                <ImageUploadField
                  title="Biểu trưng"
                  value={form.logo}
                  onChange={(value: any) => handleChange("logo", value)}
                />
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Tên ghi chú"
                    isRequired={true}
                    placeholder="Nhập tên ghi chú"
                    value={form.name}
                    onChangeText={(value: any) => handleChange("name", value)}
                    error={errors.name}
                  />
                  <SelectFieldLazy
                    title="Công ty"
                    fetchListApi={organization.autoComplete}
                    placeholder="Chọn công ty"
                    value={form.organizationId}
                    onChange={(value: any) =>
                      handleChange("organizationId", value)
                    }
                    error={errors.organizationId}
                    decryptFields={DECRYPT_FIELDS.ORGANIZATION}
                  />
                </div>

                <div className="flex flex-row space-x-2">
                  <TextAreaField
                    title="Ghi chú"
                    placeholder="Nhập ghi chú"
                    value={form.note}
                    onChangeText={(value: any) => handleChange("note", value)}
                    error={errors.note}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <SelectFieldLazy
                    title="Thẻ"
                    fetchListApi={tag.autoComplete}
                    placeholder="Chọn thẻ"
                    value={form.tagId}
                    onChange={(value: any) => handleChange("tagId", value)}
                    colorCodeField="colorCode"
                    error={errors.tagId}
                    decryptFields={DECRYPT_FIELDS.TAG}
                    queryParams={{ kind: TAG_KIND.PROJECT }}
                  />
                  <span className="flex-1" />
                </div>
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

export default UpdateProject;
