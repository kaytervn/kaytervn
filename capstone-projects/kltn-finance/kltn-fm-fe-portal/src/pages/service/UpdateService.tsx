import { InputField, TextAreaField } from "../../components/form/InputField";
import Sidebar from "../../components/page/Sidebar";
import {
  DECRYPT_FIELDS,
  PAGE_CONFIG,
} from "../../components/config/PageConfig";
import useForm from "../../hooks/useForm";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { DatePickerField } from "../../components/form/OtherField";
import {
  SelectFieldLazy,
  StaticSelectField,
} from "../../components/form/SelectField";
import useApi from "../../hooks/useApi";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  PERIOD_KIND_MAP,
  TAG_KIND,
  TOAST,
  TRANSACTION_KIND_MAP,
  VALID_PATTERN,
} from "../../services/constant";
import { LoadingDialog } from "../../components/page/Dialog";
import useQueryState from "../../hooks/useQueryState";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import {
  calculateExpirationDate,
  decryptData,
  parseDate,
} from "../../services/utils";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UpdateService = () => {
  const { id } = useParams();
  const { setToast, sessionKey } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.SERVICE.path,
    requireSessionKey: true,
  });
  const { service, loading } = useApi();
  const { tag, serviceGroup } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.NAME.test(form.name)) {
      newErrors.name = "Tên không hợp lệ";
    }
    if (!VALID_PATTERN.MONEY.test(form.money)) {
      newErrors.money = "Số tiền không hợp lệ";
    }
    if (!form.kind) {
      newErrors.kind = "Loại không hợp lệ";
    }
    if (!form.periodKind) {
      newErrors.periodKind = "Chu kỳ không hợp lệ";
    }
    if (!form.serviceGroupId) {
      newErrors.serviceGroupId = "Nhóm không hợp lệ";
    }
    const startDate = parseDate(form.startDate);
    if (!startDate) {
      newErrors.startDate = "Ngày bắt đầu không hợp lệ";
    }
    if (PERIOD_KIND_MAP.FIXED_DATE.value == form.periodKind) {
      const expirationDate = parseDate(form.expirationDate);
      if (!startDate || !expirationDate || expirationDate <= startDate) {
        newErrors.expirationDate = "Ngày tới hạn không hợp lệ";
      }
    }
    return newErrors;
  };
  const [fetchData, setFetchData] = useState(null);

  const { form, setForm, errors, handleChange, isValidForm } = useForm(
    {
      description: "",
      expirationDate: "",
      kind: "",
      money: "",
      name: "",
      periodKind: "",
      serviceGroupId: "",
      startDate: "",
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
      const res = await service.get(id);
      if (res.result) {
        const data = decryptData(sessionKey, res.data, DECRYPT_FIELDS.SERVICE);
        setFetchData(data);
        setForm({
          description: data.description,
          expirationDate: data.expirationDate,
          kind: data.kind,
          money: data.money,
          name: data.name,
          periodKind: data.periodKind,
          serviceGroupId: data.serviceGroup?.id,
          startDate: data.startDate,
          tagId: data.tag?.id,
        });
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [id]);

  const isFixedDate = PERIOD_KIND_MAP.FIXED_DATE.value == form.periodKind;
  const suggestedExpDate =
    form.startDate && !isFixedDate
      ? calculateExpirationDate(form.startDate, form.periodKind)
      : "";

  const handlePeriodKindChange = (value: any) => {
    handleChange("periodKind", value);
    if (!isFixedDate) {
      handleChange("expirationDate", "");
    }
  };

  const handleStartDateChange = (value: any) => {
    handleChange("startDate", value);
    if (!isFixedDate) {
      handleChange("expirationDate", "");
    }
  };

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await service.update({ ...form, id });
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
          label: PAGE_CONFIG.SERVICE.label,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.UPDATE_SERVICE.label,
        },
      ]}
      activeItem={PAGE_CONFIG.SERVICE.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.UPDATE_SERVICE.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Tên dịch vụ"
                    isRequired={true}
                    placeholder="Nhập tên dịch vụ"
                    value={form.name}
                    onChangeText={(value: any) => handleChange("name", value)}
                    error={errors.name}
                  />
                  <SelectFieldLazy
                    title="Nhóm dịch vụ"
                    isRequired={true}
                    fetchListApi={serviceGroup.autoComplete}
                    placeholder="Chọn nhóm dịch vụ"
                    value={form.serviceGroupId}
                    onChange={(value: any) =>
                      handleChange("serviceGroupId", value)
                    }
                    error={errors.serviceGroupId}
                    decryptFields={DECRYPT_FIELDS.SERVICE_GROUP}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <StaticSelectField
                    title="Chu kỳ"
                    isRequired={true}
                    placeholder="Chọn chu kỳ"
                    dataMap={PERIOD_KIND_MAP}
                    value={form?.periodKind}
                    onChange={handlePeriodKindChange}
                    error={errors?.periodKind}
                  />
                  <StaticSelectField
                    title="Loại"
                    isRequired={true}
                    placeholder="Chọn loại"
                    dataMap={TRANSACTION_KIND_MAP}
                    value={form?.kind}
                    onChange={(value: any) => handleChange("kind", value)}
                    error={errors?.kind}
                  />
                </div>

                <div className="flex flex-row space-x-2">
                  <DatePickerField
                    title="Ngày bắt đầu"
                    isRequired={true}
                    placeholder="Chọn ngày bắt đầu"
                    value={form.startDate}
                    onChange={handleStartDateChange}
                    error={errors.startDate}
                    disabled={!form.periodKind}
                  />
                  <DatePickerField
                    title="Ngày tới hạn"
                    isRequired={isFixedDate}
                    placeholder={"Chọn ngày tới hạn"}
                    value={isFixedDate ? form.expirationDate : suggestedExpDate}
                    onChange={(value: any) =>
                      handleChange("expirationDate", value)
                    }
                    error={errors.expirationDate}
                    disabled={!isFixedDate}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Số tiền"
                    isRequired={true}
                    placeholder="Nhập số tiền"
                    type="number"
                    value={form.money}
                    onChangeText={(value: any) => handleChange("money", value)}
                    error={errors.money}
                  />
                  <SelectFieldLazy
                    title="Thẻ"
                    fetchListApi={tag.autoComplete}
                    placeholder="Chọn thẻ"
                    value={form.tagId}
                    onChange={(value: any) => handleChange("tagId", value)}
                    colorCodeField="colorCode"
                    error={errors.tagId}
                    decryptFields={DECRYPT_FIELDS.TAG}
                    queryParams={{ kind: TAG_KIND.SERVICE }}
                  />
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

export default UpdateService;
