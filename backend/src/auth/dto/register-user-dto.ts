import {IsEmail, IsNotEmpty, Matches, MinLength} from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @Matches(/^[A-Za-z0-9._%+-]+@usc\.edu\.co$/, {
    message: 'Solo se permiten correos institucionales de la USC',
  })
  email: string;

    @IsNotEmpty()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @IsNotEmpty()
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    name: string;

}
