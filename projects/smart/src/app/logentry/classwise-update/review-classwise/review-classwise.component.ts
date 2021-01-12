import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-review-classwise',
  templateUrl: './review-classwise.component.html',
  styleUrls: ['./review-classwise.component.css']
})
export class ReviewClasswiseComponent implements OnInit {

  reviewArray: any[] = [];
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];

	constructor(
		public dialogRef: MatDialogRef<ReviewClasswiseComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
	) { }

	ngOnInit() {
		console.log(this.data);
		if (this.data) {
			this.reviewArray = this.data;
			console.log('reviewarray', this.reviewArray);
		}

	}
	closemodal(): void {
		this.dialogRef.close();
	}
	submitClasswork() {
		this.dialogRef.close({ data: true });
	}

}
