import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import supabase from 'src/infra/supabase.client';

@Injectable()
export class UsersService {
  // Obtener perfil (sin lanzar PGRST116, devuelve null si no existe)
  async getProfile(userId: string) {
    console.log('UsersService.getProfile - lookup profile id:', userId);

    const res = await supabase
      .from('profiles')
      .select('id, name, email, faculty_id, role_id')
      .eq('id', userId);

    console.log('UsersService.getProfile - supabase raw response:', res);

    if (res.error) {
      // si es PGRST116 -> 0 filas
      if (res.error.code === 'PGRST116') {
        console.warn('UsersService.getProfile: perfil no encontrado (0 rows)');
        return null;
      }
      console.error('UsersService.getProfile supabase error:', res.error);
      throw new BadRequestException(res.error.message || 'No se pudo obtener el perfil');
    }

    const profile = Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;
    return profile;
  }

  // Actualizar facultad (valida que no tenga ya una)
  async updateFaculty(userId: string, facultyId: string | null) {
    if (!facultyId) throw new BadRequestException('El ID de la facultad es requerido');

    const { data: currentUser, error: selectError } = await supabase
      .from('profiles')
      .select('faculty_id')
      .eq('id', userId)
      .maybeSingle();

    if (selectError) {
      console.error('UsersService.updateFaculty select error:', selectError);
      throw new BadRequestException('No se pudo obtener el usuario');
    }

    if (!currentUser) {
      throw new NotFoundException('Perfil no encontrado. No se puede asignar facultad a un perfil inexistente.');
    }

    if (currentUser.faculty_id !== null) {
      throw new BadRequestException('Este usuario ya tiene una facultad asignada y no se puede cambiar.');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ faculty_id: facultyId })
      .eq('id', userId)
      .select('id, name, email, faculty_id, role_id')
      .maybeSingle();

    if (error) {
      console.error('UsersService.updateFaculty update error:', error);
      throw new BadRequestException(error.message || 'Error al actualizar facultad');
    }

    return {
      message: 'Facultad actualizada correctamente',
      profile: data,
    };
  }

  // Listar roles
  async listRoles() {
    const { data, error } = await supabase.from('role').select('*');
    if (error) {
      console.error('UsersService.listRoles error:', error);
      throw new BadRequestException(error.message || 'Error al listar roles');
    }
    return data;
  }

  // Listar profesores
  async listProfessors() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id,name,email,role!inner(name)')
      .eq('role.name', 'profesor');

    if (error) {
      console.error('UsersService.listProfessors error:', error);
      throw new BadRequestException(error.message || 'Error al listar profesores');
    }
    return data;
  }

  // Listar monitores
  async listMonitors() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id,name,email,role!inner(name)')
      .eq('role.name', 'monitor');

    if (error) {
      console.error('UsersService.listMonitors error:', error);
      throw new BadRequestException(error.message || 'Error al listar monitores');
    }
    return data;
  }

  // Listar estudiantes
  async listStudents() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id,name,email,role!inner(name)')
      .eq('role.name', 'estudiante');

    if (error) {
      console.error('UsersService.listStudents error:', error);
      throw new BadRequestException(error.message || 'Error al listar estudiantes');
    }
    return data;
  }

  // Cambiar rol
  async changeRole(userId: string, newRoleName: string) {
    const { data: role, error: roleError } = await supabase
      .from('role')
      .select('id,name')
      .eq('name', newRoleName)
      .maybeSingle();

    if (roleError || !role) {
      console.error('UsersService.changeRole role lookup error:', roleError);
      throw new BadRequestException('El rol especificado no existe');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ role_id: role.id })
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('UsersService.changeRole update error:', error);
      throw new BadRequestException(error.message || 'Error al cambiar rol');
    }

    return {
      message: `Rol actualizado correctamente a ${role.name}`,
      user: data,
    };
  }

  // Obtener grupos del usuario
  async getUserGroups(userId: string) {
    const { data, error } = await supabase
      .from('group_students')
      .select(`
        group_id,
        groups (
          id,
          code,
          course_id,
          courses(name, code)
        )
      `)
      .eq('student_id', userId);

    if (error) {
      console.error('UsersService.getUserGroups error:', error);
      throw new BadRequestException(error.message || 'Error al obtener grupos del usuario');
    }

    return (data || []).map((row: any) => row.groups);
  }
}