import useForm from "../../hooks/useForm";
import { InputField } from "../../components/form/InputField";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { LoadingDialog } from "../../components/page/Dialog";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  GRANT_TYPE,
  GRANT_TYPE_MAP,
  TOAST,
  VALID_PATTERN,
} from "../../services/constant";
import useApi from "../../hooks/useApi";
import { ActionSection, BasicCardForm } from "../../components/form/FormCard";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { StaticSelectField } from "../../components/form/SelectField";

const ForgotPassword = () => {
  const { setToast } = useGlobalContext();
  const navigate = useNavigate();
  const { auth, loading } = useApi();

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.grantType) {
      newErrors.grantType = "Loại tài khoản không hợp lệ";
    }
    if (!VALID_PATTERN.EMAIL.test(form.email)) {
      newErrors.email = "Địa chỉ email không hợp lệ";
    }
    if (GRANT_TYPE.EMPLOYEE === form.grantType && !form.tenantId.trim()) {
      newErrors.tenantId = "Mã công ty không hợp lệ";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    { email: "", grantType: "", tenantId: "" },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      let res;
      if (GRANT_TYPE.CUSTOMER === form.grantType) {
        res = await auth.requestForgetPassword(form.email);
      } else {
        res = await auth.requestForgetPasswordEmployee(
          form.email,
          form.tenantId
        );
      }
      if (res.result) {
        setToast(BASIC_MESSAGES.SUCCESS, TOAST.SUCCESS);
        navigate("/reset-password", {
          state: {
            userId: res.data.userId,
            grantType: form.grantType,
            tenantId: form.tenantId,
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
      <BasicCardForm title="Quên mật khẩu">
        <div className="space-y-4">
          <StaticSelectField
            title="Loại tài khoản"
            isRequired={true}
            placeholder="Chọn loại tài khoản"
            dataMap={GRANT_TYPE_MAP}
            value={form.grantType}
            onChange={(value: any) => handleChange("grantType", value)}
            error={errors.grantType}
          />
          {GRANT_TYPE.EMPLOYEE === form.grantType && (
            <InputField
              title="Mã công ty"
              isRequired
              placeholder="Nhập mã công ty"
              value={form.tenantId}
              onChangeText={(value: any) => handleChange("tenantId", value)}
              error={errors.tenantId}
            />
          )}
          <InputField
            title="Địa chỉ email"
            isRequired={true}
            placeholder="Nhập địa chỉ email"
            value={form.email}
            onChangeText={(value: any) => handleChange("email", value)}
            error={errors.email}
          />
          <ActionSection
            children={
              <>
                <CancelButton onClick={() => navigate("/")} />
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
