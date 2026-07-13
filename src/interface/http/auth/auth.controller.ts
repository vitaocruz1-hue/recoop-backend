import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticateUserUseCase } from '../../../application/auth/use-cases/authenticate-user.use-case';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../../infra/auth/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authenticateUser: AuthenticateUserUseCase) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    return this.authenticateUser.execute(dto);
  }

  /** Usado pelo painel /admin para checar se o token salvo ainda é válido. */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    return req.user;
  }
}
