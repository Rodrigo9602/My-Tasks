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
        const taskState = task.get('state');

        if (taskState === 'creado') {
          task.set(updateTaskDto);
          const updatedTask = await task.save();
          return updatedTask;
        } else {
          throw new ConflictException('Cannot update task with state other than "creado"');
        }
      } else {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
    } catch (error) {
      return new ConflictException('Error updating task', error.message);
    }
  };

  async updateState(id: string, params: any): Promise<Task | Error> {
    try {
      // search the task and validate the state
      const task = await this.findOne(id);
      const validStates = ['creado', 'en progreso', 'terminado', 'no completado'];
      if (validStates.includes(params.state)) {
        task.set({ state: params.state });
        return task.save();
      } else {
        throw new ConflictException('Invalid task state');
      }
    } catch (error) {
      return new ConflictException('Error updating task:', error.message);
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
