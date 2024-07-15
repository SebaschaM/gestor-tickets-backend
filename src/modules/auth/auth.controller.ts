import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { LoginValidationPipe } from "./pipes/login-validation.pipe";
import { Response, Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(
    @Body(LoginValidationPipe) loginDto: LoginDto,
    @Res() res: Response
  ): Promise<void> {
    const { accessToken, refreshToken, user, message, statusCode } =
      await this.authService.login(loginDto);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(statusCode).json({ accessToken, user, message, statusCode });
  }

  @Post("refresh-token")
  async refreshToken(
    @Req() req: Request & { cookies: { [key: string]: string } },
    @Res() res: Response
  ) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new HttpException("Missing token", HttpStatus.BAD_REQUEST);
    }

    try {
      const { accessToken } = await this.authService.refreshToken(refreshToken);
      res.status(HttpStatus.OK).json({ accessToken });
    } catch (error) {
      throw new HttpException("Invalid refresh token", HttpStatus.UNAUTHORIZED);
    }
  }
}
