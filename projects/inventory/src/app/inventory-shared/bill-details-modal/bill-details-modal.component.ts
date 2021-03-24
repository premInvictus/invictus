import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { InventoryService,SisService } from '../../_services';
import { NumberToWordPipe, IndianCurrency } from 'src/app/_pipes/index';
import { TitleCasePipe } from '@angular/common';
import { CommonAPIService } from 'src/app/_services';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-bill-details-modal',
  templateUrl: './bill-details-modal.component.html',
  styleUrls: ['./bill-details-modal.component.css']
})
export class BillDetailsModalComponent implements OnInit {
  data:any;
  dialogRef: MatDialogRef<BillDetailsModalComponent>;
  tableReciptArray: any[] = [];
  schoolInfo:any;
  @ViewChild('billDetailsModal') billDetailsModal;
  constructor(
    private dialog: MatDialog, 
    public inventory: InventoryService,
    public sisService: SisService,
    public common: CommonAPIService
    ) { }

  ngOnInit() {
    this.getSchool()
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
    console.log(data);
    this.data = data;
    this.tableReciptArray['bill_total'] = new IndianCurrency().transform(data.bill_total);
    this.tableReciptArray['bill_total_words'] = new TitleCasePipe().transform(new NumberToWordPipe().transform(data.bill_total));
    this.tableReciptArray['bill_details'] = data.bill_details;
    this.tableReciptArray['name'] = data.name;
    this.tableReciptArray['mobile'] = data.contact;
    this.tableReciptArray['adm_no'] = data.emp_id ? data.emp_id.split('-')[1] : '';
    if (data.au_role_id === 3) {
      this.tableReciptArray['class_name'] = '';
      this.tableReciptArray['role_id'] = 'Employee Id';
    } else {
      // this.tableReciptArray['adm_no'] = data.em_admission_no;
      this.tableReciptArray['class_name'] = data.class;
      this.tableReciptArray['role_id'] = 'Admission No.';
    }
    this.dialogRef = this.dialog.open(this.billDetailsModal, {
      'height': '50vh',
      'width': '100vh',
      position: {
        'top': '10%'
      }
    });
  }
  print(){
    let billArray: any = {};
    billArray['bill_id'] = this.data.action.bill_id;
    billArray['bill_date'] = this.common.dateConvertion(this.data.action.created_date, 'dd-MMM-y');
    billArray['bill_total'] = new IndianCurrency().transform(this.data.action.bill_total);
    billArray['bill_total_words'] = new TitleCasePipe().transform(new NumberToWordPipe().transform(this.data.action.bill_total));
    billArray['bill_created_by'] = this.data.action.created_by;
    billArray['bill_details'] = this.data.action.bill_details;
    billArray['school_name'] = this.schoolInfo.school_name;
    billArray['school_logo'] = this.schoolInfo.school_logo;
    billArray['school_address'] = this.schoolInfo.school_address;
    billArray['school_phone'] = this.schoolInfo.school_phone;
    billArray['school_city'] = this.schoolInfo.school_city;
    billArray['school_state'] = this.schoolInfo.school_state;
    billArray['school_afflication_no'] = this.schoolInfo.school_afflication_no;
    billArray['school_website'] = this.schoolInfo.school_website;
    billArray['name'] = this.data.action.buyer_details.au_full_name;
    billArray['mobile'] = this.data.action.buyer_details.active_contact;
    billArray['active_parent'] = this.data.action.buyer_details.active_parent;
    if (this.data.action.buyer_details.au_role_id === 3) {
      billArray['adm_no'] = this.data.action.buyer_details.emp_id;
      billArray['class_name'] = '';
      billArray['role_id'] = 'Employee Id';
    } else {
      billArray['adm_no'] = this.data.action.buyer_details.em_admission_no;
      billArray['class_name'] = this.data.action.buyer_details.sec_name ? this.data.action.buyer_details.class_name + '-' + this.data.action.buyer_details.sec_name : '';
      billArray['role_id'] = 'Admission No.';
    }
    this.inventory.generateStoreBill(billArray).subscribe((result: any) => {
      if (result && result.status == 'ok') {
        const length = result.data.fileUrl.split('/').length;
        saveAs(result.data.fileUrl, result.data.fileUrl.split('/')[length - 1]);
      }
    })
  }
}
