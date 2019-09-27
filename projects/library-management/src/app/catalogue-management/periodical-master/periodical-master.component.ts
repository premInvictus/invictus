import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-periodical-master',
  templateUrl: './periodical-master.component.html',
  styleUrls: ['./periodical-master.component.css']
})
export class PeriodicalMasterComponent implements OnInit {


  

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
  }

  openAddSubscriptionDialog(): void {
    const dialogRef = this.dialog.open(AddSubscriptionDialog, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      
    });
  }


}

@Component({
  selector: 'add-subscription-dialog',
  templateUrl: 'add-subscription-dialog.html',
})
export class AddSubscriptionDialog {

  constructor(
    public dialogRef: MatDialogRef<AddSubscriptionDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
