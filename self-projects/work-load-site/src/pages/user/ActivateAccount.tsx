/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useApi from "../../hooks/useApi";
import { useEffect, useState } from "react";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TOAST,
  VALID_PATTERN,
} from "../../types/constant";
import useForm from "../../hooks/useForm";
import { AUTH_CONFIG } from "../../components/config/PageConfigDetails";
import { LoadingDialog } from "../../components/form/Dialog";
import {
  ActionSection,
  BasicCardForm,
  MessageForm,
} from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import { decryptClientField } from "../../services/encryption/clientEncryption";
import skateboarding from "../../assets/skateboarding.png";

const ActivateAccount = () => {
  const { token } = useParams();
  const { profile, setToast } = useGlobalContext();
  const navigate = useNavigate();
  const { user, loading } = useApi();
  const [isSubmitted, setIsSubmitted] = useState<any>(false);

  const handleNavigateBack = () => {
    if (profile) {
      navigate(PAGE_CONFIG.MSA_HOME.path);
    } else {
      navigate(AUTH_CONFIG.LOGIN.path);
    }
  };

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.PASSWORD.test(form.password)) {
      newErrors.password = "Invalid Password";
    }
    return newErrors;
  };

  const { form, errors, handleChange, resetForm, isValidForm } = useForm(
    { password: "", token: "" },
    validate
  );

  useEffect(() => {
    const ifTokenExist = () => {
      resetForm();
      try {
        if (!token) {
          handleNavigateBack();
        }
        const decryptedToken = decryptClientField(token);
        if (!decryptedToken) {
          handleNavigateBack();
        }
        handleChange("token", decryptedToken);
      } catch {
        handleNavigateBack();
      }
    };
    ifTokenExist();
  }, [token]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await user.activateAccount(form);
      if (res.result) {
        setToast(BASIC_MESSAGES.SUCCESS, TOAST.SUCCESS);
        setIsSubmitted(true);
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
      {!isSubmitted ? (
        <BasicCardForm title="Activate Account">
          <div className="space-y-4">
            <InputField2
              isRequired={true}
              title="Password"
              placeholder="Enter password"
              value={form.password}
              onChangeText={(value: any) => handleChange("password", value)}
              type="password"
              error={errors.password}
            />
            <ActionSection
              children={
                <>
                  <CancelButton onClick={handleNavigateBack} />
                  <SubmitButton
                    text={BUTTON_TEXT.SUBMIT}
                    onClick={handleSubmit}
                  />
                </>
              }
            />
          </div>
        </BasicCardForm>
      ) : (
        <MessageForm
          title="Account Activated"
          message="Your account has been successfully activated!"
          imgSrc={skateboarding}
          children={
            <ActionSection>
              <SubmitButton
                text={BUTTON_TEXT.CONTINUE}
                onClick={handleNavigateBack}
              />
            </ActionSection>
          }
        />
      )}
    </>
  );
};

export default ActivateAccount;
