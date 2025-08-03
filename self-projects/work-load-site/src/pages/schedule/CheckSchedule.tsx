/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useApi from "../../hooks/useApi";
import { useEffect, useState } from "react";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import { AUTH_CONFIG } from "../../components/config/PageConfigDetails";
import { LoadingDialog } from "../../components/form/Dialog";
import { BASIC_MESSAGES, BUTTON_TEXT } from "../../types/constant";
import { ActionSection, MessageForm } from "../../components/form/FormCard";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import badRequest from "../../assets/bad_request.png";
import checkedSchedule from "../../assets/checked_schedule.png";
import mark from "../../assets/mark.png";
import { unzipString } from "../../types/utils";
import useEncryption from "../../hooks/useEncryption";

const CheckSchedule = () => {
  const { clientDecryptIgnoreNonce } = useEncryption();
  const { token } = useParams();
  const { profile } = useGlobalContext();
  const navigate = useNavigate();
  const { schedule, loading } = useApi();
  const [decryptedToken, setDecryptedToken] = useState<any>(null);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const handleNavigateBack = () => {
    if (profile) {
      navigate(PAGE_CONFIG.MSA_HOME.path);
    } else {
      navigate(AUTH_CONFIG.LOGIN.path);
    }
  };

  useEffect(() => {
    const ifTokenExist = async () => {
      try {
        if (!token) {
          handleNavigateBack();
        }
        const myToken = unzipString(clientDecryptIgnoreNonce(token));
        if (!myToken) {
          handleNavigateBack();
          return;
        }
        const tenant = myToken.split(";")[0];
        const serverToken = myToken.split(";")[1];
        setDecryptedToken({ tenant, token: serverToken });
      } catch {
        handleNavigateBack();
      }
    };
    ifTokenExist();
  }, []);

  const handleSubmit = async () => {
    const res = await schedule.checkSchedule(
      decryptedToken.tenant,
      decryptedToken.token
    );
    setSubmittedData(res);
  };

  return (
    <>
      <LoadingDialog isVisible={loading} />
      {!submittedData ? (
        <MessageForm
          title="Mark as Checked"
          message="Please click the button below to confirm that your schedule has been checked."
          imgSrc={mark}
          children={
            <ActionSection>
              <CancelButton onClick={handleNavigateBack} />
              <SubmitButton text={BUTTON_TEXT.SUBMIT} onClick={handleSubmit} />
            </ActionSection>
          }
        />
      ) : submittedData?.result ? (
        <MessageForm
          title="Schedule Renewed"
          message="Your schedule has been renewed successfully. Click Continue to return to the previous page."
          imgSrc={checkedSchedule}
          children={
            <ActionSection>
              <SubmitButton
                text={BUTTON_TEXT.CONTINUE}
                onClick={handleNavigateBack}
              />
            </ActionSection>
          }
        />
      ) : (
        <MessageForm
          title="Schedule Check Failed"
          message={`We could not process your schedule request. Please try again or contact support for assistance.\n Error message: ${
            submittedData?.message || BASIC_MESSAGES.FAILED
          }`}
          imgSrc={badRequest}
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

export default CheckSchedule;
