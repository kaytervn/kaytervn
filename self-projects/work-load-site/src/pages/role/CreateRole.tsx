/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import useApi from "../../hooks/useApi";
import useQueryState from "../../hooks/useQueryState";
import useForm from "../../hooks/useForm";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TOAST,
  USER_KIND_MAP,
} from "../../types/constant";
import Sidebar2 from "../../components/main/Sidebar2";
import { LoadingDialog } from "../../components/form/Dialog";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import { StaticSelectField } from "../../components/form/SelectTextField";
import { CheckboxField } from "../../components/form/Checkbox";
import { CancelButton, SubmitButton } from "../../components/form/Button";

const CreateRole = () => {
  const { setToast } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.ROLE.path,
  });
  const { role, loading } = useApi();
  const [groupPermissions, setGroupPermissions] = useState<any>(null);

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "Invalid name";
    }
    if (form.permissionIds.length <= 0) {
      newErrors.permissionIds = "At least one permission is required";
    }
    return newErrors;
  };

  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm(
      {
        name: "",
        permissionIds: [],
      },
      validate
    );

  useEffect(() => {
    const fetchData = async () => {
      resetForm();
      try {
        const permissionData = await role.listPermissions({
          kind: USER_KIND_MAP.USER.value,
          isPaged: 0,
        });
        if (permissionData.result) {
          const groupedPermissions = permissionData?.data?.content.reduce(
            (acc: any, perm: any) => {
              if (!acc[perm.nameGroup]) acc[perm.nameGroup] = [];
              acc[perm.nameGroup].push(perm);
              return acc;
            },
            {}
          );
          setGroupPermissions(groupedPermissions);
        } else {
          handleNavigateBack();
        }
      } catch {
        handleNavigateBack();
      }
    };

    fetchData();
  }, []);

  const handlePermissionChange = (id: string) => {
    setForm((prevForm: any) => {
      const newPermissions = prevForm.permissionIds.includes(id)
        ? prevForm.permissionIds.filter((permId: string) => permId !== id)
        : [...prevForm.permissionIds, id];
      return { ...prevForm, permissionIds: newPermissions };
    });
  };

  const handleSubmit = async () => {
    if (form.permissionIds.length <= 0) {
      setToast("At least one permission is required", TOAST.ERROR);
      return;
    }
    if (isValidForm()) {
      const res = await role.create(form);
      if (res.result) {
        setToast(BASIC_MESSAGES.CREATED, TOAST.SUCCESS);
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
          label: PAGE_CONFIG.ROLE.label,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.CREATE_ROLE.label,
        },
      ]}
      activeItem={PAGE_CONFIG.ROLE.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.CREATE_ROLE.label}
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
                  <StaticSelectField
                    title="Kind"
                    disabled={true}
                    dataMap={USER_KIND_MAP}
                    value={USER_KIND_MAP.USER.value}
                  />
                </div>
                {groupPermissions &&
                  Object.keys(groupPermissions).map((group: any) => (
                    <div
                      key={group}
                      className="bg-gray-800 border-gray-600 mb-4 shadow-sm border rounded-lg p-4 space-y-2"
                    >
                      <h3 className="font-bold text-gray-200">{group}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {groupPermissions[group].map((perm: any) => (
                          <div key={perm.id} className="flex items-center">
                            <CheckboxField
                              title={perm.name}
                              subTitle={perm.permissionCode}
                              checked={form.permissionIds.includes(perm.id)}
                              onChange={() => handlePermissionChange(perm.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                <ActionSection
                  children={
                    <>
                      <CancelButton onClick={handleNavigateBack} />
                      <SubmitButton
                        text={BUTTON_TEXT.CREATE}
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

export default CreateRole;
