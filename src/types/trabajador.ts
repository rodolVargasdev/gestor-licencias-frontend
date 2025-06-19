export interface Trabajador {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  departamento_id: number;
  puesto_id: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTrabajadorDTO {
  codigo: string;
  nombre_completo: string;
  email: string;
  telefono?: string;
  departamento_id: number;
  puesto_id: number;
  tipo_personal: 'OPERATIVO' | 'ADMINISTRATIVO';
  fecha_ingreso: string;
  activo?: boolean;
}

export interface UpdateTrabajadorDTO extends Partial<CreateTrabajadorDTO> {} 