export interface CategoriaOferta {
  cat_of_id: number;
  nombre: string;
  fecha_creacion: string;
  fecha_modificacion: string;
}

export interface Oferta {
  of_id: number;
  titulo: string;
  descripcion: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  cat_of_id: number;
  categoria: CategoriaOferta;
  url?: string;
  fecha_vigencia: string;
  activo: boolean;
}

export interface CreateOfertaDto {
  titulo: string;
  descripcion: string;
  cat_of_id: number;
  url?: string;
  fecha_vigencia: string;
  activo?: boolean;
}

export interface UpdateOfertaDto extends Partial<CreateOfertaDto> {
  of_id: number;
}