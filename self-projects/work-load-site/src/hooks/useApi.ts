import { accountController } from "../controllers/accountController.ts";
import { backupCodeController } from "../controllers/backupCodeController.ts";
import { bankController } from "../controllers/bankController.ts";
import { categoryController } from "../controllers/categoryController.ts";
import { dataBackupController } from "../controllers/dataBackupController.ts";
import { idNumberController } from "../controllers/idNumberController.ts";
import { lessonController } from "../controllers/lessonController.ts";
import { mediaController } from "../controllers/mediaController.ts";
import { platformController } from "../controllers/platformController.ts";
import { roleController } from "../controllers/roleController.ts";
import { tagController } from "../controllers/tagController.ts";
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
  const role = roleController(fetchApi);
  const tag = tagController(fetchApi);
  const bank = bankController(fetchApi);
  const idNumber = idNumberController(fetchApi);

  return {
    user,
    idNumber,
    platform,
    media,
    lesson,
    category,
    loading,
    dataBackup,
    account,
    backupCode,
    role,
    tag,
    bank,
  };
};

export default useApi;
