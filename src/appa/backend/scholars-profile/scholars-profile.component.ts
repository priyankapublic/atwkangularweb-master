import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { ThemeService } from '../../shared/theme.service';
import { BackendService } from 'src/app/shared/backend.service';
import { UserProfileService } from 'src/app/shared/user-profile.service';
import { Currentuser } from 'src/app/model/Currentuser';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/auth.service';
import { Conversations } from 'src/app/model/conversations';
import { ScholarMessageHistoryService } from 'src/app/shared/scholar-message-history.service';
import { OpenCloseSidebarService } from 'src/app/shared/open-close-sidebar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { OtherService } from 'src/app/shared/other.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Profile } from 'src/app/model/Peofile';
import { Timezonelist } from 'src/app/model/timezonelist';

@Component({
  selector: 'app-scholars-profile',
  templateUrl: './scholars-profile.component.html',
  styleUrls: ['./scholars-profile.component.scss']
})
export class ScholarsProfileComponent implements OnInit {
  conversations:Conversations[];
  subject:string;
  ayotolah:string;
  history:boolean=false;
  // profile:Currentuser;
  profile= new Profile;
  editProfile:boolean=true;
  theme:boolean;
  mobileQuery: MediaQueryList;
  desktopQuery: MediaQueryList;
  userId:string;
  userEmail:string;
  otherEmail:string;
  email:string;
  myEmail:string;
  role:string;
  userdetail:{Location:'',Nationality:'',Language:'',SpecialisationIn:'',StudiesAt:'',Details:'',UserModel:{UserLoginStatus:''} };
  private _mobileQueryListener: () => void;
  timezoneList=Timezonelist
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
    private db: AngularFireDatabase,
    private spinner: NgxSpinnerService
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.desktopQuery = media.matchMedia('(min-width:1025px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.desktopQuery.addListener(this._mobileQueryListener);

  }
  ngOnInit(){
    this.role=this.as.getLocalStorage().role;
    this.myEmail=this.as.getLocalStorage().email;
    this.changeTheme();
    this.theme=this.ts.theme();  
    this.getprofile();
    this.userId =JSON.parse(localStorage.getItem('currentUser')).userId;
    this.userEmail =JSON.parse(localStorage.getItem('currentUser')).email;
    this.otherEmail=JSON.parse(localStorage.getItem('currentUser')).userEmail
    this.history = JSON.parse(localStorage.getItem('currentUser')).showHistory;

      if(this.showHistory){
        // this.getMsgHihtory();
      }
    // this.getprofileData(this.profile.email); 
    this.firebaseData();
  }
  firebaseData(){  
    this.db.object('atwk_user_info/'+this.userId).valueChanges().subscribe(
      (data:Profile)=>{
        if(data){ 
        this.profile=data;
        this.profile.UserLoginStatus = this.profile.UserLoginStatus.charAt(0).toUpperCase()+this.profile.UserLoginStatus.toLowerCase().slice(1);
        this.profile.image = this.bs.getuserimage(this.profile.ImageID, this.profile.UserType, this.profile.Gender);
        let res = this.os.getDuration(data.LastOnlineTime);  
        if(!res.online){
         if( this.profile.UserLoginStatus=='Online'){
          this.profile.UserLoginStatus='Away';
          }else if( this.profile.UserLoginStatus=='Away'){
            // this.profile.UserLoginStatus='Offline';
          }
        }  

        if(res.value>0){    
          this.profile.Duration=res.value+res.unit;   
        }else{
          this.profile.Duration='now' 
        }          
        this.profile.LocalOffset= this.timezoneList.filter(x=>x.timezone==this.profile.UserTimeZone)[0].offset ;
        this.profile.LocalTime =new Date((new Date().getTime() + new Date().getTimezoneOffset()*60*1000 )+this.profile.LocalOffset*60*1000);
        }else{
        this.getprofileData(this.userEmail)
      }
    
      },
      err=>{console.log(err)},
    )
  }
  viewImg(img:string){
    this.os.swallImage(img);
  }
 
  getprofile(){    
    this.userProfileService.userProfile$.subscribe(
      data=>{ 
 
        delete(this.conversations);
        this.profile=data.details;
        this.history=data.history;
        this.userId=data.details.userId
        this.userEmail=data.details.email
        this.otherEmail=data.details.userEmail
        this.firebaseData();
        //  if(this.userEmail!='')
        //  {this.getprofileData(this.userEmail)}  ; 

        if(this.history){
          this.getMsgHihtory();
        }
       },
      err=>console.log(err)
      );    
  }
  getprofileData(email:string){
    this.bs.getDetailsByEmail(email).subscribe(
    data => {
      let status=data.UserModel.UserLoginStatus;
      let time = new Date(new Date(data.LastOnlineTime).getTime()-19800000).toJSON()
      if(!status){status='OFFLINE'}
      this.userdetail=data;
      let fbData = {
        UserID : data.UserModel.UserId ,
        UserType : data.UserModel.UserType,
        UserName : data.UserModel.UserName ,
        Name : data.Name,
        Gender : data.Gender,
        Nationality : data.Nationality,
        Language : data.Language,
        Details : data.Details,
        StudiesAt : data.StudiesAt,
        SpecialisationIn : data.SpecialisationIn,
        Location : data.Location,
        ImageID : data.ImageID,
        UserTimeZone : '',
        LastOnlineTime : time.slice(0,-5)+'Z',
        UserLoginStatus :status
      }

      this.db.object('atwk_user_info/'+data.UserModel.UserId).update(fbData)    
    
     },
    err=>console.log(err)
  )
  
  }

  // =============== msg history ====================
  getMsgHihtory(){    
    let data ;
    if(this.role=='USER'){
      this.spinner.show();  
      this.bs.conversations(this.myEmail,this.userEmail).pipe(map(x=>this.prepareMessage(x))).subscribe(
        data =>{ this.conversations=data;  this.spinner.hide();}, 
        err=>{console.log(err); this.spinner.hide();}
      )
    }else{
      this.spinner.show();  
      let tagselector=localStorage.getItem('prfileHostoryTag');
      if(tagselector=='app-chat-history-user'){
        this.bs.conversations(this.otherEmail,this.userEmail).pipe(map(x=>this.prepareMessage(x))).subscribe(
          data =>{     
            this.conversations=data;            
             this.spinner.hide();},
             err=>{console.log(err); this.spinner.hide();}
        )
      } else if(tagselector=='app-scholars'){
        this.spinner.show();  
        this.bs.conversations(this.myEmail,this.userEmail).pipe(map(x=>this.prepareMessage(x))).subscribe(
          data =>{ this.conversations=data; this.spinner.hide();},
          err=>{console.log(err); this.spinner.hide();}
        )
      } 

    }

  }



  prepareMessage(array){    
    var flags = [], output = [];
    for(let i in array) {
        if( flags[array[i].Subject.toLowerCase().trim()]) continue;
        flags[array[i].Subject.toLowerCase().trim()] = true;
        let x= array.filter(x=>x.Subject.toLowerCase().trim()==array[i].Subject.toLowerCase().trim())
        array[i].CreatedDate=x[x.length-1].CreatedDate;
        output.push(array[i]);
    }
    return output.sort((a, b) => new Date(a.CreatedDate).getTime() > new Date(b.CreatedDate).getTime() ? -1 : new Date(a.CreatedDate).getTime() < new Date(b.CreatedDate).getTime() ? 1 : 0);     
  
  }

  
  getConversation(Subject:string,From:string){
    let data = {subject:Subject,from:From};
    this.scholarMessageHistoryService.messageHistoryFun(data);
    this.closeRightSideNav();
  }

// ================================

  closeRightSideNav(){    
    var data = {left:!this.mobileQuery.matches,right:this.desktopQuery.matches}
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
    if(!this.conversations){
      this.getMsgHihtory();
    }

  }
  showProfile(){
    this.history=false;
  }
}

