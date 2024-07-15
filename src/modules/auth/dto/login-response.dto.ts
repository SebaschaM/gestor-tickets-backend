// auth/dto/login-response.dto.ts
import { IsString, IsInt } from "class-validator";

export class LoginResponseDto {
  @IsInt()
  statusCode: number;

  @IsString()
  message: string;

  user: {
    usuario_id: number;
    nombre_usuario: string;
    correo: string;
    rol: string;
    apellidos: string;
    nombres: string;
  };

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
