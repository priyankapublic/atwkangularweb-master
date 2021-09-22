import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../../shared/theme.service';
import { BackendService} from '../../shared/backend.service';
import { AuthService} from '../../shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Userdetail } from "../../model/Userdetail";
import { CountryList } from "../../model/countrylist";
import { OtherService } from 'src/app/shared/other.service';
import { ProfileRefreshService } from 'src/app/shared/profile-refresh.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {
  countryList =CountryList;
  hideform:boolean=false;
  imgfile: File;
  url: any;
  imageChangedEvent: any = '';
  croppedImage: any = 'assets/images/common/profile.svg';
  blob: Blob;
  user :Userdetail;
  passError: boolean = false;
  constructor(
    private router:Router,
    private db: AngularFireDatabase,
    private ts:ThemeService,
    private bs:BackendService,
    private as:AuthService,
    private os:OtherService,
    private profileRefreshService:ProfileRefreshService,
    private spinner: NgxSpinnerService
    ) { }
 theme:boolean;
 color = 'accent';
 userId:number;
 ngOnInit() {

   this.theme = this.ts.theme();
   this.getUseDetail();
 }
 getUseDetail(){
   this.user = this.as.getLocalStorage();
   this.userId = this.user.userId;
 }
 changeThene(){
   this.ts.changeTheme(this.theme);
 }


 fileChangeEvent(event: any): void {
  this.imageChangedEvent = event;
}
imageCropped(event: ImageCroppedEvent) {
  this.croppedImage = event.base64;
  fetch(this.croppedImage)
    .then(res => res.blob())
    .then(data => this.blob = data)  
}

onSelectChange(event: any) {
  this.hideform=true;
  this.imageChangedEvent = event;
  this.imgfile = <File>event.target.files[0];
  this.url = this.croppedImage
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event) => {
      this.url = (<FileReader>event.target).result;
    }
  }
}
updateProfile(data: NgForm) {
  let tempData  = {  UserId : this.userId,Name:data.value.name,Location:data.value.location ,Nationality:data.value.nationality,
  Details:data.value.details,Language:data.value.language,Gender :this.user.gender,ContactNumber : this.user.contactNumber,SpecialisationIn :this.user.specialisationIn ,StudiesAt : this.user.studiesAt,UserLoginStatus:'ONLINE'};
  this.user.name = data.value.name;
  this.user.location = data.value.location;
  this.user.nationality = data.value.nationality;
  this.user.details = data.value.details;
  this.user.language =data.value.language;
  this.spinner.show();  
  this.bs.updateProfile(tempData).subscribe(
    data => {this.spinner.hide();
         if(data=='SUCCESS'){
          this.getDetails();
              this.as.setLocalStorage(this.user);  
              this.os.swall('success', 'updated Successfully')     ;
              this.profileRefreshService.profileRefreshService(true);
            }else{
              this.os.swall('error', 'Unable to update');
              }      
     
        },
    err => {   this.os.swall('error', 'somthing went wrong');} 
  )
}
cancel(){
 this.croppedImage = 'assets/images/common/profile.svg';
  this.hideform=false;
}
apply(){
  this.spinner.show();
  var i = this.croppedImage.indexOf(",")+1;
   let data = {UserID:this.userId,ImageFileName:new Date().getTime()+this.imgfile.name,ImageText:this.croppedImage.substring(i)}

    this.bs.updateProfileImage(data).subscribe(
    data => {
      if(data=='SUCCESS'){
      this.getDetails();
      this.os.swall('success', 'Profile Image Updated Successfully')
        this.spinner.hide();
      }
       },
    err => console.log(err)
  )
  this.hideform=false;
}
getDetails(){
  let userData = this.as.getLocalStorage();
  let userId = userData.userId;
  this.as.getDetails(userId).subscribe(
    data =>  {  if(data){      
       let time = new Date().toJSON();
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
        UserTimeZone : Intl.DateTimeFormat().resolvedOptions().timeZone,
        LastOnlineTime : time.slice(0,-5)+'Z' ,
        UserLoginStatus :'ONLINE'
      }

      this.db.object('atwk_user_info/'+data.UserModel.UserId).update(fbData)
      userData.image =  this.bs.getuserimage(data.ImageID,data.UserModel.UserType,data.Gender);  
      this.as.setLocalStorage(userData);
       this.profileRefreshService.profileRefreshService(true);
    }},
    error =>console.log(error)
  );
}
}
