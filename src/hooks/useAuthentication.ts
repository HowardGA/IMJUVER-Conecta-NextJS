import { useMutation, useQuery } from '@tanstack/react-query';
import { login, register, verifyEmail } from '@/services/authServices';
import { LoginForm, RegisterForm, UseEmailVerificationResult, UserData } from '@/interfaces/authInterface';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/providers/UserProvider';
import { message } from "antd";
import { AxiosError } from 'axios'; 


export const useLogin = () => {
    const router = useRouter();
    const { setUser } = useUser();

    return useMutation<UserData, AxiosError, LoginForm>({ 
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
            message.error( 'Error de inicio de sesión. Inténtelo de nuevo.');
        }
    })
}

export const useRegister = () => {
    const router = useRouter();
    const { setUser } = useUser(); 
    return useMutation<any, AxiosError, RegisterForm>({ 
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
            const backendErrorMessage =  'Error en el registro. Inténtelo de nuevo.';
            message.error(backendErrorMessage);
        }
    })
}

export const useEmailVerification = (token: string | undefined): UseEmailVerificationResult => {
  const { data, isLoading, isError, refetch, error } = useQuery<{ status: string; message: string; }, AxiosError>({
    queryKey: ['emailVerification', token],
    queryFn: async () => { 
      if (!token) {
        throw new Error('No se ha proporcionado un token de verificación.');
      }
      return verifyEmail(token);
    },
    enabled: !!token,
    retry: (failureCount, err: AxiosError) => {
      if (err?.response?.status === 400 || data?.status === 'success' || data?.status === 'expired') {
        return false;
      }
      return failureCount < 1;
    },
    staleTime: Infinity,
  });

  const isSuccess = data?.status === 'success';
  const isExpired = data?.status === 'expired';
  const errorMessage =  'Error desconocido al verificar el email.';

  return {
    isLoading: isLoading && !isSuccess && !isError && !isExpired,
    isSuccess,
    isError: isError && !isSuccess && !isExpired,
    isExpired,
    message: isSuccess ? data?.message || '' : (isExpired ? errorMessage : (isLoading ? 'Confirmando su correo electrónico...' : errorMessage)), // Added null checks for data?.message
    refetch: refetch,
  };
};