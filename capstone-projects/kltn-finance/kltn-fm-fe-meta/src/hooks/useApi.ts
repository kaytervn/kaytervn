import useFetch from "./useFetch.ts";
import { authController } from "../controllers/authController.ts";
import mediaController from "../controllers/mediaController.ts";
import { adminController } from "../controllers/adminController.ts";
import { roleController } from "../controllers/roleController.ts";
import { accountBranchController } from "../controllers/accountBranchController.ts";
import { branchController } from "../controllers/branchController.ts";
import { serverProviderController } from "../controllers/serverProviderController.ts";
import { customerController } from "../controllers/customerController.ts";
import { locationController } from "../controllers/locationController.ts";
import { dbConfigController } from "../controllers/dbConfigController.ts";

const useApi = () => {
  const { fetchApi, loading } = useFetch();

  const auth = authController(fetchApi);
  const media = mediaController(fetchApi);
  const admin = adminController(fetchApi);
  const role = roleController(fetchApi);
  const accountBranch = accountBranchController(fetchApi);
  const branch = branchController(fetchApi);
  const serverProvider = serverProviderController(fetchApi);
  const customer = customerController(fetchApi);
  const location = locationController(fetchApi);
  const dbConfig = dbConfigController(fetchApi);

  return {
    auth,
    media,
    loading,
    admin,
    role,
    accountBranch,
    branch,
    serverProvider,
    customer,
    location,
    dbConfig,
  };
};

export default useApi;
