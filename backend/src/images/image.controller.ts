import {
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors,
    Get,
    Param,
    Delete,
    Body,
    Logger,
    BadRequestException,
    NotFoundException,
  } from '@nestjs/common';
  import { FilesInterceptor, } from '@nestjs/platform-express';
  import { ImageService } from './image.service';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  import * as fs from 'fs';
  import * as path from 'path';

  @Controller('images')
  export class ImageController {
    private readonly logger = new Logger(ImageController.name);

    constructor(private readonly imageService: ImageService) {}

    private renameFileAsync(oldFilePath: string, newFilePath: string): Promise<void> {
      return new Promise((resolve, reject) => {
        fs.rename(oldFilePath, newFilePath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  
    @Post(':clientId')
    @UseInterceptors(
      FilesInterceptor('files', 10, {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const clientId = req.params.clientId; 
            const newFileName = `${clientId}-${file.originalname}`; 
            callback(null, newFileName);
          },
        }),
      }),
    )
    async uploadImages(
      @Param('clientId') clientId: number,
      @UploadedFiles() files: Express.Multer.File[],
    ) {
      return await this.uploadMultipleFiles(files, clientId);
    }

    async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[], clientId: number) {
      const savedImages = [];
      for (const file of files) {
        const image = await this.imageService.saveImage(file, clientId);
        savedImages.push(image);
      }

      //this.logger.debug(savedImages);
              
      //Add image id to images names stored on server 
      let uploadPath = path.join(process.cwd(), 'uploads');
      savedImages.forEach(si => {
        let oldFilePath = path.join(uploadPath, si.client.id + '-' + si.filename);
        let newFilePath = path.join(uploadPath, si.id + '-' + si.client.id + '-' + si.filename);

        if (!fs.existsSync(oldFilePath)) {
          throw new NotFoundException(`File ${si} not found`);
        }

        try {
          this.renameFileAsync(oldFilePath, newFilePath);
        } catch (error) {
          throw new BadRequestException(`Error renaming file ${si}: ${error.message}`);
        }
        
      });

      return savedImages;
    }
  
    @Get()
    async getAllImages() {
      return await this.imageService.getImages();
    }

    @Get('client/:clientId')
    async getClientImages(@Param('clientId') clientId: number) {
      const images = await this.imageService.findAllImagesByClient(clientId);
      return images;
    }

    @Delete(':id')
    async deleteImage(@Param('id') id: number): Promise<void> {
      await this.imageService.deleteImage(id);
    }

    
  }
  