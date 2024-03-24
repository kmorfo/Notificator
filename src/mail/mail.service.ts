import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendEmailForgotPassword(user: User, token: string) {
    const urltoken = `${process.env.DEEP_LINK}/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password reset notification',
      template: './resetpassword',
      context: {
        name: user.username,
        urltoken,
      },
    });
  }

  async sendEmailVerification(user: User, token: string) {
    const urltoken = `${process.env.VERIFICATION_LINK}/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Email account verification',
      template: './verifyemail',
      context: {
        name: user.username,
        urltoken,
      },
    });
  }
}
