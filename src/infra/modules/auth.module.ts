import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from '../../interface/http/auth/auth.controller';
import { AuthenticateUserUseCase } from '../../application/auth/use-cases/authenticate-user.use-case';
import { UserRepository } from '../../domain/auth/repositories/user.repository';
import { PrismaUserRepository } from '../database/prisma/repositories/prisma-user.repository';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { PrismaModule } from '../database/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') ?? '8h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: UserRepository, useClass: PrismaUserRepository },
    AuthenticateUserUseCase,
    JwtStrategy,
  ],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
