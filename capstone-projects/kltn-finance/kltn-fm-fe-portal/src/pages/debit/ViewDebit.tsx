import { InputField, TextAreaField } from "../../components/form/InputField";
import Sidebar from "../../components/page/Sidebar";
import {
  DECRYPT_FIELDS,
  PAGE_CONFIG,
} from "../../components/config/PageConfig";
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
} from "../../services/constant";
import { LoadingDialog } from "../../components/page/Dialog";
import useQueryState from "../../hooks/useQueryState";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { decryptData } from "../../services/utils";
import DocumentsField from "../../components/form/DocumentsField";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewDebit = () => {
  const { id } = useParams();
  const { sessionKey } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.DEBIT.path,
    requireSessionKey: true,
  });
  const { debit, loading } = useApi();
  const { tag, employee, category, transactionGroup } = useApi();
  const [fetchData, setFetchData] = useState<any>(null);

  useEffect(() => {
    if (!id) {
      handleNavigateBack();
      return;
    }
    const fetchData = async () => {
      const res = await debit.get(id);
      if (!res.result) {
        handleNavigateBack();
      }
      const data = decryptData(sessionKey, res.data, DECRYPT_FIELDS.DEBIT);
      setFetchData(data);
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
          label: PAGE_CONFIG.VIEW_DEBIT.label,
        },
      ]}
      activeItem={PAGE_CONFIG.DEBIT.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.VIEW_DEBIT.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Tên công nợ"
                    isRequired={true}
                    value={fetchData?.name}
                    disabled={true}
                  />
                  <SelectFieldLazy
                    title="Nhóm giao dịch"
                    isRequired={true}
                    fetchListApi={transactionGroup.autoComplete}
                    value={fetchData?.transactionGroup?.id}
                    decryptFields={DECRYPT_FIELDS.TRANSACTION_GROUP}
                    disabled={true}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <StaticSelectField
                    title="Loại"
                    isRequired={true}
                    value={fetchData?.kind}
                    dataMap={TRANSACTION_KIND_MAP}
                    disabled={true}
                  />
                  <SelectFieldLazy
                    title="Danh mục"
                    fetchListApi={category.autoComplete}
                    value={fetchData?.category?.id}
                    decryptFields={DECRYPT_FIELDS.CATEGORY}
                    queryParams={{ kind: TRANSACTION_KIND_MAP.EXPENSE.value }}
                    disabled={true}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <DatePickerField
                    title="Ngày giao dịch"
                    isRequired={true}
                    value={fetchData?.transactionDate}
                    disabled={true}
                  />
                  <InputField
                    title="Số tiền"
                    isRequired={true}
                    type="number"
                    value={fetchData?.money}
                    disabled={true}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <SelectField
                    title="Người tạo"
                    fetchListApi={employee.autoComplete}
                    value={fetchData?.addedBy?.id}
                    labelKey="fullName"
                    isRequired={true}
                    disabled={true}
                  />
                  <StaticSelectField
                    title="Tình trạng"
                    isRequired={true}
                    dataMap={TRANSACTION_STATE_MAP}
                    value={fetchData?.state}
                    disabled={true}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <SelectFieldLazy
                    title="Thẻ"
                    fetchListApi={tag.autoComplete}
                    value={fetchData?.tag?.id}
                    colorCodeField="colorCode"
                    decryptFields={DECRYPT_FIELDS.TAG}
                    queryParams={{ kind: TAG_KIND.TRANSACTION }}
                    disabled={true}
                  />
                  <span className="flex-1" />
                </div>
                <TextAreaField
                  title="Ghi chú"
                  value={fetchData?.note}
                  disabled={true}
                />
                <DocumentsField
                  title="Chứng từ"
                  value={fetchData?.document}
                  disabled={true}
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

export default ViewDebit;
