import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-classwork-update',
  templateUrl: './classwork-update.component.html',
  styleUrls: ['./classwork-update.component.css']
})
export class ClassworkUpdateComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  openReviewClasswork() {
    const dialogRef = this.dialog.open(ReviewClasswork, {
      height: '600px',
      width: '950px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
  }

}

@Component({
  selector: 'review-classwork',
  templateUrl: 'review-classwork.html',
})
export class ReviewClasswork {}
