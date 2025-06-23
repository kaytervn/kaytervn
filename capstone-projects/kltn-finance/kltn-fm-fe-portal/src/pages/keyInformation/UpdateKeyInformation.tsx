import { InputField, TextAreaField } from "../../components/form/InputField";
import Sidebar from "../../components/page/Sidebar";
import {
  DECRYPT_FIELDS,
  PAGE_CONFIG,
} from "../../components/config/PageConfig";
import useForm from "../../hooks/useForm";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import {
  SelectFieldLazy,
  StaticSelectField,
} from "../../components/form/SelectField";
import useApi from "../../hooks/useApi";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  KEY_KIND_MAP,
  TAG_KIND,
  TOAST,
  VALID_PATTERN,
} from "../../services/constant";
import { LoadingDialog } from "../../components/page/Dialog";
import useQueryState from "../../hooks/useQueryState";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import DocumentsField from "../../components/form/DocumentsField";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { decryptData } from "../../services/utils";

const UpdateKeyInformation = () => {
  const { id } = useParams();
  const { setToast, sessionKey } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.KEY_INFORMATION.path,
    requireSessionKey: true,
  });
  const { keyInformation, loading } = useApi();
  const { tag, organization, keyInformationGroup } = useApi();
  const [fetchData, setFetchData] = useState<any>({});

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.NAME.test(form.name)) {
      newErrors.name = "Tên không hợp lệ";
    }
    if (!form.kind) {
      newErrors.kind = "Loại không hợp lệ";
    }
    if (!form.keyInformationGroupId) {
      newErrors.keyInformationGroupId = "Nhóm không hợp lệ";
    }
    const additionalInfo = JSON.parse(form.additionalInformation || "{}");
    if (form.kind === KEY_KIND_MAP.WEB.value) {
      if (!VALID_PATTERN.USERNAME.test(additionalInfo.username))
        newErrors.username = "Tên tài khoản không hợp lệ";
      if (!additionalInfo.password.trim())
        newErrors.password = "Mật khẩu không hợp lệ";
    } else if (form.kind === KEY_KIND_MAP.SERVER.value) {
      if (!VALID_PATTERN.USERNAME.test(additionalInfo.username))
        newErrors.username = "Tên tài khoản không hợp lệ";
    }
    return newErrors;
  };

  const { form, setForm, errors, setErrors, handleChange, isValidForm } =
    useForm(
      {
        additionalInformation: JSON.stringify({
          username: "",
          password: "",
          phone: "",
          host: "",
          port: "",
          privateKey: "",
        }),
        description: "",
        document: "[]",
        keyInformationGroupId: "",
        kind: KEY_KIND_MAP.SERVER.value,
        name: "",
        organizationId: "",
        tagId: "",
      },
      validate
    );

  useEffect(() => {
    if (!id || !sessionKey) {
      handleNavigateBack();
      return;
    }

    const fetchData = async () => {
      const res = await keyInformation.get(id);
      if (res.result) {
        const data = decryptData(
          sessionKey,
          res.data,
          DECRYPT_FIELDS.KEY_INFORMATION
        );
        setFetchData(data);
        setForm({
          additionalInformation: data?.additionalInformation || "{}",
          description: data.description,
          document: data.document,
          keyInformationGroupId: data.keyInformationGroup?.id,
          kind: data.kind,
          name: data.name,
          organizationId: data.organization?.id,
          tagId: data.tag?.id,
        });
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [id]);

  const handleKindChange = (value: any) => {
    const newAdditionalInfo =
      value === KEY_KIND_MAP.WEB.value
        ? { username: "", password: "", phone: "" }
        : { username: "", password: "", host: "", port: "", privateKey: "" };
    setErrors({ ...errors, ...newAdditionalInfo });
    handleChange("kind", value);
    handleChange("additionalInformation", JSON.stringify(newAdditionalInfo));
  };

  const handleAdditionalInfoChange = (field: string, value: string) => {
    const currentInfo = JSON.parse(form.additionalInformation || "{}");
    const updatedInfo = { ...currentInfo, [field]: value };
    handleChange(field, value);
    handleChange("additionalInformation", JSON.stringify(updatedInfo));
  };

  const handleSubmit = async () => {
    if (isValidForm()) {
      const submitForm = {
        ...form,
        additionalInformation: form.additionalInformation,
        id,
      };
      const res = await keyInformation.update(submitForm);
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

  const renderAdditionalFields = () => {
    const additionalInfo = JSON.parse(form.additionalInformation || "{}");
    if (form.kind === KEY_KIND_MAP.WEB.value) {
      return (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-2">
            <InputField
              title="Tài khoản"
              isRequired={true}
              placeholder="Nhập tên tài khoản"
              value={additionalInfo.username}
              onChangeText={(value: any) =>
                handleAdditionalInfoChange("username", value)
              }
              error={errors.username}
            />
            <InputField
              title="Mật khẩu"
              isRequired={true}
              placeholder="Nhập mật khẩu"
              type="password"
              value={additionalInfo.password}
              onChangeText={(value: any) =>
                handleAdditionalInfoChange("password", value)
              }
              error={errors.password}
            />
          </div>
          <div className="flex flex-row space-x-2">
            <InputField
              title="Số điện thoại"
              placeholder="Nhập số điện thoại"
              value={additionalInfo.phone}
              onChangeText={(value: any) =>
                handleAdditionalInfoChange("phone", value)
              }
            />
            <span className="flex-1" />
          </div>
        </div>
      );
    } else if (form.kind === KEY_KIND_MAP.SERVER.value) {
      return (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-2">
            <InputField
              title="Tài khoản"
              isRequired={true}
              placeholder="Nhập tên tài khoản"
              value={additionalInfo.username}
              onChangeText={(value: any) =>
                handleAdditionalInfoChange("username", value)
              }
              error={errors.username}
            />
            <InputField
              title="Mật khẩu"
              placeholder="Nhập mật khẩu"
              type="password"
              value={additionalInfo.password}
              onChangeText={(value: any) =>
                handleAdditionalInfoChange("password", value)
              }
              error={errors.password}
            />
          </div>
          <div className="flex flex-row space-x-2">
            <InputField
              title="Địa chỉ máy chủ"
              placeholder="Nhập địa chỉ máy chủ"
              value={additionalInfo.host}
              onChangeText={(value: any) =>
                handleAdditionalInfoChange("host", value)
              }
              error={errors.host}
            />
            <InputField
              title="Cổng"
              placeholder="Nhập cổng"
              value={additionalInfo.port}
              onChangeText={(value: any) =>
                handleAdditionalInfoChange("port", value)
              }
              error={errors.port}
            />
          </div>
          <TextAreaField
            title="Khóa riêng"
            placeholder="Nhập khóa riêng"
            value={additionalInfo.privateKey}
            onChangeText={(value: any) =>
              handleAdditionalInfoChange("privateKey", value)
            }
          />
        </div>
      );
    }
    return null;
  };

  return (
    <Sidebar
      breadcrumbs={[
        { label: `${fetchData?.name}`, onClick: handleNavigateBack },
        { label: PAGE_CONFIG.UPDATE_KEY_INFORMATION.label },
      ]}
      activeItem={PAGE_CONFIG.KEY_INFORMATION.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.UPDATE_KEY_INFORMATION.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <StaticSelectField
                    title="Loại"
                    isRequired={true}
                    placeholder="Chọn loại"
                    dataMap={KEY_KIND_MAP}
                    value={form?.kind}
                    onChange={handleKindChange}
                    error={errors?.kind}
                  />
                  <InputField
                    title="Tên key"
                    isRequired={true}
                    placeholder="Nhập tên key"
                    value={form.name}
                    onChangeText={(value: any) => handleChange("name", value)}
                    error={errors.name}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <SelectFieldLazy
                    title="Nhóm key"
                    isRequired={true}
                    fetchListApi={keyInformationGroup.autoComplete}
                    placeholder="Chọn nhóm key"
                    value={form.keyInformationGroupId}
                    onChange={(value: any) =>
                      handleChange("keyInformationGroupId", value)
                    }
                    error={errors.keyInformationGroupId}
                    decryptFields={DECRYPT_FIELDS.KEY_INFORMATION_GROUP}
                  />
                  <SelectFieldLazy
                    title="Công ty"
                    fetchListApi={organization.autoComplete}
                    placeholder="Chọn công ty"
                    value={form.organizationId}
                    onChange={(value: any) =>
                      handleChange("organizationId", value)
                    }
                    error={errors.organizationId}
                    decryptFields={DECRYPT_FIELDS.ORGANIZATION}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <SelectFieldLazy
                    title="Thẻ"
                    fetchListApi={tag.autoComplete}
                    placeholder="Chọn thẻ"
                    value={form.tagId}
                    onChange={(value: any) => handleChange("tagId", value)}
                    colorCodeField="colorCode"
                    error={errors.tagId}
                    decryptFields={DECRYPT_FIELDS.TAG}
                    queryParams={{ kind: TAG_KIND.KEY_INFORMATION }}
                  />
                  <span className="flex-1" />
                </div>
                <TextAreaField
                  title="Mô tả"
                  placeholder="Nhập mô tả"
                  value={form?.description}
                  onChangeText={(value: any) =>
                    handleChange("description", value)
                  }
                  error={errors?.description}
                />
                {renderAdditionalFields()}
                <DocumentsField
                  title="Tài liệu"
                  value={form.document}
                  onChange={(value: any) => handleChange("document", value)}
                />
                <ActionSection
                  children={
                    <>
                      <CancelButton onClick={handleNavigateBack} />
                      <SubmitButton
                        text={BUTTON_TEXT.UPDATE}
                        color="royalblue"
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

export default UpdateKeyInformation;
