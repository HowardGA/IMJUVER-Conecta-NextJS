import { useMutation, useQuery } from '@tanstack/react-query';
import { login, register, verifyEmail } from '@/services/authServices';
import { LoginForm, RegisterForm, UseEmailVerificationResult, UserData } from '@/interfaces/authInterface';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/providers/UserProvider';
import { message } from "antd";
import { AxiosError } from 'axios';

export interface RegistrationSuccessResponse {
    message: string;
    status: 'success' | 'error';
}

interface VerificationApiResponse {
    message: string;
    status: 'success' | 'error' | 'expired'; // Reflects what your backend sends in the body
}

interface BackendErrorData {
    message: string;
}


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
    return useMutation<RegistrationSuccessResponse, AxiosError, RegisterForm>({ 
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
  const {
    data,
    isLoading,
    isSuccess: queryIsSuccess,
    isError: queryIsError,
    refetch,
    error
  } = useQuery<
    VerificationApiResponse,
    AxiosError<BackendErrorData>
  >({
    queryKey: ['emailVerification', token],
    queryFn: async () => {
      if (!token) {
        throw new Error('No se ha proporcionado un token de verificación.');
      }
      return verifyEmail(token);
    },
    enabled: !!token,
    retry: (failureCount, err) => {
      if (err?.response?.status === 400) {
        return false;
      }
      return failureCount < 1;
    },
    staleTime: Infinity,
  });

  const isActualSuccess = queryIsSuccess && (data as VerificationApiResponse)?.status === 'success';

  const isExpiredToken =
    (queryIsSuccess && (data as VerificationApiResponse)?.status === 'expired') ||
    (queryIsError && (error as AxiosError<BackendErrorData>)?.response?.status === 400 && (error as AxiosError<BackendErrorData>)?.response?.data?.message === 'Token expirado');

  const isGeneralError = queryIsError && !isActualSuccess && !isExpiredToken;

  let displayMessage: string;
  if (isLoading) {
    displayMessage = 'Confirmando su correo electrónico...';
  } else if (isActualSuccess) {
    displayMessage = (data as VerificationApiResponse)?.message || 'Email verificado con éxito.'; // ⭐ Add (data as VerificationApiResponse) ⭐
  } else if (isExpiredToken) {
    displayMessage = ((data as VerificationApiResponse)?.message || (error as AxiosError<BackendErrorData>)?.response?.data?.message) || 'El enlace de verificación ha expirado o ya fue utilizado.'; // ⭐ Add type assertions ⭐
  } else if (isGeneralError) {
    displayMessage = ((error as AxiosError<BackendErrorData>)?.response?.data?.message || (error as AxiosError<BackendErrorData>)?.message) || 'Error desconocido al verificar el email.'; // ⭐ Add type assertions ⭐
  } else {
    displayMessage = 'Esperando token de verificación.';
  }

  return {
    isLoading: isLoading,
    isSuccess: isActualSuccess,
    isError: isGeneralError,
    isExpired: isExpiredToken,
    message: displayMessage,
    refetch: refetch,
  };
};
