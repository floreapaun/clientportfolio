import { Controller, Get, Delete, Param, Post, Body, ParseIntPipe } from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from './client.entity';
import { CreateClientDto } from './create-client.dto.js';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async findAll(): Promise<Client[]> {
    return this.clientService.findAllClientsWithImages();
  }

  @Delete(':id')
  deleteClient(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.clientService.deleteClient(id);
  }
  
  @Post()
  async createClient(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientService.createClient(createClientDto);
  }

  @Post('/update/:id')
  async updateClient(@Param('id', ParseIntPipe) id: number, @Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientService.updateClient(id, createClientDto);
  }

}
