import { useUser } from "@clerk/nextjs";

export const useAuthUser = () => {
  const { user, isLoaded } = useUser();

  return {
    user,
    isLoaded,
    userId: user?.id,
  };
};