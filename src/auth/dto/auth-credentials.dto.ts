import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password is too weak, use at least: 1 upper, 1 lower and 1 number or special char',
  })
  password: string;
}
