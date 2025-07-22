/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { LaptopMinimalIcon, MapPinIcon, PackageIcon } from "lucide-react";
import { toast } from "react-toastify";
import CustomModal from "../form/CustomModal";
import useForm from "../../hooks/useForm";
import {
  generateUniqueId,
  getItemById,
  getRandomColor,
} from "../../types/utils";
import { GORGEOUS_SWAGGER } from "../../types/pageConfig";
import {
  getNewCollectionName,
  mapCollectionRequests,
} from "../../services/SwaggerService";
import { InputField, InputFieldWithCheckbox } from "../form/InputTextField";

const CollectionForm = ({ isVisible, hideModal, formConfig }: any) => {
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.collectionName.trim()) {
      newErrors.collectionName = "Collection name is required";
    }
    if (form.localIsChecked && !form.localUrl.trim()) {
      newErrors.localUrl = "Local URL can not be empty";
    }
    if (form.remoteIsChecked && !form.remoteUrl.trim()) {
      newErrors.remoteUrl = "Remote URL can not be empty";
    }
    return newErrors;
  };

  const { form, errors, setForm, setErrors, handleChange, isValidForm } =
    useForm(formConfig.initForm, validate);

  useEffect(() => {
    setForm(formConfig.initForm);
    setErrors({});
  }, [isVisible]);

  const getNewName = (newName: string) => {
    const col = getItemById(GORGEOUS_SWAGGER.name, form.id);
    if (col.collectionName.toLowerCase() !== newName.toLowerCase()) {
      return getNewCollectionName(newName);
    }
    return col.collectionName;
  };

  const handleSubmit = () => {
    if (isValidForm()) {
      const isUpdateForm = formConfig.isUpdateForm;
      if (!form.localIsChecked && !form.remoteIsChecked) {
        toast.error("Please select at least one URL option");
        return;
      }
      const formattedItem: any = {
        id: isUpdateForm ? form.id : generateUniqueId(),
        collectionName: isUpdateForm
          ? getNewName(form.collectionName)
          : getNewCollectionName(form.collectionName),
        color: getRandomColor(),
        createdAt: isUpdateForm ? form.createdAt : new Date(),
      };
      if (form.localIsChecked) {
        formattedItem.local = {
          url: isUpdateForm
            ? form.localUrl
            : `http://localhost:${form.localUrl}`,
          isInit: true,
          headers: [...form.localHeaders],
        };
      }
      if (form.remoteIsChecked) {
        formattedItem.remote = {
          url: isUpdateForm ? form.remoteUrl : `https://${form.remoteUrl}`,
          isInit: true,
          headers: [...form.remoteHeaders],
        };
      }
      if (form.localIsChecked && form.remoteIsChecked) {
        formattedItem.local.isInit = false;
      }
      if (form.requests.length > 0) {
        formattedItem.requests = mapCollectionRequests(form.requests);
      }
      formConfig.onButtonClick(formattedItem);
    } else {
      toast.error("Please enter valid information");
    }
  };

  if (!isVisible) return null;

  return (
    <CustomModal
      color={formConfig.color}
      onClose={hideModal}
      title={formConfig.title}
      bodyComponent={
        <>
          <InputField
            title="Collection Name"
            isRequire={true}
            placeholder="Enter collection name"
            value={form.collectionName}
            onChangeText={(value: any) => handleChange("collectionName", value)}
            icon={PackageIcon}
            error={errors.collectionName}
          />
          <InputFieldWithCheckbox
            {...(!formConfig.isUpdateForm && {
              type: "number",
              prepend: "http://localhost:",
            })}
            title="Local URL"
            isRequire={false}
            placeholder="Enter port number"
            value={form.localUrl}
            onChangeText={(value: any) => handleChange("localUrl", value)}
            icon={MapPinIcon}
            error={errors.localUrl}
            isChecked={form.localIsChecked}
            onCheckboxChange={() =>
              setForm({ ...form, localIsChecked: !form.localIsChecked })
            }
          />
          <InputFieldWithCheckbox
            {...(!formConfig.isUpdateForm && {
              prepend: "https://",
            })}
            title="Remote URL"
            isRequire={false}
            placeholder="Enter remote URL"
            value={form.remoteUrl}
            onChangeText={(value: any) => handleChange("remoteUrl", value)}
            icon={LaptopMinimalIcon}
            error={errors.remoteUrl}
            isChecked={form.remoteIsChecked}
            onCheckboxChange={() =>
              setForm({ ...form, remoteIsChecked: !form.remoteIsChecked })
            }
          />
        </>
      }
      buttonText={formConfig.buttonText}
      onButtonClick={handleSubmit}
    />
  );
};

export default CollectionForm;
