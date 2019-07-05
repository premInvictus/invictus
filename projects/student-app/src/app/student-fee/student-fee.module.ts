import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentFeeRoutingModule } from './student-fee-routing.module';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StudentFeeDetailComponent } from './student-fee-detail/student-fee-detail.component';

@NgModule({
	imports: [
		CommonModule,
		StudentFeeRoutingModule,
		SharedModuleModule,
		ReactiveFormsModule,
		FormsModule,
	],
	declarations: [StudentFeeDetailComponent]
})
export class StudentFeeModule { }
