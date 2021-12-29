import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CommonAPIService} from 'src/app/_services';
@Component({
  selector: 'app-timeout-modal',
  templateUrl: './timeout-modal.component.html',
  styleUrls: ['./timeout-modal.component.css']
})
export class TimeoutModalComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<TimeoutModalComponent>,
    public common: CommonAPIService) { }
  countDownTime: any;
  ngOnInit() {
  }
  expire() {
    this.dialogRef.close({ extend: true });
  }

  cancel() {
    this.dialogRef.close({ extend: false });
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
