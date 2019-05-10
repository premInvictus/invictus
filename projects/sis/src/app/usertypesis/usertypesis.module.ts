import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolComponent } from './school/school.component';
import { UserCredentialComponent } from './user-credential/user-credential.component';
import { UserTypeRoutingModule } from './usertype-routing.module';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';


@NgModule({
	imports: [
		CommonModule,
		UserTypeRoutingModule,
		SharedmoduleModule,

	],
	declarations:
		[
			SchoolComponent,
			UserCredentialComponent,
			SchoolDashboardComponent
		],

	exports:
		[
			SchoolComponent,
			UserCredentialComponent
		]
})
export class UsertypeSisModule { }
