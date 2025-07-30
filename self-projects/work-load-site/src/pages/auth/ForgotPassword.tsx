import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useApi from "../../hooks/useApi";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TOAST,
  VALID_PATTERN,
} from "../../types/constant";
import useForm from "../../hooks/useForm";
import { LoadingDialog } from "../../components/form/Dialog";
import {
  ActionSection,
  BasicCardForm,
  MessageForm,
} from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { AUTH_CONFIG } from "../../components/config/PageConfigDetails";
import { useState } from "react";
import MailSent from "../../assets/mail_sent.png";

const ForgotPassword = () => {
  const { setToast } = useGlobalContext();
  const navigate = useNavigate();
  const { user, loading } = useApi();
  const [submittedData, setSubmittedData] = useState<any>(null);

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.EMAIL.test(form.email)) {
      newErrors.email = "Invalid Email";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    { email: "" },
    validate
  );

  const handleNavigateToResetPassword = () => {
    navigate(AUTH_CONFIG.RESET_PASSWORD.path, {
      state: {
        userId: submittedData,
      },
    });
  };

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await user.requestForgetPassword(form);
      if (res.result) {
        setToast(BASIC_MESSAGES.SUCCESS, TOAST.SUCCESS);
        setSubmittedData(res.data.userId);
        return;
      } else {
        setToast(res.message || BASIC_MESSAGES.FAILED, TOAST.ERROR);
      }
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  return (
    <>
      <LoadingDialog isVisible={loading} />
      {!submittedData ? (
        <BasicCardForm title="Forgot Password">
          <div className="space-y-4">
            <InputField2
              title="Email Address"
              isRequired={true}
              placeholder="Enter your email"
              value={form.email}
              onChangeText={(value: any) => handleChange("email", value)}
              error={errors.email}
            />
            <ActionSection
              children={
                <>
                  <CancelButton
                    onClick={() => navigate(AUTH_CONFIG.LOGIN.path)}
                  />
                  <SubmitButton
                    text={BUTTON_TEXT.CONTINUE}
                    onClick={handleSubmit}
                  />
                </>
              }
            />
          </div>
        </BasicCardForm>
      ) : (
        <MessageForm
          title="Requested Successfully"
          message="We have sent a verification OTP to your email. Please check your inbox and follow the instructions to reset your password."
          imgSrc={MailSent}
          children={
            <ActionSection>
              <CancelButton onClick={() => navigate(AUTH_CONFIG.LOGIN.path)} />
              <SubmitButton
                text={BUTTON_TEXT.VERIFY}
                onClick={handleNavigateToResetPassword}
              />
            </ActionSection>
          }
        />
      )}
    </>
  );
};

export default ForgotPassword;
