import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  ngOnInit() {
  }

  constructor(public dialog: MatDialog) {}

  openReviewDialog(): void {
    const dialogRef = this.dialog.open(ReviewDialog, {
      width: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'review-dialog',
  templateUrl: 'review-dialog.html',
})
export class ReviewDialog {

  constructor(
    public dialogRef: MatDialogRef<ReviewDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}