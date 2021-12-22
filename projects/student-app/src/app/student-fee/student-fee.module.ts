import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentFeeRoutingModule } from './student-fee-routing.module';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StudentFeeDetailComponent } from './student-fee-detail/student-fee-detail.component';
import { FamilywiseFeeRecieptComponent } from './familywise-fee-reciept/familywise-fee-reciept.component';
import { FamilyInformationComponent } from './family-information/family-information.component';
import { PaymentChooserComponent } from './payment-chooser/payment-chooser.component';
import { AdvancePaymentFeeComponent } from './advance-payment-fee/advance-payment-fee.component';


@NgModule({
	imports: [
		CommonModule,
		StudentFeeRoutingModule,
		SharedModuleModule,
		ReactiveFormsModule,
		FormsModule,
	],
	entryComponents: [PaymentChooserComponent],
	declarations: [StudentFeeDetailComponent, FamilywiseFeeRecieptComponent, FamilyInformationComponent, PaymentChooserComponent, 
		AdvancePaymentFeeComponent]
})
export class StudentFeeModule { }
