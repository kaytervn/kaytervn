/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useQueryState from "../../hooks/useQueryState";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import useApi from "../../hooks/useApi";
import {
  ACCOUNT_KIND_MAP,
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
import {
  SelectField2,
  StaticSelectField,
} from "../../components/form/SelectTextField";
import {
  decryptFieldByUserKey,
  encryptFieldByUserKey,
} from "../../services/encryption/sessionEncryption";
import { TextAreaField2 } from "../../components/form/TextareaField";

const UpdateAccount = () => {
  const { id } = useParams();
  const { setToast, sessionKey } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.ACCOUNT.path,
    requireSessionKey: true,
  });
  const { account, loading } = useApi();
  const { platform, tag } = useApi();

  const isRoot = () => form?.kind == ACCOUNT_KIND_MAP.ROOT.value;

  const validate = (form: any) => {
    const newErrors: any = {};
    if (isRoot()) {
      if (!form.username.trim()) {
        newErrors.username = "Invalid username";
      }
      if (!form.password.trim()) {
        newErrors.password = "Invalid password";
      }
    }
    if (!form.platformId) {
      newErrors.platformId = "Invalid platform";
    }
    return newErrors;
  };
  const [fetchData, setFetchData] = useState<any>({});

  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm(
      {
        username: "",
        password: "",
        note: "",
        platformId: "",
        refId: "",
        kind: "",
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
      const res = await account.get(id);
      if (res.result) {
        const data = res.data;
        setFetchData(data);
        setForm({
          username: data.username,
          password: decryptFieldByUserKey(sessionKey, data.password),
          note: data.note,
          platformId: data.platform?.id,
          kind: data.kind,
          parentId: data.parent?.id,
          tagId: data.tag?.id || "",
        });
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      let res;
      if (isRoot()) {
        res = await account.update({
          id,
          username: form.username,
          password: encryptFieldByUserKey(sessionKey, form.password),
          note: form.note,
          platformId: form.platformId,
          tagId: form.tagId,
        });
      } else {
        res = await account.update({
          id,
          note: form.note,
          platformId: form.platformId,
          tagId: form.tagId,
        });
      }
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
          label: `(${
            fetchData?.parent?.platform?.name || fetchData?.platform?.name
          }) ${fetchData?.parent?.username || fetchData?.username}`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.UPDATE_ACCOUNT.label,
        },
      ]}
      activeItem={PAGE_CONFIG.ACCOUNT.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.UPDATE_ACCOUNT.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <SelectField2
                    title="Platform"
                    isRequired={true}
                    fetchListApi={platform.autoComplete}
                    placeholder="Choose platform"
                    value={form.platformId}
                    onChange={(value: any) => handleChange("platformId", value)}
                    error={errors.platformId}
                    initSearch={fetchData?.platform?.name}
                  />
                  <StaticSelectField
                    title="Kind"
                    disabled={true}
                    dataMap={ACCOUNT_KIND_MAP}
                    value={fetchData?.kind}
                  />
                </div>
                {isRoot() && (
                  <div className="flex flex-row space-x-2">
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
                  </div>
                )}
                <div className="flex flex-row space-x-2">
                  <TextAreaField2
                    title="Note"
                    placeholder="Enter note"
                    value={form?.note}
                    onChangeText={(value: any) => handleChange("note", value)}
                    error={errors?.note}
                  />
                  <SelectField2
                    title="Tag"
                    fetchListApi={tag.autoComplete}
                    placeholder="Choose tag"
                    value={form.tagId}
                    onChange={(value: any) => handleChange("tagId", value)}
                    error={errors.tagId}
                    colorCodeField="color"
                    queryParams={{ kind: TAG_KIND_MAP.ACCOUNT.value }}
                    initSearch={fetchData?.tag?.name}
                  />
                </div>
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

export default UpdateAccount;
