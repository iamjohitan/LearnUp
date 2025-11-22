import { IsUUID, IsNotEmpty } from 'class-validator';

export class UpdateFacultyDto {
    @IsNotEmpty()
    @IsUUID()
    facultyId?: string | null;
}