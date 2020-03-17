import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { InventoryService } from '../../_services';
import { NumberToWordPipe, IndianCurrency } from 'src/app/_pipes/index';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-bill-details-modal',
  templateUrl: './bill-details-modal.component.html',
  styleUrls: ['./bill-details-modal.component.css']
})
export class BillDetailsModalComponent implements OnInit {
  dialogRef: MatDialogRef<BillDetailsModalComponent>;
  tableReciptArray: any[] = [];
  @ViewChild('billDetailsModal') billDetailsModal;
  constructor(private dialog: MatDialog, public inventory: InventoryService) { }

  ngOnInit() {
  }
  openModal(data) {
    this.tableReciptArray['bill_total'] = new IndianCurrency().transform(data.bill_total);
    this.tableReciptArray['bill_total_words'] = new TitleCasePipe().transform(new NumberToWordPipe().transform(data.bill_total));
    this.tableReciptArray['bill_details'] = data.bill_details;
    this.tableReciptArray['name'] = data.name;
    this.tableReciptArray['mobile'] = data.contact;
    this.tableReciptArray['adm_no'] = data.emp_id;
    if (data.au_role_id === 3) {
      this.tableReciptArray['class_name'] = '';
      this.tableReciptArray['role_id'] = 'Employee Id';
    } else {
      this.tableReciptArray['adm_no'] = data.em_admission_no;
      //this.tableReciptArray['class_name'] = this.userData.sec_name ? this.userData.class_name + '-' + this.userData.sec_name : '';
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
}
