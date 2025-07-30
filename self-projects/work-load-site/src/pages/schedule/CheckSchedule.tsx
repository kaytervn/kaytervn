/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useApi from "../../hooks/useApi";
import { useEffect, useState } from "react";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import { AUTH_CONFIG } from "../../components/config/PageConfigDetails";
import { decryptClientField } from "../../services/encryption/clientEncryption";
import { LoadingDialog } from "../../components/form/Dialog";
import { BASIC_MESSAGES, BUTTON_TEXT } from "../../types/constant";
import { ActionSection, MessageForm } from "../../components/form/FormCard";
import { SubmitButton } from "../../components/form/Button";
import badRequest from "../../assets/bad_request.png";
import checkedSchedule from "../../assets/checked_schedule.png";
import { unzipString } from "../../types/utils";

const CheckSchedule = () => {
  const { token } = useParams();
  const { profile } = useGlobalContext();
  const navigate = useNavigate();
  const { schedule, loading } = useApi();
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
        const decryptedToken = unzipString(decryptClientField(token));
        if (!decryptedToken) {
          handleNavigateBack();
          return;
        }
        const tenant = decryptedToken.split(";")[0];
        const serverToken = decryptedToken.split(";")[1];
        const res = await schedule.checkSchedule(tenant, serverToken);
        setSubmittedData(res);
        return;
      } catch {
        handleNavigateBack();
      }
    };
    ifTokenExist();
  }, []);

  return (
    <>
      <LoadingDialog isVisible={loading} />
      {submittedData?.result ? (
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
