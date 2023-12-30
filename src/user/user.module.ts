import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { usersProviders } from './user.providers';
import { DatabaseModule } from 'src/database/database.module';
import { tasksProviders } from 'src/task/task.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    UserService,    
    ...usersProviders,
    ...tasksProviders
  ],
  exports: [UserService],
})
export class UserModule {}
