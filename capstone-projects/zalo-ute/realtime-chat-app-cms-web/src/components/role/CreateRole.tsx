import { useEffect } from "react";
import { TagIcon } from "lucide-react";
import InputField from "../InputField";
import useForm from "../../hooks/useForm";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import CustomModal from "../CustomModal";

const CreateRole = ({
  isVisible,
  setVisible,
  permissions,
  onButtonClick,
}: any) => {
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "Tên vai trò không được bỏ trống";
    }
    return newErrors;
  };

  const { form, errors, setForm, setErrors, handleChange, isValidForm } =
    useForm({ name: "", permissions: [] }, {}, validate);
  const { post, loading } = useFetch();

  const groupedPermissions = permissions.reduce((acc: any, perm: any) => {
    if (!acc[perm.groupName]) acc[perm.groupName] = [];
    acc[perm.groupName].push(perm);
    return acc;
  }, {});

  useEffect(() => {
    setForm({ name: "", permissions: [] });
    setErrors({});
  }, [isVisible]);

  const handlePermissionChange = (id: string) => {
    setForm((prevForm: any) => {
      const newPermissions = prevForm.permissions.includes(id)
        ? prevForm.permissions.filter((permId: string) => permId !== id)
        : [...prevForm.permissions, id];
      return { ...prevForm, permissions: newPermissions };
    });
  };

  const handleCreate = async () => {
    if (isValidForm()) {
      const res = await post("/v1/role/create", {
        name: form.name,
        permissions: form.permissions,
      });
      if (res.result) {
        toast.success("Thêm thành công");
        setVisible(false);
        onButtonClick();
      } else {
        toast.error(res.message);
      }
    } else {
      toast.error("Vui lòng kiểm tra lại thông tin");
    }
  };

  if (!isVisible) return null;

  return (
    <CustomModal
      color="gray"
      onClose={() => setVisible(false)}
      title="Thêm vai trò"
      bodyComponent={
        <>
          <InputField
            title="Tên vai trò"
            isRequire
            placeholder="Nhập tên vai trò"
            value={form.name}
            onChangeText={(value: any) => handleChange("name", value)}
            icon={TagIcon}
            error={errors.name}
          />
          {Object.keys(groupedPermissions).map((group) => (
            <div
              key={group}
              className="bg-gray-50 mb-4 shadow-sm border border-gray-200 rounded-lg p-4 space-y-4"
            >
              <h3 className="font-bold text-gray-800">{group}</h3>
              <div className="space-y-3">
                {groupedPermissions[group].map((perm: any) => (
                  <div key={perm._id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={perm._id}
                      checked={form.permissions.includes(perm._id)}
                      onChange={() => handlePermissionChange(perm._id)}
                      className="form-checkbox h-5 w-5 text-blue-500 transition duration-150 ease-in-out"
                    />
                    <label
                      htmlFor={perm._id}
                      className="ml-3 block leading-5 text-gray-700 hover:text-gray-900 cursor-pointer"
                    >
                      {perm.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      }
      buttonText="THÊM"
      onButtonClick={handleCreate}
      loading={loading}
    />
  );
};

export default CreateRole;
