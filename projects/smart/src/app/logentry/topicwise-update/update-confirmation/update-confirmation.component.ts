import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
	selector: 'app-update-confirmation',
	templateUrl: './update-confirmation.component.html',
	styleUrls: ['./update-confirmation.component.css']
})
export class UpdateConfirmationComponent implements OnInit {

	step1Flag = true;
	step2Flag = false;
	tw_entry_date = moment(new Date());
	constructor(
		private dialogRef: MatDialogRef<UpdateConfirmationComponent>
	) { }

	ngOnInit() {
	}

	closeDialog() {
		this.dialogRef.close();
	}
	goToStep2() {
		this.step1Flag = false;
		this.step2Flag = true;
	}
	submitUpdate() {
		this.dialogRef.close({update: true, tw_entry_date: this.tw_entry_date.toDate()});
	}

}
