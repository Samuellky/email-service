import { Body, Controller, HttpException, HttpStatus, Post, Headers } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBasicAuth, ApiOperation } from '@nestjs/swagger';
import { CreateMessageCommand } from './commands/create-message.command';
import { MessageRequest } from './dtos/message.request';

@Controller('api/v1/messages')
export class MessagesController {
  private readonly commandBus: CommandBus;

  public constructor(commandBus: CommandBus) {
    this.commandBus = commandBus;
  }

  @Post()
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Sends email message.' })
  public async createMessage(@Body() messageRequest: MessageRequest, @Headers('authorization') authorization: string): Promise<void> {
    if (authorization == undefined || authorization.trim() == undefined) {
      throw new HttpException('Basic authentication is required.', HttpStatus.UNAUTHORIZED);
    }
    
    let authString = authorization.split(' ')[1].toString();
    let auth = Buffer.from(authString, 'base64').toString().split(':');
    let userName = auth[0];
    let password = auth[1];

    await this.commandBus.execute(new CreateMessageCommand({
      title: messageRequest.title,
      sender: messageRequest.sender,
      recepient: messageRequest.recepient,
      content: messageRequest.content,
      userName: userName,
      password: password,
    }));
  }
}
