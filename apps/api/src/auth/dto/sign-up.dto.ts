import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Validate,
  IsDateString,
} from 'class-validator';
import { IsUserAlreadyExist } from '../../user/is-user-already-exist.validator';
import { Genders } from '@su-gtd/api-enums';

export class SignUp {
  @IsDefined()
  @IsNotEmpty()
  readonly firstName: string;

  @IsDefined()
  @IsNotEmpty()
  readonly lastName: string;

  @IsDefined()
  @IsEmail()
  @Validate(IsUserAlreadyExist)
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;

  @IsDefined()
  @IsNotEmpty()
  @IsDateString()
  readonly birthday: Date;

  @IsDefined()
  @IsNotEmpty()
  readonly gender: Genders;
}
