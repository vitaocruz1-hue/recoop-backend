import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../../../domain/auth/repositories/user.repository';

export interface AuthenticateUserCommand {
  email: string;
  password: string;
}

export interface AuthenticateUserResult {
  accessToken: string;
  user: { id: string; name: string; email: string };
}

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: AuthenticateUserCommand): Promise<AuthenticateUserResult> {
    const user = await this.userRepository.findByEmail(command.email.trim().toLowerCase());
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const passwordMatches = await bcrypt.compare(command.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      accessToken,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
