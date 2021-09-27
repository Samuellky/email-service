import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MailerFactory } from '../factories/mailer.factory';
import { MessagesModule } from '../messages.modules';
import { CreateMessageCommand } from './create-message.command';
import { CreateMessageCommandHandler } from './create-message.command.handler';

describe(CreateMessageCommandHandler.name, () => {
  let commandHandler: CreateMessageCommandHandler;
  let mailerFactory: MailerFactory;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MessagesModule],
    }).compile();

    await module.init();

    commandHandler = module.get<CreateMessageCommandHandler>(CreateMessageCommandHandler);
    mailerFactory = module.get<MailerFactory>(MailerFactory);
  });

  it('should be defined', () => {
    expect(commandHandler).toBeDefined();
  });

  it('execute_undefinedCommand_throwsHttpException', async () => {
    let throwError: HttpException;
    try {
      await commandHandler.execute(undefined);
    } catch(error) {
      throwError = error;
    }
    expect(throwError.getResponse()).toEqual('command should not be undefined.');
    expect(throwError.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
  });

  it.each([undefined, ''])('execute_withInvalidRecepient_throwsHttpException', async (param) => {
    let throwError: HttpException;
    try {
      await commandHandler.execute(new CreateMessageCommand({recepient: param}));
    } catch(error) {
      throwError = error;
    }
    expect(throwError.getResponse()).toEqual('command.requester cannot be undefined or empty.');
    expect(throwError.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
  });

  it.each([undefined, ''])('execute_withInvalidSender_throwsHttpException', async (param) => {
    let throwError: HttpException;
    try {
      await commandHandler.execute(new CreateMessageCommand({recepient: 'receive@gmail.com', sender: param}));
    } catch(error) {
      throwError = error;
    }
    expect(throwError.getResponse()).toEqual('command.sender cannot be undefined or empty.');
    expect(throwError.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
  });

  it.each([undefined, ''])('execute_withInvalidUserName_throwsHttpException', async (param) => {
    let throwError: HttpException;
    try {
      await commandHandler.execute(new CreateMessageCommand({recepient: 'receive@gmail.com', sender: 'send@gmail.com', userName: param}));
    } catch(error) {
      throwError = error;
    }
    expect(throwError.getResponse()).toEqual('command.userName cannot be undefined or empty.');
    expect(throwError.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
  });

  it.each([undefined, ''])('execute_withInvalidPassword_throwsHttpException', async (param) => {
    let throwError: HttpException;
    try {
      await commandHandler.execute(new CreateMessageCommand({recepient: 'receive@gmail.com', sender: 'send@gmail.com', userName: 'username', password: param}));
    } catch(error) {
      throwError = error;
    }
    expect(throwError.getResponse()).toEqual('command.password cannot be undefined or empty.');
    expect(throwError.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('execute_withValidArgument_success', async () => {
    let sendMailMock = jest.fn().mockImplementation();
    var getGoogleMailerMock = jest.fn().mockImplementation(() => {
      return {
        sendMail: sendMailMock,
      }
    });

    jest.spyOn(mailerFactory, 'getGoogleMailer').mockImplementation(getGoogleMailerMock);

    await commandHandler.execute(new CreateMessageCommand({recepient: 'receive@gmail.com', sender: 'send@gmail.com', userName: 'username', password: 'password'}));

    expect(getGoogleMailerMock).toBeCalledTimes(1);
    expect(sendMailMock).toBeCalledTimes(1);
  });
})