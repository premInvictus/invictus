import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-gradecard-printing',
  templateUrl: './gradecard-printing.component.html',
  styleUrls: ['./gradecard-printing.component.css']
})
export class GradecardPrintingComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  openGradeCardPrint(): void {
    const dialogRef = this.dialog.open(GradeCardPrint, {
      width: '80%',
      height: '80%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
  }

}

@Component({
  selector: 'grade-card-print',
  templateUrl: 'grade-card-print.html',
})
export class GradeCardPrint {

  constructor(
    public dialogRef: MatDialogRef<GradeCardPrint>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}