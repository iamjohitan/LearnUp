import { Body, Controller, Get, Post } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty-dto';

@Controller('faculty')
export class FacultyController {
    constructor(private readonly facultyService: FacultyService) {}

    @Post('crear')
    crear(@Body() dto: CreateFacultyDto) {
        return this.facultyService.crear(dto);
    }

    @Get('listar')
    listar() {
        return this.facultyService.listar();
    }




}


