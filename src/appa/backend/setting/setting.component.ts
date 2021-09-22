import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { ThemeService } from '../../shared/theme.service';
import { AuthService } from 'src/app/shared/auth.service';

import Swal from 'sweetalert2'
import { BackendService } from 'src/app/shared/backend.service';
import { MenuDataToRightPanService } from 'src/app/shared/menu-data-to-right-pan.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  dataArray= { tag: '',title:'' };
  editProfile:boolean=true;
  theme:boolean;
  mobileQuery: MediaQueryList;
  profile;
  userId:string;
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher,
    private router:Router,
    private ts:ThemeService,
    private as:AuthService,
    private bs:BackendService,    
    
    private menuDataToRightPanService: MenuDataToRightPanService,
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(){
    this.changeTheme();
    this.theme=this.ts.theme();   
    this.getprofile
    this.getprofile();
    this.getUseId();
  }
  getUseId(){
    this.userId = this.as.getLocalStorage().userId;
  }

  getprofile(){
   this.profile= this.as.getLocalStorage();
   this.profile.online=true;

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
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c7a76d',    
      confirmButtonText: 'Yes, Deactivate!'
    }).then((result) => {
      if (result.value) {     
      this.deactivate();
      }
    })  
  }
  deactivate(){
    this.bs.deactivate(this.userId).subscribe(
      data => {
        if(data=='SUCCESS'){
          Swal.fire( {
            title: 'Deactivated ',
            text: 'Your have deactivated Your Account.',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#c7a76d',
            } )
        }else{
          Swal.fire( {
            title: 'Error',
            text: 'Unable to Deactivate.',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#c7a76d',
            } )
        }    
        },
      err => console.log(err)
    )
  }
  logoutEveryWhere(){
    this.as.logout(true);   
  }
  
  getChangeTheme(){
    this.ts.changeTheme(this.theme);    
  }

  updateProfile(){
    let data = this.goTo('app-update-profile','My Profile');
    this.sendDataToRightPan(data);
  }
  changePasssword(){
    let data = this.goTo('app-change-password','Change Password');
    this.sendDataToRightPan(data);
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

