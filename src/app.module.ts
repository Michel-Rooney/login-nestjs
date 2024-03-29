import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './authentication/auth.module';
import { MulterModule } from '@nestjs/platform-express';


@Module({
  imports: [UsersModule,AuthModule, MulterModule.register({ dest: './uploads' })],
  controllers: [],
  providers: [],
})
export class AppModule {}
