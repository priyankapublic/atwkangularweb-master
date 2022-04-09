import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { BackendService } from '../../shared/backend.service';
import { ThemeService } from '../../shared/theme.service';
import { AuthService } from 'src/app/shared/auth.service';
import { SendQnaCurrentUserDetailService } from 'src/app/shared/send-qna-current-user-detail.service';
import { OpenCloseMenubarService } from 'src/app/shared/open-close-menubar.service';
import { OpenCloseSidebarService } from 'src/app/shared/open-close-sidebar.service';
import { OpenQnaTagFilterService } from 'src/app/shared/open-qna-tag-filter.service';
import { NgxSpinnerService } from "ngx-spinner";

import { Qna } from 'src/app/model/Qna';
import { IsLikeUpdateService } from 'src/app/shared/is-like-update.service';
import { RefeshQnaService } from 'src/app/shared/refesh-qna.service';
import { OtherService } from 'src/app/shared/other.service';
import { IdbService } from 'src/app/shared/idb.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-qa-contact-list',
  templateUrl: './qa-contact-list.component.html',
  styleUrls: ['./qa-contact-list.component.scss'],
})
export class QaContactListComponent implements OnInit {
  starttimer:any;
  slelectedTypeVar:string;
  items = Array.from({length: 100000}).map((_, i) => `Item #${i}`);
  tags = [];
  showTagFilter: boolean = false;
  color = 'accent';
  active = { left: true, middle: false, right: false }
  sortActive = { left: true, right: false }
  theme: boolean;
  mobileQuery: MediaQueryList;
  qnaList:Qna[];
  searchKey: any;
  searchKeyFilter :string='';
  sortKey: string = 'latest';
  filtertKey:boolean = false;
  showMenuVar: Boolean = false;
  chatMode: Boolean = true;
  tagMainKey = [];
  selectedformTags;
  private _mobileQueryListener: () => void;
  currentUserIndex: number;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private as: AuthService,
    private bs: BackendService,
    private ts: ThemeService,
    private sqcus: SendQnaCurrentUserDetailService,
    private openCloseSidebarService: OpenCloseSidebarService,
    private openCloseMenubarService: OpenCloseMenubarService,
    private openQnaTagFilterService: OpenQnaTagFilterService,
    private spinner: NgxSpinnerService,
    private refeshQnaService:RefeshQnaService,
    private os:OtherService,
    private isLikeUpdateService:IsLikeUpdateService,
    public idbService:IdbService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit() {
    if (!('indexedDB' in window)) {
      Swal.fire({
        title: 'This browser doesn\'t QNA',
        imageUrl: 'assets/images/common/atwk.png',
        imageWidth: 120,
        // imageHeight: 107,
        showCancelButton: false,
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        customClass: {
          popup: 'sky-blue-bg del-popup-size',
          header: 'header-class',
          title: 'title-class',
          image: 'image-class',
          actions: 'actions-class-del',
          confirmButton: 'confirm-button-class',
          cancelButton: 'cancel-button-class',
        },
      })
      return;
    }
    this.changeTheme();
    if(localStorage.getItem('qnaData')){
      this.allQNA()
    }else{
      this.spinner.show();
    }
    this.theme = this.ts.theme();
    this.openCloseMenubar();
    this.displayTagFilter();
    this.isLikeUpdate();
    this.RefeshQna();
  }
  viewImg(img:string){
    this.os.swallImage(img.slice(0, img.indexOf('?')))
  }
 RefeshQna(){
   this.refeshQnaService.refreshQna$.subscribe(
     data=>{ if(data==true){
       this.allQNA();this.spinner.hide();
     }}
   )
 }
  isLikeUpdate() {
    this.isLikeUpdateService.isLikeUpdate$.subscribe(
      data => {
        for (let key in this.qnaList) {
          if (this.qnaList[key].q_id == data.qid) {
            this.qnaList[key].is_liked = data.value;
            this.idbService.updateSingleQNAindexedDb(this.qnaList[key])
          }
        }
        // let tempQnaLIst = JSON.parse(localStorage.getItem('qnaData'));
        // for (let key in tempQnaLIst) {
        //   if (tempQnaLIst[key].q_id == data.qid) {
        //     tempQnaLIst.is_liked = data.value;
        //   }
        // }
        // this.idbService.insertQNAindexedDb(tempQnaLIst)
        // localStorage.setItem('qnaData',JSON.stringify(tempQnaLIst))
      }
    )
  }
  displayTagFilter() {
    this.openQnaTagFilterService.qnaTagFilter$.subscribe(
      data =>{
        if(this.showTagFilter==true){
          this.showTagFilter = false;
        }else{
          this.showTagFilter = true;
        }
          // this.tagMainKey = []
        }
    )
  }
  allQNA() {
    this.spinner.show();
// --------------------------------
let data;
const request = indexedDB.open('qna-db',1);
request.onsuccess = function(event) {
 var db = event.target['result'];
 var transaction =db.transaction('qna', 'readonly');
 var qnaStore = transaction.objectStore('qna');
 data = qnaStore.getAll();
}
setTimeout(() => {
  this.spinner.hide();
  this.qnaList =data.result;
  this.getTags();
}, 2000);
// --------------------------------
}

  getTags() {
    let sn =0;
    for (let key in this.qnaList) {
      for (let k in this.qnaList[key].tags) {
             if (this.tags.filter(x=>x.value==this.qnaList[key].tags[k]).length==0) {
            this.tags.push({sn:sn++,value:this.qnaList[key].tags[k],selected:false});
          // this.tags.push(this.qnaList[key].tags[k]);
        }
      }
    }

  }
  currentUser(user,i:number) {
    this.currentUserIndex = i;
    setTimeout(() => {
     let temp=[]
      this.qnaList[i].count=this.qnaList[i].count+1;
       this.idbService.updateSingleQNAindexedDb(this.qnaList[i]);
     }, 1000);

    this.closeLeftSideNav()
    this.sqcus.sendCurrentUserDetail(user);

    // localStorage.setItem('qnaData',JSON.stringify( this.qnaList))
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  openCloseMenubar() {
    this.openCloseMenubarService.menuBar$.subscribe(
      data => this.showMenuVar = data
    )
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
  filter(val:boolean){
    this.filtertKey =val;
   if(val){
    this.sortActive.left = false;this.sortActive.right = true;
   }else{
    this.sortActive.left = true;this.sortActive.right = false;
   }
   if(!!this.filtertKey){
    let temp =this.filtertKey;
    this.filtertKey=false
    setTimeout(() => {
      this.filtertKey=temp;
    }, 100);
  }else{
    this.filtertKey=false
    setTimeout(() => {
      this.filtertKey=false;
    }, 100);
  }
  }
  sort(val: string) {
    this.slelectedTypeVar =val;
    if (val == 'views') {
      this.sortKey = 'views';
      this.active.left = false; this.active.middle = false; this.active.right = true;
    } else if (val == 'oldest') {
      this.sortKey = 'oldest';
      this.active.left = false; this.active.middle = true; this.active.right = false;
    } else if (val == 'latest') {
      this.sortKey = 'latest';
      this.active.left = true; this.active.middle = false; this.active.right = false;
    }
    if(!!this.searchKey){
      let temp =this.searchKey;
      this.searchKey=''
      setTimeout(() => {
        this.searchKey=temp;
      }, 100);
    }else{
      this.searchKey='Search'
      setTimeout(() => {
        this.searchKey='';
      }, 100);
    }
  }
  applyModel(i:number){
    if(this.tags[i].selected==false){
      this.tags[i].selected=true;
    }else{
      this.tags[i].selected=false;
    }
  }
  applyTagFilter() {
    this.sort(this.slelectedTypeVar);
    // this.selectedformTags = data.value;
    for (let key in this.tags) {
      if (this.tags[key].selected == true) {
        this.tagMainKey.push(this.tags[key].value);
      }
    }
     this.showTagFilter = false;
  }

  cancelTagFilter() {
    this.showTagFilter = false;
  }
  claerAll(){
    this.tagMainKey = [];
    this.sort('latest');
    this.filter(false)
    for (let key in this.tags) {
         this.tags[key].selected=false;
    }
  }


}
