import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransportusertypeRoutingModule } from './transportusertype-routing.module';
import { SchoolComponent } from './school/school.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { TransportSharedModule } from '../transport-shared/transport-shared.module';

@NgModule({
	imports: [
		CommonModule,
		TransportusertypeRoutingModule,
		TransportSharedModule,
	],
	declarations: [SchoolComponent,
		SchoolDashboardComponent]
})
export class TransportusertypeModule { }
