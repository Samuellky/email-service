import { ICommand } from '@nestjs/cqrs';

export class CreateMessageCommand implements ICommand {
  public recepient: string;

  public sender: string;

  public title: string;

  public content: string;

  public userName: string;

  public password: string;

  public constructor(command: Partial<CreateMessageCommand>) {
    Object.assign(this, command);
  }
}