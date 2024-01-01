import { Document } from 'mongoose';

export interface Task extends Document {
  readonly name: {type:String, unique:true, required:true},
  readonly description: {type:String,required:true},
  readonly creationDate: {type: Date, required:true},
  readonly endingDate: {type: Date, required:true},
  readonly lastChange: {type: Date},
  readonly state: {type: String, enum: ['creado', 'en progreso', 'terminado', 'no completado'], default: 'creado', required: true}
}