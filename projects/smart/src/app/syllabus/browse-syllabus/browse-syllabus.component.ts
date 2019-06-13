import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-browse-syllabus',
  templateUrl: './browse-syllabus.component.html',
  styleUrls: ['./browse-syllabus.component.css']
})
export class BrowseSyllabusComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  openUnpublishModal() {
    const dialogRef = this.dialog.open(UnpublishModal, {
      height: '550px',
      width: '550px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(UnpublishModal, {
      height: '550px',
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
  selector: 'unpublish-modal',
  templateUrl: 'unpublish-modal.html',
})
export class UnpublishModal {}
