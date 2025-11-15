import { Injectable, BadRequestException } from '@nestjs/common';
import supabase from '../infra/supabase.client';
import { CreateFacultyDto } from './dto/create-faculty-dto';

@Injectable()
export class FacultyService {
    async crear(dto: CreateFacultyDto) {
        const {error} = await supabase.from('faculty').insert([{ name: dto.name }]);
        if (error) throw new BadRequestException(error.message);
        return { message: 'Facultad creada exitosamente' };
    }

    async listar() {
        const { data, error } = await supabase.from('faculty').select('*');
        if (error) throw new BadRequestException(error.message);
        return data;
    }
}
