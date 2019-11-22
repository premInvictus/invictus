import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiscusertypeRoutingModule } from './miscusertype-routing.module';
import { SchoolComponent } from './school/school.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { MiscSharedModule } from '../misc-shared/misc-shared.module';

@NgModule({
	imports: [
		CommonModule,
		MiscusertypeRoutingModule,
		MiscSharedModule,
	],
	declarations: [SchoolComponent,
		SchoolDashboardComponent]
})
export class MiscusertypeModule { }
