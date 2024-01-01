import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



import { TaskInterface } from '../../interfaces/task.interface';

import { faUser, faFileLines, faFileText, faCalendarTimes, faCalendar } from '@fortawesome/free-regular-svg-icons';

import { Task } from '../../models/task.model';



@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, MatSelectModule, FontAwesomeModule],
  providers: [DatePipe],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit {
  public task: TaskInterface;
  public taskUpdate: Task;
  public updateTaskData: boolean = false;
  private DateChanged: boolean = false;
  public date: any;
  public minDate: string = '';
  public states: Array<string> = ['creado', 'en progreso', 'terminado', 'no completado'];

  

  public nameIcon = faUser;
  public taskIcon = faFileLines;
  public descIcon = faFileText;
  public calendarIcon = faCalendar;
  public dateIcon = faCalendarTimes;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.task = {
      name: '',
      description: '',
      endingDate: new Date(),
    };

    this.taskUpdate = {
      _id: '',
      name: '',
      description: '',
      creationDate: new Date(),
      endingDate: new Date(),
      lastChange: new Date(),
      state: ''
    };
    

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

  }

  ngOnInit(): void {
    if (this.data.form === 'updTask' && this.data.dataObject.task.state === 'creado') {
      this.updateTaskData = true;
      this.taskUpdate = JSON.parse(JSON.stringify(this.data.dataObject.task));
      this.formatDate();
    }
  }  




  formatDate() {
    const date = new Date(this.data.dataObject.task.endingDate);
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    this.date = this.datePipe.transform(localDate, 'dd/MM/yyyy');
  }

  onDateChange(event: any) {
    this.DateChanged = true;
    this.taskUpdate.endingDate = new Date(event);
  }
  

  onSubmit() {
    switch (this.data.form) {
      case 'addTask':
        this.task.endingDate = this.date;
        this.data.dataObject = this.task;
        this.dialogRef.close(this.data.dataObject);
        break;

      case 'updTask':
        if (this.data.dataObject.task.state === 'creado') {
          if (!this.DateChanged) {
            const utcDate = new Date(Date.UTC(
              this.date.split('/')[2],
              this.date.split('/')[1] - 1,
              this.date.split('/')[0]
            ));
            const offset = new Date().getTimezoneOffset();
            const date = new Date(utcDate.getTime() + offset * 60 * 1000);
            this.taskUpdate.endingDate = date;
          }
          this.data.dataObject.task = this.taskUpdate;
          this.data.dataObject.task.endingDate = this.taskUpdate.endingDate.toISOString();
          this.dialogRef.close(this.data.dataObject);
        } else {
          this.data.dataObject.task.state = this.taskUpdate.state;
          this.dialogRef.close(this.data.dataObject);
        }


        break;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
