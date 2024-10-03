import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { Client } from '../clients/client.entity';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async saveImage(file: Express.Multer.File, clientId: number): Promise<Image> {
    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    if (!client) {
      throw new Error('Client not found' + clientId);
    }

    const image = new Image();
    image.filename = file.originalname;
    image.mimetype = file.mimetype;
    image.client = client;
    return await this.imageRepository.save(image);
  }

  async getImages(): Promise<Image[]> {
    return await this.imageRepository.find();
  }

  async findAllImagesByClient(clientId: number): Promise<Image[]> {
    return this.imageRepository.find({
      where: { client: { id: clientId } },
    });
  }

  async deleteImage(id: number): Promise<void> {
    const result = await this.imageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    const files = fs.readdirSync(path.join(process.cwd(), 'uploads')); 
    const foundFile = files.find((file) => file.startsWith(id.toString()));
    fs.unlink((path.join(process.cwd(), 'uploads', foundFile)), (err) => {
      if (err) {
        console.error(`Failed to delete file: ${err.message}`);
        throw err;
      }
      console.log(`File ${foundFile} was deleted`);
    });

  
  }

}
