import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSelect, MatSelectModule } from '@angular/material/select';

import { UserService } from '../../../services/user.service';
import { ModeConfigService } from '../../../services/mode.service';
import { User } from '../../../models/user.model';
import { Subscription } from 'rxjs';

import { TaskTableComponent } from '../../../components/task-table/task-table.component';



import { faMoon, faSun, faUserCircle, faEdit, faClock } from '@fortawesome/free-regular-svg-icons';
import { faSearch, faRightFromBracket, faHeart, faCoffee } from '@fortawesome/free-solid-svg-icons';
import { Task } from '../../../models/task.model';
import { Toast } from '../../../global/toast.global';
import { SessionService } from '../../../services/session.service';
import { DataService } from '../../../services/data.service';



@Component({
  selector: 'app-mainboard',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, TaskTableComponent, MatSelectModule],
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
  public clockIcon = faClock;

  public searchStr: string = '';
  public user: User;
  public currentMode: boolean = true;
  public tasks: Array<Task> = [];
  public userMenuHide: boolean = true;
  public showSearchResults: boolean = false;
  public filter: string = 'undefined';
  public states: Array<string> = ['creado', 'en progreso', 'terminado', 'no completado'];

  private userId: string = '';
  private suscriptions: Array<Subscription> = [];

  @ViewChild('stateSelector') stateSelector: MatSelect | undefined;

  constructor(
    private _sessionService: SessionService,
    private _userService: UserService,
    private _mode: ModeConfigService,
    private dataService: DataService,
  ) {
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
    this.suscriptions.push(this._userService.find(this.userId).subscribe({
      next: (res) => {
        this.user = res;
        this.dataService.updateTasks(this.user.tasks);
      },
      error: (e) => {
        Toast.fire({
          icon: 'error',
          title: 'A validation error happens',
          text: 'please log in again',
          timer: 2000,
        });
        this.onLogout();
      }
    })
    );

    this.dataService.task$.subscribe(tasks => {
      this.user.tasks = tasks;
    });
  }


  onSearch() {
    this.tasks = [];
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

      this.showSearchResults = true;
      this.stateSelector!.disabled = true;
    }

  }

  onEndSearch() {
    this.searchStr = '';
    this.filter = 'undefined';
    this.stateSelector!.writeValue('undefined');
    this.stateSelector!.disabled = false;
    this.showSearchResults = false;
  }

  onFilters() { 

      this.tasks = [];
      for (let i = 0; i < this.user.tasks.length; i++) {
        if (this.user.tasks[i].state === this.filter) {
          this.tasks.push(this.user.tasks[i]);
        }
      }

      if (this.tasks.length === 0) {
        Toast.fire({
          icon: 'info',
          title: 'Not a single task was found',
          timer: 2000
        });

      } else {
        Toast.fire({
          icon: 'success',
          title: 'Tasks found'
        });

        this.showSearchResults = true;
        this.stateSelector!.disabled = true;
      }    
    
  }


  onShowLateTasks() {
    this.tasks = [];
    for (let i = 0; i < this.user.tasks.length; i++) {
      if(this.user.tasks[i].endingDate > new Date() && this.user.tasks[i].state === 'en progreso') {
        this.tasks.push(this.user.tasks[i]);
      }
    }

    if (this.tasks.length === 0) {
      Toast.fire({
        icon: 'info',
        title: 'Congratulations!',
        text: 'You have zero tasks out of time',
        timer: 2000
      });

    } else {
      Toast.fire({
        icon: 'success',
        title: 'Tasks found'
      });

      this.showSearchResults = true;
      this.stateSelector!.disabled = true;
    }    
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
    this.suscriptions.push(this._userService.addTask(this.user._id, response._id).subscribe({
      next: res => {
        Toast.fire({
          icon: 'success',
          title: 'Task added to the list'
        });
        this.dataService.updateTasks(res.tasks);
      },
      error: e => {
        Toast.fire({
          icon: 'error',
          title: e.error.message
        });
      }
    })
    );

  }

  onUpdateTask(response: Task) {

    for (let i = 0; i < this.user.tasks.length; i++) {
      if (this.user.tasks[i]._id === response._id) {
        this.user.tasks.splice(i, 1, response);
      }
    }

    this.dataService.updateTasks(this.user.tasks);
    this.showSearchResults = false;
  }

  onRemoveTask(response: Task) {
    this.suscriptions.push(this._userService.removeTask(this.user._id, response._id).subscribe({
      next: res => {
        this.dataService.updateTasks(res.tasks);
        Toast.fire({
          icon: 'success',
          title: 'Task removed'
        });
      },
      error: e => {
        Toast.fire({
          icon: 'error',
          title: e.error.message
        });
      }
    })
    );
    this.showSearchResults = false;
  }

  onLogout() {
    this._sessionService.logout();
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach(suscription => suscription.unsubscribe());
  }

}
