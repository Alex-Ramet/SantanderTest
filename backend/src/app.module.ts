import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateModule } from './modules/candidate/candidate.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQLHOST,
      port: Number(process.env.MYSQLPORT),
      username: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      autoLoadEntities: true,
      synchronize: false,
    }),
    CandidateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
