import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { DialogComponent } from '../dialog/dialog.component';

import { TaskService } from '../../services/task.service';

import { Subscription } from 'rxjs';
import { Task } from '../../models/task.model';


import { faPenToSquare, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { DataService } from '../../services/data.service';
import { Toast } from '../../global/toast.global';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, MatDialogModule, MatPaginatorModule],
  providers: [DatePipe],
  templateUrl: './task-table.component.html',
  styleUrl: './task-table.component.scss'
})
export class TaskTableComponent implements OnInit, OnDestroy {
  public tasks: Array<Task> = [];

  // pagination vars
  public pagedTasks: Array<Task> = [];
  public pageSize: number = 4;
  public pageIndex: number = 0;


  public deleteIcon = faTrashAlt;
  public updateIcon = faPenToSquare;

  @Input() userName: string = '';
  @Input() inputTasks: Array<Task> = [];
  @Output() taskAdded = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() taskRemoved = new EventEmitter<Task>();


  private suscriptions: Array<Subscription> = [];

  constructor(private _dialog: MatDialog, private _taskService: TaskService, public datePipe: DatePipe, private dataService: DataService) { }

  ngOnInit(): void {
    if (this.inputTasks.length === 0) {
      this.dataService.task$.subscribe(tasks => {
        this.tasks = tasks;
        this.handlePageEvent({
          pageIndex: 0,
          pageSize: this.pageSize,
        });
      });
    } else {
      this.tasks = this.inputTasks;
      this.handlePageEvent({
        pageIndex: 0,
        pageSize: this.pageSize,
      });
    }

    

  }

  onAddTask() {
    const dialogRef = this._dialog.open(
      DialogComponent, {
      width: '30%',
      minWidth: '30rem',
      height: '500px',
      data: { form: 'addTask', dataObject: {} }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res !== undefined) {
        console.log(res);
        this.suscriptions.push(this._taskService.save(res.name, res.description, res.endingDate).subscribe({
          next: res => {
            this.taskAdded.emit(res);
          },
          error: e => {
            Toast.fire({
              icon: 'error',
              title: e.error.message
            });
          }
        }));


      }
    });
  }


  handlePageEvent(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.pagedTasks = this.tasks.slice(this.pageIndex * this.pageSize, this.pageIndex * this.pageSize + this.pageSize);
    
  }

  formatDate(dateIso: Date) {
    const date = new Date(dateIso);
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    return this.datePipe.transform(localDate, 'dd/MM/yyyy');
  }

  updateTask(task: Task) {
    if (task.state === 'terminado' || task.state === 'no completado') {
      Toast.fire({
        icon: 'info',
        title: 'Not changes are allowed'
      });
    } else {
      const dialogRef = this._dialog.open(
        DialogComponent, {
        width: '30%',
        minWidth: '30rem',
        height: '500px',
        data: { form: 'updTask', dataObject: { task } }
      });

      dialogRef.afterClosed().subscribe(res => {
        if (res !== undefined) {
          this.suscriptions.push(this._taskService.updateTask(res.task._id, res.task.name, res.task.description, res.task.endingDate, res.task.state).subscribe({
            next: res => {
              Toast.fire({
                icon: 'success',
                title: 'Task updated'
              });

              this.taskUpdated.emit(res);
            },
            error: e => {
              Toast.fire({
                icon: 'error',
                title: e.error.message
              });
            }
          }));
        }
      });
    }

  }

  deleteTask(task: Task) {
    this.suscriptions.push(this._taskService.delete(task._id).subscribe({
      next: res => {
        this.taskRemoved.emit(task);
      },
      error: e => {
        Toast.fire({
          icon: 'error',
          title: e.error.message
        });
      }
    }));
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach(suscription => suscription.unsubscribe());
  }
}
