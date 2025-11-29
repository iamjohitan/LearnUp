import { Controller, Patch, Body, UseGuards, Req, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import {AuthGuard} from "../auth/auth.guard"
import { UpdateFacultyDto } from './dto/update-faculty-dto';
import { get } from 'http';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Patch('faculty')
    @UseGuards(AuthGuard)
    async updateFaculty(
        @Body() dto: UpdateFacultyDto,
        @Req() req,
    ){
        console.log('Controller - req.user:', req.user);
        console.log('Controller - body:', dto);
        return this.usersService.updateFaculty(req.user.id, dto.facultyId ?? null);
    }

    @Get('me')
    @UseGuards(AuthGuard)
    async getProfile(@Req() req ){
        console.log('UsersController.getProfile - req.user:', req.user); 
        return this.usersService.getProfile(req.user.id);
    }

    @Get('roles')
    listRoles(){
        return this.usersService.listRoles();
    }

    @Get('role/professors')
    getProfessors(){
        return this.usersService.listProfessors();
    }

    @Get('role/monitors')
    getMonitors(){
        return this.usersService.listMonitors();
    }

    @Get('role/students')
    getStudents(){
        return this.usersService.listStudents();
    }


    @Post(':id/change-role')
    changeRole(
        @Param('id') userId: string,
        @Body('role') newRoleName: string
    ){
        return this.usersService.changeRole(userId, newRoleName)
    }

    @Get(':id/groups')
    getUserGroups(@Param('id') userId: string){
        return this.usersService.getUserGroups(userId)
    }

    }
