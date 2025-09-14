import { accountController } from "../controllers/accountController";
import { backupCodeController } from "../controllers/backupCodeController";
import { bankController } from "../controllers/bankController";
import { contactController } from "../controllers/contactController";
import { idNumberController } from "../controllers/idNumberController";
import { linkController } from "../controllers/linkController";
import { noteController } from "../controllers/noteController";
import { platformController } from "../controllers/platformController";
import { softwareController } from "../controllers/softwareController";
import { tagController } from "../controllers/tagController";
import { userController } from "../controllers/userController";
import useFetch from "./useFetch";

const useApi = () => {
  const { fetchApi, loading } = useFetch();

  const user = userController(fetchApi);
  const platform = platformController(fetchApi);
  const account = accountController(fetchApi);
  const backupCode = backupCodeController(fetchApi);
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
    loading,
    account,
    backupCode,
    tag,
    bank,
  };
};

export default useApi;
