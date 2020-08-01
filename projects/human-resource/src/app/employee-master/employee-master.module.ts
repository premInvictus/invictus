import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';


import { HrSharedModule } from '../hr-shared/hr-shared.module';
import * as _moment from 'moment';
import { EmployeeMasterRoutingModule } from './employee-master-routing.module';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { EmployeeTabOneContainerComponent } from './employee-tab-one-container/employee-tab-one-container.component';
import { EmployeeTabTwoContainerComponent } from './employee-tab-two-container/employee-tab-two-container.component';
import { EmployeeTabThreeContainerComponent } from './employee-tab-three-container/employee-tab-three-container.component';
import { EmployeeTabFourContainerComponent } from './employee-tab-four-container/employee-tab-four-container.component';
import { EmployeeTabFiveContainerComponent } from './employee-tab-five-container/employee-tab-five-container.component';
import { EmployeeTabSixContainerComponent } from './employee-tab-six-container/employee-tab-six-container.component';
import { EmployeeAttendanceComponent } from './employee-attendance/employee-attendance.component';
import { EmployeeLeaveComponent } from './employee-leave/employee-leave.component';
import { EmployeeLedgerComponent } from './employee-ledger/employee-ledger.component';
import { LeaveMasterComponent } from './leave-master/leave-master.component';
import { PreviewDocumentComponent } from './employee-tab-six-container/preview-document/preview-document.component';
import { EmpEnqCommonComponent } from './emp-enq-common/emp-enq-common.component';
import { EmpEnqDetailsComponent } from './emp-enq-details/emp-enq-details.component';
import { EmpEnqTabOneComponent } from './emp-enq-tab-one/emp-enq-tab-one.component';
import { EmpEnqTabTwoComponent } from './emp-enq-tab-two/emp-enq-tab-two.component';
import { EmpEnqTabThreeComponent } from './emp-enq-tab-three/emp-enq-tab-three.component';
import { EmpEnqTabFourComponent } from './emp-enq-tab-four/emp-enq-tab-four.component';
import { EmpEnqTabFiveComponent } from './emp-enq-tab-five/emp-enq-tab-five.component';
import { LeaveCreditComponent } from './employee-leave/leave-credit/leave-credit.component';

const moment = _moment;

export const MY_FORMATS = {
	parse: {
		dateInput: 'L',
	},
	display: {
		dateInput: 'DD-MMM-YYYY',
		monthYearLabel: 'YYYY',
		dateA11yLabel: 'LL',
		monthYearA11yLabel: 'YYYY',
	},
};
@NgModule({
	imports: [
		CommonModule,
		HrSharedModule,
		EmployeeMasterRoutingModule
	],
	declarations: [
		EmployeeDetailComponent,
		EmployeeTabOneContainerComponent,
		EmployeeTabTwoContainerComponent,
		EmployeeTabThreeContainerComponent,
		EmployeeTabFourContainerComponent,
		EmployeeTabFiveContainerComponent,
		EmployeeTabSixContainerComponent,
		EmployeeAttendanceComponent,
		EmployeeLeaveComponent,
		EmployeeLedgerComponent,
		LeaveMasterComponent,
		PreviewDocumentComponent,
		EmpEnqCommonComponent,
		EmpEnqDetailsComponent,
		EmpEnqTabOneComponent,
		EmpEnqTabTwoComponent,
		EmpEnqTabThreeComponent,
		EmpEnqTabFourComponent,
		EmpEnqTabFiveComponent,
		LeaveCreditComponent,
	],
	entryComponents: [PreviewDocumentComponent,LeaveCreditComponent],
	providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

	{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class EmployeeMasterModule { }
