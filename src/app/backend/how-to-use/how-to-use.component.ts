import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { ThemeService } from 'src/app/shared/theme.service';

@Component({
  selector: 'app-how-to-use',
  templateUrl: './how-to-use.component.html',
  styleUrls: ['./how-to-use.component.scss']
})
export class HowToUseComponent implements OnInit {
  loginUserId: string;
  selccted:number=0;
  theme:boolean;
  url:string ;
  constructor(   private ts:ThemeService, ) { }

  ngOnInit() {
    this.theme = this.ts.theme();  
    this.url= "assets/images/how/"+this.theme+"/0.png";

  }
   prev(){
     
     if(this.selccted !=0){ this.selccted= this.selccted -1; this.url = "assets/images/how/"+this.theme+"/"+this.selccted+".png" }
   }
   next(){
    if(this.selccted !=11){ this.selccted= this.selccted +1;this.url = "assets/images/how/"+this.theme+"/"+this.selccted+".png"}
  }
}
