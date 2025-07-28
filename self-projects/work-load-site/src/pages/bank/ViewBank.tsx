/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import useQueryState from "../../hooks/useQueryState";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import useApi from "../../hooks/useApi";
import { BUTTON_TEXT } from "../../types/constant";
import { useEffect, useState } from "react";
import Sidebar2 from "../../components/main/Sidebar2";
import { LoadingDialog } from "../../components/form/Dialog";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import { CancelButton } from "../../components/form/Button";
import JsonListField from "../../components/form/json/JsonListField";
import useEncryption from "../../hooks/useEncryption";

const ViewBank = () => {
  const { id } = useParams();
  const { userDecrypt } = useEncryption();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.BANK.path,
    requireSessionKey: true,
  });
  const { bank, loading } = useApi();
  const [fetchData, setFetchData] = useState<any>({});

  useEffect(() => {
    if (!id) {
      handleNavigateBack();
      return;
    }
    const fetchData = async () => {
      const res = await bank.get(id);
      if (res.result) {
        const data = res.data;
        setFetchData(data);
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [id]);

  return (
    <Sidebar2
      breadcrumbs={[
        {
          label: `(${fetchData?.tag?.name}) ${fetchData?.username}`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.VIEW_BANK.label,
        },
      ]}
      activeItem={PAGE_CONFIG.BANK.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.VIEW_BANK.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <InputField2
                    title="Tag"
                    disabled={true}
                    value={fetchData?.tag?.name}
                  />
                  <InputField2
                    title="Username"
                    disabled={true}
                    value={fetchData?.username}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <InputField2
                    title="Password"
                    disabled={true}
                    value={userDecrypt(fetchData?.password)}
                    type="password"
                  />
                  <JsonListField
                    title="Pins"
                    disabled={true}
                    value={userDecrypt(fetchData?.pins)}
                  />
                </div>
                <JsonListField
                  title="Numbers"
                  disabled={true}
                  value={fetchData?.numbers}
                />
                <ActionSection
                  children={
                    <CancelButton
                      onClick={handleNavigateBack}
                      text={BUTTON_TEXT.BACK}
                    />
                  }
                />
              </div>
            }
          />
        </>
      }
    />
  );
};

export default ViewBank;
