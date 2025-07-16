import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    constructor(private jwt: JwtService, private prisma: PrismaService) {}

    async registerUser (userData: RegisterDto){
        const userExist = await this.prisma.user.findUnique({
            where: {email: userData.email}
        })

        if(userExist){
            throw new ConflictException("Email já está em uso!")
        }

        const hashedPassword = await bcrypt.hash(
            userData.password, 10
        )

        const newUser = await this.prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: hashedPassword
            },
            select: {
                id: true, 
                name: true,
                email: true,
                role: true
            }
        })

        return newUser
    }
    
    async validateUser (email: string, password: string){
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if(!user){
            throw new UnauthorizedException('Credenciais inválidas!')
        } 

        const isMatch = await bcrypt.compare(password, user.password)
        
        if(!isMatch){
            throw new UnauthorizedException('Credenciais inválidas!')
        }
        
        return user;
    }
    
    async login (userData: LoginDto){
        const user = await this.validateUser(userData.email, userData.password)

        const payload = {
            userId: user.id, // -> Recebe a inscrição de id do user
            email: user.email,
            role: user.role
        }

        return {
            access_token: this.jwt.sign(payload)
        }
    }
}