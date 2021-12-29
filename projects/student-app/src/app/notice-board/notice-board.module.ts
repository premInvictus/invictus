import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NoticeBoardRoutingModule } from './notice-board-routing.module';
import { NoticeComponent } from './notice/notice.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ScrollingModule} from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    CommonModule,
    InfiniteScrollModule,
    SharedModuleModule,
    NoticeBoardRoutingModule,
    ScrollingModule
  ],
  declarations: [NoticeComponent]
})
export class NoticeBoardModule { }
