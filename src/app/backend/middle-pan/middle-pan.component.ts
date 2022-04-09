import { Component, OnInit } from '@angular/core';
import {SwitchModuleTypeService } from 'src/app/shared/switch-module-type.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-middle-pan',
  templateUrl: './middle-pan.component.html',
  styleUrls: ['./middle-pan.component.scss']
})
export class MiddlePanComponent implements OnInit {
  tag:string ;
  role:string;
  constructor(
    private switchModuleTypeService: SwitchModuleTypeService,
    private as: AuthService,
  ) { }

  ngOnInit() {
    this.role = this.as.getLocalStorage().role;
    if(this.role=='USER' || this.role=='ALIM'){
      this.tag = 'app-user-dashboard';
    }else if(this.role=='MODERATOR'){
      this.tag = 'app-moderator-dashboard';
    }
    this.switchMsgQna();
  }
  switchMsgQna(){
    this.switchModuleTypeService.switchModuleTypeService$.subscribe(
      data => this.tag = data.tag
    )
  }
}
