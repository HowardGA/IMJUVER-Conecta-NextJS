// Define interfaces for Imagen and Recurso models directly, as they will now be arrays
export interface Imagen {
  img_id: number;
  url: string; // This will be the full URL (e.g., http://localhost:3000/uploads/images/abc.png)
  fecha_creacion: string;
  fecha_modificacion: string;
}

export interface Recurso {
  rec_id: number;
  url: string; // This will be the full URL
  titulo?: string; // Resources now have a title
  descripcion?: string; // Resources now have a description
  fecha_creacion: string;
  fecha_modificacion: string;
}

// Keep Tiptap interfaces as they are, assuming content structure doesn't change
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
  autor_id: number;
  autor?: {
    usu_id: number;
    nombre: string;
  };
  visible: boolean;
  destacado: boolean;
  imagenes?: Imagen[];
  recursos?: Recurso[];
  imagen_url?: string;
  main_image_data?: Imagen;
}

export interface CreatePublicacionDto {
  titulo: string;
  contenido: TiptapContent; 
  cat_pub_id: number;
  autor_id: number;
  visible?: boolean;
  destacado?: boolean;
  fecha_evento?: string;
  imagenes?: File[]; 
  recursos?: File[]; 
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
  imagenes?: File[];
  recursos?: File[];
}

export interface UpdatePublicacionDto2 {
  titulo?: string;
  contenido?: string; 
  cat_pub_id?: number;
  visible?: boolean;
  destacado?: boolean;
  fecha_evento?: string;
  imagenes?: File[];
  recursos?: File[];
}