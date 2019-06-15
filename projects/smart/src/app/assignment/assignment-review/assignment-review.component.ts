import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-assignment-review',
  templateUrl: './assignment-review.component.html',
  styleUrls: ['./assignment-review.component.css']
})
export class AssignmentReviewComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  openEditAssignment() {
    const dialogRef = this.dialog.open(EditAssignment, {
      height: '550px',
      width: '650px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
  }

}

@Component({
  selector: 'edit-assignment',
  templateUrl: 'edit-assignment.html',
})
export class EditAssignment {}