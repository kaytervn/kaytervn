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
import { CancelButton } from "../../components/form/Button";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { DatePickerField } from "../../components/form/OtherField";
import {
  SelectField,
  SelectFieldLazy,
  StaticSelectField,
} from "../../components/form/SelectField";
import useApi from "../../hooks/useApi";
import {
  BUTTON_TEXT,
  TAG_KIND,
  TRANSACTION_KIND_MAP,
  TRANSACTION_STATE_MAP,
  TRANSACTION_UPDATE_STATE_MAP,
} from "../../services/constant";
import { LoadingDialog } from "../../components/page/Dialog";
import useQueryState from "../../hooks/useQueryState";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { decryptData } from "../../services/utils";
import DocumentsField from "../../components/form/DocumentsField";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewTransaction = () => {
  const { id } = useParams();
  const { sessionKey } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.TRANSACTION.path,
    requireSessionKey: true,
  });
  const { transaction, loading } = useApi();
  const { tag, employee, category, transactionGroup } = useApi();
  const [fetchData, setFetchData] = useState<any>(null);

  const { form, setForm } = useForm(
    {
      addedBy: "",
      approvedBy: "",
      categoryId: "",
      document: "",
      ignoreDebit: 1,
      kind: "",
      money: "",
      name: "",
      note: "",
      state: "",
      tagId: "",
      transactionDate: "",
      transactionGroupId: "",
    },
    () => {}
  );

  useEffect(() => {
    if (!id) {
      handleNavigateBack();
      return;
    }
    const fetchData = async () => {
      const res = await transaction.get(id);
      if (!res.result) {
        handleNavigateBack();
      }
      const data = decryptData(
        sessionKey,
        res.data,
        DECRYPT_FIELDS.TRANSACTION
      );
      setFetchData(data);
      setForm({
        addedBy: data.addedBy?.id,
        approvedBy: data.approvedBy?.id,
        categoryId: data.category?.id,
        document: data.document,
        ignoreDebit: data.ignoreDebit,
        kind: data.kind,
        money: data.money,
        name: data.name,
        note: data.note,
        state: data.state,
        tagId: data.tag?.id,
        transactionDate: data.transactionDate,
        transactionGroupId: data.transactionGroup?.id,
      });
    };
    fetchData();
  }, [id]);

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: `${fetchData?.name}`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.VIEW_TRANSACTION.label,
        },
      ]}
      activeItem={PAGE_CONFIG.TRANSACTION.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.VIEW_TRANSACTION.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Tên giao dịch"
                    isRequired={true}
                    value={form.name}
                    disabled={true}
                  />
                  <SelectFieldLazy
                    title="Nhóm giao dịch"
                    isRequired={true}
                    fetchListApi={transactionGroup.autoComplete}
                    value={form.transactionGroupId}
                    disabled={true}
                    decryptFields={DECRYPT_FIELDS.TRANSACTION_GROUP}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <StaticSelectField
                    title="Loại"
                    isRequired={true}
                    dataMap={TRANSACTION_KIND_MAP}
                    value={form?.kind}
                    disabled={true}
                  />
                  <SelectFieldLazy
                    title="Danh mục"
                    fetchListApi={category.autoComplete}
                    value={form.categoryId}
                    disabled={true}
                    decryptFields={DECRYPT_FIELDS.CATEGORY}
                    queryParams={{ kind: form?.kind }}
                    refreshOnOpen={true}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <DatePickerField
                    title="Ngày giao dịch"
                    isRequired={true}
                    value={form.transactionDate}
                    disabled={true}
                  />
                  <InputField
                    title="Số tiền"
                    isRequired={true}
                    type="number"
                    value={form.money}
                    disabled={true}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <SelectField
                    title="Người tạo"
                    fetchListApi={employee.autoComplete}
                    value={form.addedBy}
                    disabled={true}
                    labelKey="fullName"
                    isRequired={true}
                  />
                  <SelectField
                    title="Người duyệt"
                    fetchListApi={employee.autoComplete}
                    value={form.approvedBy}
                    labelKey="fullName"
                    disabled={true}
                    isRequired={
                      form?.state == TRANSACTION_UPDATE_STATE_MAP.APPROVE.value
                    }
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <StaticSelectField
                    title="Tình trạng"
                    isRequired={true}
                    dataMap={TRANSACTION_STATE_MAP}
                    value={form?.state}
                    disabled={true}
                  />
                  <SelectFieldLazy
                    title="Thẻ"
                    fetchListApi={tag.autoComplete}
                    value={form.tagId}
                    disabled={true}
                    colorCodeField="colorCode"
                    decryptFields={DECRYPT_FIELDS.TAG}
                    queryParams={{ kind: TAG_KIND.TRANSACTION }}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <ToggleField
                    title="Sinh công nợ"
                    disabled={true}
                    checked={form.ignoreDebit == 0}
                  />
                  <span className="flex-1" />
                </div>
                <TextAreaField
                  title="Ghi chú"
                  value={form?.note}
                  disabled={true}
                />
                <DocumentsField
                  title="Chứng từ"
                  disabled={true}
                  value={form.document}
                />
                <ActionSection
                  children={
                    <>
                      <CancelButton
                        text={BUTTON_TEXT.BACK}
                        onClick={handleNavigateBack}
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

export default ViewTransaction;
