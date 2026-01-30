import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

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
      <div style="
        font-family: Arial, sans-serif;
        color: #1f2937;
        line-height: 1.5;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f9fafb;
      ">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        
        <h2 style="color: #4f46e5; margin-top: 0;">Welcome to Work Nest!</h2>
        
        <p>Hello ${firstName || 'User'} ${lastName || ''},</p>

        <p>You have been invited to join <strong>Work Nest</strong>. Please click the button below to complete your registration:</p>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://work-nest.com/register?token=${token}" 
            style="
              display: inline-block;
              padding: 14px 28px;
              font-size: 16px;
              font-weight: bold;
              color: #ffffff;
              background-color: #4f46e5;
              text-decoration: none;
              border-radius: 6px;
            ">
            Complete Registration
          </a>
        </p>

        <p style="font-size: 14px; color: #6b7280;">
          This link will expire in <strong>7 days</strong>.<br/>
          If you did not expect this invitation, please ignore this email.
        </p>

        <p>Best regards,<br/>The Work Nest Team</p>
      </div>

        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 20px;">
          Work Nest, 2 Cold Street, Lagos, Nigeria.
        </p>
      </div>
`,
    });
  }
}
