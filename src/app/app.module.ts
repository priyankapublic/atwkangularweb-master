import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BrowserAnimationsModule, } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenIntercepterService } from './shared/token-intercepter.service';
import { RegisterComponent } from './register/register.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { JwtModule } from '@auth0/angular-jwt';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HowToUseComponent } from './how-to-use/how-to-use.component';
import { ReactivateComponent } from './reactivate/reactivate.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { AudioRecordingService } from './shared/audio-recording.service';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AsyncPipe } from '../../node_modules/@angular/common';
import { MessagingService } from './shared/messaging.service';
import { EmailSentComponent } from './email-sent/email-sent.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    HowToUseComponent,
    ReactivateComponent,
    EmailSentComponent,

  ],
  
  imports: [   
    AppRoutingModule,
    BrowserAnimationsModule,
    HammerModule,
    BrowserModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),  
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatSlideToggleModule,
    FormsModule,
    MatDialogModule,
    ImageCropperModule,
    JwtModule,
    NgxSpinnerModule
  ]
  , providers: [ MessagingService, AudioRecordingService, { provide: HTTP_INTERCEPTORS, useClass: TokenIntercepterService, multi: true }, AsyncPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
