/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import useForm from "../../../hooks/useForm";
import CustomModal from "../../form/CustomModal";
import { toast } from "react-toastify";
import { ChevronsLeftRightEllipsisIcon, KeyRoundIcon } from "lucide-react";
import { HeaderPattern } from "../../../types/constant";
import { InputField } from "../../form/InputTextField";

const HeaderForm = ({ isVisible, hideModal, formConfig }: any) => {
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.key.trim()) {
      newErrors.key = "Key is required";
    } else if (!HeaderPattern.test(form.key)) {
      newErrors.key = "Key is invalid";
    }
    if (!form.value.trim()) {
      newErrors.value = "Value is required";
    }
    return newErrors;
  };

  const { form, errors, setForm, setErrors, handleChange, isValidForm } =
    useForm(formConfig.initForm, validate);

  useEffect(() => {
    setForm(formConfig.initForm);
    setErrors({});
  }, [isVisible]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      formConfig.onButtonClick(form);
    } else {
      toast.error("Please enter valid information");
    }
  };

  if (!isVisible) return null;

  return (
    <CustomModal
      color={formConfig.color}
      width="600px"
      onClose={hideModal}
      title={formConfig.title}
      bodyComponent={
        <div className="space-y-4">
          <InputField
            title="Key"
            placeholder="Enter header key"
            isRequire={true}
            value={form.key}
            icon={KeyRoundIcon}
            error={errors?.key}
            onChangeText={(value: any) => handleChange("key", value)}
          />
          <InputField
            title="Value"
            placeholder="Enter header value"
            isRequire={true}
            value={form.value}
            icon={ChevronsLeftRightEllipsisIcon}
            error={errors?.value}
            onChangeText={(value: any) => handleChange("value", value)}
          />
        </div>
      }
      buttonText={formConfig.buttonText}
      onButtonClick={handleSubmit}
    />
  );
};

export default HeaderForm;
