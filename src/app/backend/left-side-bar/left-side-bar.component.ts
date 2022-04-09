import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { ThemeService } from '../../shared/theme.service';
import { OpenCloseMenubarService } from 'src/app/shared/open-close-menubar.service';
import { SwitchModuleTypeService } from 'src/app/shared/switch-module-type.service';
import { AuthService } from 'src/app/shared/auth.service';
import { OpenCloseSidebarService } from 'src/app/shared/open-close-sidebar.service';

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss']
})
export class LeftSideBarComponent implements OnInit {
  role:string;
  theme:boolean;
  mobileQuery: MediaQueryList;
  showMenuVar:Boolean = false;
  chatMode:Boolean = true;
  tag:string;
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher,
    private router:Router,
    private ts:ThemeService,
    private as: AuthService,
    private openCloseMenubarService :OpenCloseMenubarService,
    private openCloseSidebarService:OpenCloseSidebarService,
    // private switchChatQaService :SwitchChatQaService,
    private switchModuleTypeService: SwitchModuleTypeService,
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(){
    this.role = this.as.getLocalStorage().role;
    if(this.role=='USER' || this.role=='ALIM'){
      this.tag = 'app-user-dashboard';
    }else if(this.role=='MODERATOR'){
      this.tag = 'app-moderator-dashboard';
    }
    this.openCloseMenubar();
    this.changeTheme();
    this.theme=this.ts.theme();   
    this.switchMsgQna();

  }

  switchMsgQna(){
    this.switchModuleTypeService.switchModuleTypeService$.subscribe(
      data => this.tag = data.tag
    )
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  openCloseMenubar(){
    this.openCloseMenubarService.menuBar$.subscribe(
      data => this.showMenuVar = data
    )
  }   
  changeTheme(){
    this.ts.changeTheme$.subscribe(
      data =>{this.theme=data; }
    );
  }

  // switchChatQA(){
  //    this.switchChatQaService.switchChatQA$.subscribe(
  //      data => this.chatMode = data
  //    )
  // }
  closeBackdrop(){
    localStorage.setItem('menuOpened', 'true');
  }
}
