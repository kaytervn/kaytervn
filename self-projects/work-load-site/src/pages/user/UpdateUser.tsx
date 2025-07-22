/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useQueryState from "../../hooks/useQueryState";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import useApi from "../../hooks/useApi";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  STATUS_MAP,
  TOAST,
  USER_KIND_MAP,
  VALID_PATTERN,
} from "../../types/constant";
import { useEffect, useState } from "react";
import useForm from "../../hooks/useForm";
import Sidebar2 from "../../components/main/Sidebar2";
import { LoadingDialog } from "../../components/form/Dialog";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { ImageUploadField } from "../../components/form/OtherField";
import { InputField2 } from "../../components/form/InputTextField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import {
  SelectField2,
  StaticSelectField,
} from "../../components/form/SelectTextField";

const UpdateUser = () => {
  const { id } = useParams();
  const { setToast } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.USER.path,
  });
  const { user, loading } = useApi();
  const { role } = useApi();

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.EMAIL.test(form.email)) {
      newErrors.email = "Invalid email";
    }
    if (!form.groupId) {
      newErrors.groupId = "Invalid role";
    }
    if (form.status != 0 && !form.status) {
      newErrors.status = "Invalid status";
    }
    return newErrors;
  };
  const [fetchData, setFetchData] = useState<any>({});

  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm(
      {
        fullName: "",
        username: "",
        email: "",
        avatarPath: "",
        groupId: "",
        status: 1,
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
      const res = await user.get(id);
      if (res.result) {
        const data = res.data;
        setFetchData(data);
        setForm({
          fullName: data.fullName,
          username: data.username,
          email: data.email,
          avatarPath: data.avatarPath,
          status: data.status,
          groupId: data.group?.id,
        });
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await user.update({
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
          label: `${fetchData?.fullName}`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.UPDATE_USER.label,
        },
      ]}
      activeItem={PAGE_CONFIG.USER.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.UPDATE_USER.label}
            children={
              <div className="flex flex-col space-y-4">
                <ImageUploadField
                  title="Avatar"
                  value={form.avatarPath}
                  disabled={true}
                />
                <div className="flex flex-row space-x-2">
                  <SelectField2
                    title="Role"
                    isRequired={true}
                    fetchListApi={role.autoComplete}
                    placeholder="Choose role"
                    value={form.groupId}
                    onChange={(value: any) => handleChange("groupId", value)}
                    error={errors.groupId}
                    queryParams={{
                      kind: fetchData?.kind,
                    }}
                  />
                  <StaticSelectField
                    title="Kind"
                    disabled={true}
                    dataMap={USER_KIND_MAP}
                    value={fetchData.kind}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField2
                    title="Full name"
                    value={form.fullName}
                    disabled={true}
                  />
                  <InputField2
                    title="Username"
                    value={form.username}
                    disabled={true}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField2
                    title="Email"
                    isRequired={true}
                    placeholder="Enter email address"
                    value={form.email}
                    onChangeText={(value: any) => handleChange("email", value)}
                    error={errors.email}
                  />
                  <StaticSelectField
                    title="Status"
                    isRequired={true}
                    placeholder="Choose status"
                    dataMap={STATUS_MAP}
                    value={form.status}
                    onChange={(value: any) => handleChange("status", value)}
                    error={errors.status}
                  />
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

export default UpdateUser;
