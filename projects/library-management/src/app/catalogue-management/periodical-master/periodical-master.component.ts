import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { DatePipe } from '@angular/common';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatPaginatorI18n } from '../../library-shared/customPaginatorClass';
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
  subscriptionListData: any = [];

  SUBSCRIPTION_LIST_ELEMENT: SubscriptionListElement[] = [];
  subscriptionlistdataSource = new MatTableDataSource<SubscriptionListElement>(this.SUBSCRIPTION_LIST_ELEMENT);
  displayedSubscriptionListColumns: string[] = ['srno', 'subscription_name', 'subscription_type', 'subscription_frequency', 'subscription_start_date', 'subscription_end_date', 'subscription_vendor_id', 'subscription_status','action'];
  subscriptionListPageIndex = 0;
	subscriptionListPageSize = 10;
	subscriptionListPageSizeOptions = [10, 25, 50, 100];

  constructor(public dialog: MatDialog, 
    private fbuild: FormBuilder,
    private common: CommonAPIService, 
    private erpCommonService : ErpCommonService) {}

  ngOnInit() {
      
    this.buildForm();  
    this.getSubscriptionList();
  }

  openAddSubscriptionDialog(): void {
    const dialogRef = this.dialog.open(AddSubscriptionDialog, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      
    });
  }

  buildForm() {
    
  }

  getSubscriptionList() {
    const datePipe = new DatePipe('en-in');
   
    this.erpCommonService.getSubscriptionList({}).subscribe((result: any) => {
      // if (res && res.data.length > 0) {
      //   this.verificationLogData = res.data;
        
      // } else {
      //   this.verificationLogData = [];
      // }
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
            subscription_start_date: new DatePipe('en-in').transform(item.subscription_start_date, 'd-MMM-y'),
            subscription_end_date: new DatePipe('en-in').transform(item.subscription_end_date, 'd-MMM-y'),
            subscription_vendor_id: item.subscription_vendor_id,
            subscription_status: item.subscription_status					
          };
          console.log('element', element);
					this.SUBSCRIPTION_LIST_ELEMENT.push(element);
					pos++;
					
				}
				this.subscriptionlistdataSource = new MatTableDataSource<SubscriptionListElement>(this.SUBSCRIPTION_LIST_ELEMENT);
			} 
    });
  }

  getSubscriptionDetails(element) {

  }


}



@Component({
  selector: 'add-subscription-dialog',
  templateUrl: 'add-subscription-dialog.html',
})
export class AddSubscriptionDialog {

  constructor(
    public dialogRef: MatDialogRef<AddSubscriptionDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}


export interface SubscriptionListElement {
  srno: number;
  subscription_id:string;
  subscription_name:string;
  subscription_type:string;
  subscription_frequency:string;
  subscription_start_date:string;
  subscription_end_date:string;
  subscription_vendor_id:string;
  subscription_status:string;
}
