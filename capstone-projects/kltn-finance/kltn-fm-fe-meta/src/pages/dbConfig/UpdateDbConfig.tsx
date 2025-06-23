import { InputField, ToggleField } from "../../components/form/InputField";
import Sidebar from "../../components/page/Sidebar";
import { PAGE_CONFIG } from "../../components/PageConfig";
import useForm from "../../hooks/useForm";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import useApi from "../../hooks/useApi";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../services/constant";
import useQueryState from "../../hooks/useQueryState";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoadingDialog } from "../../components/page/Dialog";
import { extractDatabaseName } from "../../services/utils";
import { useGlobalContext } from "../../components/GlobalProvider";

const UpdateDbConfig = () => {
  const { setToast } = useGlobalContext();
  const { customerId, locationId, id } = useParams();
  const { handleNavigateBack: backLocation } = useQueryState({
    path: `/customer/location/${customerId}`,
  });
  const { handleNavigateBack: backCustomer } = useQueryState({
    path: PAGE_CONFIG.CUSTOMER.path,
  });
  const { dbConfig, loading } = useApi();
  const { location, customer } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (form.maxConnection < 1) {
      newErrors.maxConnection = "Số lượng kết nối tối đa không hợp lệ";
    }
    return newErrors;
  };
  const [customerData, setCustomerData] = useState<any>(null);
  const [locationData, setLocationData] = useState<any>(null);
  const [dbConfigData, setDbConfigData] = useState<any>(null);

  useEffect(() => {
    if (!customerId || !locationId || !id) {
      backLocation();
      return;
    }
    const fetchData = async () => {
      const [cus, loc, dbCf] = await Promise.all([
        customer.get(customerId),
        location.get(locationId),
        dbConfig.get(id),
      ]);
      if (!cus.result || !loc.result || !dbCf.result) {
        backLocation();
      }
      setCustomerData(cus.data);
      setLocationData(loc.data);
      const data = dbCf.data;
      setDbConfigData(data);
      setForm({
        serverProviderName: data.serverProvider.name,
        maxConnection: data.maxConnection,
        name: data.name,
        dbName: extractDatabaseName(data.url),
        username: data.username,
        password: data.password,
        driverClassName: data.driverClassName,
        initialize: data.initialize,
      });
    };

    fetchData();
  }, [customerId, locationId, id]);

  const { form, setForm, errors, handleChange, isValidForm } = useForm(
    {
      serverProviderName: "",
      maxConnection: 0,
      name: "",
      dbName: "",
      username: "",
      password: "",
      driverClassName: "",
      initialize: false,
    },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await dbConfig.update({ id, ...form });
      if (res.result) {
        setToast(BASIC_MESSAGES.UPDATED, TOAST.SUCCESS);
        backLocation();
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
          label: `${customerData?.account?.fullName}`,
          onClick: backCustomer,
        },
        {
          label: `${locationData?.name}`,
          onClick: backLocation,
        },
        {
          label: PAGE_CONFIG.UPDATE_DB_CONFIG.label,
        },
      ]}
      activeItem={PAGE_CONFIG.CUSTOMER.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.UPDATE_DB_CONFIG.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <InputField
                    disabled={true}
                    title="Máy chủ"
                    isRequired={true}
                    value={form.serverProviderName}
                  />
                  <InputField
                    title="Số lượng kết nối tối đa"
                    isRequired={true}
                    placeholder="Nhập số lượng kết nối tối đa"
                    type="number"
                    value={form.maxConnection}
                    onChangeText={(value: any) =>
                      handleChange("maxConnection", value)
                    }
                    error={errors.maxConnection}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField
                    disabled={true}
                    title="Mã thuê bao"
                    isRequired={true}
                    value={form.name}
                  />
                  <InputField
                    disabled={true}
                    title="Cơ sở dữ liệu"
                    isRequired={true}
                    value={form.dbName}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField
                    disabled={true}
                    title="Tài khoản MySQL"
                    isRequired={true}
                    value={form.username}
                  />
                  <InputField
                    disabled={true}
                    title="Mật khẩu MySQL"
                    isRequired={true}
                    type="password"
                    value={form.password}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField
                    disabled={true}
                    title="JDBC Driver Class"
                    isRequired={true}
                    value={form.driverClassName}
                  />
                  <ToggleField
                    title="Khởi tạo"
                    checked={form.initialize}
                    onChange={(value: any) => handleChange("initialize", value)}
                    isRequired={true}
                  />
                </div>
                <ActionSection
                  children={
                    <>
                      <CancelButton onClick={backLocation} />
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

export default UpdateDbConfig;
