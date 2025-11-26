import { IsString, IsOptional, IsDateString, IsIn} from 'class-validator'

export class CreateMonitoriaDto{
    @IsString()
    monitor_id: string;

    @IsIn(['virtual', 'presencial'])
    tipo: 'virtual' | 'presencial';

    @IsOptional()
    @IsString()
    link?: string;

    @IsOptional()
    @IsString()
    salon?: string;

    @IsDateString()
    fecha: string;

}