import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-update-confirmation',
	templateUrl: './update-confirmation.component.html',
	styleUrls: ['./update-confirmation.component.css']
})
export class UpdateConfirmationComponent implements OnInit {

	constructor(
		private dialogRef: MatDialogRef<UpdateConfirmationComponent>
	) { }

	ngOnInit() {
	}

}
