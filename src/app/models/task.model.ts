export class Task {
    constructor(  
        public _id:string,    
        public name: string,
        public description: string,
        public creationDate: Date,
        public endingDate: Date,
        public state:string,               
    ) {}
};