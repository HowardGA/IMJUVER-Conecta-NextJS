import { useMutation, useQuery } from '@tanstack/react-query';
import { login, register, verifyEmail } from '@/services/authServices';
import { LoginForm, RegisterForm, UseEmailVerificationResult } from '@/interfaces/authInterface';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/providers/UserProvider';
import { message } from "antd";

export const useLogin = () => {
    const router = useRouter();
    const {setUser} =  useUser();

    return useMutation({
        mutationFn: async (credentials: LoginForm) => {
            const userData = await login(credentials);
            return userData;
        },
        onSuccess: (data) => {
            setUser(data);
            router.push('/courses');

        },
          onError: (error) => {
            console.error('Login failed:', error);
          }
    })
}

export const useRegister = () => {
    const router = useRouter();
    const {setUser} = useUser();

    return useMutation({
        mutationFn: async (FormData: RegisterForm) => {
            const responseData = await register(FormData);
            return responseData;
        },
         onSuccess: (data) => {
            message.success(data.message);
            router.push('/registration-pending-verification');

        },
          onError: (error) => {
            console.error('Registration failed:', error);
            const backendErrorMessage = 'Error en el registro. Inténtelo de nuevo.';
            message.error(backendErrorMessage); 
          }
    })
}



export const useEmailVerification = (token: string | undefined): UseEmailVerificationResult => {
  const { data, isLoading, isError, refetch, error } = useQuery({
    queryKey: ['emailVerification', token],
    queryFn: () => {
      if (!token) {
        return Promise.reject(new Error('No se ha proporcionado un token de verificación.'));
      }
      return verifyEmail(token);
    },
    enabled: !!token,
    retry: (failureCount, err: any) => {
      if (err?.response?.status === 400 || err?.response?.data?.status === 'success' || err?.response?.data?.status === 'expired') {
        return false;
      }
      return failureCount < 1;
    },
    staleTime: Infinity,
  });

  const axiosError: any = error; 

  const isSuccess = data?.status === 'success';
  const isExpired = axiosError?.response?.data?.status === 'expired'; 
  const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Error desconocido al verificar el email.';

  return {
    isLoading: isLoading && !isSuccess && !isError && !isExpired, 
    isSuccess,
    isError: isError && !isSuccess && !isExpired,
    isExpired,
    message: isSuccess ? data.message : (isExpired ? errorMessage : (isLoading ? 'Confirmando su correo electrónico...' : errorMessage)),
    refetch: refetch,
  };
};

