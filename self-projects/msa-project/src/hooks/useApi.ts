import { accountController } from "../controllers/accountController";
import { bankController } from "../controllers/bankController";
import { noteController } from "../controllers/noteController";
import { platformController } from "../controllers/platformController";
import { tagController } from "../controllers/tagController";
import { userController } from "../controllers/userController";
import useFetch from "./useFetch";

const useApi = () => {
  const { fetchApi, loading } = useFetch();

  const user = userController(fetchApi);
  const platform = platformController(fetchApi);
  const account = accountController(fetchApi);
  const tag = tagController(fetchApi);
  const bank = bankController(fetchApi);
  const note = noteController(fetchApi);

  return {
    user,
    note,
    platform,
    loading,
    account,
    tag,
    bank,
  };
};

export default useApi;
