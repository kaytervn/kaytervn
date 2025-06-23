import { InputField, TextAreaField } from "../../components/form/InputField";
import Sidebar from "../../components/page/Sidebar";
import {
  DECRYPT_FIELDS,
  PAGE_CONFIG,
} from "../../components/config/PageConfig";
import useForm from "../../hooks/useForm";
import { CancelButton } from "../../components/form/Button";
import { ActionSection, FormCard } from "../../components/form/FormCard";
import useApi from "../../hooks/useApi";
import { BUTTON_TEXT, TASK_STATE_MAP } from "../../services/constant";
import { LoadingDialog } from "../../components/page/Dialog";
import useQueryState from "../../hooks/useQueryState";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { decryptData } from "../../services/utils";
import { StaticSelectField } from "../../components/form/SelectField";
import DocumentsField from "../../components/form/DocumentsField";

const ViewTask = () => {
  const { projectId, id } = useParams();
  const { sessionKey } = useGlobalContext();
  const { handleNavigateBack: handleBackProject } = useQueryState({
    path: PAGE_CONFIG.PROJECT.path,
    requireSessionKey: true,
  });
  const { handleNavigateBack: handleBackTask } = useQueryState({
    path: `/project/task/${projectId}`,
    requireSessionKey: true,
  });
  const [projectData, setProjectData] = useState<any>({});
  const [taskData, setTaskData] = useState<any>({});
  const { task, loading } = useApi();
  const { project } = useApi();
  const { form, setForm } = useForm(
    {
      document: "[]",
      name: "",
      note: "",
      state: 1,
    },
    () => {}
  );

  useEffect(() => {
    if (!projectId || !id) {
      handleBackTask();
      return;
    }
    const fetchData = async () => {
      const [pro, tas] = await Promise.all([
        project.get(projectId),
        task.get(id),
      ]);
      if (!pro.result || !tas.result) {
        handleBackTask();
      }
      setProjectData(decryptData(sessionKey, pro.data, DECRYPT_FIELDS.PROJECT));
      const data = decryptData(sessionKey, tas.data, DECRYPT_FIELDS.TASK);
      setTaskData(data);
      setForm({
        document: data.document,
        name: data.name,
        note: data.note,
        state: data.state,
      });
    };
    fetchData();
  }, [projectId, id]);

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: `${projectData?.name}`,
          onClick: handleBackProject,
        },
        {
          label: `${taskData?.name}`,
          onClick: handleBackTask,
        },
        {
          label: PAGE_CONFIG.VIEW_TASK.label,
        },
      ]}
      activeItem={PAGE_CONFIG.PROJECT.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.VIEW_TASK.label}
            children={
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                  <InputField
                    title="Tên công việc"
                    isRequired={true}
                    value={form.name}
                    disabled={true}
                  />
                  <StaticSelectField
                    title="Tình trạng"
                    isRequired={true}
                    disabled={true}
                    dataMap={TASK_STATE_MAP}
                    value={form.state}
                  />
                </div>
                <div className="flex flex-row space-x-2">
                  <TextAreaField
                    title="Ghi chú"
                    value={form.note}
                    disabled={true}
                  />
                </div>
                <DocumentsField
                  title="Tài liệu"
                  value={form.document}
                  disabled={true}
                />
                <ActionSection
                  children={
                    <>
                      <CancelButton
                        text={BUTTON_TEXT.BACK}
                        onClick={handleBackTask}
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

export default ViewTask;
