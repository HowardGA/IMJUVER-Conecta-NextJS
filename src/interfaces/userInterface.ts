export interface UserResponse {
user: {    usu_id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: { nombre: string };
    fecha_nacimiento: string;
    telefono: string;
    nivel_educativo: string;
    estado: boolean;
    fecha_creacion: string;
    isVerified: boolean;
}
}