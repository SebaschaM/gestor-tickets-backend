import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRequestNotification(to: string, subject: string, context: any) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: "./notification", 
        context, 
      });
    } catch (error) {
      throw new InternalServerErrorException(
        "Error al enviar el correo electrónico"
      );
    }
  }
}
