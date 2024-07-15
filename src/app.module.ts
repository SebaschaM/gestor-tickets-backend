import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { EmailModule } from "./modules/email/email.module";
import { JwtModule } from "./modules/jwt/jwt.module";
import { RequestModule } from "./modules/request/request.module";
import { SeedModule } from "./modules/seed/seed.module";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  imports: [AuthModule, EmailModule, JwtModule, RequestModule, SeedModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
