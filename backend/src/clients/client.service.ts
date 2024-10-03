import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './create-client.dto';
import { UpdateClientDto } from './update-client.dto';


@Injectable()
export class ClientService {

  private readonly logger = new Logger(ClientService.name); 

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async findAll(): Promise<Client[]> {
    const clients = await this.clientRepository.find();
    return clients;
  }

  async findAllClientsWithImages(): Promise<Client[]> {
    return this.clientRepository.find({

      // Specify that we want to load related images
      relations: ['images'], 
      
    });
  }

  async deleteClient(clientId: number): Promise<void> {
    const client = await this.clientRepository.findOne({ where: { id: clientId }, relations: ['images'] });
    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }
    await this.clientRepository.remove(client); 
  }

  async createClient(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(client);
  }


  async updateClient(clientId: number, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    this.logger.log('try editing');

    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    this.logger.log('try editing');
    // Update the client's properties
    Object.assign(client, updateClientDto);

    // Save the updated client back to the database
    return await this.clientRepository.save(client);
  }

  /*
  async updateClientImages(id: number, imagePaths: string[]): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    client.images = imagePaths;
    return this.clientRepository.save(client);
  }
   
  */

}
