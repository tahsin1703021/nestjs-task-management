import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as uuid from 'uuid/v1';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';


@Injectable()
export class TasksService {

  constructor(@InjectModel('Task') private readonly taskModel: Model<Task> ){}

  async getAllTasks(): Promise<Task[]>{
    const result = await this.taskModel.find().exec();
    return result;
  }

  async getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    let tasks = await this.getAllTasks();
  
    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(task =>
        task.title.includes(search) ||
        task.description.includes(search),
      );
    }

    return tasks;
  }

  async getTaskById(id: string): Promise<Task> {
    let found;
    try{
      found = await this.taskModel.findById(id).exec();
    }catch{
        throw new NotFoundException(`${id} not found, invalid ID`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task>{
    const { title, description } = createTaskDto;

    const newTask = new this.taskModel({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    const result = await newTask.save();

    return result;
  }

  async deleteTask(id: string){
    try{
      const result = await this.taskModel.deleteOne({_id: id}).exec();
    }catch{
      throw new InternalServerErrorException('Could not delete the task');
    }
    
    return null;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    try{
      task.save();
    }catch{
      throw new InternalServerErrorException('The update couldnt be saved');
    }

    return task;
  }
}
