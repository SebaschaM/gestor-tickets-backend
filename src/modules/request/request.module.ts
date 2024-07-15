import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [RequestController],
  providers: [RequestService, PrismaService, JwtService, EmailService],
})
export class RequestModule {}
