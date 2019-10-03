import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatPaginatorI18n } from '../../library-shared/customPaginatorClass';
import { BookListElement } from '../../auxillaries/physical-verification/physical-verification.component';
import * as XLSX from 'xlsx';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
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
  issueBookData: any = [];
  userHaveBooksData = false;
  bookReadTillDate = 0;
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
      searchId: '',
      user_role_id: ''
    });

    this.returnIssueReservoirForm = this.fbuild.group({
      scanBookId: '',
      due_date: '',
      issue_date: '',
      return_date: ''
    });
  }

  searchUser() {
    if (this.searchForm && this.searchForm.value.searchId) {
      var au_role_id = this.searchForm.value.user_role_id;
      var au_admission_no = this.searchForm.value.searchId;

      if (au_role_id === '4') {
        this.erpCommonService.getStudentInformation({ 'admission_no': au_admission_no, 'au_role_id': au_role_id }).subscribe((result: any) => {
          if (result && result.status == 'ok') {
            this.userData = result.data ? result.data[0] : '';
            this.bookData = [];
            this.getUserIssueReturnLogData();
          } else {
            this.userData = [];
            this.bookData = [];
            this.getUserIssueReturnLogData();
          }
        });
      } else if (au_role_id === '3') {
        this.erpCommonService.getTeacher({ 'login_id': this.searchForm.value.searchId, 'role_id': Number(au_role_id) }).subscribe((result: any) => {
          if (result && result.status == 'ok') {
            this.userData = result.data ? result.data[0] : '';
            this.bookData = [];
            this.getUserIssueReturnLogData();
          } else {
            this.userData = [];
            this.bookData = [];
            this.getUserIssueReturnLogData();
          }
        });
      } else if (au_role_id === '2') {
        this.erpCommonService.getUser({ 'login_id': this.searchForm.value.searchId, 'role_id': Number(au_role_id) }).subscribe((result: any) => {
          if (result && result.status == 'ok') {
            this.userData = result.data ? result.data[0] : '';
            this.bookData = [];
            this.getUserIssueReturnLogData();
          } else {
            this.userData = [];
            this.bookData = [];
            this.getUserIssueReturnLogData();
          }
        });
      }

    }
  }

  searchReservoirData() {
    if (this.returnIssueReservoirForm && this.returnIssueReservoirForm.value.scanBookId) {
      var bookAlreadyAddedStatus = this.checkBookAlreadyAdded(this.returnIssueReservoirForm.value.scanBookId);
      if (!bookAlreadyAddedStatus) {
        var issueBookStatus = this.checkForIssueBook(this.returnIssueReservoirForm.value.scanBookId);
        if (issueBookStatus.status) {
          this.bookData.push(this.bookLogData[Number(issueBookStatus.index)]);
        } else {
          const inputJson = {  "reserv_id" : Number(this.returnIssueReservoirForm.value.scanBookId), 
                               "reserv_status" : [ 'available']
                            };
          var date = new Date();
          date.setDate(date.getDate() + 7);
          this.erpCommonService.searchReservoirByStatus(inputJson).subscribe((result: any) => {
            if (result && result.status == 'ok') {
              if (result && result.data && result.data.resultData[0]) {
                delete result.data.resultData[0]["_id"];
                result.data.resultData[0]['due_date'] = date;
                result.data.resultData[0]['issued_on'] = '';
                result.data.resultData[0]['returned_on'] = '';
                this.bookData.push(result.data.resultData[0]);
                this.setDueDate(this.bookData.length - 1 , date);
                console.log('this.bookData',this.bookData);
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
    // this.common.setReservoirId(reserv_id);
    this.router.navigate(['../book-detail'], { queryParams: { book_id: reserv_id }, relativeTo: this.route } );
    
  }

  // getUserIssueReturnData() {
  //   var inputJson = {
  //     user_login_id: this.userData.au_login_id,
  //     user_role_id: this.userData.au_role_id
  //   }
  //   this.erpCommonService.getUserReservoirData(inputJson).subscribe((result: any) => {
  //     if (result && result.status == 'ok') {
  //       this.issueBookData = result.data.details;
  //     } else {
  //       this.issueBookData = [];
  //     }
  //     this.common.showSuccessErrorMessage(result.message, result.status);
  //   });
  // }

  getUserIssueReturnLogData() {
    var inputJson = {
      user_login_id: this.userData.au_login_id,
      user_role_id: this.userData.au_role_id,
      log: true
    }
    this.erpCommonService.getUserReservoirData(inputJson).subscribe((result: any) => {
      if (result && result.status == 'ok') {
        this.bookLogData = result.data.reserv_user_logs;
        this.userHaveBooksData = true;

        let element: any = {};
        let recordArray = [];
        this.BOOK_LOG_LIST_ELEMENT = [];
        this.bookLoglistdataSource = new MatTableDataSource<BookLogListElement>(this.BOOK_LOG_LIST_ELEMENT);

        let pos = 1;
        recordArray = this.bookLogData;
        let returnedCount = 0;
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
          if (item.returned_on) {
            this.bookReadTillDate++;
          }

          if(item.reserv_status === 'issued') {
            this.issueBookData.push(item);
          }

          this.BOOK_LOG_LIST_ELEMENT.push(element);
          pos++;

        }
        this.bookLoglistdataSource = new MatTableDataSource<BookLogListElement>(this.BOOK_LOG_LIST_ELEMENT);
        this.bookLoglistdataSource.paginator = this.paginator;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        this.bookLoglistdataSource.sort = this.sort;



      } else {
        this.userHaveBooksData = false;
        this.bookLogData = [];
        this.BOOK_LOG_LIST_ELEMENT = [];
        this.bookLoglistdataSource = new MatTableDataSource<BookLogListElement>(this.BOOK_LOG_LIST_ELEMENT);
      }
    });
  }

  saveIssueReturn() {
    var updatedBookData = [];
    for (let i = 0; i < this.bookData.length; i++) {
      console.log(this.bookData[i]);
      if (this.bookData[i]['reserv_status'] === 'issued') {
        console.log(this.bookData[i]['due_date']);
        console.log(this.common.dateConvertion(this.bookData[i]['fdue_date'], 'dd-MMM-yyyy'));
        if (this.bookData[i]['due_date'] < this.common.dateConvertion(this.bookData[i]['fdue_date'], 'dd-MMM-yyyy')) {
          this.bookData[i]['issued_on'] = this.common.dateConvertion(new Date(), 'dd-MMM-yyyy');
          this.bookData[i]['due_date'] = this.common.dateConvertion(this.bookData[i]['fdue_date'], 'dd-MMM-yyyy');
        } else {
          this.bookData[i]['reserv_status'] = 'available';
          this.bookData[i]['issued_on'] = '';
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
    if (!this.userHaveBooksData) {
      this.erpCommonService.insertUserReservoirData(inputJson).subscribe((result: any) => {
        if (result && result.status == 'ok') {
          this.bookData = [];
          this.resetIssueReturn();
          this.getUserIssueReturnLogData();

        }
        this.common.showSuccessErrorMessage(result.message, result.status);
      });
    } else {
      this.erpCommonService.updateUserReservoirData(inputJson).subscribe((result: any) => {
        if (result && result.status == 'ok') {
          this.bookData = [];
          this.resetIssueReturn();
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
    for (var i = 0; i < this.bookLogData.length; i++) {
      if (Number(this.bookLogData[i]['reserv_id']) === Number(searchBookId) && this.bookLogData[i]['issued_on'] != '') {
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
    this.bookData = [];
    this.returnIssueReservoirForm.reset();

  }

  resetAll() {
    this.bookData = [];
    this.bookLogData = [];
    this.issueBookData = [];
    this.userData = [];
    this.searchForm.value.searchId = '';
    this.returnIssueReservoirForm.reset();
    this.BOOK_LOG_LIST_ELEMENT = [];
    this.bookLoglistdataSource = new MatTableDataSource<BookLogListElement>(this.BOOK_LOG_LIST_ELEMENT);
  }

  applyFilterBookLog(filterValue: string) {
    this.bookLoglistdataSource.filter = filterValue.trim().toLowerCase();
  }

  getColor(item) {
    if (item.reserv_status === 'issued') {
      return 'rgb(252, 191, 188)';
    } else {
      return '#cfe39b';
    }
  }

  getBorder(item) {
    if (item.reserv_status === 'issued') {
      return 'rgb(252, 191, 188)';
    } else {
      return '#cfe39b';
    }
  }

  downloadExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('book_log')); // converts a DOM TABLE element to a worksheet
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		XLSX.writeFile(wb, 'BookLog_' + this.searchForm.value.searchId + '_' + (new Date).getTime() + '.xlsx');
  }

  downloadPdf() {
    const doc = new jsPDF('landscape');
		doc.setFont('helvetica');
		doc.setFontSize(5);
		doc.autoTable({ html: '#book_log' });
		doc.save('BookLog_' + this.searchForm.value.searchId + '_' + (new Date).getTime() + '.pdf');
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
