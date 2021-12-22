import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-mark-entry-submit-dialog',
  templateUrl: './mark-entry-submit-dialog.component.html',
  styleUrls: ['./mark-entry-submit-dialog.component.css']
})
export class MarkEntrySubmitDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MarkEntrySubmitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }
  closeDialog(status='no'): void {
    this.dialogRef.close({confirm: status});
  }

}
