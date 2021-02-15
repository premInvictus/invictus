import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { DatePipe } from '@angular/common';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatPaginatorI18n } from '../../library-shared/customPaginatorClass';
import {SelectionModel} from '@angular/cdk/collections';


@Component({
  selector: 'app-periodical-attendance',
  templateUrl: './periodical-attendance.component.html',
  styleUrls: ['./periodical-attendance.component.css']
})
export class PeriodicalAttendanceComponent implements OnInit, AfterViewInit {

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('deleteModalRef') deleteModalRef;
  subscriptionListData: any = [];
  currentSubscriptionId = '';
  SUBSCRIPTION_LIST_ELEMENT: SubscriptionListElement[] = [];
  dataSource = new MatTableDataSource<SubscriptionListElement>(this.SUBSCRIPTION_LIST_ELEMENT);
  displayedSubscriptionListColumns: string[] = ['select','srno', 'subscription_id', 'subscription_name', 'subscription_type', 'subscription_frequency','subscription_cost', 'subscription_start_date', 'subscription_end_date', 'subscription_vendor_name', 'subscription_status', 'action'];
  // subscriptionListPageIndex = 0;
  // subscriptionListPageSize = 10;
  // subscriptionListPageSizeOptions = [10, 25, 50, 100];
  showButtonStatus = true;
  pageEvent: any;
  selection = new SelectionModel<SubscriptionListElement>(true, []);


  constructor(public dialog: MatDialog,
    private fbuild: FormBuilder,
    private common: CommonAPIService,
    private erpCommonService: ErpCommonService) { }

  ngOnInit() {
    this.getSubscriptionList();
  }
  buildForm(){
    
  }

  ngAfterViewInit() {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  openModal = (data) => this.deleteModalRef.openModal(data);

  deleteComCancel() {
    this.deleteModalRef.close();
  }

  getSubscriptionList() {
    const datePipe = new DatePipe('en-in');

    this.erpCommonService.getSubscriptionList({}).subscribe((result: any) => {
      let element: any = {};
      let recordArray = [];
      this.SUBSCRIPTION_LIST_ELEMENT = [];
      this.dataSource = new MatTableDataSource<SubscriptionListElement>(this.SUBSCRIPTION_LIST_ELEMENT);
      if (result && result.status === 'ok') {
        let pos = 1;
        this.subscriptionListData = recordArray = result.data;
        for (const item of recordArray) {
          element = {
            srno: pos,
            subscription_id: item.subscription_id,
            subscription_name: item.subscription_name,
            subscription_cost: item.subscription_cost,
            subscription_type: item.subscription_type,
            subscription_frequency: item.subscription_frequency,
            subscription_start_date: item.subscription_start_date,
            subscription_end_date: item.subscription_end_date,
            subscription_vendor_id: item.subscription_vendor_id,
            subscription_vendor_name: item.subscription_vendor_name ? item.subscription_vendor_name : '',
            subscription_status: item.subscription_status,

          };
          this.SUBSCRIPTION_LIST_ELEMENT.push(element);
          pos++;

        }
        this.dataSource = new MatTableDataSource<SubscriptionListElement>(this.SUBSCRIPTION_LIST_ELEMENT);
        this.dataSource.paginator = this.paginator;
        if (this.sort) {
          this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
          this.dataSource.sort = this.sort;
        }
        
      }
    });
  }

  deleteSubscription(data) {
    if (this.currentSubscriptionId) {
      this.currentSubscriptionId['subscription_status'] = '5';
      this.erpCommonService.deleteSubscription(this.currentSubscriptionId
      ).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          this.common.showSuccessErrorMessage(res.message, res.status);
          this.getSubscriptionList();
        } else {
          this.common.showSuccessErrorMessage(res.message, res.status);
        }
      })
    }



  }

  fetchData($event) {

  }

  deleteSubscriptionModel(subscription_id) {
    this.currentSubscriptionId = subscription_id;
  }

  applyFilterSubscription(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}


export interface SubscriptionListElement {
  srno: number;
  subscription_id: string;
  subscription_name: string;
  subscription_type: string;
  subscription_frequency: string;
  subscription_cost: string;
  subscription_start_date: string;
  subscription_end_date: string;
  subscription_vendor_id: string;
  subscription_vendor_name: string;
  subscription_status: string;
}
