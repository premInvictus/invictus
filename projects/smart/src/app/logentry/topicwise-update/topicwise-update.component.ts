import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-topicwise-update',
  templateUrl: './topicwise-update.component.html',
  styleUrls: ['./topicwise-update.component.css']
})
export class TopicwiseUpdateComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  openUpdateConfirmation() {
    const dialogRef = this.dialog.open(UpdateConfirmation, {
      height: '400px',
      width: '550px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
  }

}

@Component({
  selector: 'update-confirmation',
  templateUrl: 'update-confirmation.html',
})
export class UpdateConfirmation {}
