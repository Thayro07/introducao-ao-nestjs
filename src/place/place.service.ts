import { Injectable, BadRequestException } from '@nestjs/common';
import { Place } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImageObject } from './types/image-object';
import { CloudinaryService } from './cloudinary.service';


@Injectable()
export class PlaceService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) { }

  async findAll() {
    return this.prisma.place.findMany();
  }

  async create(data: { name: string, type: any, phone: string, latitude: number, longitude: number, images: ImageObject[] }) {
     {
  return this.prisma.place.create({
    data: {
      name: data.name,
      type: data.type,
      phone: data.phone,
      latitude: typeof data.latitude === 'string' ? parseFloat(data.latitude) : data.latitude,
      longitude: typeof data.longitude === 'string' ? parseFloat(data.longitude) : data.longitude,
      images: data.images,
    }});
}
  }

  async update(id: string, data: Partial<Place>, newImages?: Buffer[]): Promise<Place> {
    const place = await this.prisma.place.findUnique({ where: { id } });
    if (!place) throw new BadRequestException('Local não encontrado');

    let images = place.images as ImageObject[];
    
    // Se forem enviadas novas imagens
    if (newImages && newImages.length > 0) {
      // Deletar imagens antigas
      await Promise.all(images.map(img => this.cloudinaryService.deleteImage(img.public_id)));
      // Upload das novas imagens
      images = await Promise.all(newImages.map(file => this.cloudinaryService.uploadImage(file)));
    }

    return this.prisma.place.update({
      where: { id },
      data: {
        ...data,
        ...(newImages ? { images: JSON.parse(JSON.stringify(images)) } : {}),
      },
    });
  }

  async delete(id: string): Promise<void> {
    const place = await this.prisma.place.findUnique({ where: { id } });
    if (!place) throw new BadRequestException('Local não encontrado');
    const images = place.images as ImageObject[];
    await Promise.all(images.map(img => this.cloudinaryService.deleteImage(img.public_id)));
    await this.prisma.place.delete({ where: { id } });
  }

}

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