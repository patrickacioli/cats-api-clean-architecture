import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateCatInput } from '../../../application/usecase';

// QUESTION: Is better way to implement this?
export class CreateCatDTO implements CreateCatInput {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  breed: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  age: number;
}

export class FindCatsDTO extends PartialType(CreateCatDTO) {}
