import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { LoginResponseDto } from "./dto/login-response.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(nombre_usuario: string, contrasenia: string) {
    const user = await this.prisma.usuario.findFirst({
      where: { nombre_usuario },
      include: { rol: true },
    });

    if (user && (await bcrypt.compare(contrasenia, user.contrasenia))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { nombre_usuario, contrasenia } = loginDto;
    const user = await this.validateUser(nombre_usuario, contrasenia);
    let userInfo;
    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    userInfo = await this.prisma.solicitante.findFirst({
      where: { usuario_id: user.usuario_id },
    });

    if (!userInfo) {
      userInfo = await this.prisma.empleado.findFirst({
        where: { usuario_id: user.usuario_id },
      });
    }

    const payloadAccessToken = {
      username: user.nombre_usuario,
      sub: user.usuario_id,
      role: user.rol.nombre_rol,
    };

    const payloadRefreshToken = {
      id: user.usuario_id,
    };

    const accessToken = this.jwtService.sign(payloadAccessToken, {
      secret: process.env.JWT_SECRET,
      expiresIn: "15m",
    });
    const refreshToken = this.jwtService.sign(payloadRefreshToken, {
      secret: process.env.JWT_SECRET,
      expiresIn: "7d",
    });

    return {
      accessToken,
      refreshToken,
      user: {
        usuario_id: user.usuario_id,
        nombre_usuario: user.nombre_usuario,
        correo: user.correo,
        rol: user.rol.nombre_rol,
        nombres: userInfo.nombres,
        apellidos: userInfo.apellidos,
      },
      statusCode: 200,
      message: "Inicio de sesión exitoso",
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const payload = {
        username: decoded.username,
        sub: decoded.id,
        role: decoded.role,
      };

      const newAccessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: "15m",
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}
