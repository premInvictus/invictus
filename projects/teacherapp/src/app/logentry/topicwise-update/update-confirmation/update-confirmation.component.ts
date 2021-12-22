import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
	selector: 'app-update-confirmation',
	templateUrl: './update-confirmation.component.html',
	styleUrls: ['./update-confirmation.component.css']
})
export class UpdateConfirmationComponent implements OnInit {

	step1Flag = true;
	step2Flag = false; 	// for publich or checked
	step3Flag = false;  // for unpublish or uncheck
	tw_entry_date = moment(new Date());
	mod_review_remark = '';
	ckeConfig: any;
	constructor(
		private dialogRef: MatDialogRef<UpdateConfirmationComponent>,
		@Inject(MAT_DIALOG_DATA) public data
	) { }

	ngOnInit() {
		console.log(this.data);
	}

	closeDialog() {
		this.dialogRef.close();
	}
	goToNext() {
		if (this.data.tw_status === '1') {
			this.step1Flag = false;
			this.step2Flag = true;
			this.step3Flag = false;
		} else {
			this.step1Flag = false;
			this.step2Flag = false;
			this.step3Flag = true;
		}
	}
	submitUpdate() {
		if (this.step2Flag) {
			this.dialogRef.close({ update: true, tw_entry_date: this.tw_entry_date.toDate(), mod_review_remark: this.mod_review_remark });
		}
		if (this.step3Flag) {
			if (this.mod_review_remark) {
				this.dialogRef.close({ update: true, tw_entry_date: this.tw_entry_date.toDate(), mod_review_remark: this.mod_review_remark });
			}
		}
	}

}
