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
exports.UserService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const saltOrRounds = 10;
let UserService = class UserService {
    constructor(userModel, taskModel) {
        this.userModel = userModel;
        this.taskModel = taskModel;
    }
    async create(createUserDto) {
        const userExists = await this.userModel.exists({ email: createUserDto.email });
        if (userExists) {
            throw new common_1.ConflictException('Email already exists');
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUserDto.password.toString(), salt);
        const user = new this.userModel({
            ...createUserDto,
            password: hashedPassword
        });
        return user.save();
    }
    findAll() {
        return this.userModel.find().populate('tasks').exec();
    }
    findOne(id) {
        const user = this.userModel.findById(id).populate('tasks').exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    findByEmail(email) {
        const user = this.userModel.findOne({ email: email }).populate('tasks').exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }
    async addTask(id, params) {
        try {
            const user = await this.findOne(id);
            if (user) {
                const task = await this.taskModel.findById(params.taskId);
                if (task) {
                    user.tasks.push(task._id);
                    let userUpdated = user.save();
                    return (await userUpdated).populate('tasks');
                }
                else {
                    throw new common_1.NotFoundException(`Task with id ${params.taskId} was not found`);
                }
            }
            else {
                throw new common_1.NotFoundException(`User with id ${id} was not found`);
            }
        }
        catch (error) {
            return new common_1.ConflictException('Error updating user', error.message);
        }
    }
    async removeTask(id, params) {
        try {
            const user = await this.userModel.findById(id).exec();
            ;
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            for (let i = 0; i < user.tasks.length; i++) {
                if (user.tasks[i].toString() === params.taskId) {
                    user.tasks.splice(user.tasks.indexOf(user.tasks[i]), 1);
                    let userUpdated = user.save();
                    return (await userUpdated).populate('tasks');
                }
            }
        }
        catch (error) {
            return new common_1.ConflictException('Error updating user', error.message);
        }
    }
    async update(id, updateUserDto) {
        try {
            const user = await this.userModel.findByIdAndUpdate(id, { name: updateUserDto.name }, {
                new: true,
                useFindAndModify: false,
            }).exec();
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            return user.populate('tasks');
        }
        catch (error) {
            return new common_1.ConflictException('Error updating user', error.message);
        }
    }
    async remove(id) {
        const user = await this.findOne(id);
        return this.userModel.deleteOne({ _id: user._id }).exec();
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('USER_MODEL')),
    __param(1, (0, common_1.Inject)('TASK_MODEL')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model])
], UserService);
//# sourceMappingURL=user.service.js.map