/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<import("./interfaces/user.interface").User>;
    findAll(): Promise<import("./interfaces/user.interface").User[]>;
    findOne(id: string): Promise<import("./interfaces/user.interface").User>;
    findByEmail(email: string): Promise<import("./interfaces/user.interface").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./interfaces/user.interface").User | Error>;
    updateTasks(id: string, params: any): Promise<import("@nestjs/common").ConflictException | Omit<import("./interfaces/user.interface").User, never>>;
    removeTask(id: string, params: any): Promise<import("@nestjs/common").ConflictException | Omit<import("mongoose").Document<unknown, {}, import("./interfaces/user.interface").User> & import("./interfaces/user.interface").User & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    remove(id: string): Promise<any>;
}
