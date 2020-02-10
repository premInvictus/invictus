import { Component, OnInit, Inject } from '@angular/core';
import { CommonAPIService } from '../../_services/index';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CapitalizePipe } from '../../_pipes';

@Component({
  selector: 'app-call-log-remarks-modal',
  templateUrl: './call-log-remarks-modal.component.html',
  styleUrls: ['./call-log-remarks-modal.component.css']
})
export class CallLogRemarksModalComponent implements OnInit {
  fromCaller: any;
  remarksArray: any[] = [];
  constructor(private commonAPIService: CommonAPIService,
    public dialogRef: MatDialogRef<CallLogRemarksModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.fromCaller = data.from_caller;
  }

  ngOnInit() {
    this.getRemarksList();
  }

  getRemarksList() {
    this.commonAPIService.callRemarkslist({ 'from_caller': this.fromCaller }).subscribe((result: any) => {
      if (result) {
        this.remarksArray = result;
      }
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }

}

