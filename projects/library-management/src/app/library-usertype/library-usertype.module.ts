import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolComponent } from './school/school.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { LibraryusertypeRoutingModule } from './library-usertype.routing.module';
import { LibrarySharedModule } from '../library-shared/library-shared.module';
import { ViewAllDueComponent } from './school/view-all-due/view-all-due.component';

@NgModule({
  imports: [
    CommonModule,
    LibraryusertypeRoutingModule,
    LibrarySharedModule
  ],
  declarations: [SchoolComponent, SchoolDashboardComponent, ViewAllDueComponent]
})
export class LibraryUsertypeModule { }
