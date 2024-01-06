import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../../services/session.service';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { faLock, faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Toast } from '../../../global/toast.global';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FontAwesomeModule, FormsModule, RouterModule],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {

  public emailIcon = faEnvelope;
  public passIcon = faLock;
  public showIcon = faEye;

  public email: string = '';
  public password: string = '';

  public showPassword: boolean = false;
  private suscription: Subscription | undefined;


  constructor(private _sessionService: SessionService, private _router: Router) { }


  /**
  * @method OnInit:
  * This method clear the local storage in case that the user access this component manually
  
  * @returns void  
  */

  ngOnInit(): void {
    // clear localstorage
    localStorage.clear();
  }

  /**
  * @method OnSubmit:
  * This method first validates that the entries are correct,
  * if they are not, it shows different alerts accordingly;
  * If they are valid, access the login method of the authentication service.
  * If authentication is performed, a session is established using the setSesion method of the Session service and
  * is subsequently redirected to the home route of the application.

  * @returns void  
  */ 

  onSubmit() {
    // check if the input data is valid
    const emailRegex = new RegExp(/^([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})$/);
    const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/);


    if (!emailRegex.test(this.email) && !passwordRegex.test(this.password)) {
      Toast.fire({
        icon: 'error',
        title: 'Email and password are invalid',
        text: 'Password must have at least: 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
        timer: 3000,
      });
    } else if (!passwordRegex.test(this.password)) {
      Toast.fire({
        icon: 'error',
        title: 'Invalid password',
        text: 'Password must have at least: 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
        timer: 3000,
      });
    } else if (!emailRegex.test(this.email)) {
      Toast.fire({
        icon: 'error',
        title: 'Invalid email',
      });
    } else {

      this.suscription = this._sessionService.login(this.email, this.password).subscribe({
        next: res => {
          if (res.status === 401) {
            Toast.fire({
              icon: 'error',
              title: res.options.message
            });
          } else {
            this._sessionService.setSession(res.id, res.access_token);
            // show welcome alert
            Toast.fire({
              icon: 'success',
              title: 'Welcome back!'
            });
            // redirect to home page
            this._router.navigate(['/home']);
          }
        },
      });
    }

  }


  /**
  * @method OnShowPassword:
  * This method enables the display of the password and modifies the display icon rendered in the input
  
  * @returns void  
  */ 


  onShowPassword() {
    this.showPassword = !this.showPassword;
    this.showPassword ? this.showIcon = faEyeSlash : this.showIcon = faEye;
  }

  /**
  * @method OnDestroy:
  * This method unsuscribe all observers
  
  * @returns void  
  */

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }
}