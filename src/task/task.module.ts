import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { tasksProviders } from './task.providers';
import { DatabaseModule } from 'src/database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [TaskController],
  providers: [
    TaskService,
    ...tasksProviders  
  ],
})
export class TaskModule {}
