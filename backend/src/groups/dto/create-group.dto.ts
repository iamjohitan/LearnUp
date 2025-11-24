import { IsUUID, IsNotEmpty, IsString, IsOptional} from "class-validator";

export class CreateGroupDto {

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsUUID()
    @IsNotEmpty()
    course_id: string;

    @IsUUID()
    @IsOptional()
    professor_id?: string;

    @IsUUID()
    @IsOptional()
    monitor_id?: string;
}