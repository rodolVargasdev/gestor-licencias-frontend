import { TipoLicencia } from './tipoLicencia';
import { Trabajador } from './trabajador';

export interface Validacion {
  id: number;
  tipo_licencia_id: number;
  trabajador_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  tipoLicencia: TipoLicencia;
  trabajador: Trabajador;
}

export interface CreateValidacionDTO {
  tipo_licencia_id: number;
  trabajador_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado?: string;
  activo?: boolean;
}

export interface UpdateValidacionDTO {
  estado?: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  observaciones?: string;
  fecha_aprobacion?: string;
}

export type EstadoValidacion = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'CANCELADA'; 