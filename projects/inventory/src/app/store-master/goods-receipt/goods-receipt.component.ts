import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Element } from './goods-receipt.model';
import { CommonAPIService, SisService, AxiomService, InventoryService } from '../../_services';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-goods-receipt',
  templateUrl: './goods-receipt.component.html',
  styleUrls: ['./goods-receipt.component.css']
})
export class GoodsReceiptComponent implements OnInit {
  @ViewChild('receiptModal') receiptModal;
  orderArray: any[] = [];
  setArray: any[] = [];
  itemCode: any;
  itemCodeArray: any[] = [];
  finalOrderArray: any = {};
  toBePromotedList: any[] = [];
  tableDivFlag = false;
  tabledataFlag = false;
  update_id: any;
  currentUser: any;
  session: any;
  ELEMENT_DATA: any[] = [];
  schoolInfo: any;
  pageLength: number;
  pageSize = 300;
  pageSizeOptions = [100, 300, 1000];
  submitParam: any = {};
  displayedColumns: string[] = ['position', 'po_number', 'po_date', 'created_by', 'vendor_id', 'vendor_name',
    'vendor_category', 'vendor_contact', 'vendor_email', 'print', 'action'];
  dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  spans = [];
  allselectedP = false;
  constructor(
    private fbuild: FormBuilder,
    public commonService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
    public inventory: InventoryService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.getSchool();
    this.getAllOrderMaster();
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
  getAllOrderMaster() {
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.inventory.getOrderMaster({ 'pm_type': "GR" }).subscribe((result: any) => {
      if (result) {
        this.orderArray = result;
        let ind = 0;
        for (const item of this.orderArray) {
          this.ELEMENT_DATA.push({
            "position": ind + 1,
            "po_number": item.pm_id,
            "po_date": item.pm_created ? item.pm_created.created_date : '-',
            "created_by": item.pm_created ? item.pm_created.created_by_name : '-',
            "vendor_id": item.pm_vendor ? item.pm_vendor.ven_id : '-',
            "vendor_name": item.pm_vendor ? item.pm_vendor.ven_name : '-',
            "vendor_category": item.pm_vendor ? item.pm_vendor.ven_category : '-',
            "vendor_contact": item.pm_vendor ? item.pm_vendor.ven_contact : '-',
            "vendor_email": item.pm_vendor ? item.pm_vendor.ven_email : '-',
            "print": { 'pm_id': item.pm_id, 'pm_status': item.pm_status },
            "action": { 'pm_id': item.pm_id, 'pm_status': item.pm_status }
          });
          ind++;
        }
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        this.pageLength = this.ELEMENT_DATA.length;
        this.dataSource.paginator = this.paginator;
        this.tableDivFlag = true;
        this.tabledataFlag = true;
      }
    });
  }
  actionList(pm_id, action) {
    if (action === 'approved') {
      this.submitParam.pm_id = pm_id;
      this.receiptModal.openModal(this.submitParam);
    }
  }
  printReceipt(pm_id) {
    const sindex = this.orderArray.findIndex(f => Number(f.pm_id) === Number(pm_id));
    if (sindex !== -1) {
      let receiptArray: any = {};
      receiptArray['receipt_no'] = this.orderArray[sindex].pm_id;
      receiptArray['date'] =this.commonService.dateConvertion(this.orderArray[sindex].pm_updated.update_date,'dd-MMM-y');
      receiptArray['vendor_name'] = this.orderArray[sindex].pm_vendor.ven_name;
      receiptArray['po_no'] = this.orderArray[sindex].pm_details.purchase_order_id;
      receiptArray['invoice_no'] = this.orderArray[sindex].pm_details.invoice_no;
      receiptArray['school_name'] = this.schoolInfo.school_name;
      receiptArray['school_logo'] = this.schoolInfo.school_logo;
      receiptArray['school_address'] = this.schoolInfo.school_address;
      this.inventory.generatePdfOfReceipt(receiptArray).subscribe((result: any) => {
        if (result && result.status == 'ok') {
          this.commonService.showSuccessErrorMessage(result.message, 'success');
          const length = result.data.fileUrl.split('/').length;
          saveAs(result.data.fileUrl, result.data.fileUrl.split('/')[length - 1]);
        }
      });
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

