import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicQnaComponent } from './public-qna.component';
import { QuestionComponent } from './question/question.component';

const routes: Routes = [
  {
    path: '', component: PublicQnaComponent,
    children: [
      { path: 'question/:id', component: QuestionComponent,}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicQnaRoutingModule { }
