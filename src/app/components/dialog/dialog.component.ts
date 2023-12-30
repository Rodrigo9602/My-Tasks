import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { TaskInterface } from '../../interfaces/task.interface';

import { faUser, faFileText, faCalendarTimes } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, FontAwesomeModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  public task: TaskInterface;
  public date: any;
  public nameIcon = faUser;
  public descIcon = faFileText;
  public dateIcon = faCalendarTimes;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.task = {
      name: '',
      description: '',
      endingDate: new Date(),
    };
  }

  onSubmit() {
    switch (this.data.form) {
      case 'addTask':
        this.task.endingDate = this.date;
        this.data.dataObject = this.task;
        this.dialogRef.close(this.data.dataObject);
      break;
  }
}

onCancel(){
  this.dialogRef.close();
}
}
