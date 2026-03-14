import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '+234 7072 666 4191' })
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @ApiPropertyOptional({ example: 'Business proposal' })
  @IsString()
  @IsOptional()
  readonly notes?: string;


}