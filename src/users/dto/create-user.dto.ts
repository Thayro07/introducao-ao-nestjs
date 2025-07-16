import { ApiProperty } from "@nestjs/swagger"


export class CreateUserDto {
    
    @ApiProperty({
        example: 'thayro holanda',
        description: 'Nome completo do usuário'
    })
    name: string

    @ApiProperty({
        example: 'thayrin@gmail.com',
        description: 'Email do usuário'
    })
    email: string 
}