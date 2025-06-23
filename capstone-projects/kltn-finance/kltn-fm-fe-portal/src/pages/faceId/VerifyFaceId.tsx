import { useRef } from "react";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useApi from "../../hooks/useApi";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../services/constant";
import { LoadingDialog } from "../../components/page/Dialog";
import { ActionSection, ModalForm } from "../../components/form/FormCard";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";

const VerifyFaceId = ({ isVisible, formConfig }: any) => {
  const navigate = useNavigate();
  const { setToast } = useGlobalContext();
  const { faceId, loading } = useApi();
  const webcamRef = useRef<any>(null);

  const handleSubmit = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
      return;
    }
    const res = await faceId.verify(imageSrc);
    if (!res.result) {
      setToast(res.message, TOAST.ERROR);
      return;
    }
    setToast(BASIC_MESSAGES.SUCCESS, TOAST.SUCCESS);
    await formConfig.onButtonClick();
  };

  return (
    <>
      <LoadingDialog isVisible={loading} />
      <ModalForm
        zIndex={990}
        isVisible={isVisible}
        onClose={() => navigate(-1)}
        title={BUTTON_TEXT.VERIFY_FACEID}
        blurAmount="sm"
        children={
          <>
            <div className="flex flex-col space-y-4">
              <Webcam
                audio={false}
                ref={webcamRef}
                className="border rounded-md border-gray-600"
              />
              <ActionSection
                children={
                  <>
                    <CancelButton onClick={() => navigate(-1)} />
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

export default VerifyFaceId;
