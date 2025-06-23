import { useEffect, useRef } from "react";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import Webcam from "react-webcam";
import { LoadingDialog } from "../../components/page/Dialog";
import { ActionSection, ModalForm } from "../../components/form/FormCard";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TOAST,
  VALID_PATTERN,
} from "../../services/constant";
import { InputField } from "../../components/form/InputField";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import { useGlobalContext } from "../../components/config/GlobalProvider";

const RegisterFaceId = ({ isVisible, formConfig }: any) => {
  const { setToast } = useGlobalContext();
  const { faceId, loading } = useApi();
  const webcamRef = useRef<any>(null);

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.PASSWORD.test(form.password)) {
      newErrors.password = "Mật khẩu không hợp lệ";
    }
    return newErrors;
  };

  const { form, errors, resetForm, handleChange, isValidForm } = useForm(
    { password: "" },
    validate
  );

  useEffect(() => {
    resetForm();
  }, [isVisible]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
        return;
      }
      const res = await faceId.register({
        password: form.password,
        imageData: imageSrc,
      });
      if (!res.result) {
        setToast(res.message, TOAST.ERROR);
        return;
      }
      setToast(BASIC_MESSAGES.SUCCESS, TOAST.SUCCESS);
      await formConfig.onButtonClick();
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  return (
    <>
      <LoadingDialog isVisible={loading} />
      <ModalForm
        isVisible={isVisible}
        onClose={formConfig?.hideModal}
        title={BUTTON_TEXT.REGISTER_FACEID}
        children={
          <>
            <div className="flex flex-col space-y-4">
              <Webcam
                audio={false}
                ref={webcamRef}
                className="border rounded-md border-gray-600"
              />
              <InputField
                type="password"
                title="Mật khẩu"
                isRequired={true}
                placeholder="Nhập mật khẩu"
                value={form?.password}
                onChangeText={(value: any) => handleChange("password", value)}
                error={errors?.password}
              />
              <ActionSection
                children={
                  <>
                    <CancelButton onClick={formConfig.hideModal} />
                    <SubmitButton
                      text={BUTTON_TEXT.SUBMIT}
                      onClick={handleSubmit}
                    />
                  </>
                }
              />
            </div>
          </>
        }
      />
    </>
  );
};

export default RegisterFaceId;
