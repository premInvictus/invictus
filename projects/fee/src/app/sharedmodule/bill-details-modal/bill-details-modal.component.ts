import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
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
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }
  openModal(data) {
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
}
