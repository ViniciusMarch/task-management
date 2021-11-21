import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDTO);
  }

  async signIn(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDTO;

    const user = await this.usersRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Please check your login credentials');
    }

    const matchedPasswords = await bcrypt.compare(password, user.password);

    if (!matchedPasswords) {
      throw new UnauthorizedException('Please check your login credentials');
    }

    const payload: JwtPayload = { username };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
