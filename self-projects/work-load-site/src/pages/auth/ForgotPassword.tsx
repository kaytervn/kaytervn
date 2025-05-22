import useForm from "../../hooks/useForm";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import useApi from "../../hooks/useApi";
import { ActionSection, BasicCardForm } from "../../components/form/FormCard";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { LoadingDialog } from "../../components/form/Dialog";
import { InputField2 } from "../../components/form/InputTextField";
import { BASIC_MESSAGES, BUTTON_TEXT, DOC_TITLE, TOAST } from "../../types/constant";
import { encryptClientData } from "../../services/encryption/clientEncryption";
import { ENCRYPT_FIELDS } from "../../services/encryption/encryptFields";
import { USER_CONFIG } from "../../components/config/PageConfigDetails";
import useDocTitle from "../../hooks/useDocTitle";

const ForgotPassword = () => {
  useDocTitle(DOC_TITLE.MSA);
  const { setToast } = useGlobalContext();
  const navigate = useNavigate();
  const { user, loading } = useApi();

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.email.trim()) {
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
      const res = await user.requestForgetPassword(
        encryptClientData(form, ENCRYPT_FIELDS.REQUEST_FORGOT_PASSWORD_FORM)
      );
      if (res.result) {
        setToast(BASIC_MESSAGES.SUCCESS, TOAST.SUCCESS);
        navigate(USER_CONFIG.RESET_PASSWORD.path, {
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
      <BasicCardForm title={USER_CONFIG.FORGOT_PASSWORD.label}>
        <div className="space-y-4">
          <InputField2
            title="Email address"
            isRequired={true}
            placeholder="Enter email address"
            value={form.email}
            onChangeText={(value: any) => handleChange("email", value)}
            error={errors.email}
          />
          <ActionSection
            children={
              <>
                <CancelButton
                  onClick={() => navigate(USER_CONFIG.LOGIN.path)}
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
