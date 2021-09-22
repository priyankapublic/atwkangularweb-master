import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { ThemeService } from '../../shared/theme.service';
import { AuthService } from 'src/app/shared/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import Swal from 'sweetalert2'
import { BackendService } from 'src/app/shared/backend.service';
import { OtherService } from 'src/app/shared/other.service';

import { Profile } from 'src/app/model/Peofile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  editProfile:boolean=true;
  theme:boolean;
  mobileQuery: MediaQueryList;
  profile= new Profile;
  userId:string;
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher,
    private router:Router,
    private ts:ThemeService,
    private as:AuthService,
    private bs:BackendService,  
    private os:OtherService,  
    private db: AngularFireDatabase,
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(){
    this.changeTheme();
    this.theme=this.ts.theme();   
    // this.getprofile();
    this.getUseId();
    this.firebaseData()
  }
  viewImg(img:string){
    this.os.swallImage(img);
  }
  
  firebaseData(){
    this.db.object('atwk_user_info/'+this.userId).valueChanges().subscribe(
      (data:Profile)=>{
        this.profile=data;
        this.profile.image = this.bs.getuserimage(this.profile.ImageID, this.profile.UserType, this.profile.Gender);
      },
      err=>{console.log(err)},
    )
  }

  // prepareFirbase(x){
  //   let temp =[];
  //   x.forEach(e => {    
  //      let y = e.payload.val();
  //     //  console.log(e.payload.val().key);
  //    temp.push(e.payload.val())
  //   }); 
  //    return temp.filter(x=>x.UserID==this.as.getLocalStorage().userId)[0]; 
  // }
  getUseId(){
    this.userId = this.as.getLocalStorage().userId;
  }
  getprofile(){                          
   this.profile= this.as.getLocalStorage();
  //  this.profile.online=true; 
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  changeTheme(){
    this.ts.changeTheme$.subscribe(
      data =>{this.theme=data; }
    );
  }
  deactivateAccount(){
    Swal.fire({
      title: 'Are you sure?', 
      imageUrl: 'assets/images/common/atwk.png',
      imageWidth: 120,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      allowOutsideClick: false,
      customClass: {
        popup: 'sky-blue-bg del-popup-size max-width',
        header: 'header-class',
        title: 'title-class',
        image: 'image-class',
        actions: 'actions-class-del',
        confirmButton: 'confirm-button-class',
        cancelButton: 'cancel-button-class',  
      },
    }).then((result) => {
      if (result.value) {     
      this.deactivate();
      }
    })  
  }
  deactivate(){
    console.log(this.userId)
    this.bs.deactivate(this.userId).subscribe(
      data => {
        if(data=='SUCCESS'){
          this.db.object('atwk_user_info/'+this.userId).remove();
          this.os.swall('success', 'Your have deactivated Your Account.')
          this.as.logout(true);
        }else{
          this.os.swall('error', 'Unable to Deactivate.');
        }    
        },
      err => console.log(err)
    )
  }
  logout(){ 
    this.os.logout();
  }
  
  getChangeTheme(){
    this.ts.changeTheme(this.theme);    
  }

}

