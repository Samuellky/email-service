import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateMessageCommandHandler } from './commands/create-message.command.handler';
import { MailerFactory } from './factories/mailer.factory';
import { MessagesController } from './messages.controller';

@Module({
  controllers: [MessagesController],
  exports: [],
  imports: [CqrsModule],
  providers: [MailerFactory, CreateMessageCommandHandler],
})
export class MessagesModule {}
