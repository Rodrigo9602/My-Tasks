import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    create(createTaskDto: CreateTaskDto): Promise<import("./interfaces/task.interface").Task>;
    findAll(): Promise<import("./interfaces/task.interface").Task[]>;
    findOne(id: string): Promise<import("./interfaces/task.interface").Task>;
    updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<import("./interfaces/task.interface").Task | Error>;
    updateState(id: string, params: any): Promise<import("./interfaces/task.interface").Task | Error>;
    remove(id: string): Promise<any>;
}
