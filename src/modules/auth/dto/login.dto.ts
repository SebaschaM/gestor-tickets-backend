// auth/dto/login.dto.ts
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  nombre_usuario: string;

  @IsString()
  contrasenia: string;
}
