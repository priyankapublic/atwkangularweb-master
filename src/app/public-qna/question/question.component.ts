import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { ThemeService } from 'src/app/shared/theme.service';
import { OtherService } from 'src/app/shared/other.service';
import { BackendService } from 'src/app/shared/backend.service';
import { Qna } from 'src/app/model/Qna';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  @ViewChild('ques') ques:ElementRef;
  @ViewChild('ans') ans:ElementRef;
  metaImg:string;
  metaTitle:string;
  deepLinkUrl:string;
  logedIn:boolean=false;
  shareUrl: String = environment.shareurl;
  show:string='main';
  questionId:any;
  color = '';
  yourEmail:string;
  currentUserDetail= new Qna;
  userId: string='';
  qId: string;
  title:String='Forgot Password';
  constructor(
    private titleService: Title,
    private meta: Meta,
    private router:Router,
    private bs:BackendService,     
    private as:AuthService,     
    private ts:ThemeService,
    private os:OtherService,
    private spinner: NgxSpinnerService,
    private actroute: ActivatedRoute,
    ) { }
 theme:boolean;

 ngOnInit() {
  
  localStorage.removeItem('shared_id')
  if (this.theme == true) { this.color = 'primary'; } else { this.color = ''; }
  if(localStorage.getItem('userDetail')){
    this.userId = this.as.getLocalStorage().userId;
    this.logedIn=true;

  } else{
    this.userId=''; 
    this.logedIn=false;
  }

   this.theme = this.ts.theme();
   this.getidFromUrl()
 }
 changeThene(){
   this.ts.changeTheme(this.theme);
 }
 getidFromUrl() {
  this.actroute.paramMap.subscribe(params => {
    this.questionId = params.get('id'); 
     this.getQnaByaId();
  })
}
 getQnaByaId(){ this.spinner.show()   
   this.bs.qnaById(this.userId, this.questionId).subscribe(
     data => {
       this.spinner.hide()
       this.currentUserDetail = data[0]; 
       if (this.currentUserDetail.scholar_image) {
         this.metaImg = this.currentUserDetail.scholar_image
       } else {
         this.metaImg = 'https://atwk.app/assets/images/atwk.png';
       }
       if (this.currentUserDetail.scholar) {
        this.metaTitle = this.currentUserDetail.scholar + "'s reply on ATWK";
      } else {
        this.metaTitle= 'Ask Those Who Know';
      }
       this.updateViewCount(this.questionId)
       this.meta.updateTag({ property: 'st', content:  this.metaTitle });
       this.meta.updateTag({ property: 'sd', content: this.currentUserDetail.subject });
       this.meta.updateTag({ property: 'si', content: this.metaImg });

       this.meta.updateTag({ property: 'description', content: this.currentUserDetail.subject });
       this.meta.updateTag({ property: 'og:title', content: this.metaTitle});
       this.meta.updateTag({ property: 'og:description', content: this.currentUserDetail.subject  });
       this.meta.updateTag({ property: 'og:image', content: this.metaImg });
       this.meta.updateTag({ property: 'og:url', content: 'https://atwk.app/' });
       this.meta.updateTag({ property: 'twitter:title', content: this.metaTitle });
       this.meta.updateTag({ property: 'twitter:description', content: this.currentUserDetail.subject });
       this.meta.updateTag({ property: 'twitter:image', content: this.metaImg });
     setTimeout(() => {
      this.deeplink()
     }, 1000);  
       
     },
     err => { console.log(err); this.spinner.hide() },
   )
 }
 updateViewCount(q_id) {
  this.bs.updateViewCount(q_id).subscribe(
    data => {  }
  );
}
 deeplink(){

  let tempData = {
    dynamicLinkInfo: {
      domainUriPrefix: "https://share.atwk.app/scholar",
      link: "https://atwk.app/public-qna/question/"+this.questionId,
      androidInfo: {
        androidPackageName: "com.askthosewhoknow"
      },
      iosInfo: {
        iosBundleId: "com.iTek.Ask-Those-Who-know"
      },
      socialMetaTagInfo: {
        socialTitle:this.currentUserDetail.subject ,
        socialDescription:this.metaTitle +"'s reply on ATWK",
        socialImageLink: this.metaImg 
      }
    }
  }
  let temp ='\n\n Q: '+ this.ques.nativeElement.textContent.substring(0,150)+'...' + '\n\n A: '+this.ans.nativeElement.textContent.substring(0,100)+'...';
  this.bs.generateDeeplink(tempData).subscribe(
    data=>{ this.deepLinkUrl=data.shortLink + temp;},
    err=>{console.log(err)},
  )
 }
 dislike() {
  if(this.logedIn){
  this.bs.makeUnFavQna(this.userId,this.questionId).subscribe(
    data => {
      if (data.status == true) {
        this.currentUserDetail.is_liked=false;
        this.os.swall('success', data.message);
      } else {
        this.os.swall('error', data.message)
      }
    },  
        err => { console.log(err); this.os.swall('error', 'Somthing bad happen') },
  )
}else{
  this.login()
}
}
like() {
  // console.log(this.currentUserDetail.q_id)
  if(this.logedIn){
  this.bs.makeFavQna(this.userId,this.questionId).subscribe(
    data => { 
      if (data.status == true) {
        this.currentUserDetail.is_liked=true;
        this.os.swall('success', data.message);
      } else {
        this.os.swall('error', data.message)
      }
    },
    err => { console.log(err); this.os.swall('error', 'Somthing bad happen') },
  )
}else{
    this.login()
}
}

copyText(val: string){
   let selBox = document.createElement('textarea'); 
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.os.swall('success', 'Link copied');
  }
  login(){
    localStorage.setItem('shared_id', this.questionId)
    setTimeout(() => {
      window.location.replace("/");
    }, 1000);

  }
  home(){
    window.location.replace("/");
  }
  wordpressHome(){
    window.open("https://www.askthosewhoknow.org");
  }
  openStoreGoogle() {
    window.open('https://play.google.com/store/apps/details?id=com.askthosewhoknow&hl=en', '_blank');
  }
  openStoreIos() {
    window.open('https://apps.apple.com/in/app/ask-those-who-know/id1209569837', '_blank');
  }
  logout() { this.os.logout(); }
  getChangeTheme(){
    this.ts.changeTheme(this.theme);    
  }
}
