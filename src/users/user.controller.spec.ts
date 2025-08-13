
import {Test,TestingModule}  from "@nestjs/testing";    
import { UsersController } from "./users.controller";   
import { UsersService } from "./users.service";

const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  remove: jest.fn(),
};

describe("UsersController", () => {
    let controller: UsersController;       
    let service: UsersService;

    beforeEach(async () => {    
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                { provide: UsersService, useValue: mockUsersService },
            ],
        }).compile();
        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    }
    );

    it("deve ser definido", () => {
        expect(controller).toBeDefined();
    });

    it("deve criar um usuário", async () => {
        const dto = { name: "thayro", email: "thayr@gmail.com" };
        mockUsersService.create.mockResolvedValue(dto);
        const result = await controller.create(dto);
        expect(result).toEqual(dto);
        expect(mockUsersService.create).toHaveBeenCalledWith(dto);
    }   
    );

    it("deve listar todos os usuários", async () => {
        const users = [
            { id: '550e8400-e29b-41d4-a716-446655440002', name: "Thayro Holanda", email: "thayr@gmail.com" },
            { id: '550e8400-e29b-41d4-a716-446655440000', name: "Bianca Lucas", email: "biazika@gmail.com" }
        ]})})