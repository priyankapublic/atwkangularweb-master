import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../shared/backend.service';
import { ThemeService } from '../../shared/theme.service';
import { OpenCloseSidebarService } from '../../shared/open-close-sidebar.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Qna } from 'src/app/model/Qna';
import { SendQnaCurrentUserDetailService } from 'src/app/shared/send-qna-current-user-detail.service';
import { OtherService } from 'src/app/shared/other.service';
import { IsLikeUpdateService } from 'src/app/shared/is-like-update.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-qna',
  templateUrl: './qna.component.html',
  styleUrls: ['./qna.component.scss']
})
export class QnaComponent implements OnInit {
  @ViewChild('ques') ques:ElementRef;
  @ViewChild('ans') ans:ElementRef;
  metaImg:string;
  metaTitle:string;
  deepLinkUrl:string
  shareUrl: String = environment.shareurl;
  title: String = 'Dashboard';
  color = '';
  theme: boolean;
  mobileQuery: MediaQueryList;
  opened: boolean = true;
  currentUserDetail: Qna;
  userId: string;
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private as: AuthService,
    private bs: BackendService,
    private os: OtherService,
    private sqcus: SendQnaCurrentUserDetailService,
    private ts: ThemeService,
    private spinner: NgxSpinnerService,
    private isLikeUpdateService: IsLikeUpdateService,
    private openCloseSidebarService: OpenCloseSidebarService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.userId = this.as.getLocalStorage().userId;
    // localStorage.removeItem("prfileHostoryTag");
    // localStorage.removeItem("currentUser");
    this.closeRightSideNav()
    // this.currentUserDetail= JSON.parse(localStorage.getItem('qnaData'))[0];
    this.theme = this.ts.theme();
    if (this.theme == true) { this.color = 'primary'; } else { this.color = ''; }
    this.getCurrentUserDetail();
    this.changeTheme();
  }
  getCurrentUserDetail() {
    this.sqcus.currentUser$.subscribe(
      data => {
        this.currentUserDetail = data;
       this.updateViewCount(data.q_id);
       setTimeout(() => {
        this.deeplink()
       }, 1000);  
      }
    )
  }
  
  updateViewCount(q_id) {
    this.bs.updateViewCount(q_id).subscribe(
      data => { }
    );
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  closeLeftSideNav() {
    var data = { left: this.mobileQuery.matches, right: !this.mobileQuery.matches }
    this.openCloseSidebarService.openCloseSideNav(data);
  }
  closeRightSideNav() {
    if (!this.mobileQuery.matches) {
      var data = { left: !this.mobileQuery.matches, right: false }
      this.openCloseSidebarService.openCloseSideNav(data);
    }
  }

  openRightSideNav() {
    var data = { left: !this.mobileQuery.matches, right: true }
    this.openCloseSidebarService.openCloseSideNav(data);
  }
  changeTheme() {
    this.ts.changeTheme$.subscribe(
      data => { this.theme = data; if (this.theme == true) { this.color = 'primary'; } else { this.color = ''; } }
    );

  }
  // changeTheme(){
  //   this.ts.changeTheme(this.theme);
  //   if(this.theme==true){  this.color = 'primary';}else{this.color = '';}
  // }
  logout() { this.os.logout(); }
  openStoreGoogle() {
    window.open('https://play.google.com/store/apps/details?id=com.askthosewhoknow&hl=en', '_blank');
  }
  openStoreIos() {
    window.open('https://apps.apple.com/in/app/ask-those-who-know/id1209569837', '_blank');
  }
  dislike() {
    this.bs.makeUnFavQna(this.userId, this.currentUserDetail.q_id).subscribe(
      data => {
        if (data.status == true) {
          this.currentUserDetail.is_liked=false;
          this.isLikeUpdate( this.currentUserDetail.q_id, false);
          this.os.swall('success', data.message);
        } else {
          this.os.swall('error', data.message)
        }
      },  
          err => { console.log(err); this.os.swall('error', 'Something went wrong.') },
    )
  }
  like() {

    this.bs.makeFavQna(this.userId,this.currentUserDetail.q_id).subscribe(
      data => {
        if (data.status == true) {
          this.currentUserDetail.is_liked=true;
          this.isLikeUpdate( this.currentUserDetail.q_id, true);
          this.os.swall('success', data.message);
        } else {
          this.os.swall('error', data.message)
        }
      },
      err => { console.log(err); this.os.swall('error', 'Something went wrong.') },
    )
  }
  isLikeUpdate(q_id, value) {
    this.isLikeUpdateService.sendisLikeUpdate({ q_id: q_id, value: value })
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


    deeplink(){
      if (this.currentUserDetail.scholar_image) {
        this.metaImg = this.currentUserDetail.scholar_image
      } else {
        this.metaImg = 'https://atwk.app/assets/images/atwk.png';
      }
      if (this.currentUserDetail.scholar) {
       this.metaTitle = this.currentUserDetail.scholar + ' | ATWK';
     } else {
       this.metaTitle= 'Ask Those Who Know';
     }

      let tempData = {
        dynamicLinkInfo: {
          domainUriPrefix: "https://share.atwk.app/scholar",
          link: "https://atwk.app/public-qna/question/"+this.currentUserDetail.q_id,
          androidInfo: {
            androidPackageName: "com.askthosewhoknow"
          },
          iosInfo: {
            iosBundleId: "com.iTek.Ask-Those-Who-know"
          },
          socialMetaTagInfo: {
            socialTitle: this.currentUserDetail.subject,
            socialDescription:  this.currentUserDetail.scholar+ "'s reply on ATWK" ,
            socialImageLink: this.metaImg 
          }
        }
      }
      let temp ='\n\n Q: '+ this.ques.nativeElement.textContent.substring(0,150)+'...' + '\n\n A: '+this.ans.nativeElement.textContent.substring(0,100)+'...';

      this.bs.generateDeeplink(tempData).subscribe(
        data=>{ this.deepLinkUrl=data.shortLink  + temp;},
        err=>{console.log(err)},
      )
     }
}
