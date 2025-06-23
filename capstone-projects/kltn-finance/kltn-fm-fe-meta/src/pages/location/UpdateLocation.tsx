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
  STATUS_MAP,
  TOAST,
  VALID_PATTERN,
} from "../../services/constant";
import useQueryState from "../../hooks/useQueryState";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  DatePickerField,
  ImageUploadField,
} from "../../components/form/OtherField";
import { StaticSelectField } from "../../components/form/SelectField";
import { parseDate } from "../../services/utils";
import { LoadingDialog } from "../../components/page/Dialog";
import { useGlobalContext } from "../../components/GlobalProvider";

const UpdateLocation = () => {
  const { setToast } = useGlobalContext();
  const { customerId, id } = useParams();
  const { handleNavigateBack: backLocation } = useQueryState({
    path: `/customer/location/${customerId}`,
  });
  const { handleNavigateBack: backCustomer } = useQueryState({
    path: PAGE_CONFIG.CUSTOMER.path,
  });
  const { location, loading } = useApi();
  const { customer } = useApi();

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.NAME.test(form.name)) {
      newErrors.name = "Tên khu vực không hợp lệ";
    }
    if (!VALID_PATTERN.USERNAME.test(form.tenantId)) {
      newErrors.tenantId = "Mã thuê bao không hợp lệ";
    }
    if (form.hotline && !VALID_PATTERN.PHONE.test(form.hotline)) {
      newErrors.hotline = "Đường dây nóng không hợp lệ";
    }
    if (form.status != 0 && !form.status) {
      newErrors.status = "Trạng thái không hợp lệ";
    }
    const startDate = parseDate(form.startDate);
    const expiredDate = parseDate(form.expiredDate);
    if (!expiredDate) {
      newErrors.expiredDate = "Ngày hết hạn không hợp lệ";
    } else if (!startDate || startDate >= expiredDate) {
      newErrors.startDate = "Ngày bắt đầu phải nhỏ hơn ngày hết hạn";
    }
    return newErrors;
  };
  const [customerData, setCustomerData] = useState<any>(null);
  const [locationData, setLocationData] = useState<any>(null);

  useEffect(() => {
    if (!customerId || !id) {
      backLocation();
      return;
    }
    const fetchData = async () => {
      const [cus, loc] = await Promise.all([
        customer.get(customerId),
        location.get(id),
      ]);
      if (!cus.result || !loc.result) {
        backLocation();
      }
      setCustomerData(cus.data);
      const data = loc.data;
      setLocationData(data);
      setForm({
        logoPath: data.logoPath,
        name: data.name,
        tenantId: data.tenantId,
        hotline: data.hotline,
        status: data.status,
        startDate: data.startDate,
        expiredDate: data.expiredDate,
      });
    };
    fetchData();
  }, [customerId, id]);

  const { form, errors, setForm, handleChange, isValidForm } = useForm(
    {
      logoPath: "",
      name: "",
      tenantId: "",
      hotline: "",
      status: 1,
      startDate: "",
      expiredDate: "",
    },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await location.update({ id, ...form });
      if (res.result) {
        setToast(BASIC_MESSAGES.UPDATED, TOAST.SUCCESS);
        backLocation();
      } else {
        setToast(BASIC_MESSAGES.FAILED, TOAST.ERROR);
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
          label: PAGE_CONFIG.UPDATE_LOCATION.label,
        },
      ]}
      activeItem={PAGE_CONFIG.CUSTOMER.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.UPDATE_LOCATION.label}
            children={
              <div className="flex flex-col space-y-4">
                <ImageUploadField
                  title="Biểu trưng"
                  value={form.logoPath}
                  onChange={(value: any) => handleChange("logoPath", value)}
                />
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Tên khu vực"
                    isRequired={true}
                    placeholder="Nhập tên khu vực"
                    value={form.name}
                    onChangeText={(value: any) => handleChange("name", value)}
                    error={errors.name}
                  />
                  <InputField
                    title="Mã thuê bao"
                    isRequired={true}
                    disabled={true}
                    placeholder="Nhập mã thuê bao"
                    value={form.tenantId}
                    onChangeText={(value: any) =>
                      handleChange("tenantId", value)
                    }
                    error={errors.tenantId}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Đường dây nóng"
                    placeholder="Nhập đường dây nóng"
                    value={form.hotline}
                    onChangeText={(value: any) =>
                      handleChange("hotline", value)
                    }
                    error={errors.hotline}
                  />
                  <StaticSelectField
                    title="Trạng thái"
                    isRequired={true}
                    placeholder="Chọn trạng thái"
                    dataMap={STATUS_MAP}
                    value={form.status}
                    onChange={(value: any) => handleChange("status", value)}
                    error={errors.status}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <DatePickerField
                    title="Ngày bắt đầu"
                    isRequired={true}
                    placeholder="Chọn ngày bắt đầu"
                    value={form.startDate}
                    onChange={(value: any) => handleChange("startDate", value)}
                    error={errors.startDate}
                  />
                  <DatePickerField
                    title="Ngày hết hạn"
                    isRequired={true}
                    placeholder="Chọn ngày hết hạn"
                    value={form.expiredDate}
                    onChange={(value: any) =>
                      handleChange("expiredDate", value)
                    }
                    error={errors.expiredDate}
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

export default UpdateLocation;
