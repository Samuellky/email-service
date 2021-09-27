import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MessageRequest{
  @ApiProperty({ required: true, type: String, description: 'The email address of the recepient.' })
  @IsString()
  public recepient!: string;

  @ApiProperty({ required: true, type: String, description: 'The email address of the sender.' })
  @IsString()
  public sender!: string;

  @ApiProperty({ required: false, type: String, description: 'The title of the email.'})
  @IsString()
  public title?: string;

  @ApiProperty({ required: false, type: String, description: 'The content of the email.'})
  @IsString()
  public content?: string;

  public constructor(request: MessageRequest) {
    Object.assign(this, request);
  }
}