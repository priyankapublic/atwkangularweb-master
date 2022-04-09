import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, timeout, map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { AuthService } from './auth.service';
import { Qna } from '../model/Qna';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  fbuserList:{ImageID: 0, Name: "", UserID: "" }[]= JSON.parse(localStorage.getItem('user_List'));
  allQnaList: Qna[];
  ServerUrl: String = environment.url;
  qnaUrl: String = environment.qnaUrl;
  errorData: {};
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  httpOptionsMultiPart = { headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }) };
  constructor(private http: HttpClient, private as: AuthService,private router:Router,   private db: AngularFireDatabase,) { 

  }

  getuserimage(imageId: number, role: string, gender: string) {
    if (imageId == 0) {
      if (role == "USER") {
        return { darkImage: 'assets/images/dark/user.svg', lightImage: 'assets/images/light/user.svg', darkImageErr: 'assets/images/dark/user.svg', lightImageErr: 'assets/images/light/user.svg' };
      } else {
        if (gender == "Female") {
          return { darkImage: 'assets/images/dark/s_f.svg', lightImage: 'assets/images/light/s_f.svg', darkImageErr: 'assets/images/dark/s_f.svg', lightImageErr: 'assets/images/light/s_f.svg' };
        } else {
          return { darkImage: 'assets/images/dark/s_m.svg', lightImage: 'assets/images/light/s_m.svg', darkImageErr: 'assets/images/dark/s_m.svg', lightImageErr: 'assets/images/light/s_m.svg' };
        }
      }
    } else {
      if (role == "USER") {
        return { darkImage: `https://app.askthosewhoknow.org/Download?identifier=${imageId}`, lightImage: `https://app.askthosewhoknow.org/Download?identifier=${imageId}`, darkImageErr: 'assets/images/dark/user.svg', lightImageErr: 'assets/images/light/user.svg' };
      } else {
        if (gender == "Female") {
          return { darkImage: `https://app.askthosewhoknow.org/Download?identifier=${imageId}`, lightImage: `https://app.askthosewhoknow.org/Download?identifier=${imageId}`, darkImageErr: 'assets/images/dark/s_f.svg', lightImageErr: 'assets/images/light/s_f.svg' };
        } else {
          return { darkImage: `https://app.askthosewhoknow.org/Download?identifier=${imageId}`, lightImage: `https://app.askthosewhoknow.org/Download?identifier=${imageId}`, darkImageErr: 'assets/images/dark/s_f.svg', lightImageErr: 'assets/images/light/s_m.svg' };
        }
      }

    }

  }
   
  userProfileData(UserID){ 
      return   this.fbuserList.filter(x=>x.UserID==UserID)[0];  
  }

  // ----------------------------------------------------------------------------

  getDetailsByEmail(email) {
    return this.http.get<any>(this.ServerUrl + `UserdetailsByUsername?username=${email}`).pipe(catchError(this.handleError));
  }

  contactList(email): any {
    return this.http.get<any>(this.ServerUrl + `Message/GetLatestSubjectMsg?myUsername=${email}`).pipe(catchError(this.handleError));
  }
  conversations(myEmail: string, partnerEmail: string) {
    return this.http.get<any>(this.ServerUrl + `Message/Conversation?myUsername=${myEmail}&othersUsername=${partnerEmail}`).pipe(catchError(this.handleError));
  }

  conversationsNew(myEmail: string, msgID: string) {

    return this.http.get<any>(this.ServerUrl + `Message/GetUserMsgForSubject?myUsername=${myEmail}&MsgID=${msgID}`).pipe(catchError(this.handleError));
  }
  msgHihtory(myEmail: any, partnerEmail: string) {
    return this.http.get<any>(this.ServerUrl + `Message/Conversation?myUsername=${myEmail}&othersUsername=${partnerEmail}`).pipe(catchError(this.handleError));
  }
  qnaAll(userID: number) { 
    // return this.http.get<[]>(this.qnaUrl + 'qna-api/v1/').pipe(catchError(this.handleError));
    return this.http.get<any>(this.qnaUrl + `qna-api/v3/qna/list?userid=${userID}`).pipe(catchError(this.handleError));
  }
  qnaById(userID:string,qnaId:string) {

    return this.http.get<any>(this.qnaUrl + `qna-api/v3/qna/subject?qid=${qnaId}&userid=${userID}`).pipe(catchError(this.handleError));
  }
  makeFavQna(userID:string,qnaId:string) {
 
    return this.http.get<any>(this.qnaUrl + `qna-api/v3/qna/like?userid=${userID}&quesid=${qnaId}`).pipe(catchError(this.handleError));
  }
  makeUnFavQna(userID:string,qnaId:string) {

    return this.http.get<any>(this.qnaUrl + `qna-api/v3/qna/unlike?userid=${userID}&quesid=${qnaId}`).pipe(catchError(this.handleError));
  }
  updateViewCount(q_id: number) {
    // return this.http.get<any>(this.qnaUrl + `wp-json/scholar/v2/update_view_count/1/${q_id}`).pipe(catchError(this.handleError));
    return this.http.get<any>(this.qnaUrl + `qna-api/v3/qna/view-count/?qid=${q_id}`).pipe(catchError(this.handleError));
  }
  fbnotification(userId: string, fbToken: string) {
    return this.http.post<any>(this.ServerUrl + `RegisterForNotification?userID=${userId}&registrationID=${fbToken}`, this.httpOptions).pipe(catchError(this.handleError));
  }
  deactivate(userId: string) {
    return this.http.post<any>(this.ServerUrl + `deactivate/${userId}`, this.httpOptions).pipe(catchError(this.handleError));
  }
  feedback(formData) {
    return this.http.post<any>(this.ServerUrl + 'Feeedback/Send', formData, this.httpOptions).pipe(catchError(this.handleError));
  }
  notifiacation() {
    return this.http.get<any>(this.ServerUrl + 'CommonMessage/All').pipe(catchError(this.handleError));
  }

  updateProfileImage(formData) {
    return this.http.post<any>(this.ServerUrl + 'UpdateProfileImage', formData, this.httpOptions).pipe(catchError(this.handleError));
  }
  updateProfile(formData) {
    return this.http.post<any>(this.ServerUrl + 'UpdateProfile', formData, this.httpOptions).pipe(catchError(this.handleError));
  }
  changePassword(formData) {
    return this.http.post<any>(this.ServerUrl + 'ChangePassword', formData, this.httpOptions).pipe(catchError(this.handleError));
  }
  allUserScholar(userType) {
    return this.http.get<[]>(this.ServerUrl + userType).pipe(catchError(this.handleError));
  }
  sendChatMessage(formData) {
    return this.http.post<any>(this.ServerUrl + 'Message/Send', formData, this.httpOptions).pipe(catchError(this.handleError));
  }
  sendVoiceMessage(formData) {

    return this.http.post<any>(this.ServerUrl + 'Message/SendVoiceMessage2', formData, this.httpOptions).pipe(catchError(this.handleError));
  }
  sendDocumentMessage(formData) {
    return this.http.post<any>(this.ServerUrl + 'Message/SendDocumentMessage', formData, this.httpOptions).pipe(catchError(this.handleError));
  }
  deleteChatMessage(userId, messageId) {
    return this.http.post<any>(this.ServerUrl + `Message/DeleteMessage?userName=${userId}&MsgID=${messageId}`, this.httpOptions).pipe(catchError(this.handleError));
  }
  updateIsRead(formData) {
    return this.http.post<any>(this.ServerUrl + 'Message/MarkMultipleRead', formData, this.httpOptions).pipe(catchError(this.handleError));
  }
  readNotification(MessageID,userID) {
    return this.http.post<any>(this.ServerUrl + `Message/MarkMultipleReadCommonMessages?MessageID=${MessageID}&UserID=${userID}`, this.httpOptions).pipe(catchError(this.handleError));
  }
  updateIsReplied(formData) {
    return this.http.post<any>(this.ServerUrl + 'Message/MarkMultipleIsReply', formData, this.httpOptions).pipe(catchError(this.handleError));
  }
  //  =================== messages =============================
  getModiatorNotification() {
    return this.http.post<any>(this.ServerUrl + 'GetModiatorNotification', this.httpOptions).pipe(catchError(this.handleError));

  }
  scholarRedirect(formData) {
    return this.http.post<any>(this.ServerUrl + 'Redirect', formData, this.httpOptions).pipe(catchError(this.handleError));
  }
  approvReject(formData) {
    return this.http.post<any>(this.ServerUrl + 'Message/MyDecision', formData, this.httpOptions).pipe(catchError(this.handleError));
  }
  allMessages() {
    const userId = this.as.getLocalStorage().userId;
    return this.http.get<any>(this.ServerUrl + `IncomingMessageUsers?userID=${userId}`).pipe(catchError(this.handleError));
  }

  bulkMessageSend(formData) {
    return this.http.post<any>(this.ServerUrl + 'CommonMessage/Send', formData, this.httpOptions).pipe(catchError(this.handleError));
  }
  ScholarsPendingQueriesCount() {
    const userId = this.as.getLocalStorage().userId;
    return this.http.get<any>(this.ServerUrl + 'GetPendingQueryAlimsWithCount", params').pipe(catchError(this.handleError));
  }

  getLatestMessages(partnerEmail: string) {
    return this.http.get<any>(this.ServerUrl + `Message/GetLatestMessagesForUser?myUsername=${partnerEmail}`).pipe(catchError(this.handleError));
  }
  chatHistoryUsers(email) {
    return this.http.get<any>(this.ServerUrl + `ChatHistoryUsers?userID=${email}`).pipe(catchError(this.handleError));
  }
  getPendingQueryAlimsWithCount() {
    return this.http.get<any>(this.ServerUrl + `GetPendingQueryAlimsWithCount`).pipe(catchError(this.handleError));
  }
  pendingQueriesByScholar(email) {
    return this.http.post<any>(this.ServerUrl + `Message/UnansweredQueriesByUsername?scholarUsername=${email}&userUsername=55555`, this.httpOptions).pipe(catchError(this.handleError));
  }

  getUserNotificationCount(email) {
    return this.http.post<any>(this.ServerUrl + `GetUserNotificationCount?MailId=${email}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  addScholar(formdata) {
      return this.http.post<any>(this.ServerUrl + 'Register',formdata, this.httpOptions).pipe(catchError(this.handleError));
  }
  generateDeeplink(formData) {
    return this.http.post<any>('https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyDGjAgM3sPX33tEFxouSBZf1JmsDtMuopE', formData).pipe(catchError(this.handleError));
  }
  

  firebaseUserList(){
    this.db.object('atwk_user_info/').valueChanges().pipe(map(x => this.prepareFirbase(x))).subscribe(
      (data)=>{ localStorage.setItem('user_List',JSON.stringify(data))   },
      err=>{console.log(err); setTimeout(() => {
        window.location.replace("/");
     }, 1000);},
    )
  }
  prepareFirbase(x) {
    let temp = [];
    for(let key in x){
      temp.push({UserID:x[key]['UserID'],Name:x[key]['Name'],ImageID:x[key]['ImageID']})
    }
    return temp;  
  }





  // ----------------------------------------------------------------------------
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.

      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.

      // The response body may contain clues as to what went wrong.

      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }

    // return an observable with a user-facing error message

    this.errorData = {
      errorCode: error.status,
      errorTitle: 'Oops! Request for document failed',
      errorDesc: 'Something bad happened. Please try again later.'
    };
    return throwError(this.errorData);
  }
}