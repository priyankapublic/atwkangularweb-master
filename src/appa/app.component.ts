import { Component, OnInit } from '@angular/core';
import { ThemeService } from './shared/theme.service';
import { MessagingService } from './shared/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  theme: boolean;
  message;
  constructor( private ts: ThemeService,private messagingService: MessagingService){

  }
  ngOnInit(){

    if(!localStorage.getItem('interceptor')){
      localStorage.setItem('interceptor','ZG9udG1lc3N1'+ 'sfdhsjfdsjfhsdjfhsjfdh') ;
    }

    this.theme = this.ts.theme();
    this.changeTheme();
    this.messagingService.requestPermission()
    this.messagingService.receiveMessage()
    this.message = this.messagingService.currentMessage
  }
  changeTheme() {
    this.ts.changeTheme$.subscribe(
      data => {   this.theme = data;}
    );
  }

}


