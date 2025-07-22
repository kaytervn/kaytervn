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
import { ActionSection, BasicCardForm } from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { AUTH_CONFIG } from "../../components/config/PageConfigDetails";

const ForgotPassword = () => {
  const { setToast } = useGlobalContext();
  const navigate = useNavigate();
  const { user, loading } = useApi();

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.EMAIL.test(form.email)) {
      newErrors.email = "Invalid email";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    { email: "" },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await user.requestForgetPassword(form);
      if (res.result) {
        setToast(BASIC_MESSAGES.SUCCESS, TOAST.SUCCESS);
        navigate(AUTH_CONFIG.RESET_PASSWORD.path, {
          state: {
            userId: res.data.userId,
          },
        });
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
      <BasicCardForm title="Forgot password">
        <div className="space-y-4">
          <InputField2
            title="Email address"
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
    </>
  );
};

export default ForgotPassword;
