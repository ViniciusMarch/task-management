import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {
    super({
      secretOrKey: 'dasdua0d9asd09kasd',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // In this point, I know that the token is valid. So now I want to fetch the user data
  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;

    const user: User = await this.usersRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    // delete user.password;

    return user;
  }
}
