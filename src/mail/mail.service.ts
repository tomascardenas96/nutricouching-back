import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: any;
  private USER_NAME_MAIL = process.env.USER_NAME_MAIL;
  private USER_PASSWORD_MAIL = process.env.USER_PASSWORD_MAIL;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.USER_NAME_MAIL,
        pass: this.USER_PASSWORD_MAIL,
      },
    });
  }

  async sendConfirmationEmail(email: string, token: string) {
    const mailOptions = {
      from: 'Nutricoaching - <nutricoaching@gmail.com>',
      to: email,
      subject: 'Confirma tu cuenta',
      text: `Por favor confirma tu cuenta utilizando el siguiente enlace: ${process.env.FRONTEND_HOST}/auth/confirm?token=${token}`,
      html: `<p>Por favor confirma tu cuenta haciendo clic en el siguiente enlace:</p><a href="${process.env.FRONTEND_HOST}/auth/confirm?token=${token}">Confirmar cuenta</a>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error.message);
      return new Error('Error sending confirmation email');
    }
  }

  async sendResetPasswordEmail(email: string, linkToken: string) {
    const mailOptions = {
      from: 'Nutricoaching - <nutricoaching@gmail.com>',
      to: email,
      subject: 'Reestablecer contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${linkToken}">Restablecer contraseña</a>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error.message);
      return new Error('Error sending confirmation email');
    }
  }
}
