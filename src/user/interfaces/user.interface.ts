import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { TaskSchema } from 'src/task/schemas/task.schema';

export interface User extends Document { 
    readonly email: { type: String, required: true, unique: true },
    readonly name: { type: String, required: true },
    readonly password: { type: String, required: true },
    readonly tasks:[{
        type: mongoose.Types.ObjectId,
       
    }];
}