import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { InvItemDetailsComponent } from '../../inventory-shared/inv-item-details/inv-item-details.component';

@Component({
  selector: 'app-stock-reconciliation',
  templateUrl: './stock-reconciliation.component.html',
  styleUrls: ['./stock-reconciliation.component.css']
})
export class StockReconciliationComponent implements OnInit {
  allLocationData: any[] = [];
  searchForm: FormGroup;
  isLoading = false;
  toHighlight: string = '';
  location_data: '';
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('deleteModalRef') deleteModalRef;
  @ViewChild('approveModalRef') approveModalRef;
  vendorListData: any = [];
  currentItemCode = 0;
  currentLocationId = 0;
  STOCK_RECONCILIATION_LIST_ELEMENT: stockReconciliationListElement[] = [];
  stockReconciliationDataSource = new MatTableDataSource<stockReconciliationListElement>(this.STOCK_RECONCILIATION_LIST_ELEMENT);
  displayedListColumns: string[] = ['srno', 'verification_date', 'item_code', 'item_name',  'item_nature', 'item_category', 'item_location','item_current_stock', 'item_available_stock','action'];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fbuild: FormBuilder,
    private common: CommonAPIService,
    private erpCommonService: ErpCommonService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges() {
  }

  buildForm() {
    this.searchForm = this.fbuild.group({
      searchId: '',
      item_location: ''
    });

  }

  getStockReconciliation(locationData) {
    console.log('locationData--', locationData);
    this.currentLocationId = locationData.location_id;
    var inputJson = { location_id: locationData.location_id };
    let element: any = {};
    let recordArray = [];
    this.STOCK_RECONCILIATION_LIST_ELEMENT = [];
    this.stockReconciliationDataSource = new MatTableDataSource<stockReconciliationListElement>(this.STOCK_RECONCILIATION_LIST_ELEMENT);
    this.erpCommonService.getInventoryStockReconciliation(inputJson).subscribe((result:any) => {
      let pos = 1;
      this.stockReconciliationDataSource = recordArray = result;
      for (const item of recordArray) {
        element = {
          srno: pos,
          item_code: item.item_code,
          item_name: item.item_name,
          item_desc: item.item_description,
          item_nature: item.item_nature.name,
          item_category: item.item_category.name,
          item_location: item.location_hierarchy,
          item_location_id : item.location_id,
          item_current_stock: item.pv_item_data ? this.getCurrentStock(item.pv_item_data) : '',
          item_verification_date: item.pv_created_date ? item.pv_created_date : '',
          item_available_stock: item.available_stock ? item.available_stock : '',
          action:item
        };
        this.STOCK_RECONCILIATION_LIST_ELEMENT.push(element);
        pos++;

      }
      this.stockReconciliationDataSource = new MatTableDataSource<stockReconciliationListElement>(this.STOCK_RECONCILIATION_LIST_ELEMENT);
      this.stockReconciliationDataSource.paginator = this.paginator;
      if (this.sort) {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        this.stockReconciliationDataSource.sort = this.sort;
      }

    });

  }


  getCurrentStock(currentStockData) {
    for(var i=0; i<currentStockData.length; i++) {
      if(Number(currentStockData[i].location_id) === Number(this.currentLocationId)) {
        return currentStockData[i].item_qty
      }
    }
  }

  approveVerification(item) {
    var inputJson = {
      pv_item_code: Number(item.item_code),
      pv_location_id: Number(item.item_location_id),
      pv_item_stock: item.item_available_stock
    };
    this.erpCommonService.updateInventoryStockReconciliation(inputJson).subscribe((result:any) => {
      this.common.showSuccessErrorMessage('Stock Reconciliation Approve Successfully', 'success');
      this.getStockReconciliation({location_id: Number(this.currentLocationId) })
    });
  }

  approveVerificationModel(element,flag) {

  }

  openModal(data) {
    data['from'] = 'inv-physical';
    this.deleteModalRef.openModal(data);
  } 

  openApproveModal(data) {
    data.text = 'Approve';
    this.approveModalRef.openModal(data);
  }

  deleteVerificationModel(item_code) {
    this.currentItemCode = item_code;
  }

  deleteComCancel() { 
    this.deleteModalRef.close();
  }

  deleteVerification(data) {
    console.log('data--', data);
    var inputJson = {
      pv_item_code: Number(data.item_code),
      pv_location_id: Number(data.item_location_id),
      pv_status: 'cancel',
      pv_item_stock: data.quantity
    };
    this.erpCommonService.updateInventoryStockReconciliation(inputJson).subscribe((result:any) => {
      this.common.showSuccessErrorMessage('Stock Reconciliation Updated Successfully', 'success');
      this.getStockReconciliation({location_id: Number(this.currentLocationId) })
    });
  }

  openItemDetailsModal(item_code) {
    const item: any = {};
    item.item_code = item_code;
    const dialogRef = this.dialog.open(InvItemDetailsComponent, {
      width: '50%',
      height: '500',
      data: item
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }



}

export interface stockReconciliationListElement {
  srno: number;
  verification_date: string,
  item_code: string;
  item_name: string;
  item_desc: string;
  item_nature: any;
  item_category: any;
  item_location: string;
  item_current_stock: string;
  item_available_stock:string;
  action: any;
}
