import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicQnaRoutingModule } from './public-qna-routing.module';
import { PublicQnaComponent } from './public-qna.component';
import { QuestionComponent } from './question/question.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [PublicQnaComponent, QuestionComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    PublicQnaRoutingModule
  ]
})
export class PublicQnaModule { }
