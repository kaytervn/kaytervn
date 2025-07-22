/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import useForm from "../../../hooks/useForm";
import { HostPattern, PathPattern } from "../../../types/constant";
import CustomModal from "../../form/CustomModal";
import { toast } from "react-toastify";
import { FolderPenIcon, LinkIcon, RouterIcon } from "lucide-react";
import SearchField from "../../form/SearchField";
import { InputFieldWithoutTitle } from "../../form/InputTextField";
import { SelectFieldWithoutTitle } from "../../form/SelectTextField";
import {
  CodeMirrorInput,
  CodeMirrorWithCheckbox,
} from "../../form/CodeMirrorField";

const RequestForm = ({ isVisible, hideModal, formConfig, folders }: any) => {
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (form.isCustomHost === "0") {
      if (!form.path.trim()) {
        newErrors.path = "Path is required";
      } else if (!PathPattern.test(form.path)) {
        newErrors.path = "Path is invalid";
      }
    } else if (
      !form.path.trim() ||
      !PathPattern.test(form.path) ||
      !form.host.trim() ||
      !HostPattern.test(form.host)
    ) {
      newErrors.path = "Custom host path and path are invalid";
      newErrors.host = "Custom host path and path are invalid";
    }
    if (form.method === "post" || form.method === "put") {
      if (!form.body.trim()) {
        newErrors.body = "Body JSON can not be empty";
      }
    }
    if (form.preScriptIsChecked && !form.preScript.trim()) {
      newErrors.preScript = "Pre-script can not be empty";
    }
    if (form.postScriptIsChecked && !form.postScript.trim()) {
      newErrors.postScript = "Post-script can not be empty";
    }
    return newErrors;
  };

  const { form, errors, setForm, setErrors, handleChange, isValidForm } =
    useForm(formConfig.initForm, validate);

  useEffect(() => {
    setForm(formConfig.initForm);
    setErrors({});
  }, [isVisible]);

  useEffect(() => {
    setErrors({ ...errors, host: "", path: "" });
  }, [form.isCustomHost, form.host, form.path]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      if (form.isCustomHost === "0") {
        form.host = "";
      }
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
          <SearchField
            title="Folder Name"
            isRequire={true}
            value={form.folder}
            options={folders}
            onChange={(value: any) => handleChange("folder", value)}
            error={errors?.folder}
          />
          <div className="flex-1 mb-2">
            <div className="flex items-center space-x-2 justify-center">
              <InputFieldWithoutTitle
                placeholder="Enter request name"
                value={form.name}
                icon={FolderPenIcon}
                error={errors?.name}
                onChangeText={(value: any) => handleChange("name", value)}
              />
              <SelectFieldWithoutTitle
                value={form.authKind}
                options={[
                  { value: "0", name: "Inherit Auth", color: "#1D4ED8" },
                  { value: "1", name: "No Auth", color: "#E63946" },
                  { value: "2", name: "Basic Auth", color: "#10B981" },
                ]}
                labelKey="name"
                valueKey="value"
                onChange={(value: any) => handleChange("authKind", value)}
              />
              <SelectFieldWithoutTitle
                value={form.isCustomHost}
                options={[
                  { value: "0", name: "Base Host", color: "#EF4444" },
                  { value: "1", name: "Custom Host", color: "#F59E0B" },
                ]}
                labelKey="name"
                valueKey="value"
                onChange={(value: any) => handleChange("isCustomHost", value)}
              />
            </div>
            {errors?.name && (
              <p className="text-red-500 text-sm mt-1 text-left">
                {errors?.name}
              </p>
            )}
          </div>
          <div className="flex-1 mb-2">
            <div className="flex items-center space-x-2">
              {form.isCustomHost === "1" && (
                <InputFieldWithoutTitle
                  placeholder="Enter custom host path"
                  value={form.host}
                  icon={RouterIcon}
                  onChangeText={(value: any) => handleChange("host", value)}
                  error={errors?.host}
                />
              )}
              <InputFieldWithoutTitle
                prepend={form.isCustomHost === "0" ? "{{baseUrl}}" : undefined}
                placeholder="Enter request path"
                value={form.path}
                icon={LinkIcon}
                onChangeText={(value: any) => handleChange("path", value)}
                error={errors?.path}
              />
              <SelectFieldWithoutTitle
                value={form.method}
                options={[
                  { value: "get", name: "GET", color: "#3BA776" },
                  { value: "post", name: "POST", color: "#E39427" },
                  { value: "put", name: "PUT", color: "#287BCB" },
                  { value: "delete", name: "DELETE", color: "#D93737" },
                ]}
                labelKey="name"
                valueKey="value"
                onChange={(value: any) => handleChange("method", value)}
              />
            </div>
            {errors?.path && (
              <p className="text-red-500 text-sm mt-1 text-left">
                {errors?.path}
              </p>
            )}
          </div>
          {(form.method === "post" || form.method === "put") && (
            <CodeMirrorInput
              title="Body JSON"
              isRequire={true}
              value={form.body}
              error={errors?.body}
              onChangeText={(value: any) => handleChange("body", value)}
            />
          )}
          <CodeMirrorWithCheckbox
            title="Pre-Script"
            placeholder="Enter pre-script"
            value={form.preScript}
            onChangeText={(value: any) => handleChange("preScript", value)}
            error={errors?.preScript}
            isChecked={form.preScriptIsChecked}
            onCheckboxChange={() =>
              handleChange("preScriptIsChecked", !form.preScriptIsChecked)
            }
          />
          <CodeMirrorWithCheckbox
            title="Post-Script"
            width="530px"
            placeholder="Enter post-script"
            value={form.postScript}
            onChangeText={(value: any) => handleChange("postScript", value)}
            error={errors?.postScript}
            isChecked={form.postScriptIsChecked}
            onCheckboxChange={() =>
              handleChange("postScriptIsChecked", !form.postScriptIsChecked)
            }
          />
        </div>
      }
      buttonText={formConfig.buttonText}
      onButtonClick={handleSubmit}
    />
  );
};

export default RequestForm;
