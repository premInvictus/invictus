import { Component, OnInit } from '@angular/core';
import { FeeService, CommonAPIService, SisService } from '../../_services';
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
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public feeService: FeeService,
		public sisService: SisService,
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
		const inputJson = {};
		this.familyDetailArr = [];
		this.feeService.getFamilyWiseFeeReceipt(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.familyDetailArr = result.data;
			}
		});
	}

	editFamily(item) {
		this.common.setFamilyData(item);
		this.router.navigate(['../add-family'], { relativeTo: this.route });
	}

	deleteFamily(item) {
		this.feeService.deleteFamily(item).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.common.showSuccessErrorMessage(result.message, 'success');
				this.getFamilyWiseFeeReceipt();
			} else {
				this.common.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

}
