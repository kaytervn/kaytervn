import { useEffect, useState } from "react";
import { PhoneIcon } from "lucide-react";
import InputField from "../InputField";
import useForm from "../../hooks/useForm";
import { PhonePattern } from "../../types/constant";
import { toast } from "react-toastify";
import CustomModal from "../CustomModal";

const VerifyEdit = ({ isVisible, setVisible, phone, onButtonClick }: any) => {
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.phone) newErrors.phone = "Số điện thoại không được bỏ trống";
    else if (!PhonePattern.test(form.phone) || phone !== form.phone)
      newErrors.phone = "Số điện thoại không hợp lệ";
    return newErrors;
  };

  const { form, errors, setForm, setErrors, handleChange, isValidForm } =
    useForm({ phone: "" }, {}, validate);

  useEffect(() => {
    if (phone) {
      setErrors({});
      setForm({ phone: "" });
    }
  }, [isVisible, phone]);

  const handleUpdate = async () => {
    if (isValidForm()) {
      onButtonClick();
    } else {
      toast.error("Vui lòng kiểm tra lại thông tin");
    }
  };

  if (!isVisible) return null;

  return (
    <CustomModal
      onClose={() => setVisible(false)}
      title="Xác minh chỉnh sửa"
      bodyComponent={
        <InputField
          title="Số điện thoại của người dùng"
          isRequire
          placeholder="Nhập số điện thoại của người dùng này"
          value={form.phone}
          onChangeText={(value: any) => handleChange("phone", value)}
          icon={PhoneIcon}
          error={errors.phone}
        />
      }
      buttonText="GỬI"
      onButtonClick={handleUpdate}
    />
  );
};

export default VerifyEdit;
