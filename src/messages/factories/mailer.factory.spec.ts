import { HttpException, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MessagesModule } from '../messages.modules';
import { MailerFactory } from './mailer.factory';

describe(MailerFactory.name, () => {
  let mailerFactory: MailerFactory;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [MessagesModule],
      }).compile();

    await module.init();

    mailerFactory = module.get<MailerFactory>(MailerFactory);
  });

  it('should be defined', () => {
    expect(mailerFactory).toBeDefined();
  });

  it.each(['', undefined])('getGoogleMailer_invalidUserName_throwsHttpException', param => {
    let throwError: HttpException;
    try {
      mailerFactory.getGoogleMailer(param, 'password')
    } catch(error) {
      throwError = error;
    }
    expect(throwError.getResponse()).toEqual('userName should not be undefined or empty.');
    expect(throwError.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
  });

  it.each(['', undefined])('getGoogleMailer_invalidPassword_throwsHttpException', param => {
    let throwError: HttpException;
    try {
      mailerFactory.getGoogleMailer('userName', param);
    } catch(error) {
      throwError = error;
    }
    expect(throwError.getResponse()).toEqual('password should not be undefined or empty.');
    expect(throwError.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('getGoogleMailer_withValidArguments_returnsTransporter', () => {
    expect(mailerFactory.getGoogleMailer('username', 'password')).toBeDefined();
  });
});