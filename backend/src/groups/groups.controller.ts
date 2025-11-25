import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AssignStudentDto } from './dto/assign-student.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post('create')
  create(@Body() dto: CreateGroupDto){
    return this.groupsService.create(dto);
  }

  @Get('list')
  list(){
    return this.groupsService.list();
  }

  @Get(':id')
  findOne(@Param('id') id: string){
    return this.groupsService.findOne(id);
  }

  @Get('course/:courseId')
  getGroupsByCourse(@Param('courseId') courseId: string){
    return this.groupsService.getGroupsByCourse(courseId);
  }

  @Post(':id/assign-professor')
  assignProfessor(
    @Param('id') groupId: string,
    @Body('professor_id') professorId:string
  ){
    return this.groupsService.assignProfessor(groupId, professorId)
  }

    @Post(':id/assign-Monitor')
  assignMonitor(
    @Param('id') groupId: string,
    @Body('monitor_id') monitorId:string
  ){
    return this.groupsService.assignMonitor(groupId, monitorId)
  }

  @Delete(':id/remove-profesor')
  removeProfessor(@Param('id') groupId: string){
    return this.groupsService.removeProfessor(groupId);
  }

  @Delete(':id/remove-monitor')
  removeMonitor(@Param('id') groupId: string){
    return this.groupsService.removeMonitor(groupId);
  }

  @Post(':id/assign-student')
  assignStudent(
    @Param('id') groupId: string,
    @Body()body: AssignStudentDto
  ){
    return this.groupsService.assignStudent(groupId, body.studentId)
  }

  @Delete(':id/remove-student')
  removeStudent(
    @Param('id') groupId: string,
    @Body('studentId') studentId: string,
  ){
    return this.groupsService.removeStudent(groupId, studentId);
  }

  @Get(':id/students')
  getStudents(@Param('id') groupId: string){
    return this.groupsService.getStudents(groupId)
  }

  @Get(':id/student-count')
  countStudent(@Param('id')groupId: string){
    return this.groupsService.countStudents(groupId)
  }
}
