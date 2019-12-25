import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { InvItemDetailsComponent } from '../../inventory-shared/inv-item-details/inv-item-details.component';
@Component({
  selector: 'app-physical-verification',
  templateUrl: './physical-verification.component.html',
  styleUrls: ['./physical-verification.component.css']
})
export class PhysicalVerificationComponent implements OnInit {
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
  pageIndex = 0;
  pageEvent: PageEvent;
  pageSize = 100;
  PHYSICAL_VERIFICATION_LIST_ELEMENT: PhysicalVerificationListElement[] = [];
  physicalVerificationdataSource = new MatTableDataSource<PhysicalVerificationListElement>(this.PHYSICAL_VERIFICATION_LIST_ELEMENT);
  displayedListColumns: string[] = ['srno', 'item_code', 'item_name', 'item_desc', 'item_nature', 'item_category', 'item_location', 'item_current_stock', 'last_verification_date', 'action'];
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

  getPhysicalVerification(locationData) {
    console.log('locationData--', locationData);
    this.currentLocationId = locationData.location_id;
    var inputJson = { location_id: locationData.location_id, page_index: this.pageIndex, page_size: this.pageSize };
    let element: any = {};
    let recordArray = [];
    this.PHYSICAL_VERIFICATION_LIST_ELEMENT = [];
    this.physicalVerificationdataSource = new MatTableDataSource<PhysicalVerificationListElement>(this.PHYSICAL_VERIFICATION_LIST_ELEMENT);
    this.erpCommonService.getInventoryPhysicalVerification(inputJson).subscribe((result: any) => {
      let pos = 1;
      this.physicalVerificationdataSource = recordArray = result;
      for (const item of recordArray) {
        element = {
          srno: pos,
          item_code: item.item_code ? item.item_code : '-',
          item_name: item.item_name ? item.item_name : '-',
          item_desc: item.item_description ? item.item_description : '-',
          item_nature: item.item_nature && item.item_nature.name ? item.item_nature.name : '-',
          item_category: item.item_category && item.item_category.name ? item.item_category.name : '-',
          item_location: item.location_hierarchy ? item.location_hierarchy : '-',
          item_location_id: item.location_id ? item.location_id : '-',
          item_current_stock: item.item_current_stock ? item.item_current_stock : '',
          item_units: item.item_units ? item.item_units : '-',
          last_verification_date: item.pv_item_data && item.pv_item_data.length > 0 ? item.pv_item_data[0]['pv_created_date'] : '',
          action: item
        };
        this.PHYSICAL_VERIFICATION_LIST_ELEMENT.push(element);
        pos++;

      }
      this.physicalVerificationdataSource = new MatTableDataSource<PhysicalVerificationListElement>(this.PHYSICAL_VERIFICATION_LIST_ELEMENT);
      this.physicalVerificationdataSource.paginator = this.paginator;
      if (this.sort) {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        this.physicalVerificationdataSource.sort = this.sort;
      }

    });

  }

  approveVerification(item) {
    var inputJson = {
      pv_item_code: Number(item.item_code),
      pv_location_id: Number(item.item_location_id),
      pv_status: 'approved',
      pv_item_stock: item.item_current_stock
    };
    this.erpCommonService.insertInventoryPhysicalVerification(inputJson).subscribe((result: any) => {
      this.common.showSuccessErrorMessage('Physical Verification Approve Successfully', 'success');
      this.getPhysicalVerification({ location_id: Number(this.currentLocationId) })
    });
  }

  openApproveModal(data) {
    data.text = 'Approve';
    this.approveModalRef.openModal(data);
  }

  approveVerificationModel(element, flag) {

  }

  openModal(data) {
    data['from'] = 'inv-physical-verification';
    this.deleteModalRef.openModal(data);
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
      pv_status: 'not-matched',
      pv_item_stock: data.quantity
    };
    this.erpCommonService.insertInventoryPhysicalVerification(inputJson).subscribe((result: any) => {
      this.common.showSuccessErrorMessage('Physical Verification Updated Successfully', 'success');
      this.getPhysicalVerification({ location_id: Number(this.currentLocationId) })
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

  fetchData(event?: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPhysicalVerification({ location_id: Number(this.currentLocationId) });
    return event;
  }
  applyFilterVendor(filterValue: string) {
    this.physicalVerificationdataSource.filter = filterValue.trim().toLowerCase();
  }
  approveComCancel() {

  }

}

export interface PhysicalVerificationListElement {
  srno: number;
  item_code: string;
  item_name: string;
  item_desc: string;
  item_nature: any;
  item_category: any;
  item_location: string;
  item_current_stock: string;
  last_verification_date: string;
  action: any;
}


