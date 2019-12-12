import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';

import * as Excel from 'exceljs/dist/exceljs';
import * as XLSX from 'xlsx';
import * as moment from 'moment/moment';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

@Component({
	selector: 'app-circulation-consumption',
	templateUrl: './circulation-consumption.component.html',
	styleUrls: ['./circulation-consumption.component.css']
})
export class CirculationConsumptionComponent implements OnInit {
	formGroupArray = [];
	searchForm: FormGroup;
	returnIssueItemsForm: FormGroup;
	userData: any = '';
	itemData: any = [];
	itemLogData: any = [];
	issueItemData: any = [];
	userHaveItemsData = false;
	itemsReadTillDate = 0;
	sessionArray: any = [];
	sessionName: any;
	currentUser: any;
	session_id: any;
	defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.svg';
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('itemDet') itemDet;
	finIssueItem: any = [];
	minDate = new Date();
	//stuOutStandingFine = 0;
	//allLocationData:any [] = [];
	ITEM_LOG_LIST_ELEMENT: ItemLogListElement[] = [];
	itemLoglistdataSource = new MatTableDataSource<ItemLogListElement>(this.ITEM_LOG_LIST_ELEMENT);
	// tslint:disable-next-line: max-line-length
	displayedItemLogListColumns: string[] = ['srno', 'item_code', 'item_name', 'item_nature', 'item_location', 'issued_quantity', 'due_date', 'returned_on'];
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
	allLocationData: any[] = [];
	locationData: any[] = [];
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private fbuild: FormBuilder,
		private common: CommonAPIService,
		private erpCommonService: ErpCommonService
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session_id = JSON.parse(localStorage.getItem('session'))['ses_id'];
	}
	openItemModal(item_no) {
		this.itemDet.openModal(item_no);
	}
	ngOnInit() {
		this.buildForm();
		this.getSession();
		this.getSchool();
		this.getGlobalSetting();
		this.getAllLocation();
	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			searchId: '',
			user_role_id: ''
		});

		this.returnIssueItemsForm = this.fbuild.group({
			scanItemId: '',
			due_date: '',
			issue_date: '',
			return_date: ''
		});
	}

	getGlobalSetting() {
		this.erpCommonService.getGlobalSetting({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				const settings = result.data;
				for (let i = 0; i < settings.length; i++) {
					if (settings[i]['gs_alias'] === 'library_user_setting') {
						this.settingData = JSON.parse(settings[i]['gs_value']);
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
							this.sessionName = this.sessionArray[this.session_id];
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
						this.itemData = [];
						this.itemLogData = [];
						this.getUserIssueReturnLogData();
					} else {
						this.userData = [];
						this.itemData = [];
						this.itemLogData = [];
						this.getUserIssueReturnLogData();
					}
				});
			} else if (au_role_id === '3') {
				// tslint:disable-next-line: max-line-length
				this.erpCommonService.getTeacher({ 'login_id': this.searchForm.value.searchId, 'role_id': Number(au_role_id) }).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.userData = result.data ? result.data[0] : '';
						this.itemData = [];
						this.itemLogData = [];
						this.getUserIssueReturnLogData();
					} else {
						this.userData = [];
						this.itemData = [];
						this.itemLogData = [];
						this.getUserIssueReturnLogData();
					}
				});
			} else if (au_role_id === '2') {
				this.erpCommonService.getUser({
					'login_id': this.searchForm.value.searchId,
					'role_id': Number(au_role_id)
				}).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.userData = result.data ? result.data[0] : '';
						this.itemData = [];
						this.itemLogData = [];
						this.getUserIssueReturnLogData();
					} else {
						this.userData = [];
						this.itemData = [];
						this.itemLogData = [];
						this.getUserIssueReturnLogData();
					}
				});
			}

		}
	}

	getAllLocation() {
		this.erpCommonService.getFilterLocation({}).subscribe((result: any) => {
			this.locationData = [];
			if (result) {
				for (var i = 0; i < result.length; i++) {
					this.locationData.push(result[i]);
				}
			}
		});
	}

	getFilterLocation(event) {
		var inputJson = { 'filter': event.target.value };
		if (event.target.value.length > 2) {
			this.erpCommonService.getFilterLocation(inputJson).subscribe((result: any) => {
				this.allLocationData = [];
				if (result) {
					for (var i = 0; i < result.length; i++) {
						this.allLocationData.push(result[i]);
					}
				}
			});
		}
	}

	setLocationId(locationDetails, i) {
		this.formGroupArray[i].patchValue({
			location_id: locationDetails.location_id,
			item_location: locationDetails.location_name,
		});

		this.itemData[i]['item_location'] = locationDetails.location_id;
	}

	setIssuedQuantity(item, i) {
		this.itemData[i]['issued_quantity'] = this.formGroupArray[i].value.issued_quantity;
	}

	searchItemData() {
		if (this.returnIssueItemsForm && this.returnIssueItemsForm.value.scanItemId) {
			const itemAlreadyAddedStatus = this.checkItemAlreadyAdded(this.returnIssueItemsForm.value.scanItemId);
			if (!itemAlreadyAddedStatus) {
				const issueItemStatus = this.checkForIssueItem(this.returnIssueItemsForm.value.scanItemId);
				if (issueItemStatus.status) {
					const date = new Date();
					if (this.searchForm.value.user_role_id === '4') {
						if (this.settingData['item_return_days_student']) {
							date.setDate(date.getDate() + parseInt(this.settingData['item_return_days_student'], 10));
						} else {
							date.setDate(date.getDate() + 7);
						}

					} else if (this.searchForm.value.user_role_id === '3') {
						if (this.settingData['item_return_days_teacher']) {
							date.setDate(date.getDate() + parseInt(this.settingData['item_return_days_teacher'], 10));
						} else {
							date.setDate(date.getDate() + 7);
						}

					} else if (this.searchForm.value.user_role_id === '2') {
						if (this.settingData['item_return_days_staff']) {
							date.setDate(date.getDate() + parseInt(this.settingData['item_return_days_staff'], 10));
						} else {
							date.setDate(date.getDate() + 7);
						}

					}

					this.itemData.push(this.issueItemData[Number(issueItemStatus.index)]);
					var itemCode = this.issueItemData[Number(issueItemStatus.index)]['item_code'];
					this.formGroupArray.push(this.fbuild.group({ item_code: itemCode, item_location: '', issued_quantity: '' }));


					console.log('this.itemData', this.itemData, issueItemStatus);
					// if (this.itemData[Number(issueItemStatus.index)]['user_inv_logs']) {
					// 	this.itemData[Number(issueItemStatus.index)]['user_inv_logs']['due_date'] = date;
					// 	this.itemData[Number(issueItemStatus.index)]['user_inv_logs']['fdue_date'] = date;

					// }
					// this.itemData.push(this.itemData[Number(issueItemStatus.index)]['user_inv_logs']);

				} else {
					const inputJson = {
						'item_code': Number(this.returnIssueItemsForm.value.scanItemId),
						'item_status': 'active',
						//'user_login_id': this.userData.au_login_id,
					};
					const date = new Date();
					if (this.searchForm.value.user_role_id === '4') {
						if (this.settingData['item_return_days_student']) {
							date.setDate(date.getDate() + parseInt(this.settingData['item_return_days_student'], 10));
						} else {
							date.setDate(date.getDate() + 7);
						}

					} else if (this.searchForm.value.user_role_id === '3') {
						if (this.settingData['item_return_days_teacher']) {
							date.setDate(date.getDate() + parseInt(this.settingData['item_return_days_teacher'], 10));
						} else {
							date.setDate(date.getDate() + 7);
						}

					} else if (this.searchForm.value.user_role_id === '2') {
						if (this.settingData['item_return_days_staff']) {
							date.setDate(date.getDate() + parseInt(this.settingData['item_return_days_staff'], 10));
						} else {
							date.setDate(date.getDate() + 7);
						}

					}

					this.erpCommonService.searchItemByStatus(inputJson).subscribe((result: any) => {
						if (result) {
							if (result && result[0]) {
								delete result[0]['_id'];
								result[0]['due_date'] = date;
								this.formGroupArray.push(this.fbuild.group({ item_code: result[0]['item_code'], item_location: '', issued_quantity: '' }));
								this.itemData.push(result[0]);

								this.setDueDate(this.itemData.length - 1, date);
								this.returnIssueItemsForm.controls['scanItemId'].setValue('');
							}
						} else {
							this.returnIssueItemsForm.controls['scanItemId'].setValue('');
							this.common.showSuccessErrorMessage('No Record Found', 'error');
						}
					});
				}
			} else {
				this.common.showSuccessErrorMessage('Item Already Added, Please Choose Another One', 'error');
			}

		} else {
			this.common.showSuccessErrorMessage('Please Scan a Item Code to Add', 'error');
		}

	}

	removeItem(index) {
		this.itemData.splice(index, 1);
	}

	setItemId(item_id) {
		this.router.navigate(['../item-detail'], { queryParams: { item_id: item_id }, relativeTo: this.route });

	}

	getUserIssueReturnLogData() {
		if (this.returnIssueItemsForm && this.returnIssueItemsForm.value.scanItemId) {
			this.returnIssueItemsForm.controls['scanItemId'].setValue('');
		}

		const inputJson = {
			user_login_id: Number(this.userData.au_login_id),
			user_role_id: Number(this.userData.au_role_id),
			//'user_inv_logs.item_status' : 'issued'
		};
		this.userHaveItemsData = false;
		this.itemLogData = [];
		this.issueItemData = [];
		this.itemsReadTillDate = 0;
		this.ITEM_LOG_LIST_ELEMENT = [];
		this.finIssueItem = [];
		this.itemLoglistdataSource = new MatTableDataSource<ItemLogListElement>(this.ITEM_LOG_LIST_ELEMENT);
		this.erpCommonService.getUserItemsData(inputJson).subscribe((result: any) => {
			if (result && result.length > 0) {
				//this.itemData = result[0].user_inv_logs;
				this.finIssueItem = [];
				this.userHaveItemsData = true;
				this.itemsReadTillDate = 0;
				let element: any = {};
				let recordArray = [];
				let pos = 1;
				recordArray = result[0].user_inv_logs;
				this.itemLogData = recordArray;
				const returnedCount = 0;
				for (const item of recordArray) {

					element = {
						srno: pos,
						item_code: item.item_code ? item.item_code : 0,
						item_name: item.item_name ? item.item_name : '',
						item_nature: item.item_nature ? item.item_nature : '',
						item_category: item.item_category ? item.item_category : '',
						item_reorder_level: item.item_reorder_level ? item.item_reorder_level : '',
						item_units: item.item_units ? item.item_units : '',
						item_desc: item.item_desc ? item.item_desc : '',
						item_status: item.item_status ? item.item_status : '',
						item_location: item.item_location ? item.item_location : '',
						issued_quantity: item.issued_quantity ? item.issued_quantity : '',
						due_date: item.due_date ? item.due_date : '',
						returned_on: item.returned_on ? item.returned_on : '',
						issued_on: item.issued_on ? item.issued_on : ''
					};
					if (item.returned_on) {
						this.itemsReadTillDate++;
					}

					if (item.item_status === 'issued') {
						this.issueItemData.push(item);
						this.finIssueItem.push(item);
					}

					this.ITEM_LOG_LIST_ELEMENT.push(element);
					pos++;

				}
				this.itemLoglistdataSource = new MatTableDataSource<ItemLogListElement>(this.ITEM_LOG_LIST_ELEMENT);
				this.itemLoglistdataSource.paginator = this.paginator;
				if (this.sort) {
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.itemLoglistdataSource.sort = this.sort;
				}

			} else {
				this.userHaveItemsData = false;
				this.itemLogData = [];
				this.issueItemData = [];
				this.itemsReadTillDate = 0;
				this.ITEM_LOG_LIST_ELEMENT = [];
				this.finIssueItem = [];
				this.itemLoglistdataSource = new MatTableDataSource<ItemLogListElement>(this.ITEM_LOG_LIST_ELEMENT);
			}
		});
	}

	saveIssueReturn() {
		const updateditemData = [];
		const itemData = JSON.parse(JSON.stringify(this.itemData));
		for (let i = 0; i < itemData.length; i++) {
			if (itemData[i]['item_status'] === 'issued') {
				if (this.common.dateConvertion(itemData[i]['due_date'], 'yyyy-MM-dd') !== this.common.dateConvertion(itemData[i]['fdue_date'], 'yyyy-MM-dd')) {
					itemData[i]['issued_on'] = this.common.dateConvertion(new Date(), 'yyyy-MM-dd');
					itemData[i]['due_date'] = this.common.dateConvertion(itemData[i]['fdue_date'], 'yyyy-MM-dd');
					itemData[i]['fdue_date'] = itemData[i]['fdue_date'];
					itemData[i]['reissue_status'] = 1;
					itemData[i]['issued_quantity'] = itemData[i]['issued_quantity'];
				} else {
					itemData[i]['item_status'] = 'active';
					itemData[i]['issued_on'] = this.common.dateConvertion(itemData[i]['issued_on'], 'yyyy-MM-dd');
					itemData[i]['returned_on'] = this.common.dateConvertion(new Date(), 'yyyy-MM-dd');

					console.log('finIssueItem--', this.finIssueItem);

					for (let j = 0; j < this.finIssueItem.length; j++) {
						if (this.finIssueItem[j]['item_code'] === itemData[i]['item_code']) {
							this.finIssueItem.splice(j, 1);
						}
					}

				}
				updateditemData.push(itemData[i]);
			} else if (itemData[i]['item_status'] === 'active' || itemData[i]['item_status'] === 'reserved') {
				if (itemData[i]['fdue_date']) {
					itemData[i]['item_status'] = 'issued';
					itemData[i]['issued_quantity'] = itemData[i]['issued_quantity'];
					itemData[i]['due_date'] = this.common.dateConvertion(itemData[i]['fdue_date'], 'yyyy-MM-dd');
					itemData[i]['issued_on'] = this.common.dateConvertion(new Date(), 'yyyy-MM-dd');
					this.finIssueItem.push(itemData[i]);
					updateditemData.push(itemData[i]);
				}
			}
		}



		var limitFlag = this.checkForIssueItemLimit();

		if (!limitFlag) {
			const inputJson = {
				user_inv_session: Number(this.session_id),
				user_inv_logs: updateditemData,
				user_login_id: this.userData.au_login_id,
				user_admission_no: this.userData.em_admission_no,
				user_role_id: this.userData.au_role_id,
				user_full_name: this.userData.au_full_name,
				user_class_name: this.userData.class_name ? this.userData.class_name : '',
				user_sec_name: this.userData.sec_name ? this.userData.sec_name : '',
				user_class_id: this.userData && this.userData.class_id ? this.userData.class_id : '',
				user_sec_id: this.userData && this.userData.sec_id ? this.userData.sec_id : ''
			};
			console.log('this.userHaveItemsData--', this.userHaveItemsData);
			if (!this.userHaveItemsData) {
				this.erpCommonService.insertUserItemData(inputJson).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.itemData = [];
						this.resetAll();
						this.issueItemData = [];
						this.resetIssueReturn();
						this.getUserIssueReturnLogData();

					}
					this.common.showSuccessErrorMessage('Item Inserted Successfully', 'ok');
				});
			} else {
				this.erpCommonService.updateUserItemData(inputJson).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.itemData = [];
						this.resetAll();
						this.issueItemData = [];
						this.resetIssueReturn();
						this.getUserIssueReturnLogData();

					}
					this.common.showSuccessErrorMessage('Item Updated Successfully', 'ok');
				});
			}
		} else {
			if (this.searchForm.value.user_role_id === '4') {
				this.common.showSuccessErrorMessage('More than ' + this.settingData['item_issued_limit_student'] + ' Item Cannot be Issued to Student', 'error');
			} else if (this.searchForm.value.user_role_id === '3') {
				this.common.showSuccessErrorMessage('More than ' + this.settingData['item_issued_limit_teacher'] + ' Item Cannot be Issued to Teacher', 'error');
			} else if (this.searchForm.value.user_role_id === '2') {
				this.common.showSuccessErrorMessage('More than ' + this.settingData['item_issued_limit_staff'] + ' Item Cannot be Issued to Staff', 'error');
			}

		}



	}

	checkForIssueItemLimit() {
		let flag = false;
		if (this.searchForm.value.user_role_id === '4') {
			if (this.finIssueItem.length > parseInt(this.settingData['item_issued_limit_student'], 10)) {
				flag = true;
			}

		} else if (this.searchForm.value.user_role_id === '3') {
			if (this.finIssueItem.length > parseInt(this.settingData['item_issued_limit_teacher'], 10)) {
				flag = true;
			}

		} else if (this.searchForm.value.user_role_id === '2') {
			if (this.finIssueItem.length > parseInt(this.settingData['item_issued_limit_staff'], 10)) {
				flag = true;
			}

		}
		return flag;

	}

	setDueDate(index, date) {
		this.itemData[index]['fdue_date'] = date;
	}

	checkForIssueItem(searchItemId) {
		console.log('this.itemData', this.itemData, searchItemId)
		let flag = { 'status': false, 'index': '' };
		for (let i = 0; i < this.issueItemData.length; i++) {
			if (this.issueItemData[i] && Number(this.issueItemData[i]['item_code']) === Number(searchItemId) && this.issueItemData[i]['issued_on'] !== '') {
				flag = { 'status': true, 'index': i.toString() };
				break;
			}
		}
		return flag;
	}

	checkItemAlreadyAdded(value) {
		let flag = false;
		for (let i = 0; i < this.itemData.length; i++) {
			if (this.itemData[i] && Number(this.itemData[i]['item_code']) === Number(value)) {
				flag = true;
				break;
			}
		}
		return flag;
	}

	resetIssueReturn() {
		this.itemData = [];
		this.finIssueItem = [];
		this.returnIssueItemsForm.reset();
		this.returnIssueItemsForm.controls['scanItemId'].setValue('');

	}

	resetAll() {
		this.itemData = [];
		this.itemLogData = [];
		this.issueItemData = [];
		this.finIssueItem = [];
		this.userData = [];
		this.searchForm.controls['searchId'].setValue('');
		this.returnIssueItemsForm.reset();
		this.ITEM_LOG_LIST_ELEMENT = [];
		this.itemLoglistdataSource = new MatTableDataSource<ItemLogListElement>(this.ITEM_LOG_LIST_ELEMENT);
	}

	getLocationName(location_id) {
		for (const item of this.locationData) {
			if (Number(item.location_id) === Number(location_id)) {
				return item.location_hierarchy;
			}
		}
	}

	applyFilterItemLog(filterValue: string) {
		this.itemLoglistdataSource.filter = filterValue.trim().toLowerCase();
	}


	// check the max  width of the cell
	checkWidth(id, header) {

		const res = this.itemLogData.map((f) => f.id !== '-' && f.id ? f.id.toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}



	downloadExcel() {
		console.log(this.itemLogData);
		let reportType: any = '';
		let reportType2: any = '';
		const columns: any = [];
		columns.push({
			key: 'item_code',
			width: this.checkWidth('item_code', 'Item Code')
		});
		columns.push({
			key: 'item_name',
			width: this.checkWidth('item_name', 'Item Name')
		});
		columns.push({
			key: 'item_nature',
			width: this.checkWidth('item_nature', 'Nature')
		});
		columns.push({
			key: 'item_location',
			width: this.checkWidth('item_location', 'Location')
		});
		columns.push({
			key: 'issued_quantity',
			width: this.checkWidth('issued_quantity', 'Issued Quantity')
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


		reportType2 = new TitleCasePipe().transform(this.userData.au_full_name + ' itemlogreport_') + this.sessionName;
		reportType = new TitleCasePipe().transform(this.userData.au_full_name + ' Item Log report: ') + this.sessionName;
		const fileName = reportType + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[8] + '1');
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[8] + '2');
		worksheet.getCell('A2').value = new TitleCasePipe().transform(' Item Log report: ') + this.sessionName;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('A3:B3');
		worksheet.getCell('A3').value = 'Admission No : ' + this.userData.em_admission_no;
		worksheet.getCell(`A3`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('C3:D3');
		worksheet.getCell('C3').value = 'Name : ' + this.userData.au_full_name;
		worksheet.getCell(`C3`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('E3:F3');
		worksheet.getCell('E3').value = 'Class : ' + this.userData.class_name + '     ' + 'Section: ' + this.userData.sec_name;
		worksheet.getCell(`E3`).alignment = { horizontal: 'left' };
		worksheet.getCell('A5').value = 'Item Code';
		worksheet.getCell('B5').value = 'Item Name';
		worksheet.getCell('C5').value = 'Nature';
		worksheet.getCell('D5').value = 'Location';
		worksheet.getCell('E5').value = 'Issued Quantity';
		worksheet.getCell('F5').value = 'Issued On';
		worksheet.getCell('G5').value = 'Due Date';
		worksheet.getCell('H5').value = 'Returned On';
		worksheet.getCell('I5').value = 'Fine';



		worksheet.columns = columns;
		this.length = worksheet._rows.length;
		let totRow = this.length + this.itemLogData.length + 5;

		worksheet.mergeCells('A' + totRow + ':' + 'B' + totRow);
		worksheet.getCell('A' + totRow + ':' + 'B' + totRow).value = 'Report Generated By : ' + this.currentUser.full_name;
		worksheet.getCell('A' + totRow + ':' + 'B' + totRow).alignment = { horizontal: 'left' };
		worksheet.mergeCells('A' + (totRow + 1) + ':' + 'B' + (totRow + 1));
		worksheet.getCell('A' + (totRow + 1) + ':' + 'B' + (totRow + 1)).value = 'No. of Records : ' + this.itemLogData.length;
		worksheet.getCell('A' + (totRow + 1) + ':' + 'B' + (totRow + 1)).alignment = { horizontal: 'left' };
		for (const item of this.itemLogData) {
			const prev = this.length + 1;
			const obj: any = {};

			this.length++;
			worksheet.getCell('A' + this.length).value = item.item_code;
			worksheet.getCell('B' + this.length).value = item.item_name;
			worksheet.getCell('C' + this.length).value = item.item_nature.name;
			worksheet.getCell('D' + this.length).value = this.getLocationName(item.item_location);
			worksheet.getCell('D' + this.length).value = item.issued_quantity;
			worksheet.getCell('E' + this.length).value = item.issued_on;
			worksheet.getCell('F' + this.length).value = item.due_date;
			worksheet.getCell('G' + this.length).value = item.returned_on ? item.returned_on : '-';
			worksheet.getCell('H' + this.length).value = item.fine ? item.reserv_user_logs.fine : '-';

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

			if (rowNum === totRow || rowNum === (totRow + 1)) {
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
			if (rowNum >= 5 && rowNum <= this.itemLogData.length + 5) {
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
			} else if (rowNum === totRow || rowNum === (totRow + 1)) {
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
			head: [[new TitleCasePipe().transform(' Item Log report: ') + this.sessionName]],
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
			head: [['Admission No : ' + this.userData.em_admission_no + '    Name : ' + this.userData.au_full_name + '     Class : ' + this.userData.class_name + '     ' + ' Section: ' + this.userData.sec_name]],
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
			html: '#item_log',
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
			head: [['Report Generated By : ' + this.currentUser.full_name]],
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
			head: [['No. of Records : ' + this.itemLogData.length]],
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
		// doc.autoTable({ html: '#item_log' });

		doc.save('itemLog_' + this.searchForm.value.searchId + '_' + (new Date).getTime() + '.pdf');
	}


}

export interface ItemLogListElement {
	srno: number;
	item_id: string;
	title: string;
	author: string;
	publisher: string;
	issued_on: string;
	due_date: string;
	returned_on: string;
	fine: string;
}
