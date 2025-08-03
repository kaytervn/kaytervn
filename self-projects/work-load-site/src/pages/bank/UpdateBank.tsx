/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useQueryState from "../../hooks/useQueryState";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import useApi from "../../hooks/useApi";
import {
  BANK_PIN_FIELD_CONFIG,
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TAG_KIND_MAP,
  TOAST,
} from "../../types/constant";
import { useEffect, useState } from "react";
import useForm from "../../hooks/useForm";
import Sidebar2 from "../../components/main/Sidebar2";
import { LoadingDialog } from "../../components/form/Dialog";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { SelectField2 } from "../../components/form/SelectTextField";
import {
  decryptFieldByUserKey,
  encryptFieldByUserKey,
} from "../../services/encryption/sessionEncryption";
import JsonListField from "../../components/form/json/JsonListField";

const UpdateBank = () => {
  const { id } = useParams();
  const { setToast, sessionKey } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.BANK.path,
    requireSessionKey: true,
  });
  const { bank, loading } = useApi();
  const { tag } = useApi();

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.username.trim()) {
      newErrors.username = "Invalid Username";
    }
    if (!form.password.trim()) {
      newErrors.password = "Invalid Password";
    }
    if (!form.tagId) {
      newErrors.tagId = "Invalid Tag";
    }
    return newErrors;
  };
  const [fetchData, setFetchData] = useState<any>({});
  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm(
      {
        username: "",
        password: "",
        numbers: "[]",
        pins: "[]",
        tagId: "",
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
      const res = await bank.get(id);
      if (res.result) {
        const data = res.data;
        setFetchData(data);
        setForm({
          ...data,
          tagId: data.tag?.id || "",
          password: decryptFieldByUserKey(sessionKey, data.password),
          pins: decryptFieldByUserKey(sessionKey, data.pins),
        });
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await bank.update({
        id,
        username: form.username,
        numbers: form.numbers,
        password: encryptFieldByUserKey(sessionKey, form.password),
        pins: encryptFieldByUserKey(sessionKey, form.pins),
        tagId: form.tagId,
      });
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
          label: `(${fetchData?.tag?.name}) ${fetchData?.username}`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.UPDATE_BANK.label,
        },
      ]}
      activeItem={PAGE_CONFIG.BANK.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.UPDATE_BANK.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <SelectField2
                    title="Tag"
                    fetchListApi={tag.autoComplete}
                    placeholder="Choose tag"
                    value={form.tagId}
                    onChange={(value: any) => handleChange("tagId", value)}
                    error={errors.tagId}
                    colorCodeField="color"
                    queryParams={{ kind: TAG_KIND_MAP.BANK.value }}
                    initSearch={fetchData?.tag?.name}
                    isRequired={true}
                  />
                  <InputField2
                    title="Username"
                    isRequired={true}
                    placeholder="Enter username"
                    value={form.username}
                    onChangeText={(value: any) =>
                      handleChange("username", value)
                    }
                    error={errors.username}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField2
                    title="Password"
                    isRequired={true}
                    placeholder="Enter password"
                    value={form.password}
                    onChangeText={(value: any) =>
                      handleChange("password", value)
                    }
                    error={errors.password}
                    type="password"
                  />
                  <JsonListField
                    title="Pin(s)"
                    value={form?.pins}
                    onChange={(value: any) => handleChange("pins", value)}
                    fieldConfig={BANK_PIN_FIELD_CONFIG}
                  />
                </div>
                <JsonListField
                  title="Number(s)"
                  value={form?.numbers}
                  onChange={(value: any) => handleChange("numbers", value)}
                />
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

export default UpdateBank;
