import { InputField, TextAreaField } from "../../components/form/InputField";
import Sidebar from "../../components/page/Sidebar";
import {
  DECRYPT_FIELDS,
  PAGE_CONFIG,
} from "../../components/config/PageConfig";
import useForm from "../../hooks/useForm";
import { CancelButton, SubmitButton } from "../../components/form/Button";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import useApi from "../../hooks/useApi";
import {
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TASK_STATE_MAP,
  TOAST,
  VALID_PATTERN,
} from "../../services/constant";
import { LoadingDialog } from "../../components/page/Dialog";
import useQueryState from "../../hooks/useQueryState";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { decryptData } from "../../services/utils";
import { StaticSelectField } from "../../components/form/SelectField";
import DocumentsField from "../../components/form/DocumentsField";

const CreateTask = () => {
  const { projectId } = useParams();
  const { setToast, sessionKey } = useGlobalContext();
  const { handleNavigateBack: handleBackProject } = useQueryState({
    path: PAGE_CONFIG.PROJECT.path,
    requireSessionKey: true,
  });
  const { handleNavigateBack: handleBackTask } = useQueryState({
    path: `/project/task/${projectId}`,
    requireSessionKey: true,
  });
  const [fetchData, setFetchData] = useState<any>({});
  const { task, loading } = useApi();
  const { project } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!VALID_PATTERN.NAME.test(form.name)) {
      newErrors.name = "Tên không hợp lệ";
    }
    if (!form.state) {
      newErrors.state = "Tình trạng không hợp lệ";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    {
      document: "[]",
      name: "",
      note: "",
      state: 1,
    },
    validate
  );

  useEffect(() => {
    if (!projectId || !sessionKey) {
      handleBackProject();
      return;
    }

    const fetchData = async () => {
      const res = await project.get(projectId);
      if (res.result) {
        const data = decryptData(sessionKey, res.data, DECRYPT_FIELDS.PROJECT);
        setFetchData(data);
      } else {
        handleBackProject();
      }
    };

    fetchData();
  }, [projectId]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await task.create({ ...form, projectId });
      if (res.result) {
        setToast(BASIC_MESSAGES.CREATED, TOAST.SUCCESS);
        handleBackTask();
      } else {
        setToast(res.message || BASIC_MESSAGES.FAILED, TOAST.ERROR);
      }
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: `${fetchData?.name}`,
          onClick: handleBackProject,
        },
        {
          label: PAGE_CONFIG.TASK.label,
          onClick: handleBackTask,
        },
        {
          label: PAGE_CONFIG.CREATE_TASK.label,
        },
      ]}
      activeItem={PAGE_CONFIG.PROJECT.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.CREATE_TASK.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Tên công việc"
                    isRequired={true}
                    placeholder="Nhập tên công việc"
                    value={form.name}
                    onChangeText={(value: any) => handleChange("name", value)}
                    error={errors.name}
                  />
                  <StaticSelectField
                    title="Tình trạng"
                    isRequired={true}
                    placeholder="Chọn tình trạng"
                    dataMap={TASK_STATE_MAP}
                    value={form.state}
                    onChange={(value: any) => handleChange("state", value)}
                    error={errors.state}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <TextAreaField
                    title="Ghi chú"
                    placeholder="Nhập ghi chú"
                    value={form.note}
                    onChangeText={(value: any) => handleChange("note", value)}
                    error={errors.note}
                  />
                </div>
                <DocumentsField
                  title="Tài liệu"
                  value={form.document}
                  onChange={(value: any) => handleChange("document", value)}
                />
                <ActionSection
                  children={
                    <>
                      <CancelButton onClick={handleBackTask} />
                      <SubmitButton
                        text={BUTTON_TEXT.CREATE}
                        color="royalblue"
                        onClick={handleSubmit}
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

export default CreateTask;
