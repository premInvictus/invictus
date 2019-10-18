import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrusertypeRoutingModule } from './hrusertype-routing.module';
import { SchoolComponent } from './school/school.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { HrSharedModule } from '../hr-shared/hr-shared.module';

@NgModule({
	imports: [
		CommonModule,
		HrusertypeRoutingModule,
		HrSharedModule,
	],
	declarations: [SchoolComponent,
		SchoolDashboardComponent]
})
export class HrusertypeModule { }
