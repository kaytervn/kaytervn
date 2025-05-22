import { useEffect } from "react";
import { CaptionsIcon, HashIcon } from "lucide-react";
import InputField from "../InputField";
import useForm from "../../hooks/useForm";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import CustomModal from "../CustomModal";
import { settingKey } from "../../types/constant";

const UpdateSetting = ({
  settingId,
  isVisible,
  setVisible,
  onButtonClick,
}: any) => {
  const validate = (form: any) => {
    const newErrors: any = {};
    if (
      form.keyName !== settingKey.VERIFY_FRIEND_POSTS &&
      form.keyName !== settingKey.VERIFY_PUBLIC_POSTS
    ) {
      if (
        !Number.isInteger(Number(form.value)) ||
        form.value.includes("e") ||
        Number(form.value) < 0
      ) {
        newErrors.value = "Giá trị không hợp lệ";
      }
    }
    return newErrors;
  };

  const { form, errors, setForm, setErrors, handleChange, isValidForm } =
    useForm({ title: "", value: 0 }, {}, validate);
  const { get, put, loading } = useFetch();

  useEffect(() => {
    setErrors({});
    const fetchData = async () => {
      if (settingId) {
        const res = await get(`/v1/setting/get/${settingId}`);
        if (res.result) {
          setForm(res.data);
        } else {
          toast.error(res.message);
        }
      }
    };
    fetchData();
  }, [isVisible, settingId]);

  const handleUpdate = async () => {
    if (isValidForm()) {
      const res = await put("/v1/setting/update", {
        id: settingId,
        value: form.value,
      });
      if (res.result) {
        toast.success("Cập nhật thành công");
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
      onClose={() => setVisible(false)}
      title="Thay đổi cài đặt"
      bodyComponent={
        <>
          <InputField
            title="Tiêu đề"
            isRequire={true}
            value={form.title}
            editable={false}
            onChangeText={(value: any) => handleChange("title", value)}
            icon={CaptionsIcon}
            error={errors.title}
          />
          {form.keyName == settingKey.VERIFY_FRIEND_POSTS ||
          form.keyName == settingKey.VERIFY_PUBLIC_POSTS ? (
            <div className="flex items-center justify-start">
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => {
                  setForm({ ...form, value: form.value === 1 ? 0 : 1 });
                }}
              >
                <div
                  className={`w-10 h-4 flex items-center rounded-full p-0.5 duration-300 ease-in-out ${
                    form.value === 1 ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${
                      form.value === 1 ? "translate-x-6" : ""
                    }`}
                  ></div>
                </div>
                <span className="text-base font-semibold text-gray-800">
                  Bật/Tắt kiểm duyệt
                </span>
              </button>
            </div>
          ) : (
            <InputField
              title="Giá trị"
              isRequire={true}
              value={form.value}
              type="number"
              onChangeText={(value: any) => handleChange("value", value)}
              icon={HashIcon}
              error={errors.value}
            />
          )}
        </>
      }
      buttonText="LƯU"
      onButtonClick={handleUpdate}
      loading={loading}
    />
  );
};

export default UpdateSetting;
