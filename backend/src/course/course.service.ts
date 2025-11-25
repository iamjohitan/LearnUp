import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course-dto';
import { UpdateCourseDto } from './dto/update-course-dto';
import supabase from 'src/infra/supabase.client';

@Injectable()
export class CourseService {
  async create(dto: CreateCourseDto) {
    const {data,error} = await supabase
    .from('courses')
    .insert(dto)
    .select()
    .single();

    if (error) throw new BadGatewayException(error.message);
    return {message: 'Curso creado con exito', course: data}

  }
  async getFacultiesForCourse(CourseId: string){
    const {data, error} = await supabase
    .from('faculty_course')
    .select('faculty(*)')
    .eq('course_id', CourseId);

    if (error) throw new BadRequestException(error.message)
    
    return data.map((row:any) => row.faculty) 
  }

  async list(){
    const{data, error} = await supabase
    .from('courses')
    .select('*')
    if (error) throw new BadRequestException(error.message)
    
    return data;
  }

  async findOne(id:string){
    const {data, error} = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

    if (error) throw new BadRequestException(error.message);

    return data
  }

  async assignFaculties(courseId: string, facultyId: string){
  if (!facultyId) {
    throw new BadRequestException('Debes enviar una facultad');
  }

  // Verificar si ya existe la relación (opcional pero recomendado para evitar duplicados)
  const { data: existing, error: existsError } = await supabase
    .from('faculty_course')
    .select('*')
    .eq('course_id', courseId)
    .eq('faculty_id', facultyId)
    .single();

  if (existsError && existsError.code !== 'PGRST116') {
    throw new BadRequestException(existsError.message);
  }

  if (existing) {
    return {
      message: 'La facultad ya estaba asignada a este curso',
      relation: existing,
    };
  }

  // Insertar la nueva relación
  const { data, error } = await supabase
    .from('faculty_course')
    .insert({ course_id: courseId, faculty_id: facultyId })
    .select()
    .single();

  if (error) throw new BadRequestException(error.message);

  return {
    message: 'Facultad asignada con éxito',
    relation: data,
  };
  }
}
