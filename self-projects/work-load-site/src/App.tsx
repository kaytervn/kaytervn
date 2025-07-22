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
  STUDY_STUFF,
  NODE_CRUD_GENERATOR,
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
import { BASIC_PAGE_CONFIG, N_LESSONS_PAGE_CONFIG } from "./components/config/PageConfig";
import { useGlobalContext } from "./components/config/GlobalProvider";
import useApi from "./hooks/useApi";
import { useEffect, useState } from "react";
import Loading from "./views/Loading";
import {
  AUTH_CONFIG,
  N_LESSONS_CONFIG,
} from "./components/config/PageConfigDetails";
import { getStorageData } from "./services/storages";
import { LOCAL_STORAGE } from "./types/constant";
import { EMBED_LIST, STUDY_LIST } from "./components/config/EmbedConfig";
import BasicEmbeded from "./views/Embed/BasicEmbeded";
import LessonClient from "./pages/n-lessons/client/LessonClient";
import MainEmbed from "./views/Embed/MainEmbed";
import StudyStuff from "./views/Embed/StudyStuff";
import NodeCrudGenerator from "./views/Tools/NodeCrudGenerator";
import { jwtDecode } from "jwt-decode";
import { getRoles } from "./types/utils";

const getEmbedRouters = ({
  pageConfig = EMBED_STUFF,
  embedList = EMBED_LIST,
}: any) => {
  return embedList.map((item: any) => (
    <Route
      key={item.path}
      path={item.path}
      element={
        <BasicEmbeded url={item.url} label={item.label} main={pageConfig} />
      }
    />
  ));
};

const AUTH_CONFIG_FILTERED = Object.values(AUTH_CONFIG).filter(
  (item: any) => item.path && item.element
);

const BASIC_CONFIG_FILTERED = Object.values(BASIC_PAGE_CONFIG).filter(
  (item: any) => item.path && item.element
);

const App = () => {
  const [tokenData, setTokenData] = useState<any>(null);
  const {
    profile,
    setProfile,
    getRouters,
    setAuthorities,
    apiKey,
    getSidebarMenus,
  } = useGlobalContext();
  const { user, loading } = useApi();

  useEffect(() => {
    const accessToken = getStorageData(LOCAL_STORAGE.ACCESS_TOKEN);
    if (!accessToken) return;
    try {
      const decoded: any = jwtDecode(accessToken);
      setTokenData(decoded);
      setAuthorities(getRoles(decoded?.authorities || []));
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    const fetchAuthData = async () => {
      if (!tokenData) return;
      try {
        const res = await user.profile();
        if (!res.result) {
          setProfile(null);
          return;
        }
        setProfile(res.data);
      } catch {
        setProfile(null);
      }
    };
    fetchAuthData();
  }, [tokenData]);

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
            {BASIC_CONFIG_FILTERED.map(({ path, element }: any) => (
              <Route key={path} path={path} element={element} />
            ))}
            {profile && getSidebarMenus().length > 0 ? (
              <>
                {getRouters().map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
              </>
            ) : (
              AUTH_CONFIG_FILTERED.map(({ path, element }: any) => (
                <Route key={path} path={path} element={element} />
              ))
            )}
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
              path={NODE_CRUD_GENERATOR.path}
              element={<NodeCrudGenerator />}
            />
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
            <Route path={EMBED_STUFF.path} element={<MainEmbed />} />
            <Route path={STUDY_STUFF.path} element={<StudyStuff />} />
            {getEmbedRouters({
              pageConfig: EMBED_STUFF,
              embedList: EMBED_LIST,
            })}
            {getEmbedRouters({
              pageConfig: STUDY_STUFF,
              embedList: STUDY_LIST,
            })}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
