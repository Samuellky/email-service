import { HttpException } from '@nestjs/common';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { MessageRequest } from './dtos/message.request';
import { MessagesController } from './messages.controller';
import { CreateMessageCommand } from './commands/create-message.command';
import { MessagesModule } from './messages.modules';

describe(MessagesController.name, () => {
  let controller: MessagesController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, MessagesModule],
      }).compile();

    await module.init();

    controller = module.get<MessagesController>(MessagesController);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createMessage_undefinedHeader_throwsHttpException', async () => {
    await expect(controller.createMessage(undefined, undefined)).rejects.toThrow(HttpException)
  });

  it('createMessage_withValidAuthorizationHeader_executeCreateMessageCommand', async () => {
    const messageRequest = new MessageRequest({ recepient: 'receive@gmail.com', sender: 'send@gmail.com', content: 'test content', title: 'test title'});
    const command = new CreateMessageCommand({
      userName: 'abc@gmail.com',
      password: 'password123',
      sender: messageRequest.sender,
      recepient: messageRequest.recepient,
      content: messageRequest.content,
      title: messageRequest.title,
    });
    const mockExecute = jest.spyOn(commandBus, 'execute').mockResolvedValue(undefined);

    await controller.createMessage(messageRequest, 'Basic YWJjQGdtYWlsLmNvbTpwYXNzd29yZDEyMw==');

    expect(mockExecute).toBeCalledWith(command);
    expect(mockExecute).toBeCalledTimes(1);
  });
});