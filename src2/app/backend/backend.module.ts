import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendRoutingModule } from './backend-routing.module';
import { BackendComponent } from './backend.component';
import { BMaterialModule } from './b-material/b-material.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from '../shared/auth.guard';
import { FilterPipe } from '../pipe/filter.pipe';
import { LeftMenuBarComponent } from './left-menu-bar/left-menu-bar.component';
import { LeftSideBarComponent } from './left-side-bar/left-side-bar.component';
import { RightSideBarComponent } from './right-side-bar/right-side-bar.component';
import { ChatContactListComponent } from './chat-contact-list/chat-contact-list.component';
import { QaContactListComponent } from './qa-contact-list/qa-contact-list.component';
import { AboutComponent } from './about/about.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { HowToUseComponent } from './how-to-use/how-to-use.component';
import { TermsOfUsageComponent } from './terms-of-usage/terms-of-usage.component';
import { DonateNowComponent } from './donate-now/donate-now.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ProfileComponent } from './profile/profile.component';
import { MiddlePanComponent } from './middle-pan/middle-pan.component';
import { QnaComponent } from './qna/qna.component';
import { QnaFilterPipe } from '../pipe/qna-filter.pipe';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { SortPipe } from '../pipe/sort.pipe';
import { TagsFilterPipe } from '../pipe/tags-filter.pipe';
import { TagsMainFilterPipe } from '../pipe/tags-main-filter.pipe';
import { NgxSpinnerModule } from "ngx-spinner";
import { SettingComponent } from './setting/setting.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ScholarsContactListComponent } from './scholars-contact-list/scholars-contact-list.component';
import { ScholarsProfileComponent } from './scholars-profile/scholars-profile.component';
import { ScholarsComponent } from './scholars/scholars.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ScholarFilterPipe } from '../pipe/scholar-filter.pipe';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ModeratorDashboardComponent } from './moderator-dashboard/moderator-dashboard.component';
import { ModeratorContactListComponent } from './moderator-contact-list/moderator-contact-list.component';
import { ScholarRedirectComponent } from './scholar-redirect/scholar-redirect.component';
import { BulkMessagesComponent } from './bulk-messages/bulk-messages.component';
import { PendingContactListComponent } from './pending-contact-list/pending-contact-list.component';
import { PendingQueriesComponent } from './pending-queries/pending-queries.component';
import { PendingQueriesHistoryComponent } from './pending-queries-history/pending-queries-history.component';
import { PendingQueriesPipe } from '../pipe/pending-queries.pipe';
import { ModFilterPipe } from '../pipe/mod-filter.pipe';
import { ChatHistoryUserContactListComponent } from './chat-history-user-contact-list/chat-history-user-contact-list.component';
import { ChatHistoryUserComponent } from './chat-history-user/chat-history-user.component';
import { ChatHistoryUserRightComponent } from './chat-history-user-right/chat-history-user-right.component';
import { DragDropDirective } from '../directive/drag-drop.directive';
import { AddScholarComponent } from './add-scholar/add-scholar.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { LikeFilterPipe } from '../pipe/like-filter.pipe';


@NgModule({
  declarations: [
    BackendComponent,
    FilterPipe,
    QnaFilterPipe,
    LikeFilterPipe,
    ModFilterPipe,
    LeftMenuBarComponent,
    LeftSideBarComponent,
    RightSideBarComponent,
    ChatContactListComponent,
    QaContactListComponent,
    AboutComponent,
    NotificationsComponent,
    HowToUseComponent,
    TermsOfUsageComponent,
    DonateNowComponent,
    FeedbackComponent,
    ProfileComponent,
    MiddlePanComponent,
    QnaComponent,
    SortPipe,
    ScholarFilterPipe,
    TagsFilterPipe,
    TagsMainFilterPipe,
    PendingQueriesPipe,
    SettingComponent,
    UpdateProfileComponent,
    ChangePasswordComponent,
    ScholarsContactListComponent,
    ScholarsProfileComponent,
    ScholarsComponent,
    UserProfileComponent,
    UserDashboardComponent,
    ModeratorDashboardComponent,
    ModeratorContactListComponent,
    ScholarRedirectComponent,
    BulkMessagesComponent,
    PendingContactListComponent,
    PendingQueriesComponent,
    PendingQueriesHistoryComponent,
    ChatHistoryUserContactListComponent,
    ChatHistoryUserComponent,
    ChatHistoryUserRightComponent,
    DragDropDirective,
    AddScholarComponent,
    ],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    NgxDocViewerModule,
    HttpClientModule,
    ReactiveFormsModule,
    BackendRoutingModule,
    BMaterialModule,
    ImageCropperModule,
    NgxSpinnerModule,
    ScrollingModule,
  ],
  providers: [AuthGuard],

})
export class BackendModule { }
