import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import { useProfileQuery } from "@/features/auth/services/auth.service";
import { getStorageData } from "@/shared/services/storage";
import { LOCAL_STORAGE } from "@/shared/constants";
import Loading from "@/pages/others/Loading";
import { buildRoutes } from "./AppRoutes";

const App = () => {
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const setAuthorities = useAuthStore((s) => s.setAuthorities);
  
  const token = getStorageData(LOCAL_STORAGE.ACCESS_TOKEN);
  
  // Fetch profile if token exists and profile is null
  const { data: profileRes, isLoading, isError } = useProfileQuery(!!token && !profile);

  useEffect(() => {
    if (profileRes?.result && profileRes.data) {
      setProfile(profileRes.data);
      setAuthorities(profileRes.data.authorities || []);
    } else if (isError || (profileRes && !profileRes.result)) {
      // If profile fetch fails but token exists, maybe token is invalid
      // For now, just let it be, the 401 handler in apiFetch will handle logout if needed
    }
  }, [profileRes, setProfile, setAuthorities, isError]);

  // If we have a token but no profile yet, and we are loading, show loading
  if (!!token && !profile && isLoading) {
    return <Loading />;
  }

  const router = createBrowserRouter(buildRoutes(profile));
  
  return <RouterProvider router={router} />;
};

export default App;
