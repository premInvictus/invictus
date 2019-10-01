import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { DatePipe } from '@angular/common';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatPaginatorI18n } from '../../library-shared/customPaginatorClass';
import { AddSubscriptionDialog } from './add-subscription-dialog/add-subscription-dialog.component';
@Component({
  selector: 'app-periodical-master',
  templateUrl: './periodical-master.component.html',
  styleUrls: ['./periodical-master.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorI18n }
  ]
})
export class PeriodicalMasterComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('deleteModalRef') deleteModalRef;
  subscriptionListData: any = [];
  currentSubscriptionId = '';
  SUBSCRIPTION_LIST_ELEMENT: SubscriptionListElement[] = [];
  subscriptionlistdataSource = new MatTableDataSource<SubscriptionListElement>(this.SUBSCRIPTION_LIST_ELEMENT);
  displayedSubscriptionListColumns: string[] = ['srno', 'subscription_id','subscription_name', 'subscription_type', 'subscription_frequency', 'subscription_start_date', 'subscription_end_date', 'subscription_vendor_name', 'subscription_status', 'action'];
  subscriptionListPageIndex = 0;
  subscriptionListPageSize = 10;
  subscriptionListPageSizeOptions = [10, 25, 50, 100];
  showButtonStatus = true;
  pageEvent: any;

  constructor(public dialog: MatDialog,
    private fbuild: FormBuilder,
    private common: CommonAPIService,
    private erpCommonService: ErpCommonService) { }

  ngOnInit() {
    this.getSubscriptionList();
  }

  openModal = (data) => this.deleteModalRef.openModal(data);

	deleteComCancel() { 
    this.deleteModalRef.close();
  }

  openAddSubscriptionDialog(): void {
    const dialogRef = this.dialog.open(AddSubscriptionDialog, {
      width: '750px',
      data: {
        subscription_id: '', 
        subscription_name: '',
        subscription_type: '',
        subscription_frequency: '',
        subscription_start_date: '',
        subscription_end_date: '',
        subscription_vendor_id: '',
        subscription_status: '',
        showButtonStatus: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getSubscriptionList();

    });
  }

  getSubscriptionList() {
    const datePipe = new DatePipe('en-in');

    this.erpCommonService.getSubscriptionList({}).subscribe((result: any) => {
      let element: any = {};
      let recordArray = [];
      this.SUBSCRIPTION_LIST_ELEMENT = [];
      this.subscriptionlistdataSource = new MatTableDataSource<SubscriptionListElement>(this.SUBSCRIPTION_LIST_ELEMENT);
      if (result && result.status === 'ok') {
        let pos = 1;
        this.subscriptionListData = recordArray = result.data;
        for (const item of recordArray) {
          element = {
            srno: pos,
            subscription_id: item.subscription_id,
            subscription_name: item.subscription_name,
            subscription_type: item.subscription_type,
            subscription_frequency: item.subscription_frequency,
            subscription_start_date: item.subscription_start_date,
            subscription_end_date: item.subscription_end_date,
            subscription_vendor_id: item.subscription_vendor_id,
            subscription_vendor_name: item.subscription_vendor_name ? item.subscription_vendor_name : '',
            subscription_status: item.subscription_status,
            
          };
          console.log('element', element);
          this.SUBSCRIPTION_LIST_ELEMENT.push(element);
          pos++;

        }
        this.subscriptionlistdataSource = new MatTableDataSource<SubscriptionListElement>(this.SUBSCRIPTION_LIST_ELEMENT);
        this.subscriptionlistdataSource.paginator = this.paginator;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        this.subscriptionlistdataSource.sort = this.sort;
      }
    });
  }

  editSubscription(element, showButton) {
    const dialogRef = this.dialog.open(AddSubscriptionDialog, {
      width: '750px',
      data: {
        subscription_id: element.subscription_id,
        subscription_name: element.subscription_name,
        subscription_type: element.subscription_type,
        subscription_frequency: element.subscription_frequency,
        subscription_start_date: element.subscription_start_date,
        subscription_end_date: element.subscription_end_date,
        subscription_vendor_id: element.subscription_vendor_id,
        subscription_status: element.subscription_status,
        showButtonStatus: showButton ? showButton : false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getSubscriptionList();

    });
  }

  deleteSubscription(data) {
    console.log('data', data, this.currentSubscriptionId);

    if (this.currentSubscriptionId) {
      this.currentSubscriptionId['subscription_status'] = '5';
      this.erpCommonService.deleteSubscription(this.currentSubscriptionId
      ).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          
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
		this.subscriptionlistdataSource.filter = filterValue.trim().toLowerCase();
  }

}


export interface SubscriptionListElement {
  srno: number;
  subscription_id: string;
  subscription_name: string;
  subscription_type: string;
  subscription_frequency: string;
  subscription_start_date: string;
  subscription_end_date: string;
  subscription_vendor_id: string;
  subscription_vendor_name: string;
  subscription_status: string;
}
