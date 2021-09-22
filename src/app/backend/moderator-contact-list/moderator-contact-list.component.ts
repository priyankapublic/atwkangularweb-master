import { Component, OnInit, ChangeDetectorRef ,ChangeDetectionStrategy} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { BackendService } from '../../shared/backend.service';
import { ThemeService } from '../../shared/theme.service';
import { AuthService } from 'src/app/shared/auth.service';
import { SendModeratorCurrentUserDetailService} from 'src/app/shared/send-moderator-current-user-detail.service';
import { OpenCloseSidebarService } from 'src/app/shared/open-close-sidebar.service';
import { NgxSpinnerService } from "ngx-spinner";
import { map } from 'rxjs/operators';
import { Currentuser } from 'src/app/model/Currentuser';
import { Modconversations } from 'src/app/model/Modconversations';
import { ReloadService } from 'src/app/shared/reload.service';
import { OtherService } from 'src/app/shared/other.service';
import { MsgcountReloadService } from 'src/app/shared/msgcount-reload.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { of } from 'rxjs';

@Component({
  selector: 'app-moderator-contact-list',
  templateUrl: './moderator-contact-list.component.html',
  styleUrls: ['./moderator-contact-list.component.scss']
})
export class ModeratorContactListComponent implements OnInit {

  color = 'accent';
  searchKey:string;
  conversations:Modconversations[];
  theme: boolean;
  mobileQuery: MediaQueryList;
  chatMode: Boolean = true;
  private _mobileQueryListener: () => void;
  userList: Currentuser[];
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private as: AuthService,
    private bs: BackendService,
    private ts: ThemeService,
    private os:OtherService,
    private smcus: SendModeratorCurrentUserDetailService,
    private openCloseSidebarService: OpenCloseSidebarService,
    private reloadService:ReloadService,
    private msgcountReloadService:MsgcountReloadService,
    private db: AngularFireDatabase,
    private spinner: NgxSpinnerService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit() {
    localStorage.setItem('prfileHostoryTag','home') ;
    // this.spinner.show();
    this.changeTheme();
    // this.contactList(true);
    this.refresscontactList();
    this.theme = this.ts.theme();
    this.firebaseData();
  }
  viewImg(img:string){
    this.os.swallImage(img)
  }
  firebaseData(){
    this.db.object('atwk_moderator_review').valueChanges().pipe(map(x=>this.prepareFirbase(x))).subscribe(
      data=>{
        if(data.length>0){       
          this.contactListFirebase(data);   
          }else{
            this.userList=[];
            this.msgcountReloadService.mcReloadFun(0)
          }
      },
      err=>{console.log(err)},
    )
  }
  prepareFirbase(x){
    let temp =[];
     for(let key in x){
       temp.push(x[key])
     }
   return temp; 
  }
  refressUser(){
   
    this.firebaseData();
    // this.spinner.show();
    // this.contactList(true);  
   }
  refresscontactList() {
    this.reloadService.ReloadService$.subscribe(
      data => {
        if (data == true) {   
          if (localStorage.getItem('prfileHostoryTag') == 'home') {      
            this.firebaseData();
            // this.contactList(false)
          }
        }
      }
    )

  }
  contactListFirebase(tempData){  
    let obj = of(tempData.reverse())
    obj.pipe(map(x=>this.prepareContact(x))).subscribe(
      data => {  this.spinner.hide();this.userList = data;  this.msgcountReloadService.mcReloadFun(this.userList.length);
        if(!this.mobileQuery.matches){
          // if(chk){
            this.currentUser(0);
        //  }       
        }
       } ,
      error =>{ console.log(error); this.spinner.hide();}        
    );
  }

  // contactList(chk){    
  //   this.bs.getModiatorNotification().pipe(map(x=>this.prepareContact(x))).subscribe(
  //     data => {  this.spinner.hide();this.userList = data;  this.msgcountReloadService.mcReloadFun(this.userList.length);
  //       if(!this.mobileQuery.matches){
  //         // if(chk){
  //           this.currentUser(0);
  //       //  }       
  //       }
  //      } ,
  //     error =>{ console.log(error); this.spinner.hide();}        
  //   );
  // }
    prepareContact(data){   
       let temp = [];
      let temp2 = data;
      let image = '';
      for(let key in data){     
        if(this.as.getLocalStorage().email !==data[key].To.toLowerCase()){     
       let res =  this.os.getDuration(this.os.changeTimeZone(data[key].CreatedDate));  
       temp2[key].createdDate = this.os.changeTimeZone(data[key].CreatedDate);
       let  role = data[key].FromUserType;
       let lastMsg = '';
        if (data[key].IsVoice == 'Y') {
          lastMsg = 'Audio';
        } else {
          if (data[key].ContentType) {
            if (data[key].ContentType.startsWith("image/")) {
              lastMsg = 'Image';
            } else {
              lastMsg = 'Doc';
            }
          } else {
            lastMsg = data[key].Text;
          }
        } 
       let  image =  this.bs.getuserimage(data[key].FromImageID,role,'Not Avilable')
        temp.push({IsRead:data[key].IsRead, IsReplied:data[key].IsReplied,ayatollah:data[key].ayatollah,date:data[key].ToLastOnlineTime,fromName:data[key].FromName,toName:data[key].ToName,lastLogin:res.value+res.unit ,online:res.online,image:image,email:data[key].To,lastMessage:lastMsg,subject:data[key].Subject,role:role,messageId:data[key].MessageID})
      }
      }
      this.conversations=temp2; 
      return temp;
    }

  currentUser(i:number) {  
    this.closeLeftSideNav()
   if(this.conversations.length >0){
      this.smcus.sendCurrentUserDetail(this.conversations[i]);
   }   
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  changeTheme() {
    this.ts.changeTheme$.subscribe(
      data => { this.theme = data; }
    );
  }

  closeLeftSideNav() {    
    var data = { left: !this.mobileQuery.matches, right: false }
    this.openCloseSidebarService.openCloseSideNav(data);
  }
}