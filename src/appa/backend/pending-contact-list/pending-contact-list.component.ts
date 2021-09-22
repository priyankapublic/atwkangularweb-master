import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { BackendService } from '../../shared/backend.service';
import { ThemeService } from '../../shared/theme.service';
import { map } from 'rxjs/operators';
import { AuthService } from '../../shared/auth.service';
import { SendSchCurrentUserDetailService } from '../../shared/send-sch-current-user-detail.service';
import { OpenCloseMenubarService } from '../../shared/open-close-menubar.service';
import { OpenCloseSidebarService } from '../../shared/open-close-sidebar.service';
import { NgxSpinnerService } from "ngx-spinner";
import { OtherService } from 'src/app/shared/other.service';
import { Pendingqueries } from 'src/app/model/Pendingqueries';
import { MenuDataToRightPanService } from 'src/app/shared/menu-data-to-right-pan.service';
import { UserProfileService } from 'src/app/shared/user-profile.service';
import { ReloadService } from 'src/app/shared/reload.service';

@Component({
  selector: 'app-pending-contact-list',
  templateUrl: './pending-contact-list.component.html',
  styleUrls: ['./pending-contact-list.component.scss']
})
export class PendingContactListComponent implements OnInit {
  color = 'accent';
  loginUser;
  dataArray= { tag: '',title:''};
  theme:boolean;
  mobileQuery: MediaQueryList;
  searchKey: any;
  showMenuVar:Boolean = false;
  chatMode:Boolean = true;
  pendingqueries:Pendingqueries[];
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher,
    private router:Router,
    private as:AuthService,
    private bs:BackendService,
    private ts:ThemeService,
    private os:OtherService,
    private reloadService:ReloadService,
    private sscus: SendSchCurrentUserDetailService,
    private openCloseSidebarService :OpenCloseSidebarService,
    private openCloseMenubarService :OpenCloseMenubarService,
    private menuDataToRightPanService:MenuDataToRightPanService,
    private userProfileService: UserProfileService,
    private spinner: NgxSpinnerService
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(){
    this.loginUser = this.as.getLocalStorage();
     this.changeTheme();
    this.contactList()
    this.theme=this.ts.theme();
    this.openCloseMenubar();
    this. refresscontactList();
  }
  viewImg(img:string){
    this.os.swallImage(img)
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  openCloseMenubar(){
    this.openCloseMenubarService.menuBar$.subscribe(
      data => this.showMenuVar = data
    )
  }
  refressUser(){
    this.contactList()
  }
  refresscontactList(){
    this.reloadService.ReloadService$.subscribe(
      data => {if(data==true){this.contactList()}}
    )
    }
  contactList(){    
    this.spinner.show();
    // .pipe(map(x=>this.prepareContact(x)))
    this.bs.getPendingQueryAlimsWithCount().pipe(map(x=>this.prepareContact(x))).subscribe(
      data => {  this.spinner.hide(); 
            this.pendingqueries =data;
          if(!this.mobileQuery.matches){  
            // this.currentUser(0)  
           }
       } ,
      error => console.log(error)        
    );
  }
  prepareContact(data){  
     for(let key in data){  
      data[key].image =  this.bs.getuserimage(data[key].ScholarsImageID,'MODERATOR','Male');
      data[key].UnreadMessageCount = parseInt(data[key].UnreadMessageCount);
    }
    return data.sort((a, b) => a.UnreadMessageCount > b.UnreadMessageCount ? -1 : a.UnreadMessageCount < b.UnreadMessageCount ? 1 : 0); 
  }
   
  changeTheme(){
    this.ts.changeTheme$.subscribe( 
      data =>{this.theme=data; }
    );
  }

  currentUser(i:number){      
    let user =this.pendingqueries[i];
    localStorage.setItem('currentUser',JSON.stringify(user));
    this.closeLeftSideNav()  
    // this.sscus.sendCurrentUserDetail(user);
    this.userProfileService.sendUserProfile(user)
    let data = this.goTo('app-pending-queries','Scholar');   
    this.sendDataToRightPan(data);  
  }
  closeLeftSideNav(){    
    var data = {left:!this.mobileQuery.matches,right:true}
    this.openCloseSidebarService.openCloseSideNav(data);
   }
   sendDataToRightPan(data: any) {
    this.menuDataToRightPanService.rightPanData(data);
  }
  goTo(tag:string,title:string){  
    this.dataArray.tag=tag;
    this.dataArray.title=title;
    return this.dataArray;
  }

}
