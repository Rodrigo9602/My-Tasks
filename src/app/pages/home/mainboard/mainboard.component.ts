import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';

import { UserService } from '../../../services/user.service';
import { ModeConfigService } from '../../../services/mode.service';
import { User } from '../../../models/user.model';
import { Subscription } from 'rxjs';

import { TaskTableComponent } from '../../../components/task-table/task-table.component';
import { DialogComponent } from '../../../components/dialog/dialog.component';


import { faMoon, faSun, faUserCircle, faEdit, faClock } from '@fortawesome/free-regular-svg-icons';
import { faSearch, faRightFromBracket, faHeart, faCoffee, faClose } from '@fortawesome/free-solid-svg-icons';
import { Task } from '../../../models/task.model';
import { Toast } from '../../../global/toast.global';
import { SessionService } from '../../../services/session.service';
import { DataService } from '../../../services/data.service';



@Component({
  selector: 'app-mainboard',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, MatSelectModule, TaskTableComponent, DialogComponent, MatSidenavModule],
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
  public returnIcon = faClose;

  public opened: boolean = false;
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

  /**
  * @method OnSubmit:
  * This method collects the user id value stored in locaStorage and proceeds to search for it using the find method of the user service.
  * If an error occurs in the validation, said error is displayed and the user is redirected back to the page login;
  * If the user is found, the value of the observable in the dataService is updated, in order to provide global access to the data.

  * @returns void  
  */

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
  };


  /**
  * @method onChangeMode:
  * This method sets the value of the variable referring to the current display mode,
  * changes the icon that is rendered in the navigation bar and updates the value of an observable related to the display mode

  * @returns void  
  */

  onChangeMode() {
    this.currentMode = !this.currentMode;
    this.currentMode ? this.modeIcon = faMoon : this.modeIcon = faSun;
    this._mode.changeMode(this.currentMode);
  };

  /**
    * @method toggleSidenav:
    * This method allows you to control the state of the page's sidebar.
    * 
    * @returns void  
    */

  toggleSidenav() {
    this.opened = !this.opened;
  }

  // user related methods

  /**
    * @method onUserMenu:
    * This method allows you to control the user menu visualization.
    
    * @returns void  
    */


  onUserMenu() {
    this.userMenuHide = !this.userMenuHide;
  };

  /**
      * @method onLogout:
      * This method close the current session and clears the LocalStorage.
      
      * @returns void  
      */

  onLogout() {
    this._sessionService.logout();
  };


  // filters and search realated methods

  /**
     * @method onFilter:
     * This method links 4 different ways of searching for information among the current data:
     * the first is through a search for tasks by name, this uses regex to validate that all those tasks that have at least one matching word with respect to the chain are searched. searched text;
     * the second is through the status of the tasks;
     * the third form of search filters the task in the 'in progress' state that has been in that state for the longest time;
     * the last method filters those tasks outside the completion time
     
     * @param {string} type: The type of search we are applying
     * @returns void  
     */

  onFilter(type: string) {
    this.tasks = [];
    let longestDurationWithoutChange = 0;
    const now = new Date();
    let oldestUnchangedTask: Task | undefined;

    for (let i = 0; i < this.user.tasks.length; i++) {
      switch (type) {
        case 'search':
          const escapedTerms = this.searchStr.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(escapedTerms.split(' ').join('|'), 'gi');

          if (this.user.tasks[i].name.match(regex)) {
            this.tasks.push(this.user.tasks[i]);
          }
          break;

        case 'late-task':
          let endingDate = new Date(this.user.tasks[i].endingDate);
          if (endingDate.getTime() > now.getTime() && this.user.tasks[i].state === 'en progreso') {
            this.tasks.push(this.user.tasks[i]);
          }
          break;

        case 'state':
          if (this.user.tasks[i].state === this.filter) {
            this.tasks.push(this.user.tasks[i]);
          }
          break;

        case 'oldest-todo':


          let lastChange = new Date(this.user.tasks[i].lastChange);


          if (this.user.tasks[i].state === 'en progreso') {
            const duration = now.getTime() - lastChange.getTime();

            if (duration > longestDurationWithoutChange) {
              longestDurationWithoutChange = duration;
              oldestUnchangedTask = this.user.tasks[i];
            }
          }

          break;
      }
    }

    if (oldestUnchangedTask) {
      this.tasks.push(oldestUnchangedTask);
    }

    if (this.tasks.length === 0) {
      Toast.fire({
        icon: 'info',
        title: 'Sorry, we found nothing'
      });

    } else {
      Toast.fire({
        icon: 'success',
        title: 'Some tasks were found'
      });

      this.showSearchResults = true;
      this.stateSelector!.disabled = true;
    }



  };

  /**
   * @method onEndSearch:
   * This method is use it to end the current search, because the spa arquitecture of the app, there is not other way of showing the searched data
   * on the same table component. It was a solution in the pursuit of performance, a way to avoid this method is creating a new component to render only the 
   * searched data
   
   * @returns void
   */


  onEndSearch(): void {
    this.searchStr = '';
    this.filter = 'undefined';
    this.stateSelector!.writeValue('undefined');
    this.stateSelector!.disabled = false;
    this.showSearchResults = false;
  };

  // tasks operations realated methods

  /**
   * @method onAddTask:
   * This method activate when and output event is emitted from the child component, and it access the
   * addTask method of the userService to add the task to the task array of the user and update the value of the data observer
   
   * @returns void
   * @param {Task} response: its the returning data from the child component onAddTask method
   */

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

  /**
   * @method onAddTask:
   * This method activate when and output event is emitted from the child component, it update the user task array
   * with the returned response from the child component, and update de data observer
   
   * @returns void
   * @param {Task} response: its the returning data from the child component updateTask method
   */

  onUpdateTask(response: Task) {

    for (let i = 0; i < this.user.tasks.length; i++) {
      if (this.user.tasks[i]._id === response._id) {
        this.user.tasks.splice(i, 1, response);
      }
    }

    this.dataService.updateTasks(this.user.tasks);
    
  }


  /**
   * @method onAddTask:
   * This method activate when and output event is emitted from the child component, it delete the task from the user task array
   * in database, and update de data observer
   
   * @returns void
   * @param {Task} response: its the returning data from the child component updateTask method
   */

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
