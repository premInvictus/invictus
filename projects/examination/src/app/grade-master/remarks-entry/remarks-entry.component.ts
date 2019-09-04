import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-remarks-entry',
  templateUrl: './remarks-entry.component.html',
  styleUrls: ['./remarks-entry.component.css']
})
export class RemarksEntryComponent implements OnInit {


  ngOnInit() {
  }

  constructor(public dialog: MatDialog) {}

  openRemarkDialog(): void {
    const dialogRef = this.dialog.open(RemarksDialog, {
      width: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'remarks-dialog',
  templateUrl: 'remarks-dialog.html',
})
export class RemarksDialog {

  constructor(
    public dialogRef: MatDialogRef<RemarksDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}