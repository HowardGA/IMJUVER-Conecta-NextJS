import { UserData
 } from "./adminInterface";

export enum EstadoPropuesta {
  Recibida = 'Recibida',
  EnRevision = 'EnRevision',
  Aprobada = 'Aprobada',
  Rechazada = 'Rechazada',
  Implementada = 'Implementada',
}

export interface Comment {
  comentario_id: number;
  contenido: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  idea_id: number;
  autor: UserData;
  visible: boolean;
}

export interface Idea {
  idea_id: number;
  titulo: string;
  contenido: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  autor: UserData;
  estado: EstadoPropuesta;
  is_public: boolean;
  visible: boolean;
  isLikedByMe?: boolean;
  _count?: {
    likes?: number;       
    comentarios?: number; 
  };
}


export interface CreateIdeaPayload {
  titulo: string;
  contenido: string;
  is_public: boolean;
  autorId: number;
}

export interface UpdateIdeaPayload {
  titulo?: string;
  contenido?: string;
  is_public?: boolean;
}

export interface CreateCommentPayload {
  contenido: string;
  autorId: number;   
}

