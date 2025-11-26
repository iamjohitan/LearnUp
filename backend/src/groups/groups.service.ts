import { BadRequestException, Injectable } from '@nestjs/common';
import supabase from "src/infra/supabase.client"
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupsService {

async create(dto:CreateGroupDto){

    const{data:course, error: courseError} = await supabase
    .from('courses')
    .select('id, code')
    .eq('id',dto.course_id)
    .single();

    if(courseError)throw new BadRequestException('Course not found');

    if(!dto.code.startsWith(course.code)){
        throw new BadRequestException(`El codigo del grupo debe empezar con el codigo del curso: ${course.code}`);
    }

    const{data,error} = await supabase
    .from('groups')
    .insert(dto)
    .select()
    .single()

    if(error) throw new BadRequestException(error.message)
    
    return { message: 'Grupo creado exitosamente', group: data};
}

async list(){

    const{data,error} = await supabase
    .from('groups')
    .select('*')

    if (error) throw new BadRequestException(error.message)
    
    return data;

}

async findOne(id:string){

    const{data,error} = await supabase
    .from('groups')
    .select('*')
    .eq('id', id)
    .single()

    if (error) throw new BadRequestException(error.message)
    
    return data;

}

async getGroupsByCourse(courseId: string){

    const{data,error} = await supabase
    .from('groups')
    .select('*')
    .eq('course_id', courseId)

    if(error) throw new BadRequestException(error.message);

    return data;

}

async assignProfessor(groupId: string, professorId: string){

    const {data: profile, error: profileError} = await supabase
    .from('profiles')
    .select('id, role_id, role(name)')
    .eq('id', professorId)
    .single<{
        id: string;
        role_id:string;
        role:{name: string}
    }>();

    if(profileError) throw new BadRequestException('Usuario no encontrado')

    if(profile.role.name !== 'profesor'){
        throw new BadRequestException('El usuario no tiene rol de profesor')
    }

    const {data, error} = await supabase
    .from('groups')
    .update({professor_id: professorId})
    .eq('id', groupId)
    .select()
    .single();

    if (error) throw new BadRequestException(error.message)
    
    return{message: 'Profesor asignado correctamente', group:data }




}

async assignMonitor(groupId: string, monitorId: string){
    const{data: profile, error: profileError} = await supabase
    .from('profiles')
    .select('id, role_id, role(name)')
    .eq('id', monitorId)
    .single<{
        id: string;
        role_id:string;
        role:{name: string}
    }>();

    if(profileError) throw new BadRequestException('usuario no encontrado')
    
    if(profile.role.name !== 'monitor'){
        throw new BadRequestException('El usuario no tiene rol de monitor')
    }

    const{data: group, error: updError} = await supabase
    .from('groups')
    .update({monitor_id: monitorId})
    .eq('id', groupId)
    .select()
    .single();

    if(updError) throw new BadRequestException(updError.message)

    return {message: 'Monitor asignado correctamente', group,};
}

async removeProfessor(groupId: string){
    const{data, error} = await supabase
    .from('groups')
    .update({professor_id: null})
    .eq('id', groupId)
    .select()
    .single()

    if(error) throw new BadRequestException(error.message)
    
    return{ message: 'Profesor removido del grupo', group: data};
}

async removeMonitor(groupId: string){
    const{data, error} = await supabase
    .from('groups')
    .update({monitor_id: null})
    .eq('id', groupId)
    .select()
    .single()

    if(error) throw new BadRequestException(error.message)

    return {message: 'Monitor removido del grupo', group: data};
}

async assignStudent(groupId: string, studentId: string){
    const {data: group, error: groupErr} = await supabase
    .from('groups')
    .select('course_id')
    .eq('id', groupId)
    .single();

    if (groupErr || !group) {
        throw new BadRequestException('El grupo no existe');
    }
    const courseId = group.course_id;

    const {data:CourseFaculties, error:CourseFacultyErr} = await supabase
    .from('faculty_course')
    .select('faculty_id')
    .eq('course_id', courseId)

    if(CourseFacultyErr) throw new BadRequestException("No se pudieron obtener las facultades del curso")
    
    const CourseFacultyIds = CourseFaculties.map(f => f.faculty_id)

    const {data: StudentFaculties, error: StudentFacultyErr} = await supabase
    .from('profiles')
    .select('faculty_id')
    .eq('id', studentId)

    if (StudentFacultyErr) throw new BadRequestException('No se pudieron obtener las facultades del estudiante')

    const studentFacultyIds = StudentFaculties.map(f =>f.faculty_id)

    const canEnroll = studentFacultyIds.some(facId => CourseFacultyIds.includes(facId));

    if(!canEnroll){
        throw new BadRequestException('El estudiante no pertenece a ninguna facultad habilitada para este curso')
    }
    const{error} = await supabase
    .from('group_students')
    .insert({
        group_id: groupId,
        student_id: studentId
    });
    
    if(error){
        throw new BadRequestException('No se pudo inscribir el estudiante en el grupo')
    }
    return{message: 'Estudiante inscrito correctamente'};
}

async removeStudent(groupId: string, studentId: string){
    const {error} = await supabase
    .from('group_students')
    .delete()
    .eq('group_id', groupId)
    .eq('student_id', studentId);

    if(error){
        throw new BadRequestException('No se pudo remover al estudiante del grupo')
    }
    return {message: 'Estudiante removido correctamente'}
}

async getStudents(groupId: string){
    const{data, error} = await supabase
    .from('group_students')
    .select(`
        student_id,
        profiles (
            id,
            name,
            email
        )
    `)
    .eq('group_id', groupId);

    if(error) throw new BadRequestException(error.message)

    return data.map(item => item.profiles);
}

async countStudents(groupId: string){
    const{count,error} = await supabase
    .from('group_students')
    .select('*',{count: 'exact', head: true})
    .eq('group_id', groupId)

    if(error) throw new BadRequestException(error.message)
        return count;
}



}
