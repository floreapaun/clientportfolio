import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ClientModule } from './clients/client.module';
import { ImageModule } from './images/image.module';

import { Client } from './clients/client.entity';
import { Image } from './images/image.entity';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RequestLoggerMiddleware } from './middlewares/request-logger/request-logger.middleware';

@Module({
  imports: [
    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,  '..', 'uploads'),
      serveRoot: '/images/',
    }),
    
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_DB'),
        entities: [Client, Image],
        synchronize: false,
        autoLoadEntities: true,
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
        factories: [__dirname + '/factories/**/*{.ts,.js}'],
        cli: {
          migrationsDir: __dirname + '/migrations/',
        },
      }),
      inject: [ConfigService],
    }),
    
    ClientModule,
    ImageModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes('*');  
  }
}
