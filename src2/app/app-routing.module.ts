import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactivateComponent } from './reactivate/reactivate.component';
import { HowToUseComponent } from './how-to-use/how-to-use.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { EmailSentComponent } from './email-sent/email-sent.component';


const routes: Routes = [
  { path: '', loadChildren: () => import('./backend/backend.module').then(m => m.BackendModule) },
  { path: 'public-qna', loadChildren: () => import('./public-qna/public-qna.module').then(m => m.PublicQnaModule) }, 
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},  
  {path:'forgot-password',component:ForgotPasswordComponent},  
  {path:'how-to-use',component:HowToUseComponent},  
  {path:'reactivate',component:ReactivateComponent},  
  {path:'email-sent',component:EmailSentComponent}, 
  {path:'**',component:PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
