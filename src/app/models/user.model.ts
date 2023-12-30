import { Task } from "./task.model";

export class User {
    constructor(   
        public _id: string,   
        public name: string,
        public email: string,
        public password: string,        
        public tasks: Array<Task>,               
    ) {}
};