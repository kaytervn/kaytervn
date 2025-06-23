import { InputField, TextAreaField } from "../../components/form/InputField";
import Sidebar from "../../components/page/Sidebar";
import {
  DECRYPT_FIELDS,
  PAGE_CONFIG,
} from "../../components/config/PageConfig";
import useForm from "../../hooks/useForm";
import { CancelButton } from "../../components/form/Button";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import {
  SelectFieldLazy,
  StaticSelectField,
} from "../../components/form/SelectField";
import useApi from "../../hooks/useApi";
import { BUTTON_TEXT, KEY_KIND_MAP, TAG_KIND } from "../../services/constant";
import { LoadingDialog } from "../../components/page/Dialog";
import useQueryState from "../../hooks/useQueryState";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import DocumentsField from "../../components/form/DocumentsField";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { decryptData } from "../../services/utils";

const ViewKeyInformation = () => {
  const { id } = useParams();
  const { sessionKey } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.KEY_INFORMATION.path,
    requireSessionKey: true,
  });
  const { keyInformation, loading } = useApi();
  const { tag, organization, keyInformationGroup } = useApi();
  const [fetchData, setFetchData] = useState<any>({});

  const { form, setForm } = useForm(
    {
      additionalInformation: JSON.stringify({
        username: "",
        password: "",
        phone: "",
        host: "",
        port: "",
        privateKey: "",
      }),
      description: "",
      document: "[]",
      keyInformationGroupId: "",
      kind: KEY_KIND_MAP.SERVER.value,
      name: "",
      organizationId: "",
      tagId: "",
    },
    () => {}
  );

  useEffect(() => {
    if (!id || !sessionKey) {
      handleNavigateBack();
      return;
    }

    const fetchData = async () => {
      const res = await keyInformation.get(id);
      if (res.result) {
        const data = decryptData(
          sessionKey,
          res.data,
          DECRYPT_FIELDS.KEY_INFORMATION
        );
        setFetchData(data);
        setForm({
          additionalInformation: data?.additionalInformation || "{}",
          description: data.description,
          document: data.document,
          keyInformationGroupId: data.keyInformationGroup?.id,
          kind: data.kind,
          name: data.name,
          organizationId: data.organization?.id,
          tagId: data.tag?.id,
        });
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [id]);

  const renderAdditionalFields = () => {
    const additionalInfo = JSON.parse(form.additionalInformation || "{}");
    if (form.kind === KEY_KIND_MAP.WEB.value) {
      return (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-2">
            <InputField
              title="Tài khoản"
              isRequired={true}
              disabled={true}
              value={additionalInfo.username}
            />
            <InputField
              title="Mật khẩu"
              isRequired={true}
              type="password"
              value={additionalInfo.password}
              disabled={true}
            />
          </div>
          <div className="flex flex-row space-x-2">
            <InputField
              title="Số điện thoại"
              value={additionalInfo.phone}
              disabled={true}
            />
            <span className="flex-1" />
          </div>
        </div>
      );
    } else if (form.kind === KEY_KIND_MAP.SERVER.value) {
      return (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-2">
            <InputField
              title="Tài khoản"
              isRequired={true}
              value={additionalInfo.username}
              disabled={true}
            />
            <InputField
              title="Mật khẩu"
              type="password"
              value={additionalInfo.password}
              disabled={true}
            />
          </div>
          <div className="flex flex-row space-x-2">
            <InputField
              title="Địa chỉ máy chủ"
              value={additionalInfo.host}
              disabled={true}
            />
            <InputField
              title="Cổng"
              value={additionalInfo.port}
              disabled={true}
            />
          </div>
          <TextAreaField
            title="Khóa riêng"
            disabled={true}
            value={additionalInfo.privateKey}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <Sidebar
      breadcrumbs={[
        { label: `${fetchData?.name}`, onClick: handleNavigateBack },
        { label: PAGE_CONFIG.VIEW_KEY_INFORMATION.label },
      ]}
      activeItem={PAGE_CONFIG.KEY_INFORMATION.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.VIEW_KEY_INFORMATION.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <StaticSelectField
                    title="Loại"
                    isRequired={true}
                    dataMap={KEY_KIND_MAP}
                    value={form?.kind}
                    disabled={true}
                  />
                  <InputField
                    title="Tên key"
                    isRequired={true}
                    value={form.name}
                    disabled={true}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <SelectFieldLazy
                    title="Nhóm key"
                    isRequired={true}
                    fetchListApi={keyInformationGroup.autoComplete}
                    value={form.keyInformationGroupId}
                    disabled={true}
                    decryptFields={DECRYPT_FIELDS.KEY_INFORMATION_GROUP}
                  />
                  <SelectFieldLazy
                    title="Công ty"
                    fetchListApi={organization.autoComplete}
                    value={form.organizationId}
                    disabled={true}
                    decryptFields={DECRYPT_FIELDS.ORGANIZATION}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <SelectFieldLazy
                    title="Thẻ"
                    fetchListApi={tag.autoComplete}
                    value={form.tagId}
                    colorCodeField="colorCode"
                    disabled={true}
                    decryptFields={DECRYPT_FIELDS.TAG}
                    queryParams={{ kind: TAG_KIND.KEY_INFORMATION }}
                  />
                  <span className="flex-1" />
                </div>
                <TextAreaField
                  title="Mô tả"
                  value={form?.description}
                  disabled={true}
                />
                {renderAdditionalFields()}
                <DocumentsField
                  title="Tài liệu"
                  disabled={true}
                  value={form.document}
                />
                <ActionSection
                  children={
                    <>
                      <CancelButton
                        text={BUTTON_TEXT.BACK}
                        onClick={handleNavigateBack}
                      />
                    </>
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

export default ViewKeyInformation;
