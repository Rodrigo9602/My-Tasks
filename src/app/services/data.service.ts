import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private initialTask: Array<Task> = [ ];


  private taskSource = new BehaviorSubject<Task[]>(this.initialTask);
  task$ = this.taskSource.asObservable(); 

  constructor() { }

  updateTasks(task:Array<Task>) {   
    this.taskSource.next(task);
  };


}
