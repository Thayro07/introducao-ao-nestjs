import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './Jwt.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret-dev',
      signOptions: {expiresIn: '1d'}
    })
  ],
  providers: [AuthService, PrismaService, JwtAuthGuard],
  controllers: [AuthController]
})

export class AuthModule {}