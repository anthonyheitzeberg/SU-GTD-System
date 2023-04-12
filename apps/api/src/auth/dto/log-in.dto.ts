import { IsNotEmpty, IsString } from 'class-validator';

export class LogIn {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
