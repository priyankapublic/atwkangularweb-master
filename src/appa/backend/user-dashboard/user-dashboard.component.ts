import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../shared/backend.service';
import { ThemeService } from '../../shared/theme.service';
import { OpenCloseSidebarService } from '../../shared/open-close-sidebar.service';
import { AuthService } from 'src/app/shared/auth.service';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { NgxSpinnerService } from "ngx-spinner";
import { Userdetail } from 'src/app/model/Userdetail';
import { Currentuser } from "../../model/Currentuser";
import { UserProfileService } from 'src/app/shared/user-profile.service';
import { MenuDataToRightPanService } from 'src/app/shared/menu-data-to-right-pan.service';
import { Conversations } from 'src/app/model/conversations';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioRecordingService } from 'src/app/shared/audio-recording.service';
import { SendUserMsgCurrentUserDetailService } from 'src/app/shared/send-user-msg-current-user-detail.service';
import { OtherService } from 'src/app/shared/other.service';
import { IsreplyedRefreshService } from 'src/app/shared/isreplyed-refresh.service';
import { ReloadService } from 'src/app/shared/reload.service';
import * as sha1 from "simple-sha1";
import { AngularFireDatabase } from '@angular/fire/database';
import { of } from 'rxjs';
import { Profile } from 'src/app/model/Peofile';
import { UserMessageHistoryService } from 'src/app/shared/user-message-history.service';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('scrollMe') scrollMe: ElementRef;
  @ViewChild('myTextAreaRef') public myTextAreaRef;
  documentFileType: string = 'mammoth';
  wrapflag: boolean = true;
  wraptextlength: number;
  showPull: boolean = false;
  dropImageActive: boolean = false;
  url: any;
  selectedFile: File;
  selsectedChatType: string = '';
  notRepliedArryVar = [];
  notReadedArryVar = "";
  title: String = 'Dashboard';
  chatText: string = ""
  color = '';
  dataArray = { tag: '', title: '' };
  theme: boolean;
  mobileQuery: MediaQueryList;
  opened: boolean = true;
  loginDetail: Userdetail;
  currentUserDetail: Currentuser;
  conversations: Conversations[];
  conversationsAll: Conversations[];
  isRecording = false;
  recordedTime;
  blobUrl;
  idArray = [];
  doc: any;
  docFileName: any;
  image: any;
  imageFileName: any;
  audio: any;
  audioFileName: any;
  loginEmail: string;
  lastMsgId: number;
  profile = new Profile;
  private _mobileQueryListener: () => void;
  role: string;
  sha1Var: string;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private as: AuthService,
    private reloadService: ReloadService,
    private bs: BackendService,
    private os: OtherService,
    private sumcus: SendUserMsgCurrentUserDetailService,
    private ts: ThemeService,
    private openCloseSidebarService: OpenCloseSidebarService,
    private userProfileService: UserProfileService,
    private menuDataToRightPanService: MenuDataToRightPanService,
    private spinner: NgxSpinnerService,
    private isreplyedRefreshService: IsreplyedRefreshService,
    private audioRecordingService: AudioRecordingService,
    private db: AngularFireDatabase,
    private sanitizer: DomSanitizer,
    private userMessageHistoryService: UserMessageHistoryService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.audioSupport();
  }

  ngOnInit() {
    this.role = this.as.getLocalStorage().role;
    this.theme = this.ts.theme();
    if (this.theme == true) { this.color = 'primary'; } else { this.color = ''; }
    this.getCurrentUserDetail();
    this.getCurrentUserDetailFromHistory();
    this.changeTheme();
    this.loginDetail = this.as.getLocalStorage();
    this.loginEmail = this.as.getLocalStorage().email;
    if (this.currentUserDetail) {
      this.firebaseData()
      this.firebaseprofileData()
    }

  }
  firebaseprofileData() {
    this.db.object('atwk_user_info/' + this.currentUserDetail.userId).valueChanges().subscribe(
      (data: Profile) => {
        if (data) {
          this.currentUserDetail.name = data.Name;
          this.currentUserDetail.image = this.bs.getuserimage(data.ImageID, data.UserType, data.Gender);
          this.currentUserDetail.UserLoginStatus = data.UserLoginStatus.charAt(0).toUpperCase() + data.UserLoginStatus.toLowerCase().slice(1);
          this.currentUserDetail.Duration = data.Name;
          let res = this.os.getDuration(data.LastOnlineTime);
          // if (!res.online) {
          //   if (this.currentUserDetail.UserLoginStatus == 'Online') {
          //     this.currentUserDetail.UserLoginStatus = 'Away';
          //   } else if (this.currentUserDetail.UserLoginStatus == 'Away') {
          //     this.currentUserDetail.UserLoginStatus = 'Offline';
          //   }

          // }
          if (res.value > 0) {
            this.currentUserDetail.Duration = res.value + res.unit;
          } else {
            this.currentUserDetail.Duration = 'now'
          }
        }
      },
      err => { console.log(err) },
    )
  }


  viewImg(img: string) {
    this.os.swallImage(img)
  }
  getCurrentUserDetail() {
    this.sumcus.currentUser$.subscribe(
      data => {    this.chatText = ""; this.conversations=[];this.showCheckbox = false;
        this.currentUserDetail = data; this.generateSha1(); this.notRepliedArryVar = []; this.notReadedArryVar = "";
          this.firebaseprofileData()
        this.firebaseData()
      }
    )
  }
  getCurrentUserDetailFromHistory() {
    this.userMessageHistoryService.messageHistory$.subscribe(
      data => {

        this.currentUserDetail.subject = data.subject;
        this.currentUserDetail.ayatollah = data.ayatollah;
        this.getConversationsFromApi(data.email)
      }
    )
  }
  getConversationsFromApi(currentUserEmail) {
    this.spinner.show();
    this.bs.conversations(this.as.getLocalStorage().email, currentUserEmail).pipe(map(x => x.filter(y => y.Subject == this.currentUserDetail.subject))).subscribe(
      data => { this.conversations = data; this.spinner.hide(); },
      error => console.log(error)
    )
  }
  getConversationsAndUpdateToFirebase(messageId) {
    let email;
    if (this.role == 'USER') {
      email = this.loginDetail.email;
    } else {
      email = this.currentUserDetail.email;
    }
    this.bs.conversationsNew(email, messageId).subscribe(
      data => {
        let tempData = {};
        for (let key in data) {
          tempData = {
            Subject: data[key].Subject,
            ayatollah: data[key].ayatollah,
            Text: data[key].Text,
            To: data[key].To,
            From: data[key].From,
            ToUserID: data[key].ToUserID,
            FromUserID: data[key].FromUserID,
            ToName: data[key].ToName,
            FromName: data[key].FromName,
            ToImageID: data[key].ToImageID,
            FromImageID: data[key].FromImageID,
            MessageStatus: data[key].MessageStatus,
            MessageID: data[key].MessageID,
            CreatedDate: data[key].CreatedDate,
            IsVoice: data[key].IsVoice,
            IsRead: data[key].IsRead,
            IsReplied: data[key].IsReplied,
            FromUserType: data[key].FromUserType,
            FileContextText: data[key].FileContextText,
            ContentType: data[key].ContentType
          }
          this.db.object('atwk_chat_rooms/' + this.sha1Var + '/' + data[key].MessageID).update(tempData);
        }
        this.firebaseData();
      },
      error => console.log(error)
    )
  }



  updateIsRead(msgID) {
    if (msgID) {
      let arrayList = msgID.split(",");
      let data = { UserID: this.as.getLocalStorage().userId, MessageID: msgID, IsRead: 'Y' }
      this.bs.updateIsRead(data).subscribe(
        data => {

          for (let key in arrayList) {
            if (arrayList[key]) {

              this.db.object('atwk_chat_rooms/' + this.sha1Var + '/' + arrayList[key]).valueChanges().subscribe(
                data => {
                  if (data) {
                    this.db.object('atwk_chat_rooms/' + this.sha1Var + '/' + arrayList[key]).update({ IsRead: 'Y' });
                  }
                }
              )
            }
          }
          this.reloadService.sendReloadService(true);
        },
      )
    }
  }
  chkenter() {
    let temp1 = this.chatText.search("\n");
    let temp2 = this.chatText.search("\r");
    if (temp1 != -1 || temp2 != -1) {
      this.showPull = true;
    } else {
      // this.showPull=false;
    }
  }

  updateIsReadReplied() {

    for (let key in this.notRepliedArryVar) {
      this.updateIsReadRepliedSingle(this.notRepliedArryVar[key])
    }
  }
  updateIsReadRepliedSingle(msgID) {
    let data = { UserID: this.as.getLocalStorage().userId, MessageID: msgID, IsReplied: 'Y' }
    this.bs.updateIsReplied(data).subscribe(
      data => {
        if (data == "SUCCESS") {

          this.db.object('atwk_chat_rooms/' + this.sha1Var + '/' + msgID).valueChanges().subscribe(
            data => {
              if (data) {
                this.db.object('atwk_chat_rooms/' + this.sha1Var + '/' + msgID).update({ IsReplied: 'Y' })
              }
            }
          )
          this.isreplyedRefreshService.sendreplyedRefreshService(this.currentUserDetail.messageId); this.reloadService.sendReloadService(true);
        };
      },
    )
  }

  closeLeftSideNav() {
    var data = { left: this.mobileQuery.matches, right: !this.mobileQuery.matches }
    this.openCloseSidebarService.openCloseSideNav(data);
  }
  changeTheme() {
    this.ts.changeTheme$.subscribe(
      data => { this.theme = data; if (this.theme == true) { this.color = 'primary'; } else { this.color = ''; } }
    );
  }

  logout() { this.os.logout(); }

  delMessage() {
    Swal.fire({
      title: 'Are you sure to delete ?',
      imageUrl: 'assets/images/common/atwk.png',
      imageWidth: 120,
      // imageHeight: 107,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
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
    }).then((result) => {
      if (result.value) {
        this.deleteMessage(this.loginDetail.email)
        this.os.swall('success', 'Deleted Successfully');
      }
    })
  }


  deleteId(messageId) {
    if (this.idArray.indexOf(messageId) == -1) {
      this.idArray.push(messageId)
    } else {
      this.idArray = this.idArray.filter(x => x != messageId);
    }

  }
  deleteMessage(userId) {

    let messageId = '';
    for (let key in this.idArray) {
      messageId += this.idArray[key] + ',';
    }
    this.bs.deleteChatMessage(userId, messageId.substring(0, messageId.length - 1)).subscribe(
      data => {
        for (let key in this.idArray) {
          let msgId = this.idArray[key];
          let userID;
          let scholarID;
          if (this.role == 'USER') {
            userID = this.loginDetail.userId;
            scholarID = this.currentUserDetail.userId;
          } else {
            userID = this.loginDetail.userId;
            scholarID = this.currentUserDetail.userId;
          }
          this.db.object('atwk_chat_rooms/' + this.sha1Var + '/' + this.idArray[key]).remove()
            .then(() => {
              this.db.object('atwk_latest_subject/' + userID + '/' + this.sha1Var).valueChanges().pipe(map(x => this.prepareMsgId(x))).subscribe(
                data => {
                  this.db.object('atwk_moderator_review/' +msgId ).remove(); 
                  if (data == msgId) {
                    if (this.conversationsAll.length > 0) {     
                      let userLastMsg = this.conversationsAll[this.conversationsAll.length - 1]
                      userLastMsg.CreatedDate = new Date(userLastMsg.CreatedDate).toJSON();
                      this.db.object('atwk_latest_subject/' + userID + '/' + this.sha1Var).update(userLastMsg);
                    } else {
                  
                      this.db.object('atwk_latest_subject/' + userID + '/' + this.sha1Var).remove();
                    }
                  }
                }
              )

              this.db.object('atwk_latest_subject/' + scholarID + '/' + this.sha1Var).valueChanges().pipe(map(x => this.prepareMsgId(x))).subscribe(
                data => {
                  if (data == msgId) {
                    let scholarMsgs = this.conversationsAll.filter(x => x.MessageStatus == "APPROVE")
                    if (scholarMsgs.length > 0) {                 
                      let scholarLastMsg = scholarMsgs[scholarMsgs.length - 1]
                      scholarLastMsg.CreatedDate = new Date(scholarLastMsg.CreatedDate).toJSON();
                      this.db.object('atwk_latest_subject/' + scholarID + '/' + this.sha1Var).update(scholarLastMsg);
                    }
                    else {
                    
                      this.db.object('atwk_latest_subject/' + scholarID + '/' + this.sha1Var).remove();
                    }
                  }

                }
              )
            })
        }
        // this.getConversations(this.currentUserDetail.messageId);
        this.showCheckbox = false;
        messageId = '';
        this.idArray = [];
      },
      err => { console.log(err) }
    )
  }
  prepareMsgId(data) {
    if(data){
    return data.MessageID;
      
    }
  }
  showCheckbox: boolean = false;

  displayCheckbox() {
    if (this.showCheckbox) {
      this.showCheckbox = false;
    } else {
      this.showCheckbox = true;
    }

  }
  cancelDelete() {
    this.showCheckbox = false;
  }

  expend: boolean = false;
  rows: number = 1;
  pullImageUrl: string = 'assets/images/common/push.svg';
  expendTextBox() {
    if (this.expend) {
      this.expend = false;
      this.pullImageUrl = 'assets/images/common/push.svg';
      this.rows = 1;
    } else {
      this.expend = true;
      this.pullImageUrl = 'assets/images/common/pull.svg';
      this.rows = 15;
    }
  }
  viewPrfile() {
    this.openRightSideNav();
    this.userProfileService.sendUserProfile({ details: this.currentUserDetail, history: false });
    let data = this.goTo('app-user-profile', 'Profile');
    this.sendDataToRightPan(data);
  }
  openRightSideNav() {
    var data = { left: !this.mobileQuery.matches, right: true }
    this.openCloseSidebarService.openCloseSideNav(data);
  }
  sendDataToRightPan(data: any) {
    this.menuDataToRightPanService.rightPanData(data);
  }
  goTo(tag: string, title: string) {
    this.dataArray.tag = tag;
    this.dataArray.title = title;
    return this.dataArray;
  }
  recordVoice() {
    this.selsectedChatType = 'voice';
    let timerInterval;
    this.startRecording()
    Swal.fire({
      title: 'Recording Voice...',
      imageUrl: 'assets/images/common/record_image.png',
      imageWidth: 120,
      imageHeight: 107,
      imageAlt: 'Custom image',
      html: '<b class="timer"></b>',
      showCancelButton: true,
      confirmButtonText: 'Cancel',
      cancelButtonText: 'Stop',
      allowOutsideClick: false,
      customClass: {
        popup: 'sky-blue-bg record-popup-size',
        header: 'header-class',
        title: 'title-class',
        closeButton: 'close-button-class',
        image: 'image-class',
        content: 'content-class',
        actions: 'actions-class',
        confirmButton: 'confirm-button-record',
        cancelButton: 'cancel-button-record',
      },
      onBeforeOpen: () => {
        Swal.getIcon()
        timerInterval = setInterval(() => {
          const content = Swal.getContent()
          if (content) {
            const b: any = content.querySelector('b')
            if (b) {
              b.textContent = this.recordedTime;
            }
          }
        }, 100)
      },
      onClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      this.stopRecording();
      if (result.value) {
        this.selsectedChatType = '';
        this.clearRecordedData();
      } else {
        Swal.fire({
          html: 'Are you sure you want to send <br> this audio? ',
          imageUrl: 'assets/images/common/send.png',
          imageWidth: 120,
          // imageHeight: 107,
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          allowOutsideClick: false,
          customClass: {
            popup: 'sky-blue-bg del-popup-size',
            header: 'header-class',
            title: 'title-class',
            content: 'content-class-audio-send',
            image: 'image-class',
            actions: 'actions-class-del',
            confirmButton: 'confirm-button-class',
            cancelButton: 'cancel-button-class',
          },
        }).then((res) => {
          if (res.value) {
            this.sendChat()
          } else {
            this.selsectedChatType = ''
            this.clearRecordedData();
          }
        })

      }
    })
  }

  scrollToBottom() {
    var bottomChat = document.getElementById("sidenav");    
    setTimeout(() => {
      if (!!bottomChat) {
        bottomChat.scrollTop = bottomChat.scrollHeight;
      }
    }, 100);
  }

  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.selsectedChatType = '';
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  audioSupport() {
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      // this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));  
      var reader = new FileReader();
      reader.readAsDataURL(data.blob);
      reader.onload = (event) => {
        let base64data = reader.result;
        this.audio = base64data;
        var i = this.audio.indexOf(",") + 1;
        this.audio = this.audio.substring(i);
        this.audioFileName = new Date().getTime() + '.mp3';
      }
    });
  }

  sendTextChat(e) {
    e.preventDefault();
    let data
    if (this.role == 'USER') {
      data = { UserID: this.loginDetail.userId, From: this.loginDetail.email, To: this.currentUserDetail.email, Subject: this.currentUserDetail.subject, Ayatollah: this.currentUserDetail.ayatollah, Text: this.chatText, IsVoice: 'N', MessageStatus: 'PEND', MessageReplyID: this.lastMsgId }
    } else {
      data = { UserID: this.loginDetail.userId, From: this.loginDetail.email, To: this.currentUserDetail.email, Subject: this.currentUserDetail.subject, Ayatollah: this.currentUserDetail.ayatollah, Text: this.chatText, IsVoice: 'N', MessageStatus: 'APPROVE', MessageReplyID: this.lastMsgId }
    }
    if (this.chatText.split(" ").join("").length > 0) {
      this.spinner.show();     
      this.bs.sendChatMessage(data).subscribe(
        data => { this.chatText = ''; if (e.keyCode == 13) { e.keyCode == 13 }  this.sendDataToFirebase(data); this.spinner.hide(); this.updateIsReadReplied(); }
      )
    }
  }

  sendAudioChat() {
    if (this.selsectedChatType == 'voice') {
      this.spinner.show();
      let data
      if (this.role == 'USER') {
        data = { Text: this.audio, FileContextText: this.chatText, FileName: this.audioFileName, UserID: this.loginDetail.userId, From: this.loginDetail.email, To: this.currentUserDetail.email, Subject: this.currentUserDetail.subject, Ayatollah: this.currentUserDetail.ayatollah, IsVoice: 'Y', MessageStatus: 'PEND', MessageReplyID: this.lastMsgId }

      } else {
        data = { Text: this.audio, FileContextText: this.chatText, FileName: this.audioFileName, UserID: this.loginDetail.userId, From: this.loginDetail.email, To: this.currentUserDetail.email, Subject: this.currentUserDetail.subject, Ayatollah: this.currentUserDetail.ayatollah, IsVoice: 'Y', MessageStatus: 'APPROVE', MessageReplyID: this.lastMsgId }

      }
      this.bs.sendVoiceMessage(data).subscribe(
        data => { this.clearRecordedData(); this.sendDataToFirebase(data); this.spinner.hide(); }
      )
    }
  }

  sendImageChat() {
    // this.spinner.show();
    let data
    if (this.role == 'USER') {
      data = { Text: this.image, FileContextText: this.chatText, FileName: this.imageFileName, UserID: this.loginDetail.userId, From: this.loginDetail.email, To: this.currentUserDetail.email, Subject: this.currentUserDetail.subject, Ayatollah: this.currentUserDetail.ayatollah, IsVoice: 'N', MessageStatus: 'PEND', MessageReplyID: this.lastMsgId }

    } else {
      data = { Text: this.image, FileContextText: this.chatText, FileName: this.imageFileName, UserID: this.loginDetail.userId, From: this.loginDetail.email, To: this.currentUserDetail.email, Subject: this.currentUserDetail.subject, Ayatollah: this.currentUserDetail.ayatollah, IsVoice: 'N', MessageStatus: 'APPROVE', MessageReplyID: this.lastMsgId }

    }

    this.bs.sendDocumentMessage(data).subscribe(
      data => { this.sendDataToFirebase(data); this.spinner.hide(); }
    )
  }
  sendDocChat() {
    this.spinner.show();
    let data
    if (this.role == 'USER') {
      data = { Text: this.doc, FileContextText: this.chatText, FileName: this.docFileName, UserID: this.loginDetail.userId, From: this.loginDetail.email, To: this.currentUserDetail.email, Subject: this.currentUserDetail.subject, Ayatollah: this.currentUserDetail.ayatollah, IsVoice: 'N', MessageStatus: 'PEND', MessageReplyID: this.lastMsgId }

    } else {
      data = { Text: this.doc, FileContextText: this.chatText, FileName: this.docFileName, UserID: this.loginDetail.userId, From: this.loginDetail.email, To: this.currentUserDetail.email, Subject: this.currentUserDetail.subject, Ayatollah: this.currentUserDetail.ayatollah, IsVoice: 'N', MessageStatus: 'APPROVE', MessageReplyID: this.lastMsgId }

    }

    this.bs.sendDocumentMessage(data).subscribe(
      data => { this.sendDataToFirebase(data); this.spinner.hide(); }
    )
  }
  sendChat() {
    if (this.selsectedChatType == 'voice') {
      this.sendAudioChat();
    } else if (this.selsectedChatType == 'img') {
      this.sendImageChat();
    } else if (this.selsectedChatType == 'doc') {
      this.sendDocChat();
    } else {
      // this.sendTextChat()
    }
    this.chatText = '';
    this.updateIsReadReplied();
  }
  sendDoc() {
    this.sendDocChat();
    this.chatText = '';
    this.updateIsReadReplied();
    this.selsectedChatType = ''
  }
  cancelDoc() {
    this.selsectedChatType = ''
  }
  uploadFile(event, drop: boolean) {
    this.clearDrop();
    this.selectedFile = event[0];
    let ext = this.selectedFile.name.substr(this.selectedFile.name.lastIndexOf('.') + 1);
    if (ext == 'mp3') {
      this.selsectedChatType = 'voice';
      this.audioFileName = new Date().getTime() + '.mp3';
      this.prepageAudio(this.selectedFile, drop)
    } else if (ext == 'doc' || ext == 'docx' || ext == 'pdf') {
      if (ext == 'doc' || ext == 'docx') {
        this.documentFileType = 'mammoth';
      } else if (ext == 'pdf') {
        this.documentFileType = 'pdf';
      }
      this.selsectedChatType = 'doc';
      this.docFileName = new Date().getTime() + this.selectedFile.name;
      this.prepageDoc(this.selectedFile, drop)
    } else if (ext == 'jpeg' || ext == 'jpg' || ext == 'png') {
      this.selsectedChatType = 'img';
      this.imageFileName = 'image ' + new Date().getTime() + this.selectedFile.name;
      this.prepageImage(this.selectedFile, drop)
    } else {
      Swal.fire({
        imageUrl: 'assets/images/common/broken.png',
        imageWidth: 96,
        imageHeight: 96,
        html: 'Sorry! Unsupported File ',
        confirmButtonColor: '#c7a76d',
        confirmButtonText: 'ok',
        allowOutsideClick: false,
        customClass: {
          popup: 'sky-blue-bg ',
          header: 'header-class-file-upload',
          title: 'title-class',
          content: 'content-class-regular',
          confirmButton: 'confirm-button-class',
          cancelButton: 'cancel-button-class',
        },
      })
    }
  }
  prepageAudio(file, drop: boolean) {
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.url = 'assets/images/common/mp3.png';
        this.audio = (<FileReader>event.target).result;
        var i = this.audio.indexOf(",") + 1;
        this.audio = this.audio.substring(i);
        if (drop) {
          this.swalPopup(this.url, 'Audio')
        }
      }
    }

  }
  prepageImage(file, drop: boolean) {
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
        this.image = (<FileReader>event.target).result;
        var i = this.image.indexOf(",") + 1;
        this.image = this.image.substring(i);
        if (drop) {
          this.swalPopup(this.url, 'Image')
        }
      }
    }

  }
  prepageDoc(file, drop: boolean) {
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
        this.doc = (<FileReader>event.target).result;
        var i = this.doc.indexOf(",") + 1;
        this.doc = this.doc.substring(i);
        // if(drop){
        // this.swalPopupDoc(this.url,'Doc File')          
        // }      
      }
    }
  }


  swalPopupDoc(url, file) {
    Swal.fire({
      imageUrl: url,
      html: '<ngx-doc-viewer [url]="' + url + '" viewer="pdf" style="width:100%;height:50vh;"></ngx-doc-viewer>',
      showCancelButton: true,
      confirmButtonColor: '#c7a76d',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      allowOutsideClick: false,
      customClass: {
        popup: 'sky-blue-bg ',
        header: 'header-class-file-upload',
        title: 'title-class',
        content: 'content-class-regular',
        confirmButton: 'confirm-button-class',
        cancelButton: 'cancel-button-class',
      },
    }).then((res) => {

      if (res.value) {
        this.sendChat()
      } else {
        this.selsectedChatType = ''
        this.clearRecordedData();
      }
    })
  }
  swalPopup(url, file) {
    Swal.fire({
      imageUrl: url,
      html: 'Are you sure you want to send <br> this ' + file + ' ? ',
      showCancelButton: true,
      confirmButtonColor: '#c7a76d',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      allowOutsideClick: false,
      customClass: {
        popup: 'sky-blue-bg ',
        header: 'header-class-file-upload',
        title: 'title-class',
        content: 'content-class-regular',
        confirmButton: 'confirm-button-class',
        cancelButton: 'cancel-button-class',
      },
    }).then((res) => {

      if (res.value) {

        this.sendChat()
      } else {
        this.selsectedChatType = ''
        this.clearRecordedData();
      }
    })
  }
  allowDrop(ev) {
    this.dropImageActive = true
    ev.preventDefault();
    this.scrollMe.nativeElement.style.backgroundImage = 'url(assets/images/common/3DragandDrop.png)';
    this.scrollMe.nativeElement.style.backgroundRepeat = 'no-repeat';
    this.scrollMe.nativeElement.style.backgroundPosition = 'center';
  }
  clearDrop() {
    setTimeout(() => {
      this.dropImageActive = false
      this.scrollMe.nativeElement.style.backgroundImage = 'none';
      this.scrollToBottom();
    }, 2000);
  }
  startDrop() {
    this.dropImageActive = true
  }

  shiftAndEnterkeypressed() {
    // this.chatText= this.chatText + '\n'
  }
  enterkeypresed(e) {

  }
  showPullFun() {
    if (this.myTextAreaRef.nativeElement.scrollHeight > 48 && this.wrapflag) {
      this.wraptextlength = this.chatText.length;
      this.wrapflag = false;
      this.showPull = true; this.rows = 2;
    }
    if (!this.wrapflag) {
      if (this.chatText.length < this.wraptextlength) {
        this.showPull = false; this.rows = 1; this.wrapflag = true;
      }
    }
    // if(this.chatText.length<=this.wraptextlength){
    //   this.showPull=false;   this.rows=1;this.wrapflag=true;
    // }
  }
  openStoreGoogle() {
    window.open('https://play.google.com/store/apps/details?id=com.askthosewhoknow&hl=en', '_blank');
  }
  openStoreIos() {
    window.open('https://apps.apple.com/in/app/ask-those-who-know/id1209569837', '_blank');
  }
  generateSha1() {
    if (this.role == 'USER') {
      
      this.sha1Var = sha1.sync(this.loginDetail.userId + ':' + this.currentUserDetail.userId + ':' + this.currentUserDetail.subject.trim().toLocaleLowerCase() + ':' + this.currentUserDetail.ayatollah.trim().toLocaleLowerCase())
    } else {
      this.sha1Var = sha1.sync(this.currentUserDetail.userId + ':' + this.loginDetail.userId + ':' + this.currentUserDetail.subject.trim().toLocaleLowerCase() + ':' + this.currentUserDetail.ayatollah.trim().toLocaleLowerCase())
    }

  }
  sendDataToFirebase(data) {
    let tempData = {
      Subject: data.Subject,
      ayatollah: data.ayatollah,
      Text: data.Text,
      To: data.To,
      From: data.From,
      ToUserID: data.ToUserID,
      FromUserID: data.FromUserID,
      ToName: data.ToName,
      FromName: data.FromName,
      ToImageID: data.ToImageID,
      FromImageID: data.FromImageID,
      MessageStatus: data.MessageStatus,
      MessageID: data.MessageID,
      CreatedDate:data.CreatedDate,
      IsVoice: data.IsVoice,
      IsRead: data.IsRead,
      IsReplied: data.IsReplied,
      FromUserType: data.FromUserType,
      FileContextText: data.FileContextText,
      ContentType: data.ContentType,
    }
    // CreatedDate: new Date(data.CreatedDate).toJSON(),
    // console.log(tempData);
    this.db.object('atwk_chat_rooms/' + this.sha1Var + '/' + data.MessageID).update(tempData);
    this.db.object('atwk_latest_subject/' + this.loginDetail.userId + '/' + this.sha1Var).update(tempData);
    if (this.role == 'USER') {
      this.db.object('atwk_moderator_review/' + data.MessageID).update(tempData);
    } else {
      this.db.object('atwk_latest_subject/' + this.currentUserDetail.userId + '/' + this.sha1Var).update(tempData);
    }
  }
  firebaseData() {
    // console.log(this.sha1Var)
    this.db.object('atwk_chat_rooms/' + this.sha1Var).valueChanges().pipe(map(x => this.prepareFirbase(x))).subscribe(
      data => {
        
        if (data.length > 0) {
          this.getConversations(data);
        } else {
          this.conversations = [];
          this.conversationsAll = [];
     
          this.getConversationsAndUpdateToFirebase(this.currentUserDetail.messageId);
        }
      },
      err => { console.log(err) },
    )
  }
  prepareFirbase(x) {
    // console.log(this.conversations)
    let temp = [];
    for (let key in x) {
     if(x[key].ContentType!=undefined){
      temp.push(x[key])
     }     
    }
    return temp;
  }
  getConversations(temp) {

    let obs = of(temp);
    // this.chatText = "";
    this.rows = 1;
    this.expend = false;
    this.showPull = false;
    obs.pipe(map(x => this.prepareMessage(x))).subscribe(
      data => { 
        this.conversationsAll = data.reverse()
       
        if (this.role == 'USER') {
          this.conversations = this.conversationsAll;
       
          this.lastMsgId = this.conversations[this.conversations.length - 1].MessageID;
          // this.db.object('atwk_latest_subject/' +this.loginDetail.userId + '/' + this.sha1Var).update(this.conversations[this.conversations.length - 1]);
          this.scrollToBottom()
        } else {
          this.conversations = this.conversationsAll.filter(x => x.MessageStatus == "APPROVE");
          this.lastMsgId = this.conversations[this.conversations.length - 1].MessageID;
          this.scrollToBottom()
          //  this.db.object('atwk_latest_subject/' +this.loginDetail.userId + '/' + this.sha1Var).update(this.conversations[this.conversations.length - 1]);
        }


      },
      error => console.log(error)
    )

  }
  prepareMessage(data) {
    for (let key in data) {
      data[key].CreatedDate = this.os.changeTimeZone(data[key].CreatedDate);
      if (data[key].Text) {
        data[key].Text = data[key].Text.replace(/\n/g, "<br>").replace(/\r/g, "<br>");
        data[key].Text = this.os.Linkify(data[key].Text);
      }
      if (data[key].To == this.loginDetail.email) {
        if (data[key].IsReplied == 'N' && data[key].MessageStatus == 'APPROVE') {
          let msgID = data[key].MessageID
          this.notRepliedArryVar.push(msgID);
        }
        if (data[key].IsRead == 'N' && data[key].MessageStatus == 'APPROVE') {
          let msgID = data[key].MessageID
          this.notReadedArryVar += msgID + ',';

        }
      }
    }

    this.updateIsRead(this.notReadedArryVar.substring(0, this.notReadedArryVar.length - 1));

    return data.reverse();
  }
}
