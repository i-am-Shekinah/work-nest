import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserInvitation(
    email: string,
    firstName: string,
    lastName: string,
    token: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Work Nest! Complete Your Registration',
      html: `
        <p>Hello, ${firstName} ${lastName}!</p>
        <p>You have been invited to join Work Nest. Please click the link below to complete your registration:</p>
        <a href="https://work-nest.com/register?token=${token}">Complete Registration</a>
        <p>This link will expire in 7 days.</p>
        <p>If you did not expect this invitation, please ignore this email.</p>
        <p>Best regards,<br/>The Work Nest Team</p>
      `,
    });
  }
}
