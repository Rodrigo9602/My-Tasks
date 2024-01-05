import { Component, OnDestroy } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { faLock, faEnvelope, faEye, faUser, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import { Toast } from '../../../global/toast.global';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HttpClientModule, FontAwesomeModule, FormsModule, RouterModule],
  providers: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnDestroy {
  public nameIcon = faUser;
  public emailIcon = faEnvelope;
  public passIcon = faLock;
  public showIcon = faEye;
  public showConfIcon = faEye;

  public name:string = '';
  public email:string = '';
  public password:string = '';
  public passwordConfirmation:string = '';

  public showPassword:boolean =false;
  public showPasswordConfirmation:boolean =false;

  private suscription:Subscription | undefined;
  
  constructor(private _userService:UserService, private _router:Router){}

/**
  * @method OnSubmit:
  * This method access the register method of the user service, inorder to perform a register,
  * In case of succefull register it shows an alert and redirect to login page,
  * in case of error on the request it shows an alert with the corresponding error 

  * @returns void  
  */ 

  onSubmit() {
    this.suscription = this._userService.register(this.name, this.email, this.password ).subscribe({
      next: res => {
        Toast.fire({
          icon: 'success',
          title: 'Account registered!',
          text: 'Please login now',
          timer: 2000
        });
        this._router.navigate(['/']);
      },
      error: e => {
        console.log(e);
        Toast.fire({
          icon: 'error',
          title: e.error.message
        });
      }
    });
  }


  /**
  * @method OnShowPassword:
  * This method enables the display of the password and modifies the display icon rendered in the input
  * @returns void  
  */ 
  onShowPassword(type: string) {
    if(type === 'password') {
      this.showPassword = !this.showPassword;
      this.showPassword ? this.showIcon = faEyeSlash : this.showIcon = faEye;
    } else {
      this.showPasswordConfirmation = !this.showPasswordConfirmation;
      this.showPasswordConfirmation ? this.showConfIcon = faEyeSlash : this.showConfIcon = faEye;
    }   
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
