
interface TiptapNodeAttributes {
  [key: string]: unknown;
}

interface TiptapTextMark {
  type: string; 
  attrs?: TiptapNodeAttributes; 
}

interface TiptapNode {
  type: string; 
  attrs?: TiptapNodeAttributes;
  content?: TiptapNode[];
  text?: string;
  marks?: TiptapTextMark[]; 
}

export interface TiptapContent {
  type: "doc";
  content?: TiptapNode[];
}

export interface Publicacion {
  pub_id: number;
  titulo: string;
  contenido: string; 
  fecha_creacion: string; 
  fecha_modificacion: string; 
  fecha_evento?: string;
  cat_pub_id: number;
  categoria?: {
    cat_pub_id: number;
    nombre: string;
  };
  img_id?: number | null;
  imagen?: {
    img_id: number;
    url: string;
  };
  recursos_id?: number | null;
  recurso?: {
    rec_id: number;
    url: string;
  };
  autor_id: number;
  autor?: {
    usu_id: number;
    nombre: string;
  };
  visible: boolean;
  destacado: boolean;
  imagen_url?:string,
  recurso_url?:string;

}

export interface CreatePublicacionDto {
  titulo: string;
  contenido: TiptapContent; 
  cat_pub_id: number;
  autor_id: number;
  visible?: boolean;
  destacado?: boolean;
  fecha_evento?: string;
  imagen?: File;
  recurso?: File;
}

export interface CategoriaPublicacion {
  cat_pub_id: number;
  nombre: string;
}

export interface GetPublicacionesFilters {
  visible?: boolean;
  destacado?: boolean;
  cat_pub_id?: number | null;
  searchTerm?: string;
  fecha_evento_gte?: string;
  fecha_evento_lte?: string;
}

export interface UpdatePublicacionDto extends Partial<Omit<CreatePublicacionDto, 'autor_id'>> {
  titulo?: string;
  contenido?: TiptapContent;
  cat_pub_id?: number;
  visible?: boolean;
  destacado?: boolean;
  fecha_evento?: string;
  imagen?: File; 
  recurso?: File;
}