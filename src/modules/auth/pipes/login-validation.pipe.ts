// auth/pipes/login-validation.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class LoginValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }

    const loginDto = plainToInstance(LoginDto, value);
    const errors = await validate(loginDto);

    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    return value;
  }
}
