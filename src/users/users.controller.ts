import { Body, Controller, Get, Param, Post, Put, Delete} from "@nestjs/common";
import { User } from "@prisma/client";
import { UsersService } from "./users.service";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/uptade-user.dto";

@Controller('/user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // @Post()
    // @ApiOperation({ summary: 'Criar um novo usuário' })
    // @ApiBody({ type: CreateUserDto })
    // @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
    // create(@Body() data: CreateUserDto) {
    // return this.usersService.create(data);
    // }

    @Get('/users')
    @ApiOperation({ summary: 'Listar todos os usuários' })
    @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso.' })
    findAll() {
        return this.usersService.findAll()
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Buscar um usuário por ID' })
    @ApiResponse({ status: 200, description: 'Usuário encontrado.' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
    @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
    findOne(@Param('id') id: string){
        return this.usersService.findOne(id)
    }

    @Put('/:id')
    @ApiOperation({ summary: 'Atualizar um usuário' })
    @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
    @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
    @ApiBody({ type: UpdateUserDto })
    UpdateUser(@Param('id') id:string, @Body() data: UpdateUserDto){
        return this.usersService.UpdateUser(id, data)
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Remover um usuário' })
    @ApiResponse({ status: 200, description: 'Usuário removido com sucesso.' })
    @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
    remove(@Param('id') id: string){
        return this.usersService.remove(id)
    }
}