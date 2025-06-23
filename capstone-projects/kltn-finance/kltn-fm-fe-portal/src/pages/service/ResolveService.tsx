import { ActionSection, ModalForm } from "../../components/form/FormCard";
import useForm from "../../hooks/useForm";
import { useEffect } from "react";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { BUTTON_TEXT, PERIOD_KIND_MAP } from "../../services/constant";
import useApi from "../../hooks/useApi";
import { LoadingDialog } from "../../components/page/Dialog";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import {
  calculateExpirationDate,
  decryptData,
  getNextValidExpirationDate,
  getPreviousExpirationDate,
  parseDate,
} from "../../services/utils";
import { DECRYPT_FIELDS } from "../../components/config/PageConfig";
import { DatePickerField } from "../../components/form/OtherField";
import {
  ChevronUp,
  ChevronDown,
  CalendarClock,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "lucide-react";

const ResolveService = ({ isVisible, formConfig }: any) => {
  const { sessionKey } = useGlobalContext();
  const { service, loading } = useApi();
  const { form, errors, setForm, resetForm, handleChange } = useForm(
    formConfig.initForm,
    () => {}
  );

  const isFixedDate = formConfig.isFixedDate;

  useEffect(() => {
    const fetchData = async () => {
      if (!sessionKey) {
        formConfig?.hideModal();
      }
      resetForm();
      const res = await service.get(formConfig.initForm.id);
      if (res.result) {
        const data = decryptData(sessionKey, res.data, DECRYPT_FIELDS.SERVICE);
        setForm((prev: any) => ({
          id: data.id,
          startDate: data.startDate,
          periodKind: data.periodKind,
          expirationDate: data.expirationDate,
          ...(isFixedDate
            ? {}
            : {
                maxExpirationDate: calculateExpirationDate(
                  data.startDate,
                  data.periodKind
                ),
              }),
        }));
      } else {
        formConfig?.hideModal();
      }
    };

    if (formConfig?.initForm?.id) {
      fetchData();
    }
  }, [formConfig]);

  useEffect(() => {
    resetForm();
  }, [isVisible]);

  const handleSubmit = async () => {
    await formConfig.onButtonClick(form);
  };

  const goToPreviousDate = () => {
    const { startDate, expirationDate, maxExpirationDate, periodKind } =
      form || {};
    const start = parseDate(startDate);
    const exp = parseDate(expirationDate);
    const maxExp = parseDate(maxExpirationDate);
    if (!start || !exp || !maxExp || exp <= maxExp) {
      return;
    }
    handleChange(
      "expirationDate",
      getPreviousExpirationDate(startDate, expirationDate, periodKind)
    );
  };

  const goToNextDate = () => {
    const { startDate, expirationDate, periodKind } = form || {};
    handleChange(
      "expirationDate",
      getNextValidExpirationDate(startDate, expirationDate, periodKind)
    );
  };

  if (!isVisible) return null;
  return (
    <>
      <LoadingDialog isVisible={loading} />
      <ModalForm
        isVisible={isVisible}
        onClose={formConfig.hideModal}
        title={formConfig.title}
      >
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <DatePickerField
              isRequired={true}
              title="Ngày tới hạn"
              placeholder={"Chọn ngày tới hạn"}
              value={form?.expirationDate}
              onChange={(value: any) => handleChange("expirationDate", value)}
              error={errors?.expirationDate}
              disabled={true}
            />
            {!isFixedDate && (
              <div className="flex flex-row space-x-2">
                <button
                  onClick={goToPreviousDate}
                  className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
                  title="Ngày trước đó"
                >
                  <ChevronLeftIcon size={16} />
                </button>
                <button
                  onClick={goToNextDate}
                  className="p-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                  title="Ngày tiếp theo"
                >
                  <ChevronRightIcon size={16} />
                </button>
              </div>
            )}
          </div>
          <ActionSection>
            <div className="flex justify-end space-x-3">
              <CancelButton onClick={formConfig?.hideModal} />
              <SubmitButton text={BUTTON_TEXT.RESOLVE} onClick={handleSubmit} />
            </div>
          </ActionSection>
        </div>
      </ModalForm>
    </>
  );
};

export default ResolveService;
