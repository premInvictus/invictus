import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartusertypeRoutingModule } from './smartusertype-routing.module';
import { SmartSharedModule } from '../smart-shared/smart-shared.module';
import { SchoolComponent } from './school/school.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';

@NgModule({
	imports: [
		CommonModule,
		SmartusertypeRoutingModule,
		SmartSharedModule,
	],
	declarations: [SchoolComponent,
		SchoolDashboardComponent]
})
export class SmartusertypeModule { }
