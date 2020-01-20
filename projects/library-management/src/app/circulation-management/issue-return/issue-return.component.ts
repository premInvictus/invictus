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
	@ViewChild('bookDet')bookDet;
	finIssueBook : any = [];
	minDate = new Date();
	stuOutStandingFine = 0;
	BOOK_LOG_LIST_ELEMENT: BookLogListElement[] = [];
	bookLoglistdataSource = new MatTableDataSource<BookLogListElement>(this.BOOK_LOG_LIST_ELEMENT);
	// tslint:disable-next-line: max-line-length
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
	settingData: any;
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
	openBookModal(book_no) {
		this.bookDet.openModal(book_no);
	}
	ngOnInit() {
		this.buildForm();
		this.getSession();
		this.getSchool();
		this.getGlobalSetting();
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

	getGlobalSetting() {
		this.erpCommonService.getGlobalSetting({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				const settings = result.data;
				for (let i=0; i< settings.length;i++) {
					if (settings[i]['gs_alias'] === 'library_user_setting') {
						this.settingData = JSON.parse(settings[i]['gs_value']);
						console.log('settingData', this.settingData);
						// this.formGroupArray[this.configValue-1].formGroup.patchValue({
						// 	'book_issued_limit_staff': settingData['book_issued_limit_staff'],
						// 	'book_return_days_staff': settingData['book_return_days_staff'],
						// 	'book_request_for_staff': settingData['book_request_for_staff'],
						// 	'book_issued_limit_teacher': settingData['book_issued_limit_teacher'],
						// 	'book_return_days_teacher': settingData['book_return_days_teacher'],
						// 	'book_request_for_teacher': settingData['book_request_for_teacher'],
						// 	'book_issued_limit_student': settingData['book_issued_limit_student'],
						// 	'book_return_days_student': settingData['book_return_days_student'],
						// 	'book_request_for_student': settingData['book_request_for_student'],
						// 	'class_book_issue_for_student' : settingData['class_book_issue_for_student'],
						// });
					}
				}
				
				
			}
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
			const au_role_id = this.searchForm.value.user_role_id;
			const au_admission_no = this.searchForm.value.searchId;
			
			if (au_role_id === '4') {
				this.erpCommonService.getStudentInformation({ 'admission_no': au_admission_no, 'au_role_id': au_role_id }).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.userData = result.data ? result.data[0] : '';
						this.bookData = [];
						this.bookLogData = [];
						this.getUserIssueReturnLogData();
					} else {
						this.userData = [];
						this.bookData = [];
						this.bookLogData = [];
						this.getUserIssueReturnLogData();
					}
				});
			} else if (au_role_id === '3') {
				// tslint:disable-next-line: max-line-length
				this.erpCommonService.getEmployeeDetail({ emp_id: Number(this.searchForm.value.searchId),emp_login_id: { $ne: '' } }).subscribe((result: any) => {
					if (result) {
						console.log('result--', result);
						var resultJson = {
							au_login_id: result.emp_login_id,							
							au_role_id: 3,
							au_full_name: result.emp_name,
							au_mobile: result.emp_personal_detail && result.emp_personal_detail.contact_detail ? result.emp_personal_detail.contact_detail.primary_mobile_no : ''
						}
						
						this.userData = resultJson;
						this.bookData = [];
						this.bookLogData = [];
						this.getUserIssueReturnLogData();
					} else {
						this.userData = [];
						this.bookData = [];
						this.bookLogData = [];
						this.getUserIssueReturnLogData();
					}
				});
			} else if (au_role_id === '2') {
				// this.erpCommonService.getUser({
				// 	'login_id': this.searchForm.value.searchId,
				// 	'role_id': Number(au_role_id)
				// }).subscribe((result: any) => {
				// 	if (result && result.status === 'ok') {
				// 		this.userData = result.data ? result.data[0] : '';
				// 		this.bookData = [];
				// 		this.bookLogData = [];
				// 		this.getUserIssueReturnLogData();
				// 	} else {
				// 		this.userData = [];
				// 		this.bookData = [];
				// 		this.bookLogData = [];
				// 		this.getUserIssueReturnLogData();
				// 	}
				// });
			}

		}
	}

	searchReservoirData() {
		if (this.returnIssueReservoirForm && this.returnIssueReservoirForm.value.scanBookId) {
			const bookAlreadyAddedStatus = this.checkBookAlreadyAdded(this.returnIssueReservoirForm.value.scanBookId);
			if (!bookAlreadyAddedStatus) {
				const issueBookStatus = this.checkForIssueBook(this.returnIssueReservoirForm.value.scanBookId);
				if (issueBookStatus.status) {
					// console.log(this.bookLogData[Number(issueBookStatus.index)]['reserv_user_logs']);	
					const date = new Date();
					if (this.searchForm.value.user_role_id === '4') {
						if (this.settingData['book_return_days_student']) {
							date.setDate(date.getDate() + parseInt(this.settingData['book_return_days_student'], 10));
						} else {
							date.setDate(date.getDate() + 7);
						}
						
					} else if (this.searchForm.value.user_role_id === '3') {
						if (this.settingData['book_return_days_teacher']) {
							date.setDate(date.getDate() + parseInt(this.settingData['book_return_days_teacher'], 10));
						} else {
							date.setDate(date.getDate() + 7);
						}
						
					} else if (this.searchForm.value.user_role_id === '2') {
						if (this.settingData['book_return_days_staff']) {
							date.setDate(date.getDate() + parseInt(this.settingData['book_return_days_staff'], 10));
						} else {
							date.setDate(date.getDate() + 7);
						}
						
					}
					if (this.bookLogData[Number(issueBookStatus.index)]['reserv_user_logs']) {
						this.bookLogData[Number(issueBookStatus.index)]['reserv_user_logs']['due_date'] = date;
						this.bookLogData[Number(issueBookStatus.index)]['reserv_user_logs']['fdue_date'] = date;
						
					}
									

					this.bookData.push(this.bookLogData[Number(issueBookStatus.index)]['reserv_user_logs']);

				} else {
					const inputJson = {
						'reserv_id': Number(this.returnIssueReservoirForm.value.scanBookId),
						'reserv_status': ['available'],
						'user_login_id': this.userData.au_login_id,
					};
					const date = new Date();
					if (this.searchForm.value.user_role_id === '4') {
						if (this.settingData['book_return_days_student']) {
							date.setDate(date.getDate() + parseInt(this.settingData['book_return_days_student'], 10));
						} else {
							date.setDate(date.getDate() + 7);
						}
						
					} else if (this.searchForm.value.user_role_id === '3') {
						if (this.settingData['book_return_days_teacher']) {
							date.setDate(date.getDate() + parseInt(this.settingData['book_return_days_teacher'], 10));
						} else {
							date.setDate(date.getDate() + 7);
						}
						
					} else if (this.searchForm.value.user_role_id === '2') {
						if (this.settingData['book_return_days_staff']) {
							date.setDate(date.getDate() + parseInt(this.settingData['book_return_days_staff'], 10));
						} else {
							date.setDate(date.getDate() + 7);
						}
						
					}
					
					this.erpCommonService.searchReservoirByStatus(inputJson).subscribe((result: any) => {
						if (result && result.status === 'ok') {

							console.log('result', result);
							if (result && result.data && result.data.resultData[0]) {
								delete result.data.resultData[0]['_id'];
								console.log('date', date);
								result.data.resultData[0]['due_date'] = date;
								// result.data.resultData[0]['issued_on'] = '';
								// result.data.resultData[0]['returned_on'] = '';
								this.bookData.push(result.data.resultData[0]);
								this.setDueDate(this.bookData.length - 1, date);
								this.returnIssueReservoirForm.controls['scanBookId'].setValue('');
							}
						} else {
							// this.bookData = [];
							this.returnIssueReservoirForm.controls['scanBookId'].setValue('');
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
		if (this.returnIssueReservoirForm && this.returnIssueReservoirForm.value.scanBookId) {
			this.returnIssueReservoirForm.controls['scanBookId'].setValue('');
		}
		
		const inputJson = {
			user_login_id: this.userData.au_login_id,
			user_role_id: (this.userData.au_role_id === '3' || this.userData.au_role_id === 3) ? 0 : this.userData.au_role_id,
			log: true
		};
		this.erpCommonService.getUserReservoirData(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.bookLogData = result.data;
				this.finIssueBook = [];
				this.userHaveBooksData = true;
				this.bookReadTillDate = 0;
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
						title: item.reserv_user_logs.title,
						author:  item.reserv_user_logs.authors[0],
						publisher: item.reserv_user_logs.publisher,
						issued_on: item.reserv_user_logs.issued_on,
						due_date: item.reserv_user_logs.due_date,
						returned_on: item.reserv_user_logs.returned_on,
						fine: item.reserv_user_logs.fine ? item.reserv_user_logs.fine : '',
					};
					if (item.reserv_user_logs.returned_on) {
						this.bookReadTillDate++;
					}

					if (item.reserv_user_logs.reserv_status === 'issued') {
						this.issueBookData.push(item);
						this.finIssueBook.push(item);
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
				this.issueBookData = [];
				this.bookReadTillDate = 0;
				this.BOOK_LOG_LIST_ELEMENT = [];
				this.finIssueBook = [];
				this.bookLoglistdataSource = new MatTableDataSource<BookLogListElement>(this.BOOK_LOG_LIST_ELEMENT);
			}
		});

		this.erpCommonService.getUserOutstandingFine(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.stuOutStandingFine = result.data;
			} else {
				this.stuOutStandingFine = 0;
			}
		});
	}

	saveIssueReturn() {
		const updatedBookData = [];
		const bookData = JSON.parse(JSON.stringify(this.bookData));
		
		for (let i = 0; i < bookData.length; i++) {
			if (bookData[i]['reserv_status'] === 'issued') {
				//bookData[i]['due_date'] <= this.common.dateConvertion(new Date(), 'yyyy-MM-dd') || 

				console.log(bookData[i]['due_date'] , this.common.dateConvertion(bookData[i]['fdue_date'], 'yyyy-MM-dd'));
				if (this.common.dateConvertion(bookData[i]['due_date'],'yyyy-MM-dd') !== this.common.dateConvertion(bookData[i]['fdue_date'], 'yyyy-MM-dd')) {
							bookData[i]['issued_on'] = this.common.dateConvertion(new Date(), 'yyyy-MM-dd');
							bookData[i]['due_date'] = this.common.dateConvertion(bookData[i]['fdue_date'], 'yyyy-MM-dd');
							bookData[i]['fdue_date'] = bookData[i]['fdue_date'];
							bookData[i]['reissue_status'] = 1;
							bookData[i]['issued_by'] = {'login_id':this.currentUser.login_id, "name" :this.currentUser.full_name };
							console.log('in available jh');
						} else {
							console.log('in available');
							bookData[i]['reserv_status'] = 'available';
							bookData[i]['issued_on'] = this.common.dateConvertion(bookData[i]['issued_on'], 'yyyy-MM-dd');
							bookData[i]['returned_on'] = this.common.dateConvertion(new Date(), 'yyyy-MM-dd');
							bookData[i]['returned_by'] = {'login_id':this.currentUser.login_id, "name" :this.currentUser.full_name };
							for (let j=0; j< this.finIssueBook.length;j++) {
								if (this.finIssueBook[j]['reserv_user_logs']['reserv_id'] === bookData[i]['reserv_id']) {
									this.finIssueBook.splice(j,1);
								}
							}
							
						}
						updatedBookData.push(bookData[i]);
			} else if (bookData[i]['reserv_status'] === 'available' || bookData[i]['reserv_status'] === 'reserved') {
				if (bookData[i]['fdue_date']) {
					
					bookData[i]['reserv_status'] = 'issued';
					bookData[i]['issued_by'] = {'login_id':this.currentUser.login_id, "name" :this.currentUser.full_name };
					bookData[i]['due_date'] = this.common.dateConvertion(bookData[i]['fdue_date'], 'yyyy-MM-dd');
					bookData[i]['issued_on'] = this.common.dateConvertion(new Date(), 'yyyy-MM-dd');
					this.finIssueBook.push(bookData[i]);
					updatedBookData.push(bookData[i]);
				}
			}
    }
    

		var limitFlag = this.checkForIssueBookLimit();
		if (!limitFlag) {
			const inputJson = {
				reservoir_data: updatedBookData,
				user_login_id: this.userData.au_login_id,
				user_admission_no: this.userData.em_admission_no,
				user_role_id: this.userData.au_role_id,
				user_full_name: this.userData.au_full_name,
				user_class_name: this.userData.class_name ? this.userData.class_name : '',
				user_sec_name: this.userData.sec_name ? this.userData.sec_name : '',
				user_class_id: this.userData && this.userData.class_id ? this.userData.class_id : '',
				user_sec_id: this.userData && this.userData.sec_id ? this.userData.sec_id : ''
			};

			console.log('inputJson--', inputJson);
			
			if (!this.userHaveBooksData) {
				this.erpCommonService.insertUserReservoirData(inputJson).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.bookData = [];
						this.issueBookData = [];
						this.resetIssueReturn();
						this.getUserIssueReturnLogData();
	
					}
					this.common.showSuccessErrorMessage(result.message, result.status);
				});
			} else {
				this.erpCommonService.updateUserReservoirData(inputJson).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.bookData = [];
						this.issueBookData = [];
						this.resetIssueReturn();
						this.getUserIssueReturnLogData();
	
					}
					this.common.showSuccessErrorMessage(result.message, result.status);
				});
			}
		} else {
			if (this.searchForm.value.user_role_id === '4') {
				this.common.showSuccessErrorMessage('More than '+this.settingData['book_issued_limit_student']+' Book Cannot be Issued to Student', 'error');
			} else if (this.searchForm.value.user_role_id === '3') {
				this.common.showSuccessErrorMessage('More than '+this.settingData['book_issued_limit_teacher']+' Book Cannot be Issued to Teacher', 'error');				
			} else if (this.searchForm.value.user_role_id === '2') {
				this.common.showSuccessErrorMessage('More than '+this.settingData['book_issued_limit_staff']+' Book Cannot be Issued to Staff', 'error');				
			}
			
		}

		

	}

	checkForIssueBookLimit() {
		let flag = false;
		//parseInt(this.settingData['book_return_days_staff'], 10)
		console.log('this.finIssueBook.length', this.finIssueBook , this.finIssueBook.length);
		if (this.searchForm.value.user_role_id === '4') {
			if (this.finIssueBook.length >  parseInt(this.settingData['book_issued_limit_student'], 10)) {
				flag = true;
			}
			
		} else if (this.searchForm.value.user_role_id === '3') {
			console.log(this.finIssueBook.length >  parseInt(this.settingData['book_issued_limit_teacher'], 10));
			if (this.finIssueBook.length >  parseInt(this.settingData['book_issued_limit_teacher'], 10)) {
				flag = true;
			}
			
		} else if (this.searchForm.value.user_role_id === '2') {
			if (this.finIssueBook.length >  parseInt(this.settingData['book_issued_limit_staff'], 10)) {
				flag = true;
			}
			
		}
		return flag;

	}

	setDueDate(index, date) {
		this.bookData[index]['fdue_date'] = date;
	}

	checkForIssueBook(searchBookId) {
		console.log('this.bookLogData', this.bookLogData);
		let flag = { 'status': false, 'index': '' };
		for (let i = 0; i < this.bookLogData.length; i++) {
			if (Number(this.bookLogData[i]['reserv_user_logs']['reserv_id']) === Number(searchBookId) && this.bookLogData[i]['reserv_user_logs']['issued_on'] !== '') {
				flag = { 'status': true, 'index': i.toString() };

				break;
			}
		}
		return flag;
	}

	checkBookAlreadyAdded(value) {
		let flag = false;
		for (let i = 0; i < this.bookData.length; i++) {
			if (Number(this.bookData[i]['reserv_id']) === Number(value)) {
				flag = true;
				break;
			}
		}
		return flag;
	}

	resetIssueReturn() {
		this.bookData = [];		
		this.finIssueBook = [];
		this.returnIssueReservoirForm.reset();
		this.returnIssueReservoirForm.controls['scanBookId'].setValue('');

	}

	resetAll() {
		this.bookData = [];
		this.bookLogData = [];
		this.issueBookData = [];
		this.finIssueBook = [];
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
		
		const res = this.bookLogData.map((f) => f.reserv_user_logs[id] !== '-' && f.reserv_user_logs[id] ? f.reserv_user_logs[id].toString().length : 1);
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

		reportType2 = new TitleCasePipe().transform(this.userData.au_full_name + ' booklogreport_') + this.sessionName;
		reportType = new TitleCasePipe().transform(this.userData.au_full_name+' Book Log report: ') + this.sessionName;
		const fileName = reportType + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[8] + '1');
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[8] + '2');
		worksheet.getCell('A2').value = new TitleCasePipe().transform(' Book Log report: ') + this.sessionName;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('A3:B3');
		worksheet.getCell('A3').value = 'Admission No : ' +this.userData.em_admission_no;
		worksheet.getCell(`A3`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('C3:D3');
		worksheet.getCell('C3').value = 'Name : ' +this.userData.au_full_name;
		worksheet.getCell(`C3`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('E3:F3');
		worksheet.getCell('E3').value = 'Class : ' +this.userData.class_name+'     '+'Section: '+this.userData.sec_name;
		worksheet.getCell(`E3`).alignment = { horizontal: 'left' };
		worksheet.getCell('A5').value = 'Book No.';
		worksheet.getCell('B5').value = 'Book Name';
		worksheet.getCell('C5').value = 'Author';
		worksheet.getCell('D5').value = 'Publisher';
		worksheet.getCell('E5').value = 'Issued On';
		worksheet.getCell('F5').value = 'Due Date';
		worksheet.getCell('G5').value = 'Returned On';
		worksheet.getCell('H5').value = 'Fine';
		
		

		worksheet.columns = columns;
		this.length = worksheet._rows.length;
		let totRow = this.length+this.bookLogData.length+5;
		console.log(worksheet._rows.length, this.currentUser, totRow);
		
		worksheet.mergeCells('A'+totRow+':'+'B'+totRow);
		worksheet.getCell('A'+totRow+':'+'B'+totRow).value = 'Report Generated By : ' +this.currentUser.full_name;
		worksheet.getCell('A'+totRow+':'+'B'+totRow).alignment = { horizontal: 'left' };
		worksheet.mergeCells('A'+(totRow+1)+':'+'B'+(totRow+1));
		worksheet.getCell('A'+(totRow+1)+':'+'B'+(totRow+1)).value = 'No. of Records : ' +this.bookLogData.length;
		worksheet.getCell('A'+(totRow+1)+':'+'B'+(totRow+1)).alignment = { horizontal: 'left' };
		for (const item of this.bookLogData) {
			const prev = this.length + 1;
			const obj: any = {};
			let aval = '';
			for (const avalue of item.reserv_user_logs.authors) {
				aval += avalue + ',';
			}

			this.length++;
			worksheet.getCell('A' + this.length).value = item.reserv_user_logs.reserv_id;
			worksheet.getCell('B' + this.length).value = item.reserv_user_logs.title;
			worksheet.getCell('C' + this.length).value = aval.slice(0, -1);
			worksheet.getCell('D' + this.length).value = item.reserv_user_logs.publisher;
			worksheet.getCell('E' + this.length).value = item.reserv_user_logs.issued_on;
			worksheet.getCell('F' + this.length).value = item.reserv_user_logs.due_date;
			worksheet.getCell('G' + this.length).value = item.reserv_user_logs.returned_on ? item.reserv_user_logs.returned_on : '-';
			worksheet.getCell('H' + this.length).value = item.reserv_user_logs.fine ? item.reserv_user_logs.fine : '-';

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
			if (rowNum === 3) {
				row.font = {
					name: 'Arial',
					size: 12,
					bold: true
				};
			}
			
			if (rowNum === totRow || rowNum === (totRow+1)) {
				row.font = {
					name: 'Arial',
					size: 14,
					bold: true
				};
			}
			if (rowNum === 5) {
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
			if (rowNum >= 5 && rowNum <= this.bookLogData.length+5) {
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
			} else if (rowNum === totRow || rowNum === (totRow+1)) {
				row.font = {
					name: 'Arial',
					size: 12,
					bold: true
				};
				row.eachCell(cell => {
					cell.alignment = { horizontal: 'text', vertical: 'top', wrapText: true };
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
			head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
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
			head: [[new TitleCasePipe().transform(' Book Log report: ') + this.sessionName]],
			didDrawPage: function (data) {
				doc.setFont('Roboto');
			},
			headerStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 13,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			head: [['Admission No : ' + this.userData.em_admission_no + '    Name : ' +this.userData.au_full_name + '     Class : ' +this.userData.class_name+'     '+' Section: '+this.userData.sec_name]],
			didDrawPage: function (data) {
				doc.setFont('Roboto');
			},
			headerStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 13,
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

		doc.autoTable({
			head: [['Report Generated By : ' +this.currentUser.full_name]],
			didDrawPage: function (data) {
				doc.setFont('Roboto');
			},
			headerStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 13,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			head: [['No. of Records : ' +this.bookLogData.length]],
			didDrawPage: function (data) {
				doc.setFont('Roboto');
			},
			headerStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 13,
			},
			useCss: true,
			theme: 'striped'
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
