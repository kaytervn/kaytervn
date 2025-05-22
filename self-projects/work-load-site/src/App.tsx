/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GorgeousSwagger from "./views/swagger/GorgeousSwagger";
import CRUDGenerator from "./views/Tools/CRUDGenerator";
import NotFound from "./views/NotFound";
import Tools from "./views/Tools/Tools";
import {
  CRUD_GENERATOR,
  GORGEOUS_SWAGGER,
  QR_GENERATOR,
  SEQUENCE_ACTIVATOR,
  API_DOCS,
  TOOLS,
  GAMES,
  PERMISSIONS_GENERATOR,
  FIGHTING_GAME,
  MULTIROOM_PLATFORMER,
  THREE_D_RACING_GAME,
  REQUEST_MANAGER,
  HEADER_MANAGER,
  EMBED_STUFF,
} from "./types/pageConfig";
import QrCodeGenerator from "./views/Tools/QrGenerator";
import SequenceActivator from "./views/Tools/SequenceActivator";
import APIDocs from "./views/Tools/APIDocs";
import Games from "./views/Other/Games";
import Permissions from "./views/Tools/Permissions";
import FightingGame from "./views/Other/FightingGame";
import MultiroomPlatformer from "./views/Other/MultiroomPlatformer";
import ThreeDRacingGame from "./views/Other/ThreeDRacingGame";
import RequestManager from "./views/swagger/RequestManager";
import HeaderManager from "./views/swagger/HeaderManager";
import {
  N_LESSONS_PAGE_CONFIG,
  PAGE_CONFIG,
} from "./components/config/PageConfig";
import { useGlobalContext } from "./components/config/GlobalProvider";
import useApi from "./hooks/useApi";
import { useEffect } from "react";
import Loading from "./views/Loading";
import {
  N_LESSONS_CONFIG,
  USER_CONFIG,
} from "./components/config/PageConfigDetails";
import {
  getStorageData,
  isValidJWT,
  removeSessionCache,
} from "./services/storages";
import { LOCAL_STORAGE } from "./types/constant";
import { EMBED_LIST } from "./components/config/EmbedConfig";
import BasicEmbeded from "./views/Embed/BasicEmbeded";
import EmbedList from "./views/Embed/EmbedList";
import LessonClient from "./pages/n-lessons/client/LessonClient";

const PAGE_CONFIG_FILTERED = Object.values(PAGE_CONFIG).filter(
  (item: any) => item.path && item.element
);

const USER_CONFIG_FILTERED = Object.values(USER_CONFIG).filter(
  (item: any) => item.path && item.element
);

const App = () => {
  const { profile, setProfile, apiKey } = useGlobalContext();
  const { user, loading } = useApi();

  useEffect(() => {
    const fetchAuthData = async () => {
      if (profile) {
        return;
      }
      const token = await getStorageData(LOCAL_STORAGE.ACCESS_TOKEN, null);
      if (!token || !isValidJWT(token)) {
        setProfile(null);
        removeSessionCache();
        return;
      }
      const res = await user.verifyToken();
      if (res.result) {
        setProfile(res.data?.token);
        return;
      }
      removeSessionCache();
      setProfile(null);
    };
    fetchAuthData();
  }, []);

  const N_LESSONS_PAGE_CONFIG_FILTERED = Object.values(
    N_LESSONS_PAGE_CONFIG
  ).filter((item: any) => item.path && item.element);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            {profile
              ? PAGE_CONFIG_FILTERED.map(({ path, element }: any) => (
                  <Route key={path} path={path} element={element} />
                ))
              : USER_CONFIG_FILTERED.map(({ path, element }: any) => (
                  <Route key={path} path={path} element={element} />
                ))}
            {apiKey ? (
              <>
                {N_LESSONS_PAGE_CONFIG_FILTERED.map(
                  ({ path, element }: any) => (
                    <Route key={path} path={path} element={element} />
                  )
                )}
              </>
            ) : (
              <>
                <Route
                  path={N_LESSONS_CONFIG.CLIENT.path}
                  element={<LessonClient />}
                />
              </>
            )}
            <Route path={GORGEOUS_SWAGGER.path} element={<GorgeousSwagger />} />
            <Route path={REQUEST_MANAGER.path} element={<RequestManager />} />
            <Route path={HEADER_MANAGER.path} element={<HeaderManager />} />
            <Route path={TOOLS.path} element={<Tools />} />
            <Route path={CRUD_GENERATOR.path} element={<CRUDGenerator />} />
            <Route path={QR_GENERATOR.path} element={<QrCodeGenerator />} />
            <Route
              path={SEQUENCE_ACTIVATOR.path}
              element={<SequenceActivator />}
            />
            <Route path={API_DOCS.path} element={<APIDocs />} />
            <Route path={GAMES.path} element={<Games />} />
            <Route
              path={PERMISSIONS_GENERATOR.path}
              element={<Permissions />}
            />
            <Route path={FIGHTING_GAME.path} element={<FightingGame />} />
            <Route
              path={THREE_D_RACING_GAME.path}
              element={<ThreeDRacingGame />}
            />
            <Route
              path={MULTIROOM_PLATFORMER.path}
              element={<MultiroomPlatformer />}
            />
            <Route path={EMBED_STUFF.path} element={<EmbedList />} />
            {EMBED_LIST.map((item: any) => (
              <Route
                key={item.path}
                path={item.path}
                element={
                  <BasicEmbeded
                    url={item.url}
                    label={item.label}
                    main={EMBED_STUFF}
                  />
                }
              />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
