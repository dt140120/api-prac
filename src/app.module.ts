import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get('MONGO_HOST')
        const port = config.get('MONGO_PORT')
        const db = config.get('MONGO_DB')

        const uri = `mongodb://${host}:${port}/${db}`
        return { uri }
      },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
