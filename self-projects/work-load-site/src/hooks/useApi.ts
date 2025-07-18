import { accountController } from "../controllers/accountController.ts";
import { backupCodeController } from "../controllers/backupCodeController.ts";
import { categoryController } from "../controllers/categoryController.ts";
import { dataBackupController } from "../controllers/dataBackupController.ts";
import { lessonController } from "../controllers/lessonController.ts";
import { mediaController } from "../controllers/mediaController.ts";
import { platformController } from "../controllers/platformController.ts";
import { userController } from "../controllers/userController.ts";
import useFetch from "./useFetch.ts";

const useApi = () => {
  const { fetchApi, loading } = useFetch();

  const media = mediaController(fetchApi);
  const lesson = lessonController(fetchApi);
  const category = categoryController(fetchApi);

  const user = userController(fetchApi);
  const platform = platformController(fetchApi);
  const dataBackup = dataBackupController(fetchApi);
  const account = accountController(fetchApi);
  const backupCode = backupCodeController(fetchApi);

  return {
    user,
    platform,
    media,
    lesson,
    category,
    loading,
    dataBackup,
    account,
    backupCode,
  };
};

export default useApi;
