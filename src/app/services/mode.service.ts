import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ModeConfigService {
  private _modoSubject = new BehaviorSubject<boolean>(true);
  modo$ = this._modoSubject.asObservable();

  changeMode(mode:boolean) {
    this._modoSubject.next(mode);  
    mode ? localStorage.setItem('theme', 'light') : localStorage.setItem('theme', 'dark');
    document.getElementsByTagName("HTML")[0].setAttribute("data-theme", localStorage.getItem('theme')!);  
  }
  constructor() { }
}

