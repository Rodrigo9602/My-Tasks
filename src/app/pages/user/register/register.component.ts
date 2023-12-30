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

  onShowPassword(type: string) {
    if(type === 'password') {
      this.showPassword = !this.showPassword;
      this.showPassword ? this.showIcon = faEyeSlash : this.showIcon = faEye;
    } else {
      this.showPasswordConfirmation = !this.showPasswordConfirmation;
      this.showPasswordConfirmation ? this.showConfIcon = faEyeSlash : this.showConfIcon = faEye;
    }   
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe(); 
  }
}
