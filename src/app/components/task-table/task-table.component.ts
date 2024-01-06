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
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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
  public addIcon = faPlus;

  @Input() userName: string = '';
  @Input() inputTasks: Array<Task> = [];
  @Output() taskAdded = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() taskRemoved = new EventEmitter<Task>();


  private suscriptions: Array<Subscription> = [];

  constructor(private _dialog: MatDialog, private _taskService: TaskService, public datePipe: DatePipe, private dataService: DataService) {
    if (window.innerWidth <= 670) {
      this.pageSize = 1;
    }
  }

  /**
   * @method OnInit:
   * This method checks if there is an input as the momento of its initialization,
   * in the case that an input exits it means that the component is rendering a search result or
   * a filter search; on the contrary, if the input doesnt exits it will suscribe to an observer on a service
   * and gets all changes on task data in a reactive way, wich increase the performance of the system.
   
   * @returns void
   */

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

  /**
   * @method OnAddTask:
   * This method uses the dialog component as a modal window to collect the creation data of a new task.
   * If said component returns a value other than undefined,
   * this method uses the taskService to store this new task in the database,
   * in case it is saved. Successfully, an alert is displayed and an event is emitted with the added task,
   * which is used in the parent component to update the observable declared in the dataService and for the entire page in general to perform a reactive update of the data.
   
   * @returns void
   */

  onAddTask() {
    const dialogRef = this._dialog.open(
      DialogComponent, {
      width: '30%',
      minWidth: '20rem',
      minHeight: '500px',
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

  /**
   * @method handlePageEvent:
   * This method is responsible for performing the pagination and organizing the number of tasks that will be displayed on each page. 

   * @returns void
   * @param {any} event: refers to the current pagination of the component
   */


  handlePageEvent(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.pagedTasks = this.tasks.slice(this.pageIndex * this.pageSize, this.pageIndex * this.pageSize + this.pageSize);

  }

  /**
   * @method formatDate: 
   * This method uses the datePipe to transform the endingDate shown in the forms,
   * in addition to adjusting the offset generated by default when creating Date type objects.
   
   * @returns void   
   */

  formatDate(dateIso: Date) {
    const date = new Date(dateIso);
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    return this.datePipe.transform(localDate, 'dd/MM/yyyy');
  }


  /**
   * @method updateTask:
   * This method is used to update the task,
   * first it is verified that the task can be updated,
   * then the DialogComponent component is used as a modal window,
   * in case the response of said component is not undefined,
   * the update is carried out. the task using the updateTask method of the task service.
   * The status of the response is checked in case of errors or exceptions and an alert is displayed accordingly;
   * If the task is updated, it is emitted as an event,
   * which will be received in the parent component in order to perform a reactive update of the data.
   
   * @returns void
   * @param {Task} task: an instance of Task
   */

  updateTask(task: Task) :void {
    if (task.state === 'terminado' || task.state === 'no completado') {
      Toast.fire({
        icon: 'info',
        title: 'Not changes are allowed'
      });
    } else {
      const dialogRef = this._dialog.open(
        DialogComponent, {
        width: '30%',
        minWidth: '20rem',
        minHeight: '500px',
        data: { form: 'updTask', dataObject: { task } }
      });

      dialogRef.afterClosed().subscribe(res => {
        if (res !== undefined) {
          this.suscriptions.push(this._taskService.updateTask(res.task._id, res.task.name, res.task.description, res.task.endingDate, res.task.state).subscribe({
            next: res => {
              if (res.status === 409) {
                Toast.fire({
                  icon: 'error',
                  title: res.response.error
                });
              } else {
                Toast.fire({
                  icon: 'success',
                  title: 'Task updated'
                });

                this.taskUpdated.emit(res);
              }
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

  /**
   * @method deleteTask:
   * This method is used to delete the task, it gets a task to delete and access to the delete method on taskService
   * if the task is deleted succefully, the response of the request wich is the deleted task is emitted as an event,
   * which will be received in the parent component in order to perform a reactive update of the data.
   
   * @returns void
   * @param {Task} task: an instance of Task
   */


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

  /**
   * @method OnDestroy:
   * This method unsuscribe all observers
   
   * @returns void  
  */

  ngOnDestroy(): void {
    this.suscriptions.forEach(suscription => suscription.unsubscribe());
  }
}