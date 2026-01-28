import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class AcceptInvitationDto {
  @IsString()
  @IsNotEmpty()
  readonly token: string;

  @IsString()
  readonly firstName?: string;

  @IsString()
  readonly lastName?: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;


}