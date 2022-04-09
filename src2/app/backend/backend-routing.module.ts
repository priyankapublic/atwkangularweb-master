import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../shared/auth.guard";
import { BackendComponent } from './backend.component';
import { MiddlePanComponent } from './middle-pan/middle-pan.component';
import { HowToUseComponent } from '../how-to-use/how-to-use.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
const routes: Routes = [

  { path: '', component: BackendComponent,canActivateChild:[AuthGuard]  ,
    children:[
      {path:'pass',component:HowToUseComponent},
      // {path:'pass',component:ChatHistoryUserContactListComponent,canActivateChild:[AuthGuard]},
      {path:'',component:MiddlePanComponent,canActivateChild:[AuthGuard]},
    ],canActivate:[AuthGuard]
   }, 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackendRoutingModule { }
