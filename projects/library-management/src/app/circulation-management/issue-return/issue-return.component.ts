import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatPaginatorI18n } from '../../library-shared/customPaginatorClass';
import { BookListElement } from '../../auxillaries/physical-verification/physical-verification.component';

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
  bookData: any = [];
  bookLogData: any = [];
  issueBookData: any;
  userHaveBooksData = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  BOOK_LOG_LIST_ELEMENT: BookLogListElement[] = [];
  bookLoglistdataSource = new MatTableDataSource<BookLogListElement>(this.BOOK_LOG_LIST_ELEMENT);
  displayedBookLogListColumns: string[] = ['srno', 'reserv_id', 'title', 'author', 'publisher', 'issued_on', 'due_date', 'returned_on', 'fine'];

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
      scanBookId: '',
      due_date: '',
      issue_date: '',
      return_date: ''
    });
  }

  searchUser() {
    console.log('this.searchForm', this.searchForm);
    if (this.searchForm && this.searchForm.value.searchId) {
      var role_id = this.searchForm.value.searchId.split('-')[0];
      var login_id = this.searchForm.value.searchId.split('-')[1];
      console.log('dfgb', this.searchForm.value.searchId);
      this.erpCommonService.getStudentInformation({ 'login_id': login_id }).subscribe((result: any) => {
        if (result && result.status == 'ok') {
          this.userData = result.data ? result.data[0] : '';
          this.getUserIssueReturnData();
          this.getUserIssueReturnLogData();
        }
      });
    }
  }

  searchReservoirData() {
    console.log('this.returnIssueReservoirForm', this.returnIssueReservoirForm);
    if (this.returnIssueReservoirForm && this.returnIssueReservoirForm.value.scanBookId) {
      var bookAlreadyAddedStatus = this.checkBookAlreadyAdded(this.returnIssueReservoirForm.value.scanBookId);
      if (!bookAlreadyAddedStatus) {
        var issueBookStatus = this.checkForIssueBook(this.returnIssueReservoirForm.value.scanBookId);
        if (issueBookStatus.status) {
          // this.issueBookData[Number(issueBookStatus.index)]['reserv_status'] = 'available';
          this.bookData.push(this.issueBookData[Number(issueBookStatus.index)]);
          console.log('this.bookData', this.bookData);
        } else {
          const inputJson = { "filters": [{ "filter_type": "reserv_id", "filter_value": this.returnIssueReservoirForm.value.scanBookId, "type": "number" }, { "filter_type": "reserv_status", "filter_value": "available", "type": "string" }] };
          this.erpCommonService.getReservoirDataBasedOnFilter(inputJson).subscribe((result: any) => {
            if (result && result.status == 'ok') {
              console.log('result', result);
              if (result && result.data && result.data.resultData[0]) {
                delete result.data.resultData[0]["_id"];
                for (var i = 0; i < result.data.resultData[0]["similarBooks"].length; i++) {
                  delete result.data.resultData[0]["similarBooks"][i]["_id"];
                }
                this.bookData.push(result.data.resultData[0]);
              }
            } else {
              this.bookData = [];
              this.common.showSuccessErrorMessage('No Record Found', 'error');
            }
          });
        }
      } else {
        this.common.showSuccessErrorMessage('Book Already Added, Please Choose Another One', 'error');
      }

    } else {
      this.common.showSuccessErrorMessage('Please Scan a Book to Add', 'error');
    }

  }

  removeBook(index) {
    this.bookData.splice(index, 1);
  }

  setBookId(reserv_id) {
    this.common.setReservoirId(reserv_id);
    this.router.navigate(['../book-detail'], { relativeTo: this.route });
  }

  getUserIssueReturnData() {
    var inputJson = {
      user_login_id: this.userData.au_login_id,
      user_role_id: this.userData.au_role_id
    }
    this.erpCommonService.getUserReservoirData(inputJson).subscribe((result: any) => {
      if (result && result.status == 'ok') {
        console.log('result', result);
        this.issueBookData = result.data.details;
      } else {
        this.issueBookData = [];
      }
      this.common.showSuccessErrorMessage(result.message, result.status);
    });
  }

  getUserIssueReturnLogData() {
    var inputJson = {
      user_login_id: this.userData.au_login_id,
      user_role_id: this.userData.au_role_id,
      log: true
    }
    this.erpCommonService.getUserReservoirData(inputJson).subscribe((result: any) => {
      if (result && result.status == 'ok') {
        console.log('result', result);
        this.bookLogData = result.data.reserv_user_logs;
        console.log(' this.bookLogData', this.bookLogData);
        this.userHaveBooksData = true;

        let element: any = {};
        let recordArray = [];
        this.BOOK_LOG_LIST_ELEMENT = [];
        this.bookLoglistdataSource = new MatTableDataSource<BookLogListElement>(this.BOOK_LOG_LIST_ELEMENT);

        let pos = 1;
        recordArray = this.bookLogData;
        for (const item of recordArray) {
          element = {
            srno: pos,
            reserv_id: item.reserv_id,
            title: item.title,
            author: item.authors,
            publisher: item.publisher,
            issued_on: item.issued_on,
            due_date: item.due_date,
            returned_on: item.returned_on,
            fine: item.fine ? item.fine : '',
          };
          console.log('element', element);
          this.BOOK_LOG_LIST_ELEMENT.push(element);
          pos++;

        }
        this.bookLoglistdataSource = new MatTableDataSource<BookLogListElement>(this.BOOK_LOG_LIST_ELEMENT);
        this.bookLoglistdataSource.paginator = this.paginator;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        this.bookLoglistdataSource.sort = this.sort;


      } else {
        this.userHaveBooksData = false;

        this.BOOK_LOG_LIST_ELEMENT = [];
        this.bookLoglistdataSource = new MatTableDataSource<BookLogListElement>(this.BOOK_LOG_LIST_ELEMENT);
        // this.common.showSuccessErrorMessage(result.message, result.status);
      }
    });
  }

  saveIssueReturn() {
    console.log(' this.userData', this.userData);
    console.log('this.bookData', this.bookData);
    console.log('this.userHaveBooksData', this.userHaveBooksData);
    var updatedBookData = [];
    for (let i = 0; i < this.bookData.length; i++) {
      if (this.bookData[i]['reserv_status'] === 'issued') {
        if (this.bookData[i]['due_date'] > this.common.dateConvertion(this.bookData[i]['fdue_date'], 'dd-MMM-yyyy')) {
          this.bookData[i]['issued_on'] = this.common.dateConvertion(new Date(), 'dd-MMM-yyyy');
          this.bookData[i]['due_date'] = this.common.dateConvertion(this.bookData[i]['fdue_date'], 'dd-MMM-yyyy');
        } else {
          this.bookData[i]['reserv_status'] = 'available';
          this.bookData[i]['returned_on'] = this.common.dateConvertion(new Date(), 'dd-MMM-yyyy');
        }
        updatedBookData.push(this.bookData[i]);
      } else if (this.bookData[i]['reserv_status'] === 'available') {
        if (this.bookData[i]['fdue_date']) {
          this.bookData[i]['reserv_status'] = 'issued';
          this.bookData[i]['due_date'] = this.common.dateConvertion(this.bookData[i]['fdue_date'], 'dd-MMM-yyyy');
          this.bookData[i]['issued_on'] = this.common.dateConvertion(new Date(), 'dd-MMM-yyyy');
          updatedBookData.push(this.bookData[i]);
        }
      }
    }

    var inputJson = {
      reservoir_data: updatedBookData,
      user_login_id: this.userData.au_login_id,
      user_role_id: this.userData.au_role_id
    }
    console.log('inputJson', inputJson);
    if (!this.userHaveBooksData) {
      this.erpCommonService.insertUserReservoirData(inputJson).subscribe((result: any) => {
        if (result && result.status == 'ok') {
          this.bookData = [];
          this.resetIssueReturn();
          this.getUserIssueReturnData();
          this.getUserIssueReturnLogData();

        }
        this.common.showSuccessErrorMessage(result.message, result.status);
      });
    } else {
      this.erpCommonService.updateUserReservoirData(inputJson).subscribe((result: any) => {
        if (result && result.status == 'ok') {
          this.bookData = [];
          this.resetIssueReturn();
          this.getUserIssueReturnData();
          this.getUserIssueReturnLogData();

        }
        this.common.showSuccessErrorMessage(result.message, result.status);
      });
    }

  }

  setDueDate(index, date) {
    this.bookData[index]['fdue_date'] = date;
  }

  checkForIssueBook(searchBookId) {
    var flag = { 'status': false, 'index': '' };
    for (var i = 0; i < this.issueBookData.length; i++) {
      if (Number(this.issueBookData[i]['reserv_id']) === Number(searchBookId)) {
        flag = { 'status': true, 'index': i.toString() };

        break;
      }
    }
    return flag;
  }

  checkBookAlreadyAdded(value) {
    var flag = false;
    for (var i = 0; i < this.bookData.length; i++) {
      if (Number(this.bookData[i]['reserv_id']) === Number(value)) {
        flag = true
        break;
      }
    }
    return flag;
  }

  resetIssueReturn() {
    this.returnIssueReservoirForm.reset();

  }

  applyFilterBookLog(filterValue: string) {
    this.bookLoglistdataSource.filter = filterValue.trim().toLowerCase();
  }

  getColor(item) {
    if (item.reserv_status === 'issued') {
      return '#ff0000';
    } else {
      return '#00ff00';
    }
  }

  getBorder(item) {
    if (item.reserv_status === 'issued') {
      return '#ff0000';
    } else {
      return '#00ff00';
    }
  }

}

export interface BookLogListElement {
  srno: number;
  reserv_id: string;
  title: string;
  author: string;
  publisher: string;
  issued_on: string;
  due_date: string;
  returned_on: string;
  fine: string;
}
