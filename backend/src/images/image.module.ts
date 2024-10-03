import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { Client } from '../clients/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Client])],
  controllers: [ImageController, ],
  providers: [ImageService, ],
})
export class ImageModule {}
