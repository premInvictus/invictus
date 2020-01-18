import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { ReceiptModal } from './receipt-modal.model';
import { InventoryService } from '../../_services';
@Component({
  selector: 'app-receipt-modal',
  templateUrl: './receipt-modal.component.html',
  styleUrls: ['./receipt-modal.component.css']
})
export class ReceiptModalComponent implements OnInit {
  inputData: any;
  vendor_name: any;
  vendor_contact: any;
  vendor_category: any;
  vendor_email: any; 
  receipt_no: any;
  recipt_date: any;
  created_by: any;
  ELEMENT_DATA: any[] = [];
  dialogRef: MatDialogRef<ReceiptModalComponent>;
  @ViewChild('receiptModal') receiptModal;
  displayedColumns: string[] = ['position', 'item_code', 'item_name', 'item_quantity', 'item_price', 'item_location'];
  dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  constructor(private dialog: MatDialog, public inventory: InventoryService) { }
  ngOnInit() {
  }
  openModal(data) {
    this.ELEMENT_DATA = [];
    this.inputData = data;
    this.inputData.pm_type = 'GR';
    this.inventory.getOrderMaster(this.inputData).subscribe((result: any) => {
      if (result) {
        let ind = 0;
        this.vendor_name = result[0].pm_vendor.ven_name ? result[0].pm_vendor.ven_name : '-';
        this.vendor_contact = result[0].pm_vendor.ven_contact ? result[0].pm_vendor.ven_contact : '-';
        this.vendor_category = result[0].pm_vendor.ven_category ? result[0].pm_vendor.ven_category : '-';
        this.vendor_email = result[0].pm_vendor.ven_email ? result[0].pm_vendor.ven_email : '-';
        this.receipt_no = result[0].pm_id ? result[0].pm_id : '-';
        this.recipt_date = result[0].pm_created.created_date ? result[0].pm_created.created_date : '-';
        this.created_by = result[0].pm_created.created_by_name ? result[0].pm_created.created_by_name : '-';
        for (const item of result[0].pm_item_details) {
          this.ELEMENT_DATA.push({
            "position": ind + 1,
            "item_code": item.item_code,
            "item_name": item.item_name,
            "item_price": item.item_price,
            "item_quantity": item.item_quantity,
            "item_location": item.item_location
          });
          ind++;
        }
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        this.dialogRef = this.dialog.open(this.receiptModal, {
          'height': '50vh',
          'width': '100vh',
          position: {
            'top': '10%'
          }
        });
      }
    });

  }
  closeDialog() {
    this.dialogRef.close();
  }

}

