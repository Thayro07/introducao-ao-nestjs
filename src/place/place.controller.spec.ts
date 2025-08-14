import { Test, TestingModule } from '@nestjs/testing';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { CloudinaryService } from './cloudinary.service';
import { buffer, find } from 'rxjs';
import { Place, placeType } from '@prisma/client';
import { create } from 'domain';

describe('PlaceController', () => {
    let controller: PlaceController;
    let placeService: jest.Mocked<PlaceService>;
    let cloudinaryService: jest.Mocked<CloudinaryService>;

    beforeEach(async () => {
        const mockPlaceService = {
            findAll: jest.fn(),
            findPaginated: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as any

        const mockCloudinaryService = {
            uploadImage: jest.fn(),
            deleteImage: jest.fn(),
        } as any

        const module: TestingModule = await Test.createTestingModule({
            controllers: [PlaceController],
            providers: [
                { provide: PlaceService, useValue: mockPlaceService },
                { provide: CloudinaryService, useValue: mockCloudinaryService },
            ],
        }).compile();

        controller = module.get<PlaceController>(PlaceController);
        placeService = module.get(PlaceService);
        cloudinaryService = module.get(CloudinaryService);
    });

    it("deve listar todos os lugares", async () => {
        const result: Place[] = [
            {
                id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                name: 'Real Lanches',
                phone: '88999992222',
                type: placeType.RESTAURANTE,
                latitude: -23.55052,
                longitude: -46.633308,
                images:
                    ['https://www.google.com/search?sca_esv=bbe24cb31649d4ed&sxsrf=AE3TifNDd3PMQP1hFk3TOUNoJUmT2Bfp8g:1755190839685&udm=2&fbs=AIIjpHxX5k-tONtMCu8aDeA7E5WMlVZjGnBiGIxaghLPqA-PlfgbLKUxiHcJwD8uXnH2piRJ050j0vn26_9l7bhJ4n7QPV-WlaFzA5vaGqRErzXXl-hAEqPG1IUtttCfgvMJG_hYbXMb50KemBeGNQv-kk32JWlgMuElh7afUv4sICSVekLQVK0WB9teW6hWMHsi2elsmORn0k6aiXY6EUk0BTALmUPKBw&q=lanchonete&sa=X&ved=2ahUKEwjcwoy044qPAxU-qJUCHUAXCAAQtKgLegQIGhAB&biw=1707&bih=862&dpr=1.13#vhid=KKNQTIWQgp1-4M&vssid=mosaic'],
                createdAt: new Date()
            },
            {
                id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
                name: 'Baron',
                phone: '88999992223',
                type: placeType.RESTAURANTE,
                latitude: -23.55152,
                longitude: -46.634308,
                images:
                    ['https://www.google.com/search?sca_esv=bbe24cb31649d4ed&sxsrf=AE3TifNDd3PMQP1hFk3TOUNoJUmT2Bfp8g:1755190839685&udm=2&fbs=AIIjpHxX5k-tONtMCu8aDeA7E5WMlVZjGnBiGIxaghLPqA-PlfgbLKUxiHcJwD8uXnH2piRJ050j0vn26_9l7bhJ4n7QPV-WlaFzA5vaGqRErzXXl-hAEqPG1IUtttCfgvMJG_hYbXMb50KemBeGNQv-kk32JWlgMuElh7afUv4sICSVekLQVK0WB9teW6hWMHsi2elsmORn0k6aiXY6EUk0BTALmUPKBw&q=lanchonete&sa=X&ved=2ahUKEwjcwoy044qPAxU-qJUCHUAXCAAQtKgLegQIGhAB&biw=1707&bih=862&dpr=1.13#vhid=pHdKlVP6JbCZqM&vssid=mosaic'],
                createdAt: new Date()
            }
        ];
        placeService.findAll.mockResolvedValue(result);

        expect(await controller.findAll()).toBe(result);
        expect(placeService.findAll).toHaveBeenCalled();
    })
});

// Não choresxs
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣴⣶⣶⣾⣿⣿⣿⣿⣿⣷⣶⣶⣦⣤⣄⣀⡀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣾⣿⣿⣿⣿⣿⣿⠿⣟⣛⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀⠀⠀
// ⠀⠀⠀⠀⢰⠶⣶⣶⣶⣦⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠟⠋⠉⡇⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠋⠉⠀⠀⠀
// ⠀⠀⠀⠀⢸⣷⣄⣙⣿⣿⣿⣿⣿⣿⣿⣫⣭⠿⣭⣝⢿⣿⣦⣄⡇⣿⣿⣿⣿⣿⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣫⠟⠁⠀⠀⠀⠈⢷⢻⣿⣿⣿⣿⣿⣿⣿⣥⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⣾⡟⣷⢻⣿⣿⣿⣿⠃⠀⠀⣠⣤⡀⠀⠘⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⡀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⣿⠀⢸⣏⣿⣿⣿⡏⠀⠀⠀⣿⣿⣇⠀⠀⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀
// ⠀⠀⠀⠀⠀⢹⠀⠀⣿⣿⣿⡟⠀⠀⠀⠀⣿⣿⣿⠀⠀⣿⣿⠇⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡄⠀⠀
// ⠀⠀⠀⠀⠀⣸⣄⡀⢻⣿⠉⠀⠀⠀⠀⠀⠹⠿⠏⠀⣸⣿⣿⡀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀
// ⠀⠀⠀⠀⠀⢿⣿⣿⣷⡖⠒⠦⢄⣀⣀⣀⣀⠤⠒⢉⣀⡀⠀⠙⣿⣿⣿⣿⣟⠛⠉⠉⠉⠉⠛⠛⠻⢿⣷⠀
// ⠀⠀⠀⠀⠀⠀⠉⠻⡛⠁⠀⠀⠀⠀⠈⠀⠀⠀⠀⢀⡸⠻⠀⢰⣿⣿⣿⣿⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠈⠂
// ⠀⠀⠀⠀⠀⠀⠀⠀⠙⠲⣄⠀⠀⠀⠀⠀⠠⠒⠚⠉⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠬⠵⣦⠤⣤⠀⠀⣀⣤⣤⣶⣿⠟⠛⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⣠⡞⢀⡔⠒⣼⡞⢁⡔⠂⠉⠉⠉⠛⠧⣄⢀⠟⠛⠻⢿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⢸⠘⠷⠤⢷⡀⠈⠳⠼⡀⠀⠀⠀⠀⠀⢀⠈⢿⣧⠀⠀⠀⠉⠻⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⡠⠓⢦⡤⠔⠛⠲⠤⠤⠵⢴⠀⠀⡄⢰⠈⣇⣿⣿⣧⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠘⠦⠤⠟⣆⠀⠀⠀⠀⠀⠀⢦⣀⣴⣠⣧⣼⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⢦⣤⣀⣠⣤⣾⣿⣿⣿⡇⠀⠀⠈⠙⠻⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⠻⣿⣿⡏⠻⢿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡏⠀⢹⣿⣿⠀⠀⠀⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⡔⠒⢋⣿⣿⣿⡒⢬⣿⣿⡧⠤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠧⠀⠈⠉⢉⡟⠉⢥⣿⣿⠿⠒⠀⢹⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⢀⡸⢄⠀⠀⠀⠀⢣⡀⠀⠀⠀⠀⠀⠀⡸⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⢀⣤⣾⣿⡦⠀⠙⢶⣶⣤⣼⠀⠀⠀⠀⠀⠀⠀⠀⣨⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⣠⣶⣿⠿⠋⣡⣴⣷⡀⠈⣿⣿⣿⣷⣦⣤⣤⠄⠀⠒⠚⠻⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⣼⡿⢋⣡⣴⣿⣿⣿⣿⡇⠀⢻⣿⣿⣿⣿⡿⠁⣠⣾⠘⣷⣦⢹⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠘⢿⣾⣿⣿⣿⣿⣿⣿⡿⠧⠤⠚⠛⠉⢿⣿⠃⣸⣿⣿⡀⠹⣿⣧⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣄⣿⣿⣿⣧⠀⢻⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣇⢸⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠻⢿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

// Made with love by Thayr (:
