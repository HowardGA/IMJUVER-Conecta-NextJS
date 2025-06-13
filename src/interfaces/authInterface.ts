export interface LoginForm {
    email: string;
    password: string;
}

export interface UserData {
    usu_id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol_id: number;
    rol_nombre: string;
}

export interface RegisterForm {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    telefono: string;
    rol_id: number;
    fecha_nacimiento: string;
    nivel_educativo?: string;
}

export interface RegistrationSuccessResponse {
    message: string;
    status: 'success' | 'error'; 
}


export interface VerificationResponse {
  message: string;
  status: 'success' | 'error' | 'expired';
}

export interface UseEmailVerificationResult {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isExpired: boolean;
  message: string;
  refetch: () => void;
}