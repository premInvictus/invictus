import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-cbse-marks-analysis',
  templateUrl: './cbse-marks-analysis.component.html',
  styleUrls: ['./cbse-marks-analysis.component.css']
})
export class CbseMarksAnalysisComponent implements OnInit {

  ngOnInit() {
  }

  constructor(public dialog: MatDialog) {}

  openUploadDialog(): void {
    const dialogRef = this.dialog.open(CbseMarksUploadDialog, {
      width: '60%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'cbse-marks-upload-dialog',
  templateUrl: 'cbse-marks-upload-dialog.html',
})
export class CbseMarksUploadDialog {

  constructor(
    public dialogRef: MatDialogRef<CbseMarksUploadDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
