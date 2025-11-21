import { Controller, Patch, Body, UseGuards, Req, Get } from '@nestjs/common';
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
        return this.usersService.getProfile(req.user.id);
    }
    }
