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
  logData: any = [];
  currentSubscriptionId = '';
  ELEMENT_DATA: SubscriptionListElement[] = [];
  dataSource = new MatTableDataSource<SubscriptionListElement>(this.ELEMENT_DATA);
  displayedSubscriptionListColumns: string[] = ['subscription_name', 'subscription_type', 'subscription_frequency','subscription_cost', 'subscription_start_date', 'subscription_end_date', 'subscription_copies', 'subscription_attendance'];
  // subscriptionListPageIndex = 0;
  // subscriptionListPageSize = 10;
  // subscriptionListPageSizeOptions = [10, 25, 50, 100];
  showButtonStatus = true;
  pageEvent: any;
  selection = new SelectionModel<SubscriptionListElement>(true, []);
  searchForm: FormGroup;
  formGroupArray: any[] = [];
  attendance_mark_arr:any[]=[
    {id:1,name:'yes'},
    {id:2,name:'no'}
  ]
  constructor(public dialog: MatDialog,
    private fbuild: FormBuilder,
    private common: CommonAPIService,
    private erpCommonService: ErpCommonService) { }

  ngOnInit() {
    this.buildForm();
    //this.getSubscriptionList();
  }
  buildForm(){
    this.searchForm = this.fbuild.group({
      date:''
    })
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

  async getSubscriptionList() {
    this.logData = [];
    this.subscriptionListData = [];
    const param:any={};
    param.subscription_status = '1';
    param.subscription_date = new DatePipe('en-in').transform(this.searchForm.value.date, 'yyyy-MM-dd')
    await this.erpCommonService.getPeriodicalLog({log_date:param.subscription_date}).toPromise().then((result: any) => {
      if (result && result.status === 'ok') {
        this.logData = result.data;
      }
    });
    await this.erpCommonService.getSubscriptionList(param).toPromise().then((result: any) => {
      let element: any = {};
      this.ELEMENT_DATA = [];
      this.dataSource = new MatTableDataSource<SubscriptionListElement>(this.ELEMENT_DATA);
      if (result && result.status === 'ok') {
        let pos = 1;
        this.subscriptionListData = result.data;
        for (const item of this.subscriptionListData) {
          this.formGroupArray.push({
            formGroup: this.fbuild.group({
              subscription_id:item.subscription_id,
              subscription_copies: 1,
              subscription_attendance: ''
            })
          });
          const tempdata = this.logData.find(e => e.log_subscription_id == item.subscription_id && e.log_date == param.subscription_date)
          if(tempdata){
            this.formGroupArray[pos-1].formGroup.patchValue({
              subscription_copies: tempdata.log_subscription_copies,
              subscription_attendance: tempdata.log_subscription_attendance
            })
          }
          element = {
            srno: pos,
            subscription_id:item.subscription_id,
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
          this.ELEMENT_DATA.push(element);
          pos++;
        }
        this.dataSource = new MatTableDataSource<SubscriptionListElement>(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        if (this.sort) {
          this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
          this.dataSource.sort = this.sort;
        }
        console.log('this.formGroupArra',this.formGroupArray);
      }
    });
  }

  fetchData($event) {

  }

  applyFilterSubscription(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  save() {   
    let batchArr = [];
    for (var i = 0; i < this.ELEMENT_DATA.length; i++) {
      console.log('this.formGroupArray[i].formGroup.value.subscription_id',this.formGroupArray[i].formGroup.value.subscription_id)
      batchArr.push({
        log_date : new DatePipe('en-in').transform(this.searchForm.value.date, 'yyyy-MM-dd'),
        log_subscription_id : this.formGroupArray[i].formGroup.value.subscription_id,
        log_subscription_attendance : this.formGroupArray[i].formGroup.value.subscription_attendance,
        log_subscription_copies : this.formGroupArray[i].formGroup.value.subscription_copies
      });
    }
    this.erpCommonService.insertPeriodicalLog(batchArr).subscribe((res: any) => {
      if (res && res.status == 'ok') {
        this.common.showSuccessErrorMessage(res.message, res.status);
      } else {
        this.common.showSuccessErrorMessage(res.message, res.status);
      }
    });
  }
  reset(){
    for (var i = 0; i < this.ELEMENT_DATA.length; i++) {
      this.formGroupArray[i].formGroup.reset();
    }
  }

}


export interface SubscriptionListElement {
  srno:number;
  subscription_id:number;
  subscription_copies: string;
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
