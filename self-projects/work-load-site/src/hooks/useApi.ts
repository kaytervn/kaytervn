import { accountController } from "../controllers/accountController.ts";
import { backupCodeController } from "../controllers/backupCodeController.ts";
import { bankController } from "../controllers/bankController.ts";
import { categoryController } from "../controllers/categoryController.ts";
import { contactController } from "../controllers/contactController.ts";
import { dataBackupController } from "../controllers/dataBackupController.ts";
import { idNumberController } from "../controllers/idNumberController.ts";
import { lessonController } from "../controllers/lessonController.ts";
import { linkController } from "../controllers/linkController.ts";
import { mediaController } from "../controllers/mediaController.ts";
import { noteController } from "../controllers/noteController.ts";
import { platformController } from "../controllers/platformController.ts";
import { roleController } from "../controllers/roleController.ts";
import { softwareController } from "../controllers/softwareController.ts";
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
  const contact = contactController(fetchApi);
  const link = linkController(fetchApi);
  const software = softwareController(fetchApi);
  const note = noteController(fetchApi);

  return {
    user,
    link,
    note,
    software,
    contact,
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
