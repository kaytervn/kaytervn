/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import {
  DECRYPT_FIELDS,
  PAGE_CONFIG,
} from "../../components/config/PageConfig";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { LoadingDialog } from "../../components/form/Dialog";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import { SelectFieldLazy } from "../../components/form/SelectTextField";
import { TextAreaField2 } from "../../components/form/TextareaField";
import Sidebar2 from "../../components/main/Sidebar2";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import useQueryState from "../../hooks/useQueryState";
import {
  decryptDataByUserKey,
  encryptDataByUserKey,
} from "../../services/encryption/sessionEncryption";
import {
  ACCOUNT_KIND_MAP,
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TOAST,
} from "../../types/constant";
import { useEffect, useState } from "react";
import { isValidObjectId } from "../../types/utils";

const UpdateAccount = () => {
  const { id } = useParams();
  const [fetchData, setFetchData] = useState<any>(null);
  const { setToast, sessionKey } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.ACCOUNT.path,
    requireSessionKey: true,
  });
  const { account, loading } = useApi();
  const { platform } = useApi();

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
    if (!form.platformId.trim()) {
      newErrors.platformId = "Invalid platform";
    }
    return newErrors;
  };

  const { form, setForm, errors, handleChange, isValidForm } = useForm(
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
    if (!isValidObjectId(id) || !sessionKey) {
      handleNavigateBack();
      return;
    }

    const fetchData = async () => {
      const res = await account.get(id);
      if (res.result) {
        const data = decryptDataByUserKey(
          sessionKey,
          res.data,
          DECRYPT_FIELDS.ACCOUNT
        );
        setFetchData(data);
        setForm({
          username: data.username || "",
          password: data.password || "",
          note: data.note || "",
          platformId: data.platform?._id || "",
          kind: data.kind || "",
          refId: data.ref?._id || "",
        });
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await account.update(
        encryptDataByUserKey(
          sessionKey,
          {
            id,
            ...form,
          },
          DECRYPT_FIELDS.ACCOUNT
        )
      );
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
          label: PAGE_CONFIG.ACCOUNT.label,
          onClick: handleNavigateBack,
        },
        {
          label: `(${
            fetchData?.ref?.platform?.name || fetchData?.platform?.name
          }) ${fetchData?.ref?.username || fetchData?.username}`,
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
                <SelectFieldLazy
                  title="Platform"
                  isRequired={true}
                  fetchListApi={platform.list}
                  placeholder="Choose platform"
                  value={form.platformId}
                  onChange={(value: any) => handleChange("platformId", value)}
                  error={errors.platformId}
                  valueKey="_id"
                  decryptFields={DECRYPT_FIELDS.PLATFORM}
                />
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
                <TextAreaField2
                  title="Note"
                  placeholder="Enter note"
                  value={form?.note}
                  onChangeText={(value: any) => handleChange("note", value)}
                  error={errors?.note}
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

export default UpdateAccount;
