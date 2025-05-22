import { useState } from "react";

const useForm = (
  initialValues: any,
  initialErrors: any,
  validate: (form: any) => any
) => {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);

  const handleChange = (field: any, value: any) => {
    setForm((prevForm: any) => ({ ...prevForm, [field]: value }));
    setErrors((prevErrors: any) => ({ ...prevErrors, [field]: "" }));
  };

  const isValidForm = () => {
    const newErrors = validate(form);
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  return {
    form,
    errors,
    setForm,
    handleChange,
    isValidForm,
  };
};

export default useForm;
