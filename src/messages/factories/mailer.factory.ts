import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class MailerFactory {
  public getGoogleMailer(userName: string, password: string): Transporter {
    if (userName == undefined || userName.trim() === '') {
      throw new HttpException('userName should not be undefined or empty.', HttpStatus.BAD_REQUEST);
    }
    if (password == undefined || password.trim() === '') {
      throw new HttpException('password should not be undefined or empty.', HttpStatus.BAD_REQUEST);
    }

    return createTransport({
      service: 'gmail',
      auth: {
        user: userName,
        pass: password,
      }
    });
  }
}