import { Model } from 'mongoose';
import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { Task } from './interfaces/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_MODEL')
    private taskModel: Model<Task>,
  ) { }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    // Check if task name already exists
    const taskExists = await this.taskModel.exists({ name: createTaskDto.name });
    if (taskExists) {
      throw new ConflictException('Task already exits on database');
    }
    const createTask = new this.taskModel(createTaskDto);
    return createTask.save();
  };

  findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();;
  };

  findOne(id: string): Promise<Task> {
    const task = this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  };

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | Error> {
    
    try {
      const task = await this.findOne(id);
      if (task) {      
        const OLD_NAME = String(task.name); 
        if (updateTaskDto.name !== OLD_NAME) {
          const taskWithSameName = this.taskModel.exists({name: updateTaskDto.name});
          if(taskWithSameName) {
            throw new ConflictException('There is a task with the same name in database');
          }
        }
        const taskState = task.get('state');
        if(taskState !== updateTaskDto.state) {
          task.set({lastChange: new Date()});
        }

        if (taskState === 'creado') {
          task.set(updateTaskDto);
          const updatedTask = await task.save();
          return updatedTask;
        } else {
          task.set({ state: updateTaskDto.state });
          const updatedTask = await task.save();
          return updatedTask;
        }
      } else {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
    } catch (error) {
      return new ConflictException('Error updating task', error.message);
    }
  };

 
  async remove(id: string): Promise<any> {
    try {
      const task = await this.findOne(id);
      if (task) {
        this.taskModel.deleteOne({ _id: task._id }).exec();
        return this.findAll();
      } else {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
    } catch (error) {
      return new ConflictException('Error updating task:', error.message);
    }

  };
}
