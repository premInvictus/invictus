import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatPaginatorI18n } from '../../library-shared/customPaginatorClass';

@Component({
  selector: 'app-issue-return',
  templateUrl: './issue-return.component.html',
  styleUrls: ['./issue-return.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorI18n }
  ]
})
export class IssueReturnComponent implements OnInit {
  searchForm: FormGroup;
  returnIssueReservoirForm: FormGroup;
  userData: any = '';
  bookData: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
		private router: Router,
    private fbuild: FormBuilder,
    private common: CommonAPIService,
    private erpCommonService: ErpCommonService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.searchForm = this.fbuild.group({
      searchId: ''
    });

    this.returnIssueReservoirForm = this.fbuild.group({
      scanBookId: ''
    });
  }

  searchUser() {
    console.log('this.searchForm', this.searchForm);
    if (this.searchForm && this.searchForm.value.searchId) {
      console.log('dfgb', this.searchForm.value.searchId);
      this.erpCommonService.getStudentInformation({ 'admission_no': this.searchForm.value.searchId }).subscribe((result: any) => {
        if (result && result.status == 'ok') {
          this.userData = result.data ? result.data[0] : '';
          this.getUserIssueReturnData();
        }
      });
    }
  }

  searchReservoirData() {
    console.log('this.returnIssueReservoirForm', this.returnIssueReservoirForm);
    if (this.returnIssueReservoirForm && this.returnIssueReservoirForm.value.scanBookId) {
      console.log('dfgb', this.returnIssueReservoirForm.value.scanBookId);
      const inputJson = { "filters": [{ "filter_type": "reserv_id", "filter_value": this.returnIssueReservoirForm.value.scanBookId, "type": "number" }] };
      this.erpCommonService.getReservoirDataBasedOnFilter(inputJson).subscribe((result: any) => {
        if (result && result.status == 'ok') {
          console.log('result', result);
          if (result && result.data && result.data.resultData[0]) {
            delete result.data.resultData[0]["_id"];
            this.bookData = result.data.resultData;
          }          
        } else {
          this.bookData = [];
        }
      });
    }
  }

  removeBook(index) {
    this.bookData.splice(index,1);
  }

  setBookId(reserv_id) {
    this.common.setReservoirId(reserv_id);
    this.router.navigate(['../book-detail'], { relativeTo: this.route });
  }

  getUserIssueReturnData() {
    var inputJson = {
      user_login_id: this.userData.au_login_id,
      user_role_id: '4'
    }
    this.erpCommonService.getUserReservoirData(inputJson).subscribe((result: any) => {
      if (result && result.status == 'ok') {
        console.log('result', result);
        this.common.showSuccessErrorMessage(result.status, result.message);
      } else {
        this.common.showSuccessErrorMessage(result.status, result.message);
      }
    });
  }

  saveIssueReturn() {
    console.log(' this.userData',  this.userData);
    console.log('this.bookData', this.bookData);
    var inputJson = {
      reservoir_data : this.bookData,
      user_login_id: this.userData.au_login_id,
      user_role_id: '4'
    }
    this.erpCommonService.insertUserReservoirData(inputJson).subscribe((result: any) => {
      if (result && result.status == 'ok') {
        this.common.showSuccessErrorMessage(result.status, result.message);
      } else {
        this.common.showSuccessErrorMessage(result.status, result.message);
      }
    });
  }

  resetIssueReturn() {
    this.returnIssueReservoirForm.reset();

  }

}
