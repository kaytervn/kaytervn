/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import useQueryState from "../../hooks/useQueryState";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import useApi from "../../hooks/useApi";
import { ACCOUNT_KIND_MAP, BUTTON_TEXT } from "../../types/constant";
import { useEffect, useState } from "react";
import Sidebar2 from "../../components/main/Sidebar2";
import { LoadingDialog } from "../../components/form/Dialog";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import { InputField2 } from "../../components/form/InputTextField";
import { CancelButton } from "../../components/form/Button";
import { StaticSelectField } from "../../components/form/SelectTextField";
import { TextAreaField2 } from "../../components/form/TextareaField";
import useEncryption from "../../hooks/useEncryption";

const ViewAccount = () => {
  const { id } = useParams();
  const { userDecrypt } = useEncryption();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.ACCOUNT.path,
    requireSessionKey: true,
  });
  const { account, loading } = useApi();
  const [fetchData, setFetchData] = useState<any>({});
  const isRoot = () => fetchData?.kind == ACCOUNT_KIND_MAP.ROOT.value;

  useEffect(() => {
    if (!id) {
      handleNavigateBack();
      return;
    }

    const fetchData = async () => {
      const res = await account.get(id);
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
          label: `(${
            fetchData?.parent?.platform?.name || fetchData?.platform?.name
          }) ${fetchData?.parent?.username || fetchData?.username}`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.VIEW_ACCOUNT.label,
        },
      ]}
      activeItem={PAGE_CONFIG.ACCOUNT.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.VIEW_ACCOUNT.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <InputField2
                    title="Platform"
                    disabled={true}
                    value={fetchData?.platform?.name}
                  />
                  <StaticSelectField
                    title="Kind"
                    disabled={true}
                    dataMap={ACCOUNT_KIND_MAP}
                    value={fetchData?.kind}
                  />
                </div>
                {isRoot() && (
                  <div className="flex flex-row space-x-2">
                    <InputField2
                      title="Username"
                      value={fetchData?.username}
                      disabled={true}
                    />
                    <InputField2
                      title="Password"
                      disabled={true}
                      value={userDecrypt(fetchData?.password)}
                      type="password"
                    />
                  </div>
                )}
                <div className="flex flex-row space-x-2">
                  <TextAreaField2
                    title="Note"
                    value={fetchData?.note}
                    disabled={true}
                    height={"200"}
                  />
                  <InputField2
                    title="Tag"
                    value={fetchData?.tag?.name}
                    disabled={true}
                  />
                </div>
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

export default ViewAccount;
