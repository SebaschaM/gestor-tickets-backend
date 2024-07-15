import { Module } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { PrismaService } from "src/prisma/prisma.service";
import { SeedController } from './seed.controller';

@Module({
  controllers: [SeedController],
  providers: [SeedService, PrismaService],
})
export class SeedModule {}
