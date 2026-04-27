import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToastStore } from "@/shared/stores/useToastStore";
import { TEXT, TOAST } from "@/shared/constants";
import { useUpdateProfileMutation, useProfileQuery } from "../services/auth.service";
import { profileSchema, type ProfileForm } from "../types";
import { useAuthStore } from "@/shared/stores/useAuthStore";

export const useProfileForm = (isVisible: boolean, onClose: () => void) => {
  const showToast = useToastStore((s) => s.showToast);
  const mutation = useUpdateProfileMutation();
  const profileQuery = useProfileQuery(isVisible);
  const authProfile = useAuthStore((s) => s.profile);
  const setAuthProfile = useAuthStore((s) => s.setProfile);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", email: "" },
  });

  useEffect(() => {
    if (isVisible && profileQuery.data?.data) {
      const data = profileQuery.data.data;
      form.reset({
        fullName: data.fullName || "",
        email: data.email || "",
      });
      // also update global store if out of sync
      if (!authProfile || authProfile.fullName !== data.fullName) {
        setAuthProfile({
          ...data,
          id: data.id || 0,
          kind: data.kind || 0,
          username: data.username || "",
          fullName: data.fullName || "",
          email: data.email || "",
        });
      }
    }
  }, [isVisible, profileQuery.data, form, authProfile, setAuthProfile]);

  const handleSubmit = async (data: ProfileForm) => {
    const res = await mutation.mutateAsync({
      fullName: data.fullName,
      email: data.email,
    });

    if (res?.result) {
      showToast(TEXT.UPDATED, TOAST.SUCCESS);
      if (authProfile) {
        setAuthProfile({
          ...authProfile,
          fullName: data.fullName,
          email: data.email || "",
        });
      }
      onClose();
    } else {
      showToast(res.message || TEXT.REQUEST_FAILED, TOAST.ERROR);
    }
  };

  return {
    form,
    handleSubmit,
    profileData: authProfile,
    loading: mutation.isPending || profileQuery.isLoading,
  };
};
