"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
let TaskService = class TaskService {
    constructor(taskModel) {
        this.taskModel = taskModel;
    }
    async create(createTaskDto) {
        const taskExists = await this.taskModel.exists({ name: createTaskDto.name });
        if (taskExists) {
            throw new common_1.ConflictException('Task already exits on database');
        }
        const createTask = new this.taskModel(createTaskDto);
        return createTask.save();
    }
    ;
    findAll() {
        return this.taskModel.find().exec();
        ;
    }
    ;
    findOne(id) {
        const task = this.taskModel.findById(id).exec();
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }
    ;
    async updateTask(id, updateTaskDto) {
        try {
            const task = await this.findOne(id);
            if (task) {
                const taskState = task.get('state');
                if (taskState === 'creado') {
                    task.set(updateTaskDto);
                    const updatedTask = await task.save();
                    return updatedTask;
                }
                else {
                    throw new common_1.ConflictException('Cannot update task with state other than "creado"');
                }
            }
            else {
                throw new common_1.NotFoundException(`Task with ID ${id} not found`);
            }
        }
        catch (error) {
            return new common_1.ConflictException('Error updating task', error.message);
        }
    }
    ;
    async updateState(id, params) {
        try {
            const task = await this.findOne(id);
            const validStates = ['creado', 'en progreso', 'terminado', 'no completado'];
            if (validStates.includes(params.state)) {
                task.set({ state: params.state });
                return task.save();
            }
            else {
                throw new common_1.ConflictException('Invalid task state');
            }
        }
        catch (error) {
            return new common_1.ConflictException('Error updating task:', error.message);
        }
    }
    ;
    async remove(id) {
        try {
            const task = await this.findOne(id);
            if (task) {
                this.taskModel.deleteOne({ _id: task._id }).exec();
                return this.findAll();
            }
            else {
                throw new common_1.NotFoundException(`Task with ID ${id} not found`);
            }
        }
        catch (error) {
            return new common_1.ConflictException('Error updating task:', error.message);
        }
    }
    ;
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('TASK_MODEL')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], TaskService);
//# sourceMappingURL=task.service.js.map