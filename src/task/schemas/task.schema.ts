import * as mongoose from 'mongoose';

export const TaskSchema = new mongoose.Schema({
    name: {type:String, unique:true, required:true},
    description: {type:String,required:true},
    creationDate: {type: Date, required:true, default: Date.now()},
    endingDate: {type: Date, required:true},
    state: {type: String, enum: ['creado', 'en progreso', 'terminado', 'no completado'], default: 'creado', required: true}
});

