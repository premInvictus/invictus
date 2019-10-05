import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatPaginatorI18n } from '../../library-shared/customPaginatorClass';
import { BookListElement } from '../../auxillaries/physical-verification/physical-verification.component';
import * as Excel from 'exceljs/dist/exceljs';
import * as XLSX from 'xlsx';
import * as moment from 'moment/moment';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-issue-return',
  templateUrl: './issue-return.component.html',
  styleUrls: ['./issue-return.component.css']
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
  sessionArray: any = [];
  sessionName: any;
  currentUser: any;
  session_id: any;
  defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.svg';
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  BOOK_LOG_LIST_ELEMENT: BookLogListElement[] = [];
  bookLoglistdataSource = new MatTableDataSource<BookLogListElement>(this.BOOK_LOG_LIST_ELEMENT);
  displayedBookLogListColumns: string[] = ['srno', 'reserv_id', 'title', 'author', 'publisher', 'issued_on', 'due_date', 'returned_on', 'fine'];
  alphabetJSON = {
		1: 'A',
		2: 'B',
		3: 'C',
		4: 'D',
		5: 'E',
		6: 'F',
		7: 'G',
		8: 'H',
		9: 'I',
		10: 'J',
		11: 'K',
		12: 'L',
		13: 'M',
		14: 'N',
		15: 'O',
		16: 'P',
		17: 'Q',
		18: 'R',
		19: 'S',
		20: 'T',
		21: 'U',
		22: 'V',
		23: 'W',
		24: 'X',
		25: 'Y',
		26: 'Z',
		27: 'AA',
		28: 'AB',
		29: 'AC',
		30: 'AD',
		31: 'AE',
		32: 'AF',
		33: 'AG',
		34: 'AH',
		35: 'AI',
		36: 'AJ',
		37: 'AK',
		38: 'AL',
		39: 'AM',
		40: 'AN',
		41: 'AO',
		42: 'AP',
		43: 'AQ',
		44: 'AR',

  };
  schoolInfo: any;
  length: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fbuild: FormBuilder,
    private common: CommonAPIService,
    private erpCommonService: ErpCommonService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session_id = JSON.parse(localStorage.getItem('session'));
   }

  ngOnInit() {
    this.buildForm();
    this.getSession();
    this.getSchool();
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

  getSession() {
		this.erpCommonService.getSession()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						for (const citem of result.data) {
							this.sessionArray[citem.ses_id] = citem.ses_name;
            }
            if (this.session_id) {
              this.sessionName = this.sessionArray[this.session_id.ses_id];
            }
						
					}
				});
  }
  
  getSchool() {
		this.erpCommonService.getSchool()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.schoolInfo = result.data[0];
					}
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
          console.log(issueBookStatus.index);
          this.bookData.push(this.bookLogData[Number(issueBookStatus.index)]);
        } else {
          const inputJson = {
            "reserv_id": Number(this.returnIssueReservoirForm.value.scanBookId),
            "reserv_status": ['available']
          };
          var date = new Date();
          date.setDate(date.getDate() + 7);
          this.erpCommonService.searchReservoirByStatus(inputJson).subscribe((result: any) => {
            if (result && result.status == 'ok') {
              if (result && result.data && result.data.resultData[0]) {
                delete result.data.resultData[0]["_id"];
                result.data.resultData[0]['due_date'] = date;
                // result.data.resultData[0]['issued_on'] = '';
                // result.data.resultData[0]['returned_on'] = '';
                this.bookData.push(result.data.resultData[0]);
                this.setDueDate(this.bookData.length - 1, date);
              }
            } else {
              // this.bookData = [];
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
    this.router.navigate(['../book-detail'], { queryParams: { book_id: reserv_id }, relativeTo: this.route });

  }

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

          if (item.reserv_status === 'issued') {
            this.issueBookData.push(item);
          }

          this.BOOK_LOG_LIST_ELEMENT.push(element);
          pos++;

        }
        this.bookLoglistdataSource = new MatTableDataSource<BookLogListElement>(this.BOOK_LOG_LIST_ELEMENT);
        this.bookLoglistdataSource.paginator = this.paginator;
        if (this.sort) {
          this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
          this.bookLoglistdataSource.sort = this.sort;
        }




      } else {
        this.userHaveBooksData = false;
        this.bookLogData = [];
        this.bookReadTillDate = 0;
        this.BOOK_LOG_LIST_ELEMENT = [];
        this.bookLoglistdataSource = new MatTableDataSource<BookLogListElement>(this.BOOK_LOG_LIST_ELEMENT);
      }
    });
  }

  saveIssueReturn() {
    var updatedBookData = [];
    var bookData = JSON.parse(JSON.stringify(this.bookData));;
    for (let i = 0; i < bookData.length; i++) {
      if (bookData[i]['reserv_status'] === 'issued') {
        if (bookData[i]['due_date'] <= this.common.dateConvertion(bookData[i]['fdue_date'], 'yyyy-MM-dd')) {
          bookData[i]['issued_on'] = this.common.dateConvertion(new Date(), 'yyyy-MM-dd');
          bookData[i]['due_date'] = this.common.dateConvertion(bookData[i]['fdue_date'], 'yyyy-MM-dd');
          bookData[i]['fdue_date'] = bookData[i]['fdue_date'];
          bookData[i]['reissue_status'] = 1;
        } else {
          bookData[i]['reserv_status'] = 'available';
          bookData[i]['issued_on'] = this.common.dateConvertion(bookData[i]['issued_on'], 'yyyy-MM-dd');
          bookData[i]['returned_on'] = this.common.dateConvertion(new Date(), 'yyyy-MM-dd');
        }
        updatedBookData.push(bookData[i]);
      } else if (bookData[i]['reserv_status'] === 'available') {
        if (bookData[i]['fdue_date']) {
          bookData[i]['reserv_status'] = 'issued';
          bookData[i]['due_date'] = this.common.dateConvertion(bookData[i]['fdue_date'], 'yyyy-MM-dd');
          bookData[i]['issued_on'] = this.common.dateConvertion(new Date(), 'yyyy-MM-dd');
          updatedBookData.push(bookData[i]);
        }
      }
    }

    var inputJson = {
      reservoir_data: updatedBookData,
      user_login_id: this.userData.au_login_id,
      user_role_id: this.userData.au_role_id,
      user_full_name: this.userData.au_full_name,
      user_class_id: this.userData && this.userData.class_id ? this.userData.class_id : '',
      user_sec_id: this.userData && this.userData.sec_id ? this.userData.sec_id : ''
    }
    if (!this.userHaveBooksData) {
      this.erpCommonService.insertUserReservoirData(inputJson).subscribe((result: any) => {
        if (result && result.status == 'ok') {
          this.bookData = [];
          this.issueBookData = [];
          this.resetIssueReturn();
          this.getUserIssueReturnLogData();

        }
        this.common.showSuccessErrorMessage(result.message, result.status);
      });
    } else {
      this.erpCommonService.updateUserReservoirData(inputJson).subscribe((result: any) => {
        if (result && result.status == 'ok') {
          this.bookData = [];
          this.issueBookData = [];
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
    console.log('this.bookLogData', this.bookLogData);
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
    this.searchForm.controls['searchId'].setValue('');
    this.returnIssueReservoirForm.reset();
    this.BOOK_LOG_LIST_ELEMENT = [];
    this.bookLoglistdataSource = new MatTableDataSource<BookLogListElement>(this.BOOK_LOG_LIST_ELEMENT);
  }

  applyFilterBookLog(filterValue: string) {
    this.bookLoglistdataSource.filter = filterValue.trim().toLowerCase();
  }

  // check the max  width of the cell
	checkWidth(id, header) {
		const res = this.bookLogData.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}



  downloadExcel() {
    // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('book_log')); // converts a DOM TABLE element to a worksheet
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // XLSX.writeFile(wb, 'BookLog_' + this.searchForm.value.searchId + '_' + (new Date).getTime() + '.xlsx');

    let reportType: any = '';
    let reportType2: any = '';
    const columns: any = [];
    columns.push({
      key: 'reserv_id',
      width: this.checkWidth('reserv_id', 'Book No.')
    });
    columns.push({
      key: 'title',
      width: this.checkWidth('title', 'Book Name')
    });
    columns.push({
      key: 'author',
      width: this.checkWidth('authors', 'Author')
    });
    columns.push({
      key: 'publisher',
      width: this.checkWidth('publisher', 'Publisher')
    });
    columns.push({
      key: 'issued_on',
      width: this.checkWidth('issued_on', 'Issued On')
    });
    columns.push({
      key: 'due_date',
      width: this.checkWidth('due_date', 'Due Date')
    });
    columns.push({
      key: 'returned_on',
      width: this.checkWidth('returned_on', 'Returned On')
    });
    columns.push({
      key: 'fine',
      width: this.checkWidth('fine', 'Fine') ? this.checkWidth('fine', 'Fine') : 10
    });
    
    reportType2 = new TitleCasePipe().transform(this.userData.au_full_name+' booklogreport_') + this.sessionName;
    reportType = new TitleCasePipe().transform(this.userData.au_full_name+' Book Log report: ') + this.sessionName;
    const fileName = reportType + '.xlsx';
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
      { pageSetup: { fitToWidth: 7 } });
    worksheet.mergeCells('A1:' + this.alphabetJSON[7] + '1');
    worksheet.getCell('A1').value =
      new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
    worksheet.getCell('A1').alignment = { horizontal: 'left' };
    worksheet.mergeCells('A2:' + this.alphabetJSON[7] + '2');
    worksheet.getCell('A2').value = reportType;
    worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
    worksheet.getCell('A4').value = 'Book No.';
    worksheet.getCell('B4').value = 'Book Name';
    worksheet.getCell('C4').value = 'Author';
    worksheet.getCell('D4').value = 'Publisher';
    worksheet.getCell('E4').value = 'Issued On';
    worksheet.getCell('F4').value = 'Due Date';
    worksheet.getCell('G4').value = 'Returned On';
    worksheet.getCell('H4').value = 'Fine';
    worksheet.columns = columns;
    this.length = worksheet._rows.length;
    console.log('this.bookLogData', this.bookLogData);
    for (const item of this.bookLogData) {
      const prev = this.length + 1;
      const obj: any = {};
      let aval = '';
          for( const avalue of item.authors ) {
            console.log('avalue', avalue);
            aval+= avalue+",";
          }
          console.log(aval);
        
          this.length++;
          worksheet.getCell('A' + this.length).value = item.reserv_id;
          worksheet.getCell('B' + this.length).value = item.title;
          worksheet.getCell('C' + this.length).value = aval.slice(0, -1);
          worksheet.getCell('D' + this.length).value = item.publisher;
          worksheet.getCell('E' + this.length).value = item.issued_on;
          worksheet.getCell('F' + this.length).value = item.due_date;
          worksheet.getCell('G' + this.length).value = item.returned_on ? item.returned_on : '-';
          worksheet.getCell('H' + this.length).value = item.fine ? item.fine : '-';
        
      worksheet.addRow(obj);
    }

    worksheet.eachRow((row, rowNum) => {
      if (rowNum === 1) {
        row.font = {
          name: 'Arial',
          size: 16,
          bold: true
        };
      }
      if (rowNum === 2) {
        row.font = {
          name: 'Arial',
          size: 14,
          bold: true
        };
      }
      if (rowNum === 4) {
        row.eachCell(cell => {
          cell.font = {
            name: 'Arial',
            size: 10,
            bold: true,
            color: { argb: '636a6a' }
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'c8d6e5' },
            bgColor: { argb: 'c8d6e5' },
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
        });
      }
      if (rowNum >= 5 && rowNum <= worksheet._rows.length) {
        row.eachCell(cell => {
          // tslint:disable-next-line: max-line-length
          
            if (rowNum % 2 === 0) {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ffffff' },
                bgColor: { argb: 'ffffff' },
              };
            } else {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '888888' },
                bgColor: { argb: '888888' },
              };
            }
          
          cell.font = {
            color: { argb: 'black' },
            bold: false,
            name: 'Arial',
            size: 10
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
        });
      }
    });
    // const obj3: any = {};
    // obj3['sd_topic_name'] = 'Grand Total';
    // obj3['sd_st_name'] = '';
    // obj3['sd_desc'] = '';
    // obj3['sd_period_teacher'] = this.bookLogData.map(t => t['sd_period_teacher']).reduce((acc, val) => Number(acc) + Number(val), 0);
    // obj3['sd_period_test'] = this.bookLogData.map(t => t['sd_period_test']).reduce((acc, val) => Number(acc) + Number(val), 0);
    // obj3['sd_period_revision'] = this.bookLogData.map(t => t['sd_period_revision']).reduce((acc, val) => Number(acc) + Number(val), 0);
    // obj3['cw_period_teacher'] = this.bookLogData.map(t => t['cw_period_teacher']).reduce((acc, val) => Number(acc) + Number(val), 0);
    // obj3['cw_period_test'] = this.bookLogData.map(t => t['cw_period_test']).reduce((acc, val) => Number(acc) + Number(val), 0);
    // obj3['cw_period_revision'] = this.bookLogData.map(t => t['cw_period_revision']).reduce((acc, val) => Number(acc) + Number(val), 0);
    // obj3['total'] = obj3['sd_period_teacher'] + obj3['sd_period_test'] + obj3['sd_period_revision'];
    // obj3['total1'] = obj3['cw_period_teacher'] + obj3['cw_period_test'] + obj3['cw_period_revision'];
    // obj3['deviation'] = obj3['total'] - obj3['total1'];
    // obj3['finaldeviation'] = obj3['total'] - obj3['total1'];
    // worksheet.addRow(obj3);
    // worksheet.eachRow((row, rowNum) => {
    //   if (rowNum === worksheet._rows.length) {
    //     row.eachCell(cell => {
    //       cell.fill = {
    //         type: 'pattern',
    //         pattern: 'solid',
    //         fgColor: { argb: '004261' },
    //         bgColor: { argb: '004261' },
    //       };
    //       cell.font = {
    //         color: { argb: 'ffffff' },
    //         bold: true,
    //         name: 'Arial',
    //         size: 10
    //       };
    //       cell.border = {
    //         top: { style: 'thin' },
    //         left: { style: 'thin' },
    //         bottom: { style: 'thin' },
    //         right: { style: 'thin' }
    //       };
    //       cell.alignment = { horizontal: 'center' };
    //     });
    //   }
    // });
    workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      saveAs(blob, fileName);
    });


  }

  downloadPdf() {
    const doc = new jsPDF('landscape');
    doc.autoTable({
      head: [['Book Log of ' + this.userData.au_full_name]],
      didDrawPage: function (data) {
        doc.setFont('Roboto');
      },
      headerStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'center',
        fontSize: 15,
      },
      useCss: true,
      theme: 'striped'
    });
    doc.autoTable({
      html: '#book_log',
      headerStyles: {
        fontStyle: 'normal',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'center',
        fontSize: 14,
      },
      useCss: true,
      styles: {
        fontSize: 14,
        cellWidth: 'auto',
        textColor: 'black',
        lineColor: '#89A8C9',
      },
      theme: 'grid'
    });
    // doc.save('table.pdf');

    // const doc = new jsPDF('landscape');
    // doc.setFont('helvetica');
    // doc.setFontSize(5);
    // doc.autoTable({ html: '#book_log' });

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
