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
import { SelectField } from "../../components/form/SelectField";
import { LoadingDialog } from "../../components/page/Dialog";
import { useGlobalContext } from "../../components/GlobalProvider";

const CreateDbConfig = () => {
  const { setToast } = useGlobalContext();
  const { customerId, locationId } = useParams();
  const { handleNavigateBack: backLocation } = useQueryState({
    path: `/customer/location/${customerId}`,
  });
  const { handleNavigateBack: backCustomer } = useQueryState({
    path: PAGE_CONFIG.CUSTOMER.path,
  });
  const { dbConfig, loading } = useApi();
  const { location, customer, serverProvider } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.serverProviderId) {
      newErrors.serverProviderId = "Máy chủ không hợp lệ";
    }
    if (form.maxConnection < 1) {
      newErrors.maxConnection = "Số lượng kết nối tối đa không hợp lệ";
    }
    return newErrors;
  };
  const [customerData, setCustomerData] = useState<any>(null);
  const [locationData, setLocationData] = useState<any>(null);

  useEffect(() => {
    if (!customerId || !locationId) {
      backLocation();
      return;
    }
    const fetchData = async () => {
      const [cus, loc] = await Promise.all([
        customer.get(customerId),
        location.get(locationId),
      ]);
      if (!cus.result || !loc.result) {
        backLocation();
      }
      setCustomerData(cus.data);
      setLocationData(loc.data);
    };

    fetchData();
  }, [customerId, locationId]);

  const { form, errors, handleChange, isValidForm } = useForm(
    {
      initialize: false,
      maxConnection: 0,
      serverProviderId: "",
    },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await dbConfig.create({ locationId, ...form });
      if (res.result) {
        setToast(BASIC_MESSAGES.CREATED, TOAST.SUCCESS);
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
          label: PAGE_CONFIG.CREATE_DB_CONFIG.label,
        },
      ]}
      activeItem={PAGE_CONFIG.CUSTOMER.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.CREATE_DB_CONFIG.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <SelectField
                    title="Máy chủ"
                    isRequired={true}
                    fetchListApi={serverProvider.autoComplete}
                    placeholder="Chọn máy chủ"
                    value={form.serverProviderId}
                    onChange={(value: any) =>
                      handleChange("serverProviderId", value)
                    }
                    error={errors.serverProviderId}
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
                  <ToggleField
                    title="Khởi tạo"
                    checked={form.initialize}
                    onChange={(value: any) => handleChange("initialize", value)}
                    isRequired={true}
                  />
                  <span className="flex-1" />
                </div>
                <ActionSection
                  children={
                    <>
                      <CancelButton onClick={backLocation} />
                      <SubmitButton
                        text={BUTTON_TEXT.CREATE}
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

export default CreateDbConfig;
