import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { SmsModal } from './sms-deliver-status.model';

@Component({
  selector: 'app-sms-deliver-status',
  templateUrl: './sms-deliver-status.component.html',
  styleUrls: ['./sms-deliver-status.component.css']
})
export class SmsDeliverStatusComponent implements OnInit {
  ELEMENT_DATA: any[] = [];
  dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  displayedColumns: string[] = ['srno', 'au_full_name', 'class_name', 'mobile', 'msg_status'];
  inputData: any;
  dialogRef: MatDialogRef<SmsDeliverStatusComponent>;
  @ViewChild('smsModal') smsModal;
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }
  openModal(data) {
    this.inputData = data;
    console.log('inputData--', this.inputData);
    let ind = 0;
    this.ELEMENT_DATA = [];
    for (const item of this.inputData) {
      this.ELEMENT_DATA.push({
        "srno": ind + 1,
        "au_full_name": item.au_full_name,
        "class_name": item.class_name + '-' + item.sec_name,
        "mobile": item.mobile,
        "msg_status": Array.isArray(item.msg_status) ? item.msg_status[0].status_name : (item.msg_status.status_name).toLowerCase()
      });
      ind++;
    }
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.dialogRef = this.dialog.open(this.smsModal, {
      'height': '50vh',
      'width': '100vh',
      position: {
        'top': '10%'
      }
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
