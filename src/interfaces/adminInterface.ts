export interface AdminStats {
    totalCourses: number;
    totalLessons: number;
    totalPosts: number;
    totalQuizzes: number;
    totalUsers: number;
    totalCourseCategories: number;
    totalModules: number;
}

export interface UserData {
    usu_id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    nivel_educativo?: string | null;
    estado: boolean;
    isVerified: boolean;
    fecha_creacion: string;
    rol: {
        rol_id: number;
        nombre: string;
        descripcion?: string | null;
    };
}

export interface UpdateUserRolePayload {
    userId: number;
    newRoleId: number;
}

export interface RoleData {
    rol_id: number;
    nombre: string;
    descripcion: string | null;
}

export interface CreateManagerUserDto {
  nombre: string;
  email: string;
  password: string;
  rol_id: number;
  estado?: boolean;
}
