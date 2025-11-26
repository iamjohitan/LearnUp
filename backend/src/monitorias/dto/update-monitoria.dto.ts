import {IsString, IsOptional, IsDateString, IsIn} from 'class-validator'
export class UpdateMonitoriaDto{
    @IsOptional()
    @IsIn(['virtual', 'presencial'])
    tipo?: 'virtual' | 'presencial';

    @IsOptional()
    @IsString()
    link?: string;

    @IsOptional()
    @IsString()
    salon?: string;

    @IsOptional()
    @IsDateString()
    fecha?: string;
}