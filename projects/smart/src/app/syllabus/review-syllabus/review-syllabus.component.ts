import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-review-syllabus',
  templateUrl: './review-syllabus.component.html',
  styleUrls: ['./review-syllabus.component.css']
})
export class ReviewSyllabusComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(EditSyllabus, {
      height: '550px',
      width: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
  }

}

@Component({
  selector: 'edit-syllabus',
  templateUrl: 'edit-syllabus.html',
})
export class EditSyllabus {}
