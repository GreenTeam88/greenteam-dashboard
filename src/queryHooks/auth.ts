import { useMutation } from '@tanstack/react-query';

import { createUser, loginUser } from '@/apiRequests/AuthRequests';

export function useRegister() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => createUser(email, password),
  });
}
export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => loginUser(email, password),
  });
}
