import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course-dto';
import { UpdateCourseDto } from './dto/update-course-dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('create')
  create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @Get('list')
  list() {
    return this.courseService.list();
  }

  @Get(':id/')
  findOne(@Param('id') id: string){
    return this.courseService.findOne(id);
  }

  @Get(':id/faculties')
  getFacultiesForCourse(@Param('id') courseId: string) {
    return this.courseService.getFacultiesForCourse(courseId);
  }

  @Post(':id/faculty')
  assignFaculties(
    @Param('id') courseId: string,
    @Body('faculty_id') facultyId: string 
  ){
    return this.courseService.assignFaculties(courseId,facultyId);
  }
}
