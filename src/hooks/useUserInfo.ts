import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/services/userServices";
import { UserResponse } from "@/interfaces/userInterface";

export const useUserInfo = (userId: number) => {
  return useQuery<UserResponse>({
    queryKey: ['userProfile', userId],
    queryFn: () => getUserInfo(userId),
    retry: 1
  });
};
