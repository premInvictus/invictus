import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-syllabus-progress-report',
  templateUrl: './syllabus-progress-report.component.html',
  styleUrls: ['./syllabus-progress-report.component.css']
})
export class SyllabusProgressReportComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(AddRemarkPopUp, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
  }

}

@Component({
  selector: 'add-remark-pop-up',
  templateUrl: 'add-remark-pop-up.html',
})
export class AddRemarkPopUp {
  constructor(
    public dialogRef: MatDialogRef<AddRemarkPopUp>

  onNoClick(): void {
    this.dialogRef.close();
  }

}
