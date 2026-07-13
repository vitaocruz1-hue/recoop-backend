import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Protege qualquer rota que exija login (área /admin). */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
