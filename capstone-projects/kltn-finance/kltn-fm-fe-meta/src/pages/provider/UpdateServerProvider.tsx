import { InputField } from "../../components/form/InputField";
import Sidebar from "../../components/page/Sidebar";
import { PAGE_CONFIG } from "../../components/PageConfig";
import useForm from "../../hooks/useForm";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import useApi from "../../hooks/useApi";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TOAST,
  VALID_PATTERN,
} from "../../services/constant";
import { LoadingDialog } from "../../components/page/Dialog";
import useQueryState from "../../hooks/useQueryState";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { extractHostAndPort } from "../../services/utils";
import { useGlobalContext } from "../../components/GlobalProvider";

const UpdateServerProvider = () => {
  const { setToast } = useGlobalContext();
  const { id } = useParams();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.SERVER_PROVIDER.path,
  });
  const { serverProvider, loading } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.NAME.test(form.name)) {
      newErrors.name = "Tên máy chủ không hợp lệ";
    }
    if (!form.url.trim()) {
      newErrors.url = "Đường dẫn không hợp lệ";
    }
    if (form.maxTenant < 1) {
      newErrors.maxTenant = "Số lượng kết nối tối đa không hợp lệ";
    }
    return newErrors;
  };
  const [serverProviderData, setServerProviderData] = useState<any>({});

  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm(
      {
        host: "",
        maxTenant: 0,
        mySqlRootPassword: "",
        mySqlRootUser: "",
        name: "",
        port: "",
        url: "",
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
      const res = await serverProvider.get(id);
      if (res.result) {
        const data = res.data;
        setServerProviderData(data);
        const { host, port }: any = extractHostAndPort(data.mySqlJdbcUrl);
        setForm({
          host,
          maxTenant: data.maxTenant,
          mySqlRootPassword: data.mySqlRootPassword,
          mySqlRootUser: data.mySqlRootUser,
          name: data.name,
          port,
          url: data.url,
        });
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await serverProvider.update({ id, ...form });
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
    <Sidebar
      breadcrumbs={[
        {
          label: `${serverProviderData?.name}`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.UPDATE_SERVER_PROVIDER.label,
        },
      ]}
      activeItem={PAGE_CONFIG.SERVER_PROVIDER.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.UPDATE_SERVER_PROVIDER.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Tên máy chủ"
                    isRequired={true}
                    placeholder="Nhập tên máy chủ"
                    value={form.name}
                    onChangeText={(value: any) => handleChange("name", value)}
                    error={errors.name}
                  />
                  <InputField
                    title="Đường dẫn"
                    isRequired={true}
                    placeholder="Nhập đường dẫn"
                    value={form.url}
                    onChangeText={(value: any) => handleChange("url", value)}
                    error={errors.url}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField
                    disabled={true}
                    title="Địa chỉ máy chủ"
                    isRequired={true}
                    placeholder="Nhập địa chỉ máy chủ"
                    value={form.host}
                    onChangeText={(value: any) => handleChange("host", value)}
                    error={errors.host}
                  />
                  <InputField
                    disabled={true}
                    title="Cổng"
                    isRequired={true}
                    placeholder="Nhập cổng"
                    type="number"
                    value={form.port}
                    onChangeText={(value: any) => handleChange("port", value)}
                    error={errors.port}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField
                    disabled={true}
                    title="Tài khoản MySQL"
                    isRequired={true}
                    placeholder="Nhập tài khoản MySQL"
                    value={form.mySqlRootUser}
                    onChangeText={(value: any) =>
                      handleChange("mySqlRootUser", value)
                    }
                    type="mySqlRootUser"
                    error={errors.mySqlRootUser}
                  />
                  <InputField
                    disabled={true}
                    title="Mật khẩu MySQL"
                    isRequired={true}
                    placeholder="Nhập mật khẩu MySQL"
                    value={form.mySqlRootPassword}
                    onChangeText={(value: any) =>
                      handleChange("mySqlRootPassword", value)
                    }
                    type="password"
                    error={errors.mySqlRootPassword}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Số lượng kết nối tối đa"
                    isRequired={true}
                    placeholder="Nhập số lượng kết nối tối đa"
                    type="number"
                    value={form.maxTenant}
                    onChangeText={(value: any) =>
                      handleChange("maxTenant", value)
                    }
                    error={errors.maxTenant}
                  />
                  <span className="flex-1" />
                </div>
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

export default UpdateServerProvider;
