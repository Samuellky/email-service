import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailOptions } from 'nodemailer/lib/smtp-transport';
import { MailerFactory } from '../factories/mailer.factory';
import { CreateMessageCommand } from './create-message.command';

@CommandHandler(CreateMessageCommand)
export class CreateMessageCommandHandler implements ICommandHandler<CreateMessageCommand> {
  private readonly mailerFactory: MailerFactory;

  public constructor(mailerFactory: MailerFactory) {
    this.mailerFactory = mailerFactory;
  }

  private static validate(command: CreateMessageCommand): void {
    if (command == undefined) {
      throw new HttpException('command should not be undefined.', HttpStatus.BAD_REQUEST);
    }

    if (command.recepient == undefined || command.recepient.trim() === '') {
      throw new HttpException('command.requester cannot be undefined or empty.', HttpStatus.BAD_REQUEST);
    }

    if (command.sender == undefined || command.sender.trim() === '') {
      throw new HttpException('command.sender cannot be undefined or empty.', HttpStatus.BAD_REQUEST);
    }

    if (command.userName == undefined || command.userName.trim() === '') {
      throw new HttpException('command.userName cannot be undefined or empty.', HttpStatus.BAD_REQUEST);
    }

    if (command.password == undefined || command.password.trim() === '') {
      throw new HttpException('command.password cannot be undefined or empty.', HttpStatus.BAD_REQUEST);
    }
  }

  public async execute(command: CreateMessageCommand): Promise<void> {
    CreateMessageCommandHandler.validate(command);

    var mailer = this.mailerFactory.getGoogleMailer(command.userName, command.password);

    try {
      await mailer.sendMail({
        from: { address: command.sender },
        to: [{ address: command.recepient }],
        text: command.content,
        subject: command.title,
      } as MailOptions);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}