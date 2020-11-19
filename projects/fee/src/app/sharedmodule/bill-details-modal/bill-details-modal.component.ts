import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { NumberToWordPipe, IndianCurrency } from 'src/app/_pipes/index';
import { TitleCasePipe } from '@angular/common';
import { FeeService,CommonAPIService,SisService } from '../../_services'
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-bill-details-modal',
  templateUrl: './bill-details-modal.component.html',
  styleUrls: ['./bill-details-modal.component.css']
})
export class BillDetailsModalComponent implements OnInit {
  dialogRef: MatDialogRef<BillDetailsModalComponent>;
  tableReciptArray: any[] = [];
  currentUser:any;
  schoolInfo:any;
  data:any;
  @ViewChild('billDetailsModal') billDetailsModal;
  constructor(
    private dialog: MatDialog,
    private feeService:FeeService,
    private common:CommonAPIService,
    private sisService:SisService) { 
      this.getSchool();
    }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
  getSchool() {
    this.sisService.getSchool()
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.schoolInfo = result.data[0];
          }
        });
  }
  openModal(data) {
    this.data = data;
    console.log(data);
    this.tableReciptArray['bill_total'] = data.bill_total ? new IndianCurrency().transform(data.bill_total) : 0;
    this.tableReciptArray['bill_total_words'] = data.bill_total ? new TitleCasePipe().transform(new NumberToWordPipe().transform(data.bill_total)): '';
    this.tableReciptArray['bill_details'] = data.bill_details;
    this.tableReciptArray['name'] = data.buyer_details.au_full_name;
    this.tableReciptArray['mobile'] = data.buyer_details.au_mobile;
    this.tableReciptArray['adm_no'] = data.buyer_details.em_admission_no;
    this.tableReciptArray['class'] = data.buyer_details.class_name;
    this.dialogRef = this.dialog.open(this.billDetailsModal, {
      'height': '50vh',
      'width': '100vh',
      position: {
        'top': '10%'
      }
    });
  }
  printBill() {
    let billArray: any = {};
    billArray['bill_id'] = this.data.bill_no;
    billArray['bill_date'] = this.common.dateConvertion(this.data.created_date, 'dd-MMM-y');
    billArray['bill_total'] = this.data.bill_total ? new IndianCurrency().transform(this.data.bill_total) : 0;
    billArray['bill_total_words'] = new TitleCasePipe().transform(new NumberToWordPipe().transform(this.data.bill_total));
    billArray['bill_created_by'] = this.currentUser.full_name;
    billArray['bill_details'] = this.data.bill_details;
    billArray['school_name'] = this.schoolInfo.school_name;
    billArray['school_logo'] = this.schoolInfo.school_logo;
    billArray['school_address'] = this.schoolInfo.school_address;
    billArray['school_phone'] = this.schoolInfo.school_phone;
    billArray['school_city'] = this.schoolInfo.school_city;
    billArray['school_state'] = this.schoolInfo.school_state;
    billArray['school_afflication_no'] = this.schoolInfo.school_afflication_no;
    billArray['school_website'] = this.schoolInfo.school_website;
    billArray['name'] = this.data.buyer_details.au_full_name;
    billArray['mobile'] = this.data.buyer_details.au_mobile;
    billArray['adm_no'] = this.data.buyer_details.em_admission_no;
    billArray['class_name'] = this.data.buyer_details.sec_name ? this.data.buyer_details.class_name + '-' + this.data.buyer_details.sec_name : '';
    billArray['role_id'] = 'Admission No.';
    this.feeService.generateStoreBill(billArray).subscribe((result: any) => {
      if (result && result.status == 'ok') {
        const length = result.data.fileUrl.split('/').length;
        saveAs(result.data.fileUrl, result.data.fileUrl.split('/')[length - 1]);
      }
    })
  }
}
