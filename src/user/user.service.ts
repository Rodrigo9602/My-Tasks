import mongoose, { Model, ObjectId } from 'mongoose';
import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Task } from 'src/task/interfaces/task.interface';

import * as bcrypt from 'bcrypt';
const saltOrRounds = 10;



@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL') private userModel: Model<User>,
    @Inject('TASK_MODEL') private taskModel: Model<Task>,
  ) { }


  async create(createUserDto: CreateUserDto): Promise<User> {

    // Check if user email already exists
    const userExists = await this.userModel.exists({ email: createUserDto.email });
    if (userExists) {
      throw new ConflictException('Email already exists');
    }
    // Create and save new user 
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password.toString(), salt);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword
    });
    return user.save();
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().populate('tasks').exec();
  }

  findOne(id: string): Promise<User> {
    const user = this.userModel.findById(id).populate('tasks').exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  findByEmail(email:string) : Promise<User> {    
    const user = this.userModel.findOne({email:email}).populate('tasks').exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async addTask(id: string, params: any) {
    try {
      const user = await this.findOne(id);
      if (user) {
        const task = await this.taskModel.findById(params.taskId);
        if (task) {
          user.tasks.push(task._id);
          let userUpdated = user.save();
          return (await userUpdated).populate('tasks');
        } else {
          throw new NotFoundException(`Task with id ${params.taskId} was not found`);
        }
      } else {
        throw new NotFoundException(`User with id ${id} was not found`);
      }
    } catch (error) {
      return new ConflictException('Error updating user', error.message);
    }
  }


  async removeTask(id:string, params:any) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      for (let i=0; i< user.tasks.length; i++) {        
        if(user.tasks[i].toString() === params.taskId) {
          user.tasks.splice(user.tasks.indexOf(user.tasks[i]),1);
          let userUpdated = user.save();
          return (await userUpdated).populate('tasks');
        }
      }
    } catch (error) {
      return new ConflictException('Error updating user', error.message);
    }
  }



  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | Error> {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, { name: updateUserDto.name }, {
        new: true,
        useFindAndModify: false,
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user.populate('tasks');
    } catch (error) {
      return new ConflictException('Error updating user', error.message);
    }
  }

  async remove(id: string): Promise<any> {
    const user = await this.findOne(id);
    return this.userModel.deleteOne({ _id: user._id }).exec();
  }
}
