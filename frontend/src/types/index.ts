// Tipos comunes para toda la aplicación
export type Role = { id: string; name: string };
export type Profile = { id: string; name?: string; email?: string; role_id?: string | null };
export type User = { id: string; name?: string; email?: string };
export type Group = { id: string; code?: string };
export type Course = { id: string; name: string; code: string; description?: string };

// Tipo genérico para respuestas del backend
export type ApiResponse<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
};

// Respuestas específicas
export type CreateCourseResponse = ApiResponse<{ id: string; name: string }>;
export type ChangeRoleResponse = ApiResponse<{ message: string }>;
export type CreateMonitoriaResponse = ApiResponse<{ id: string; monitor_id: string }>;
