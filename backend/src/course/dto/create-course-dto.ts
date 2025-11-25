import { IsNotEmpty, IsString, IsOptional} from "class-validator";

export class CreateCourseDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsOptional()
    description?: string;
}