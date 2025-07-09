export interface CategoriaDirectorio {
  cat_dir_id: number;
  nombre: string;
  fecha_creacion: string;
  fecha_modificacion: string;
}

export interface Directorio {
  dir_id: number;
  nombre: string;
  descripcion: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  cat_dir_id: number;
  categoria: CategoriaDirectorio;
  url?: string;
  telefono: string;
  horarios: string;
}

export interface CreateDirectorioDto {
  nombre: string;
  descripcion: string;
  cat_dir_id: number;
  url?: string;
  telefono: string;
  horarios: string;
}

export interface UpdateDirectorioDto extends Partial<CreateDirectorioDto> {
  dir_id: number;
}