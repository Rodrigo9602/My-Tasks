import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Task } from '../../models/task.model';

import { DatePipe } from '@angular/common';

import { faPenToSquare, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  providers: [DatePipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit {
  @Input() task:Task
  public deleteIcon = faTrashAlt;
  public updateIcon = faPenToSquare;
  
  constructor(public datePipe:DatePipe){
    this.task = {
      _id: '',
      name: '',
      description: '',
      creationDate: new Date(),
      endingDate: new Date(),
      state: ''
    }
  }
  ngOnInit(): void {
    
  }

  updateTask() {

  }

  deleteTask() {

  }
}
