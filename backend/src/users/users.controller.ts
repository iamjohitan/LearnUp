import { Controller, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import {AuthGuard} from "../auth/auth.guard"

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard)
    @Patch('faculty')
    async updateFaculty(@Req() req, @Body('faculty_id') facultyId: string){
        const userId = req.user.id
        return this.usersService.updateFaculty(userId, facultyId)
    }
}
