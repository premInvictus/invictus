import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-vendor-master',
  templateUrl: './vendor-master.component.html',
  styleUrls: ['./vendor-master.component.css']
})
export class VendorMasterComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
  }

  addVendorDialog(): void {
    const dialogRef = this.dialog.open(AddVendorDialog, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}


@Component({
  selector: 'add-vendor-dialog',
  templateUrl: 'add-vendor-dialog.html',
})
export class AddVendorDialog {

  constructor(
    public dialogRef: MatDialogRef<AddVendorDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}