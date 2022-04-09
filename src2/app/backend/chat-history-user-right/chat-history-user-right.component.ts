import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { ThemeService } from '../../shared/theme.service';
import { BackendService } from 'src/app/shared/backend.service';
import { UserProfileService } from 'src/app/shared/user-profile.service';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/auth.service';
import { Conversations } from 'src/app/model/conversations';
import { ScholarMessageHistoryService } from 'src/app/shared/scholar-message-history.service';
import { OpenCloseSidebarService } from 'src/app/shared/open-close-sidebar.service';
import { Pendingqueries } from 'src/app/model/Pendingqueries';
import { OtherService } from 'src/app/shared/other.service';
@Component({
  selector: 'app-chat-history-user-right',
  templateUrl: './chat-history-user-right.component.html',
  styleUrls: ['./chat-history-user-right.component.scss']
})
export class ChatHistoryUserRightComponent implements OnInit {
  conversations:Conversations[];
  history:boolean=false;
  profile:Pendingqueries;
  editProfile:boolean=true;
  theme:boolean;
  mobileQuery: MediaQueryList;
  userId:string;
  email:string;
  myEmail:string;
  userdetail:{Location:'',Nationality:'',Language:'',SpecialisationIn:'',StudiesAt:'',Details:'',};
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher,
    private router:Router,
    private ts:ThemeService,
    private bs:BackendService,  
    private userProfileService: UserProfileService,
    private scholarMessageHistoryService:ScholarMessageHistoryService,
    private as:AuthService,
    private os:OtherService,
    private openCloseSidebarService:OpenCloseSidebarService,
    
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(){
    this.myEmail=this.as.getLocalStorage().email;
    this.changeTheme();
    this.theme=this.ts.theme();  
    this.getprofile();
    this.profile =JSON.parse(localStorage.getItem('currentUser'));
    this.getprofileData(this.profile.ScholarsUserName);  

  }
  viewImg(img:string){
    this.os.swallImage(img)
  } 
  getprofile(){    
    this.userProfileService.userProfile$.subscribe(
      data=>{ this.profile=data; },
      err=>console.log(err)
      );    
  }
  getprofileData(email:string){
  this.bs.getDetailsByEmail(email).subscribe(
    data => {this.userdetail=data; this.getMsgHihtory();},
    err=>console.log(err)
  )
  
  }
  getMsgHihtory(){    
    this.bs.conversations(this.profile.ScholarsUserName,this.profile.UsersUserName).pipe(map(x=>this.prepareMessage(x))).subscribe(
      data =>{ this.conversations=data; },
      err=>console.log(err)
    )
  }
  prepareMessage(array){
    var flags = [], output = [];
    for(let i in array) {
        if( flags[array[i].Subject.toLowerCase().trim()]) continue;
        flags[array[i].Subject.toLowerCase().trim()] = true;
        output.push(array[i]);
    }
    return output;    
  }

  
  getConversation(Subject:string,From:string){
    let data = {subject:Subject,from:From};
    this.scholarMessageHistoryService.messageHistoryFun(data);
    this.closeRightSideNav();
  }
  closeRightSideNav(){    
    var data = {left:!this.mobileQuery.matches,right:false}
    this.openCloseSidebarService.openCloseSideNav(data);
   }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  changeTheme(){
    this.ts.changeTheme$.subscribe(
      data =>{this.theme=data; }
    );
  }

  
  getChangeTheme(){
    this.ts.changeTheme(this.theme);    
  }

  showHistory(){
    this.history=true;
  }
  showProfile(){
    this.history=false;
  }
}
