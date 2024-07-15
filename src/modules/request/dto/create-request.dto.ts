// src/request/dto/create-request.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsDateString,
} from "class-validator";

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  asunto_solicitud: string;

  @IsString()
  @IsOptional()
  numero_ticket: string;

  @IsString()
  @IsNotEmpty()
  detalle_solicitud: string;

  @IsDateString()
  @IsOptional()
  fecha_asignada?: string;

  @IsInt()
  @IsNotEmpty()
  usuario_id: number;

  @IsInt()
  @IsNotEmpty()
  tipo_solicitud_id: number;

  @IsString()
  @IsNotEmpty()
  nombre_tipo_solicitud: string;

  @IsString()
  @IsNotEmpty()
  nombre_tipo_familia: string;

  @IsInt()
  @IsOptional()
  token: string;

  @IsInt()
  @IsNotEmpty()
  tipo_servicio_id: number;

  @IsString()
  @IsNotEmpty()
  nombre_tipo_servicio: string;

  @IsInt()
  @IsNotEmpty()
  tipo_estado_id: number;

  @IsInt()
  @IsNotEmpty()
  tipo_prioridad_id: number;
}
