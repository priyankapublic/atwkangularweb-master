import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ThemeService  {
 dark:boolean=false;
 _changeTheme = new Subject<boolean>();
 changeTheme$ = this._changeTheme.asObservable();

  constructor() { 
    var x =  localStorage.getItem('dark');
  }
  theme(){
  var x =  localStorage.getItem('dark');
  if(x == 'true'){ return true; }else{ return this.dark;}    
  }
  changeTheme(theme){
    localStorage.setItem('dark', theme);
     this.themeService(theme);
  }
  themeService(theme:boolean){
    this._changeTheme.next(theme);
  }
}
