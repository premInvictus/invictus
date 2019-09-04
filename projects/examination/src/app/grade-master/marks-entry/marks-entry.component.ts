import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-marks-entry',
  templateUrl: './marks-entry.component.html',
  styleUrls: ['./marks-entry.component.css']
})
export class MarksEntryComponent implements OnInit {

  ngOnInit() {
  }

  constructor(public dialog: MatDialog) {}

  openMarkEntryDialog(): void {
    const dialogRef = this.dialog.open(MarksEntryDialog, {
      width: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'marks-entry-dialog',
  templateUrl: 'marks-entry-dialog.html',
})
export class MarksEntryDialog {

  constructor(
    public dialogRef: MatDialogRef<MarksEntryDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}