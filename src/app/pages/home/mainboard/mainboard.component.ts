import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { UserService } from '../../../services/user.service';
import { ModeConfigService } from '../../../services/mode.service';
import { User } from '../../../models/user.model';
import { Subscription } from 'rxjs';

import { TaskTableComponent } from '../../../components/task-table/task-table.component';


import { faMoon, faSun, faUserCircle, faEdit } from '@fortawesome/free-regular-svg-icons';
import { faSearch, faRightFromBracket, faHeart, faCoffee } from '@fortawesome/free-solid-svg-icons';
import { Task } from '../../../models/task.model';
import { Toast } from '../../../global/toast.global';
import { SessionService } from '../../../services/session.service';
import { DataService } from '../../../services/data.service';



@Component({
  selector: 'app-mainboard',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, TaskTableComponent],  
  templateUrl: './mainboard.component.html',
  styleUrl: './mainboard.component.scss'
})
export class MainboardComponent implements OnInit, OnDestroy {
  public modeIcon = faMoon;
  public searchIcon = faSearch;
  public userIcon = faUserCircle;
  public editIcon = faEdit;
  public logoutIcon = faRightFromBracket;
  public loveIcon = faHeart;
  public coffeIcon = faCoffee;

  public searchStr: string = '';
  public user: User;
  public currentMode: boolean = true;
  public tasks: Array<Task> = [];
  public userMenuHide: boolean = true;

  private userId: string = '';
  private suscription: Subscription | undefined;


  constructor(private _sessionService: SessionService, private _userService: UserService, private _mode: ModeConfigService, private dataService: DataService) {
    this.user = {
      _id: '',
      name: '',
      email: '',
      password: '',
      tasks: []
    };
  }

  ngOnInit(): void {
    // get the user id
    this.userId = localStorage.getItem('id')!;
    // get initial data
    this.suscription = this._userService.find(this.userId).subscribe({
      next: (res) => {
        this.user = res;
        this.dataService.updateTasks(this.user.tasks);
      },
      error: (e) => { console.log(e) }
    })
  }


  onSearch() {
    for (let i = 0; i < this.user.tasks.length; i++) {
      if (this.user.tasks[i].name === this.searchStr) {
        this.tasks.push(this.user.tasks[i]);
      }
    }
    if (this.tasks.length === 0) {
      Toast.fire({
        icon: 'info',
        title: 'Task was not found'
      });
    } else {
      Toast.fire({
        icon: 'success',
        title: 'Task was found'
      });
    }
    this.searchStr = '';
  }

  onChangeMode() {
    this.currentMode = !this.currentMode;
    this.currentMode ? this.modeIcon = faMoon : this.modeIcon = faSun;
    this._mode.changeMode(this.currentMode);
  }

  onUserMenu() {
    this.userMenuHide = !this.userMenuHide;
  }

  onAddTask(response: Task) {
    this._userService.addTask(this.user._id, response._id).subscribe({
      next: res => {        
        this.dataService.updateTasks(res.tasks);
      },
      error: e => {
        console.log(e);
      }
    })
  }

  onRemoveTask(response: Task) {
    this._userService.removeTask(this.user._id, response._id).subscribe({
      next: res => {            
        this.dataService.updateTasks(res.tasks);
        Toast.fire({
          icon: 'success',
          title: 'Task removed'
        });
      },
      error: e => {
        console.log(e);
      }
    })
  }

  onLogout() {
    this._sessionService.logout();
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }

}
