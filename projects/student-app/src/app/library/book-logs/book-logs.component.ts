import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { ErpCommonService } from 'src/app/_services';
import { saveAs } from 'file-saver';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import * as Excel from 'exceljs/dist/exceljs';
import { TitleCasePipe } from '@angular/common';
@Component({
  selector: 'app-book-logs',
  templateUrl: './book-logs.component.html',
  styleUrls: ['./book-logs.component.css']
})
export class BookLogsComponent implements OnInit, AfterViewInit {
  @ViewChild('bookDet')bookDet;
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
  length: any;
  displayedBookLogListColumns: string[] = ['srno', 'book_no', 'title', 'author', 'publisher', 'issued_on', 'due_date', 'returned_on', 'fine'];
  BOOK_LOG_LIST_ELEMENT: BookLogListElement[] = [];
  userData: any = '';
	bookData: any = [];
	bookLogData: any = [];
	issueBookData: any = [];
	userHaveBooksData = false;
	bookReadTillDate = 0;
	sessionArray: any = [];
  bookLoglistdataSource = new MatTableDataSource<BookLogListElement>(this.BOOK_LOG_LIST_ELEMENT);
  @ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
  currentUser: any =  {};
  userDetail: any = {};
  schoolInfo: any;
  sessionName: any;
  session_id: any;
  constructor(private erpCommonService: ErpCommonService) { }
  ngAfterViewInit() {
  }
  applyFilterBookLog(filterValue: string) {
	this.bookLoglistdataSource.filter = filterValue.trim().toLowerCase();
}
  ngOnInit() {
    this.getSession();
		this.getSchool();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getUserIssueReturnLogData(this.currentUser);
  }	getSession() {
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
  openBookModal(book_no) {
		this.bookDet.openModal(book_no);
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
  getUserIssueReturnLogData(user) {
		const inputJson = {
			user_login_id: user.login_id,
			user_role_id: user.role_id,
			log: true
		};
		this.erpCommonService.getUserReservoirData(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.bookLogData = result.data;
				this.userHaveBooksData = true;
				let element: any = {};
				let recordArray = [];
				this.BOOK_LOG_LIST_ELEMENT = [];
				this.bookLoglistdataSource = new MatTableDataSource<BookLogListElement>(this.BOOK_LOG_LIST_ELEMENT);

				let pos = 1;
				recordArray = this.bookLogData;
				const returnedCount = 0;
				for (const item of recordArray) {

					let aval = '';
					for (const avalue of item.reserv_user_logs.authors) {
						aval += avalue + ',';
					}

					element = {
						srno: pos,
						reserv_id: item.reserv_user_logs.reserv_id,
						book_no:item.reserv_user_logs.book_no,
						title: item.reserv_user_logs.title,
						author:  item.reserv_user_logs.authors[0],
						publisher: item.reserv_user_logs.publisher,
						issued_on: item.reserv_user_logs.issued_on,
						due_date: item.reserv_user_logs.due_date,
						returned_on: item.reserv_user_logs.returned_on,
						fine: item.reserv_user_logs.fine ? item.reserv_user_logs.fine : ''
					};
					if (item.reserv_user_logs.returned_on) {
						this.bookReadTillDate++;
					}

					if (item.reserv_user_logs.reserv_status === 'issued') {
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
  checkWidth(id, header) {
		const res = this.bookLogData.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}



	downloadExcel() {
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

		reportType2 = new TitleCasePipe().transform(this.currentUser.au_full_name + ' booklogreport_') + this.sessionName;
		reportType = new TitleCasePipe().transform(this.currentUser.au_full_name + ' Book Log report: ') + this.sessionName;
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
		for (const item of this.bookLogData) {
			const prev = this.length + 1;
			const obj: any = {};
			let aval = '';
			for (const avalue of item.authors) {
				console.log('avalue', avalue);
				aval += avalue + ',';
			}

			this.length++;
			worksheet.getCell('A' + this.length).value = item.book_no;
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
							fgColor: { argb: 'ffffff' },
							bgColor: { argb: 'ffffff' },
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
		workbook.xlsx.writeBuffer().then(data => {
			const blob = new Blob([data], { type: 'application/octet-stream' });
			saveAs(blob, fileName);
		});


	}

	downloadPdf() {
		const doc = new jsPDF('landscape');
		doc.autoTable({
			head: [['Book Log of ' + this.currentUser.au_full_name]],
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
		doc.save('BookLog_' + this.currentUser.login_id + '_' + (new Date).getTime() + '.pdf');
	}

}
export interface BookLogListElement {
	srno: number;
	reserv_id: string;
	book_no:string;
	title: string;
	author: string;
	publisher: string;
	issued_on: string;
	due_date: string;
	returned_on: string;
	fine: string;
}
