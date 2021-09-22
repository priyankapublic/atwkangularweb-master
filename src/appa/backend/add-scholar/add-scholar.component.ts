import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgxSpinnerService } from "ngx-spinner";
import { CountryList } from '../../model/countrylist';
import { AuthService } from '../../shared/auth.service';
import { ThemeService } from '../../shared/theme.service';
import { OtherService } from '../../shared/other.service';
import { BackendService } from 'src/app/shared/backend.service';

@Component({
  selector: 'app-add-scholar',
  templateUrl: './add-scholar.component.html',
  styleUrls: ['./add-scholar.component.scss']
})
export class AddScholarComponent implements OnInit {
  frm = { name: "",email: "",nationality: "",location: "",language: "",specialisationIn: "",studiesAt: "",password: "",cpassword: "" }
  email_detail:string
  imageSelected:boolean=false;
  hideform:boolean=false;
  countryList =CountryList;
  imgfile: File;
  url: any;
  imageChangedEvent: any = '';
  croppedImage: any = 'assets/images/common/profile.svg';
  blob: Blob;
  title: String = 'Registeation';
  passError: boolean = false;
  constructor(
    private router: Router,
     private as: AuthService,
     private bs: BackendService,      
       private ts: ThemeService,
       private os:OtherService,
       private spinner: NgxSpinnerService
       ) { }
  theme: boolean;
  color = 'accent';

  ngOnInit() {
    localStorage.setItem('interceptor','ZG9udG1lc3N1'+ 'sfdhsjfdsjfhsdjfhsjfdh') ;
    this.theme = this.ts.theme();
    this.address();
  }
  address(){
    this.as.address().subscribe(
      data=>{this.frm.nationality=data.country;this.frm.location=data.city},
      err=>console.log(err)
    )
  }
  changeThene() {
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
  register(data: NgForm) {    
    this.spinner.show(); 
    let userModel ={UserId:'',UserName:data.value.email, UserPassword:data.value.password,UserType:"ALIM",CreatorUserId : ""};
    let tempData;
    if(this.imageSelected){
      var i = this.croppedImage.indexOf(",")+1;
      tempData  = { UserModel : userModel, Name :data.value.name ,Location : data.value.location,Nationality : this.countryList.filter(x=>x.code==this.frm.nationality)[0].name, ContactNumber :"" , Language :data.value.language, SpecialisationIn : data.value.specialisationIn, StudiesAt :data.value.studiesAt , ImageText : this.croppedImage.substring(i),ImageFileName :new Date().getTime()+this.imgfile.name  }
    
    }else{
     tempData  = { UserModel : userModel, Name :data.value.name ,Location : data.value.location,Nationality : this.countryList.filter(x=>x.code==this.frm.nationality)[0].name, ContactNumber :"" , Language :data.value.language, SpecialisationIn : data.value.specialisationIn, StudiesAt :data.value.studiesAt , ImageText : '',ImageFileName :''  }
   
    }

    this.bs.addScholar(tempData).subscribe(
      data => {
        if(data=='SUCCESS'){
          this.spinner.hide();
          this.os.swall('success', data);
        } else{
          this.spinner.hide();
          this.os.swall('error', data);
        }    
 
        this.imageSelected = false;
      },
      err => console.log(err)
    )
  }

  chkPaassword(password: string, cpassword: string) {
    if (password == cpassword) {
      this.passError = false
    } else {
      this.passError = true;
    }
  }
  cancel(){
    this.imageSelected=false;
    this.croppedImage = 'assets/images/common/profile.svg';
     this.hideform=false;
   }
   apply(){
     this.imageSelected=true;
     this.hideform=false;
   }
}
