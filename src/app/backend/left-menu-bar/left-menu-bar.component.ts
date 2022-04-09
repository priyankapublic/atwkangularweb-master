import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component,OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { ThemeService } from 'src/app/shared/theme.service';
import { OpenCloseMenubarService } from 'src/app/shared/open-close-menubar.service';
import { OpenCloseSidebarService } from 'src/app/shared/open-close-sidebar.service';
import { MenuDataToRightPanService } from 'src/app/shared/menu-data-to-right-pan.service';
import { SwitchModuleTypeService } from 'src/app/shared/switch-module-type.service';
import { ScholarUserSwitchService } from 'src/app/shared/scholar-user-switch.service';
import { BackendService } from 'src/app/shared/backend.service';
import { ProfileRefreshService } from 'src/app/shared/profile-refresh.service';

@Component({
  selector: 'app-left-menu-bar',
  templateUrl: './left-menu-bar.component.html',
  styleUrls: ['./left-menu-bar.component.scss']
})
export class LeftMenuBarComponent implements OnInit {
  msgCount:number;
  color = '';
  theme: boolean;
  mobileQuery: MediaQueryList;
  openedLeft: boolean = true;
  openedRight: boolean = false
  user: {name:'',image:{darkImage:'',lightImage:'',darkImageErr:'',lightImageErr:''}};
  dataArray= { tag: '',title:'' };
  dataArraySecond= { tag: '',title:'',chatOn:true };
  showMenuVar: Boolean = false;
  private _mobileQueryListener: () => void;
  role: string;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private as: AuthService,
    private bs: BackendService,
    private ts: ThemeService,
    private profileRefreshService:ProfileRefreshService,
    private openCloseMenubarService: OpenCloseMenubarService,
    private openCloseSidebarService: OpenCloseSidebarService,
    private menuDataToRightPanService: MenuDataToRightPanService,
    private switchModuleTypeService: SwitchModuleTypeService,
    private scholarUserSwitchService:ScholarUserSwitchService,

  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit() {
    this.role = this.as.getLocalStorage().role;
    this.theme = this.ts.theme();
    this.changeTheme();
    this.user = this.as.getLocalStorage();
    this.getUserNotificationCount(this.as.getLocalStorage().email);
    this.refressProfile();
  }
  refressProfile(){
    this.profileRefreshService.ProfileRefreshService$.subscribe(
      data=>{
        this.user = this.as.getLocalStorage();
      }
    )
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  changeTheme() {
    this.ts.changeTheme$.subscribe(
      data => {
        this.theme = data;
       
        if (this.theme == true) { this.color = 'primary'; } else { this.color = ''; }
      }
    );
  }

  about() {
   let data = this.goTo('app-about','About');
    this.sendDataToRightPan(data);
    this.openRightSideNav();
    this.closeMenu();
  }
  notification() {
    let data = this.goTo('app-notifications','Notifications');
    this.sendDataToRightPan(data);
    this.openRightSideNav();
    this.closeMenu();
    this.msgCount=0;
   }
   setting(){
    let data = this.goTo('app-setting','Setings');
    this.sendDataToRightPan(data);
    this.openRightSideNav();
    this.closeMenu();
   }
  feedback() {
    let data = this.goTo('app-feedback','Feedback');   
    this.sendDataToRightPan(data);
    this.openRightSideNav();
    this.closeMenu();
   }
  termOfUsage() {
    let data = this.goTo('app-terms-of-usage','Terms of usage');   
    this.sendDataToRightPan(data);
    this.openRightSideNav();
    this.closeMenu();
   }
  donateNow() {
    let data = this.goTo('app-donate-now','Donate Now');   
    this.sendDataToRightPan(data);
    this.openRightSideNav();
    this.closeMenu();
   }
  howToUse() {
    let data = this.goTo('app-how-to-use','How to Use');
    this.sendDataToRightPan(data);
    this.openRightSideNav();
    this.closeMenu();
  }

   profile() {
    let data = this.goTo('app-profile','Profile');   
    this.sendDataToRightPan(data);
    this.openRightSideNav();
    this.closeMenu();
   }
  home() {
    let data;
    if(this.role=='USER' || this.role=='ALIM'){
      data = this.goToSecond('app-user-dashboard','Dashboard',true); 
    }else if(this.role=='MODERATOR'){
      localStorage.setItem('prfileHostoryTag','home') 
      data = this.goToSecond('app-moderator-dashboard','Dashboard',true);   
    }   
    this.closeMenu(); 
    this.switchMsgQna(data);   
  }
 bulkMessages() {
    let data = this.goToSecond('app-bulk-messages','Bulk Message',false); 
    this.sendDataToRightPan(data);
    this.openRightSideNav();
    this.closeMenu();
  }
  addScholer(){
    let data = this.goToSecond('app-add-scholar','Add Scholar',true); 
    this.sendDataToRightPan(data);
    this.openRightSideNav();
    this.closeMenu();
  }
  publicqna() {  
    localStorage.setItem('prfileHostoryTag','app-qna')  
    let data = this.goToSecond('app-qna','Public QNA',false); 
    // this.scholarUserSwitchService.scholarUserSwitchFun({name:'Public QNA',userType:'Alims'})
    this.switchMsgQna(data); 
    this.closeMenu();
  }
  pendingQueries() {
    localStorage.setItem('prfileHostoryTag','app-pending-queries') 
    let data = this.goToSecond('app-pending-queries','Pending Queries',true); 
    // this.scholarUserSwitchService.scholarUserSwitchFun({name:'Pending Queries',userType:'Alims'})
    this.switchMsgQna(data); 
    this.closeMenu();
   }
  scholar() {
    localStorage.setItem('prfileHostoryTag','app-scholars')  
    let data = this.goToSecond('app-scholars','Scholars',true); 
    setTimeout(() => {
      this.scholarUserSwitchService.scholarUserSwitchFun({name:'Scholars',userType:'Alims'})
    }, 100);  
    this.switchMsgQna(data); 
    this.closeMenu();
   }

  users() {
    localStorage.setItem('prfileHostoryTag','app-scholars')  
    let data = this.goToSecond('app-scholars','Users',true); 
    setTimeout(() => {
      this.scholarUserSwitchService.scholarUserSwitchFun({name:'Users',userType:'Users'})
    }, 100);    
    this.switchMsgQna(data); 
    this.closeMenu();
  }
  openRightSideNav() {
    var data = { left: !this.mobileQuery.matches, right: true }
    this.openCloseSidebarService.openCloseSideNav(data);   
  }
  switchMsgQna(data:any) {
    this.switchModuleTypeService.switchModuleTypeFun(data);
  }
  closeMenu() {
    this.openCloseMenubarService.openCloseMenuBar(false);
    localStorage.setItem('menuOpened', 'true');
  }
  sendDataToRightPan(data: any) {
    this.menuDataToRightPanService.rightPanData(data);
  }
  goTo(tag:string,title:string){
    this.dataArray.tag=tag;
    this.dataArray.title=title;
    return this.dataArray;
  }
  goToSecond(tag:string,title:string,chatOn:boolean){
    this.dataArray.tag=tag;
    this.dataArray.title=title;
    // =====
    this.dataArraySecond.tag=tag;
    this.dataArraySecond.title=title;
    this.dataArraySecond.chatOn=chatOn;
    return this.dataArraySecond;
  }
  closeMenuBar(){
    this.closeMenu();
  }
  getUserNotificationCount(email){
    this.bs.getUserNotificationCount(email).subscribe(
      data =>{this.msgCount=data[1].substring(15);}
    )
   }
}
