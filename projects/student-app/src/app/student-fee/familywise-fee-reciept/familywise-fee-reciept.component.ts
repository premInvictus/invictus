import { Component, OnInit, ViewChild } from '@angular/core';

import { ErpCommonService, CommonAPIService } from '../../../../../../src/app/_services/index';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
	selector: 'app-familywise-fee-reciept',
	templateUrl: './familywise-fee-reciept.component.html',
	styleUrls: ['./familywise-fee-reciept.component.css']
})
export class FamilywiseFeeRecieptComponent implements OnInit {
	familyDetailArr: any[] = [];
	printFamilyArr: any[] = [];
	enablePrint = false;
	loginId;
	processType;
	@ViewChild('deleteModal') deleteModal;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public erpCommonService: ErpCommonService,
		private fbuild: FormBuilder,
		private common: CommonAPIService,
		public dialog: MatDialog) { }

	ngOnInit() {
		this.getFamilyWiseFeeReceipt();
	}

	moveToAddFamily() {
		this.router.navigate(['../add-family'], { relativeTo: this.route });
	}

	getFamilyWiseFeeReceipt() {
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.loginId = currentUser.login_id;
		this.processType = currentUser.au_process_type;
		const inputJson = {login_id : this.loginId , process_type : this.processType};
		this.familyDetailArr = [];
		this.erpCommonService.getFamilyWiseFeeReceipt(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.familyDetailArr = result.data;
			}
		});
	}

	editFamily(item) {
		this.common.setFamilyData(item);
		this.router.navigate(['../add-family'], { relativeTo: this.route });
	}

	openDeleteDialog = (data) => this.deleteModal.openModal(data);

	goToFamilyInformation(familyEntryNumber) {
		this.common.setFamilyInformation(familyEntryNumber);
		this.router.navigate(['../family-information'], { relativeTo: this.route });
	}

	deleteFamily(value) {
		console.log('in');
		// this.erpCommonService.deleteFamily(value).subscribe((result: any) => {
		// 	if (result && result.status === 'ok') {
		// 		this.common.showSuccessErrorMessage(result.message, 'success');
		// 		this.getFamilyWiseFeeReceipt();
		// 	} else {
		// 		this.common.showSuccessErrorMessage(result.message, 'error');
		// 	}
		// });
	}

	// setDataForPrint(event, item) {
	// 	if (event.checked) {
	// 		this.printFamilyArr.push(item.fam_entry_number);
	// 	} else {
	// 		for (let i = 0; i < this.printFamilyArr.length; i++) {
	// 			if (this.printFamilyArr[i].toString() === item.fam_entry_number.toString()) {
	// 				this.printFamilyArr.splice(i, 1);
	// 			}
	// 		}
	// 	}

	// 	if (this.printFamilyArr.length > 0) {
	// 		this.enablePrint = true;
	// 	} else {
	// 		this.enablePrint = false;
	// 	}
	// }

	printFamilyInvoice(item) {
		this.printFamilyArr = [];
		this.printFamilyArr.push(item.fam_entry_number);
		const inputJson = {'family_entry_numbers' : this.printFamilyArr, 'with_summary' : true};
		this.erpCommonService.printFamilyInvoice(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log('result', result.data);
				//this.familyDetailArr = result.data;
			}
		});
	}

}
