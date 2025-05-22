import useForm from "../../hooks/useForm";
import CustomModal from "../form/CustomModal";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { importCollectionData } from "../../services/SwaggerService";
import { TextareaField } from "../form/TextareaField";

const ImportCollection = ({ isVisible, setVisible, onButtonClick }: any) => {
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.data.trim()) {
      newErrors.data = "Import data is required";
    }
    return newErrors;
  };
  const { form, errors, setForm, setErrors, handleChange, isValidForm } =
    useForm({ data: "" }, validate);
  const handleButtonClick = () => {
    if (isValidForm()) {
      const count = importCollectionData(form.data);
      toast.success(
        `Imported ${count} ${count === 1 ? "collection" : "collections"}`
      );
      onButtonClick();
    } else {
      toast.error("Please enter valid information");
    }
  };
  useEffect(() => {
    setForm({ data: "" });
    setErrors({});
  }, [isVisible]);
  if (!isVisible) return null;
  return (
    <CustomModal
      color="gray"
      onClose={() => setVisible(false)}
      title="Import Collection(s)"
      bodyComponent={
        <TextareaField
          title="Import Data"
          isRequire
          placeholder="Enter import data"
          value={form.data}
          onChangeText={(value: any) => handleChange("data", value)}
          error={errors.data}
          minRows={10}
          maxHeight={100000}
        />
      }
      buttonText="SUBMIT"
      onButtonClick={handleButtonClick}
    />
  );
};

export default ImportCollection;
