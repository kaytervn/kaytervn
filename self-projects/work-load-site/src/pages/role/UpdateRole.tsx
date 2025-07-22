/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useQueryState from "../../hooks/useQueryState";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import useApi from "../../hooks/useApi";
import { useEffect, useState } from "react";
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
import { CheckboxField } from "../../components/form/Checkbox";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { StaticSelectField } from "../../components/form/SelectTextField";

const UpdateRole = () => {
  const { setToast } = useGlobalContext();
  const { id } = useParams();
  const { handleNavigateBack } = useQueryState({ path: PAGE_CONFIG.ROLE.path });
  const { role, loading } = useApi();
  const { role: permission } = useApi();
  const [groupPermissions, setGroupPermissions] = useState<any>(null);
  const [fetchData, setFetchData] = useState<any>(null);

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
    if (!id) {
      handleNavigateBack();
      return;
    }

    const fetchData = async () => {
      resetForm();
      try {
        const res = await role.get(id);
        if (!res.result) {
          handleNavigateBack();
          return;
        }
        const data = res.data;
        setFetchData(data);
        const perms = await permission.listPermissions({
          kind: data?.kind,
          isPaged: 0,
        });
        if (!perms.result) {
          handleNavigateBack();
          return;
        }
        const groupedPermissions = perms?.data?.content.reduce(
          (acc: any, perm: any) => {
            if (!acc[perm.nameGroup]) acc[perm.nameGroup] = [];
            acc[perm.nameGroup].push(perm);
            return acc;
          },
          {}
        );
        setGroupPermissions(groupedPermissions);
        setForm({
          name: data.name,
          permissionIds: data.permissions
            ? data.permissions.map((p: any) => p.id)
            : [],
        });
      } catch {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [id]);

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
      const res = await role.update({ id, ...form });
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
          label: PAGE_CONFIG.UPDATE_ROLE.label,
        },
      ]}
      activeItem={PAGE_CONFIG.ROLE.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.UPDATE_ROLE.label}
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
                    value={fetchData?.kind}
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

export default UpdateRole;
