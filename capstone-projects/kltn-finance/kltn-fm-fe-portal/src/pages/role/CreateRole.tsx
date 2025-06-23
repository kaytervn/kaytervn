import { LoadingDialog } from "../../components/page/Dialog";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../services/constant";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import { useEffect, useState } from "react";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import useQueryState from "../../hooks/useQueryState";
import Sidebar from "../../components/page/Sidebar";
import {
  CheckboxField,
  InputField,
  TextAreaField,
} from "../../components/form/InputField";
import { useGlobalContext } from "../../components/config/GlobalProvider";

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
      newErrors.name = "Tên vai trò không hợp lệ";
    }
    if (!form.description.trim()) {
      newErrors.description = "Mô tả không hợp lệ";
    }
    return newErrors;
  };

  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm(
      {
        name: "",
        description: "",
        permissionIds: [],
      },
      validate
    );

  useEffect(() => {
    const fetchData = async () => {
      resetForm();
      try {
        const permissionData = await role.getEmployeeRole();
        if (permissionData.result) {
          const groupedPermissions = permissionData.data.permissions.reduce(
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
      } catch (error) {
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
    <Sidebar
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
                  <InputField
                    title="Tên vai trò"
                    isRequired={true}
                    placeholder="Nhập tên vai trò"
                    value={form.name}
                    onChangeText={(value: any) => handleChange("name", value)}
                    error={errors.name}
                  />
                  <TextAreaField
                    title="Mô tả"
                    isRequired={true}
                    placeholder="Nhập mô tả"
                    value={form.description}
                    onChangeText={(value: any) =>
                      handleChange("description", value)
                    }
                    error={errors.description}
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
