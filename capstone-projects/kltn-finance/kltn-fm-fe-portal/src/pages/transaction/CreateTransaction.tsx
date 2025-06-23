import {
  InputField,
  TextAreaField,
  ToggleField,
} from "../../components/form/InputField";
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
  SelectField,
  SelectFieldLazy,
  StaticSelectField,
} from "../../components/form/SelectField";
import useApi from "../../hooks/useApi";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TAG_KIND,
  TOAST,
  TRANSACTION_KIND_MAP,
  VALID_PATTERN,
} from "../../services/constant";
import { LoadingDialog } from "../../components/page/Dialog";
import useQueryState from "../../hooks/useQueryState";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { parseDate } from "../../services/utils";
import DocumentsField from "../../components/form/DocumentsField";

const CreateTransaction = () => {
  const { setToast, hasRoles } = useGlobalContext();
  const canChangeEmployee = hasRoles("TR_C_FA");
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.TRANSACTION.path,
    requireSessionKey: true,
  });
  const { transaction, loading } = useApi();
  const { tag, employee, category, transactionGroup } = useApi();
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
    const transactionDate = parseDate(form.transactionDate);
    if (!transactionDate) {
      newErrors.transactionDate = "Ngày giao dịch không hợp lệ";
    }
    if (!form.transactionGroupId) {
      newErrors.transactionGroupId = "Nhóm không hợp lệ";
    }
    if (canChangeEmployee) {
      if (!form.addedBy) {
        newErrors.addedBy = "Nhân viên không hợp lệ";
      }
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    {
      addedBy: "",
      approvedBy: "",
      categoryId: "",
      document: "[]",
      ignoreDebit: 1,
      kind: "",
      money: "",
      name: "",
      note: "",
      tagId: "",
      transactionDate: "",
      transactionGroupId: "",
    },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await transaction.create(form);
      if (res.result) {
        setToast(BASIC_MESSAGES.CREATED, TOAST.SUCCESS);
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
          label: PAGE_CONFIG.TRANSACTION.label,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.CREATE_TRANSACTION.label,
        },
      ]}
      activeItem={PAGE_CONFIG.TRANSACTION.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.CREATE_TRANSACTION.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Tên giao dịch"
                    isRequired={true}
                    placeholder="Nhập tên giao dịch"
                    value={form.name}
                    onChangeText={(value: any) => handleChange("name", value)}
                    error={errors.name}
                  />
                  <SelectFieldLazy
                    title="Nhóm giao dịch"
                    isRequired={true}
                    fetchListApi={transactionGroup.autoComplete}
                    placeholder="Chọn nhóm giao dịch"
                    value={form.transactionGroupId}
                    onChange={(value: any) =>
                      handleChange("transactionGroupId", value)
                    }
                    error={errors.transactionGroupId}
                    decryptFields={DECRYPT_FIELDS.TRANSACTION_GROUP}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <StaticSelectField
                    title="Loại"
                    isRequired={true}
                    placeholder="Chọn loại"
                    dataMap={TRANSACTION_KIND_MAP}
                    value={form?.kind}
                    onChange={(value: any) => {
                      if (value == TRANSACTION_KIND_MAP.INCOME.value) {
                        handleChange("ignoreDebit", 1);
                      }
                      handleChange("kind", value);
                      handleChange("categoryId", "");
                    }}
                    error={errors?.kind}
                  />
                  <SelectFieldLazy
                    title="Danh mục"
                    fetchListApi={category.autoComplete}
                    placeholder="Chọn danh mục"
                    value={form.categoryId}
                    onChange={(value: any) => handleChange("categoryId", value)}
                    error={errors.categoryId}
                    decryptFields={DECRYPT_FIELDS.CATEGORY}
                    queryParams={{ kind: form?.kind }}
                    refreshOnOpen={true}
                    disabled={!form.kind}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <DatePickerField
                    title="Ngày giao dịch"
                    isRequired={true}
                    placeholder="Chọn ngày giao dịch"
                    value={form.transactionDate}
                    onChange={(value: any) =>
                      handleChange("transactionDate", value)
                    }
                    error={errors.transactionDate}
                  />
                  <InputField
                    title="Số tiền"
                    isRequired={true}
                    placeholder="Nhập số tiền"
                    type="number"
                    value={form.money}
                    onChangeText={(value: any) => handleChange("money", value)}
                    error={errors.money}
                  />
                </div>
                {canChangeEmployee && (
                  <div className="flex flex-row space-x-2">
                    <SelectField
                      title="Người tạo"
                      fetchListApi={employee.autoComplete}
                      placeholder="Chọn người tạo"
                      value={form.addedBy}
                      onChange={(value: any) => handleChange("addedBy", value)}
                      error={errors.addedBy}
                      labelKey="fullName"
                      isRequired={true}
                    />
                    <SelectField
                      title="Người duyệt"
                      fetchListApi={employee.autoComplete}
                      placeholder="Chọn người duyệt"
                      value={form.approvedBy}
                      onChange={(value: any) =>
                        handleChange("approvedBy", value)
                      }
                      error={errors.approvedBy}
                      labelKey="fullName"
                    />
                  </div>
                )}
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
                    queryParams={{ kind: TAG_KIND.TRANSACTION }}
                  />
                  <ToggleField
                    title="Sinh công nợ"
                    disabled={form?.kind == TRANSACTION_KIND_MAP.INCOME.value}
                    checked={form.ignoreDebit == 0}
                    onChange={(value: any) => {
                      const ignoreDebit = value ? 0 : 1;
                      handleChange("ignoreDebit", ignoreDebit);
                    }}
                  />
                </div>
                <TextAreaField
                  title="Ghi chú"
                  placeholder="Nhập ghi chú"
                  value={form?.note}
                  onChangeText={(value: any) => handleChange("note", value)}
                  error={errors?.note}
                />
                <DocumentsField
                  title="Chứng từ"
                  value={form.document}
                  onChange={(value: any) => handleChange("document", value)}
                />
                <ActionSection
                  children={
                    <>
                      <CancelButton onClick={handleNavigateBack} />
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

export default CreateTransaction;
