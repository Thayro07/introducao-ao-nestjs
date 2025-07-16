import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('register')
    @ApiBody({type: RegisterDto})
    @ApiCreatedResponse({description: 'Usuário registrado com sucesso!'})
    @ApiConflictResponse({description: 'Email está em uso!'})
    @ApiOperation({summary: 'Registrar novo usuário'})
    async registerUser(@Body() userData: RegisterDto) {
        return this.authService.registerUser(userData)
    }

    @Post('login')
    @ApiBody({type: LoginDto})
    @ApiOperation({summary: 'Login do Usuário'})
    async login(@Body() userData: LoginDto): Promise<LoginResponseDto> {
        return this.authService.login(userData)
    }
}
