import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../shared/theme.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  theme:boolean;
  constructor(
    private router:Router,
    private ts:ThemeService,

    ) {

  }
  ngOnInit(){
    this.changeTheme();
    this.theme=this.ts.theme();
  }

  changeTheme(){
    this.ts.changeTheme$.subscribe(
      data =>{this.theme=data; }
    );
  }

}
