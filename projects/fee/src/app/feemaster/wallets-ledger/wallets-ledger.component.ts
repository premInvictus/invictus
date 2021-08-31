import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SisService, ProcesstypeFeeService, FeeService, CommonAPIService } from '../../_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { StudentRouteMoveStoreService } from '../student-route-move-store.service';
import { CommonStudentProfileComponent } from '../common-student-profile/common-student-profile.component';
import { SelectionModel } from '@angular/cdk/collections';
import { WalletReceiptDetailsModalComponent } from '../../sharedmodule/wallet-receipt-details-modal/wallet-receipt-details-modal.component';
import { BillDetailsModalComponent } from '../../sharedmodule/bill-details-modal/bill-details-modal.component';
import { TitleCasePipe, DatePipe } from '@angular/common';
import * as Excel from 'exceljs/dist/exceljs';
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	Formatters,
	DelimiterType,
	FileType
} from 'angular-slickgrid';
import { IndianCurrency } from '../../_pipes';

@Component({
	selector: 'app-wallets-ledger',
	templateUrl: './wallets-ledger.component.html',
	styleUrls: ['./wallets-ledger.component.css']
})
export class WalletsLedgerComponent implements OnInit {
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('deleteWithReasonModal') deleteWithReasonModal;
	@ViewChild('billDetailsModal') billDetailsModal;
	@ViewChild(CommonStudentProfileComponent) commonStu: CommonStudentProfileComponent;
	displayedColumns: string[] = ['w_rpt_no', 'w_transaction_date', 'particulars', 'w_amount', 'action'
		//, 'w_amount_type'
		// , 'w_pay_id', 'w_cheque_no', 'w_cheque_date', 'w_bnk_id', 'w_branch', 'w_transaction_id', 'w_remarks'
	];
	ELEMENT_DATA: Element[] = [];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	selectedMode: any;
	lastRecordId;
	loginId: any;
	feeLoginId: any;
	invoiceArray: any[] = [];
	studentInfo: any = { };
	invoiceTotal: any;
	entryModes: any[] = [];
	payModes: any[] = [];
	invoice: any = { };
	feePeriods: any[] = [];
	invoiceTypes: any[] = [];
	banks: any[] = [];
	allBanks: any[] = [];
	selectedGroupingFields: any[] = [];
	currentDate = new Date();
	minDate: any;
	schoolInfo: any;
	startMonth: any;
	type: any = '';
	feeRenderId: any = '';
	btnDisable = false;
	currentInvoiceId = '';
	sessionArray: any[] = [];
	session: any;
	sessionName: any;
	session_id: any;
	selection = new SelectionModel<Element>(true, []);
	footerRecord: any = {
		balancetotal: 0,
		balancetype: ''
	};
	recordArray: any[] = [];
	locationArray: any[] = [];
	gridOptions: GridOption = { };
	angularGrid: AngularGridInstance;
	currentUser: any;
	columnDefinitions: any[] = [
		{
			id: 'srno',
			name: 'SNo.',
			field: 'srno',
			sortable: true,
			maxWidth: 40
		},
		{
			id: 'txn_id',
			name: 'Txn. Id.',
			field: 'txn_id',
			sortable: true,
			maxWidth: 90,
			formatter: this.checkReceiptFormatter,
			cssClass: 'receipt_collection_report'
		},
		{
			id: 'date',
			name: 'Date',
			field: 'date',
			sortable: true,
			maxWidth: 140
		},
		{
			id: 'particulars',
			name: 'Particulars.',
			field: 'particulars',
			sortable: true,
			maxWidth: 900
		},
		{
			id: 'created_by',
			name: 'Created By',
			field: 'created_by',
			sortable: true,
			maxWidth: 200
		},
		{
			id: 'deposit',
			name: 'Deposit',
			field: 'deposit',
			sortable: true,
			maxWidth: 140,
			formatter: this.checkFeeFormatter
		},
		{
			id: 'withdrawal',
			name: 'Withdrawal',
			field: 'withdrawal',
			sortable: true,
			maxWidth: 140,
			formatter: this.checkFeeFormatter
		},
		{
			id: 'current',
			name: 'Cummulative',
			field: 'current',
			sortable: true,
			maxWidth: 140,
			formatter: this.checkFeeFormatter
		},
		
		{
			id: 'action',
			name: 'Action',
			field: 'action',
			sortable: true,
			formatter: this.getImageCheck
			// maxWidth: 140,
			// formatter: this.checkFeeFormatter
		},
	];
	length: any;
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
	groupColumns: Grouping[];
	draggableGroupingPlugin: any;
	dataviewObj: any;
	totalRow: any;
	gridObj: any;
	exportColumnDefinitions: any[];
	pdfrowdata: any;
	levelHeading: any;
	levelTotalFooter: any;
	levelSubtotalFooter: any;
	dataset: any[];
	constructor(
		private sisService: SisService,
		public processtypeService: ProcesstypeFeeService,
		public feeService: FeeService,
		private fbuild: FormBuilder,
		public common: CommonAPIService,
		private router: Router,
		private route: ActivatedRoute,
		public dialog: MatDialog,
		public studentRouteMoveStoreService: StudentRouteMoveStoreService
	) {
		this.session_id = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
		this.invoiceArray = [];
		this.invoice = { };
		this.selectedMode = '';
		this.getLocation();
		this.getSchool();
		this.getSession();
		this.gridOptions = {
			enableDraggableGrouping: true,
			createPreHeaderPanel: true,
			showPreHeaderPanel: true,
			enableHeaderMenu: true,
			preHeaderPanelHeight: 40,
			enableFiltering: true,
			enableSorting: true,
			enableColumnReorder: true,
			createFooterRow: true,
			showFooterRow: true,
			footerRowHeight: 35,
			enableExcelCopyBuffer: true,
			enableAutoTooltip: true,
			enableCellNavigation: true,
			fullWidthRows: true,
			headerMenu: {
				iconColumnHideCommand: 'fas fa-times',
				iconSortAscCommand: 'fas fa-sort-up',
				iconSortDescCommand: 'fas fa-sort-down',
				title: 'Sort'
			},
			exportOptions: {
				sanitizeDataExport: true,
				exportWithFormatter: true
			},
			gridMenu: {
				customItems: [{
					title: 'pdf',
					titleKey: 'Export as PDF',
					command: 'exportAsPDF',
					iconCssClass: 'fas fa-download'
				},
					{
						title: 'excel',
						titleKey: 'Export Excel',
						command: 'exportAsExcel',
						iconCssClass: 'fas fa-download'
					},
					{
						title: 'expand',
						titleKey: 'Expand Groups',
						command: 'expandGroup',
						iconCssClass: 'fas fa-expand-arrows-alt'
					},
					{
						title: 'collapse',
						titleKey: 'Collapse Groups',
						command: 'collapseGroup',
						iconCssClass: 'fas fa-compress'
					},
					{
						title: 'cleargroup',
						titleKey: 'Clear Groups',
						command: 'cleargroup',
						iconCssClass: 'fas fa-eraser'
					}
				],
				onCommand: (e, args) => {
					if (args.command === 'toggle-preheader') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.clearGrouping();
					}
					if (args.command === 'exportAsPDF') {
						this.exportAsPDF(this.ELEMENT_DATA)
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
					}
					if (args.command === 'expandGroup') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.expandAllGroups();
					}
					if (args.command === 'collapseGroup') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.collapseAllGroups();
					}
					if (args.command === 'cleargroup') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.clearGrouping();
					}
					if (args.command === 'exportAsExcel') {
						this.exportAsExcel(this.ELEMENT_DATA)
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
					}
					if (args.command === 'export-csv') {
					}
				},
				onColumnsChanged: (e, args) => {
					this.updateTotalRow(this.angularGrid.slickGrid);
				},
			},
			draggableGrouping: {
				dropPlaceHolderText: 'Drop a column header here to group by the column',
				// groupIconCssClass: 'fa fa-outdent',
				deleteIconCssClass: 'fa fa-times',
				onGroupChanged: (e, args) => {
					this.groupColumns = [];
					this.groupColumns = args.groupColumns;
					this.onGroupChanged(args && args.groupColumns);
					setTimeout(() => {
						this.updateTotalRow(this.angularGrid.slickGrid);
					}, 100);
				},
				onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
			}
		}
		this.selectedMode = '';
		const invDet: any = this.studentRouteMoveStoreService.getInvoiceId();
		if (!(invDet.inv_id)) {
			this.studentRouteMoveStoreService.getRouteStore().then((data: any) => {
				if (data.adm_no && data.login_id) {
					this.lastRecordId = data.adm_no;
					this.loginId = data.adm_no;
					this.feeLoginId = data.login_id;
					this.getWallets(this.lastRecordId);
				} else {
					this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
						if (result.status === 'ok') {
							this.lastRecordId = result.data[0].last_record;
							this.loginId = result.data[0].au_login_id;
							this.feeLoginId = this.loginId;
							this.getWallets(this.lastRecordId);
						}
					});
				}

			});
		}
	}
	buildForm() {
	}
	getSession() {
		this.sisService.getSession()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						for (const citem of result.data) {
							this.sessionArray[citem.ses_id] = citem.ses_name;
						}
						this.sessionName = this.sessionArray[this.session_id.ses_id];
					}
				});
	}
	checkEmit(process_type) {
		if (process_type) {
			this.type = process_type;
			this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
				if (result.status === 'ok') {
					this.lastRecordId = result.data[0].last_record;
					this.loginId = result.data[0].au_login_id;
					this.feeLoginId = this.loginId;
					//this.getWallets(this.lastRecordId);
				}
			});
		}
	}
	getSchool() {
		this.sisService.getSchool().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.schoolInfo = result.data[0];
				this.startMonth = Number(this.schoolInfo.session_start_month);
				this.minDate = new Date(new Date().getFullYear(), this.startMonth - 1, 1);
			}
		});
	}
	getLocationName(location_id) {
		if (location_id && this.locationArray.length > 0) {
			for (const item of this.locationArray) {
				if (Number(item.location_id) === Number(location_id)) {
					return item.location_hierarchy;
				}
			}
		} else {
			return '';
		}

	}
	getLocation() {
		var inputJson = { };
		this.feeService.getLocation(inputJson).subscribe((result: any) => {
			if (result) {
				this.locationArray = result;
			} else {
				this.locationArray = [];
			}
		});
	}
	getWallets(login_id) {
		this.recordArray = [];
		this.selection.clear();
		let element: any = { };
		this.ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
		this.feeService.getWallets({ login_id: this.feeLoginId }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.recordArray = result.data;
				let pos = 1;
				this.footerRecord = {
					balancetotal: 0,
					balancetype: ''
				};
				let total_credit = 0;
				let total_debit = 0;
				for (const item of this.recordArray) {
					element = {
						id: pos,
						srno: pos,
						created_by: item.au_full_name,
						particulars: '',
						subparticulars: '',
						date: new DatePipe('en-in').transform(item.w_transaction_date, 'd-MMM-y'),
						txn_id: item.w_rpt_no && item.w_rpt_no != 0 ? item.w_rpt_no : '',
						rpt_type: '',
						w_remarks: item.w_remarks ? item.w_remarks : '',
						w_amount: item.w_amount ? item.w_amount : '0',
						w_amount_type: item.w_amount_type ? item.w_amount_type : '-',
						w_amount_sign: item.w_amount_type == 'credit' ? '+' : '-',
						w_pay_id: item.pay_name ? item.pay_name : '-',
						w_cheque_no: item.w_cheque_no ? item.w_cheque_no : '-',
						w_cheque_date: item.w_cheque_date ? item.w_cheque_date : '-',
						w_bnk_id: item.tb_name_bnk ? item.tb_name_bnk : '-',
						w_branch: item.w_branch ? item.w_branch : '-',
						w_transaction_id: item.w_transaction_id ? item.w_transaction_id : '-',
						w_opening: item.w_opening,
						w_amount_status: item.w_amount_status,
						action: item
					};
					if (item.w_pay_id == 3) {
						element.w_bnk_id = item.tb_name_deposit ? item.tb_name_deposit : '-';
					}
					if (item.w_amount_status == 'deposit') {
						element.deposit = parseInt(item.w_amount);
						element.withdrawal = 0;
						total_credit += parseInt(item.w_amount);
						element.rpt_type = 'RPT';
						element.particulars = 'Amount Received';
						element.subparticulars = item.pay_name ? '(By ' + item.pay_name + ')' : '';
					} else if (item.w_amount_status == 'withdrawal') {
						element.deposit = 0;
						element.withdrawal = parseInt(item.w_amount);
						total_debit += parseInt(item.w_amount);
						element.txn_id = item.w_rpt_no
						element.rpt_type = 'BIL';
						element.particulars = 'Withdrawal';
						element.subparticulars = item.pay_name ? '(By ' + item.pay_name + ')' : '';
					} else if (item.w_amount_status == 'purchase') {
						total_debit += parseInt(item.w_amount);
						element.deposit = 0;
						element.withdrawal = parseInt(item.w_amount);
						element.txn_id = item.w_ref_id
						element.rpt_type = 'BIL';
						element.particulars = this.getLocationName(item.w_ref_location_id);
						element.subparticulars = item.w_ref_no_of_items ? '(No of items - ' + item.w_ref_no_of_items + ')' : '';
					}
					if (item.w_opening == 1) {
						if (item.w_amount_type == 'credit') {
							total_credit += parseInt(item.w_amount);
							element.deposit = parseInt(item.w_amount);
							element.withdrawal = 0;
						} else if (item.w_amount_type == 'debit') {
							total_debit += parseInt(item.w_amount);
							element.deposit = 0;
							element.withdrawal = parseInt(item.w_amount);
						}
						element.txn_id = '';
						element.particulars = 'Opening Balance';
						element.subparticulars = '';
					}
					element.current = total_credit - total_debit;
					element.particulars = element.particulars + ' ' + element.subparticulars + " (Ref-" + element.w_remarks + ')';
					this.ELEMENT_DATA.push(element);
					pos++;
				}
				this.footerRecord.balancetotal = total_credit - total_debit;
				if (this.footerRecord.balancetotal > 0) {
					this.footerRecord.balancetype = '+';
				} else if (this.footerRecord.balancetotal < 0) {
					this.footerRecord.balancetype = '';
				}
				this.commonStu.wallet_balance = this.footerRecord.balancetotal;
				// this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
				// console.log('this.ELEMENT_DATA', this.ELEMENT_DATA);
				let obj4:any = {
					'id': 'aa',
					'srno':'',
					'date': '',
					'txn_id': '',
					'particulars': 'Total',
					'created_by':'',
					'deposit': total_credit,
					'withdrawal': total_debit,
					'current': '',
					
				};
				this.ELEMENT_DATA.push(obj4);



			} else {
				this.common.showSuccessErrorMessage(result.data, 'error');
			}
		});
	}
	getStudentInformation(login_id) {
		this.studentInfo = { };
		this.sisService.getStudentInformation({ au_login_id: login_id, au_status: '1' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.studentInfo = result.data[0];
				this.selectedMode = '1';
				if (this.studentInfo.last_invoice_number) {
					this.currentInvoiceId = this.studentInfo.last_invoice_number;
				} else {
					this.invoiceArray = [];
					this.selectedMode = '';
				}
			}
		});
	}
	next(admno) {
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getWallets(this.loginId);
		} else {
			this.getWallets(this.loginId);
		}
	}
	prev(admno) {
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getWallets(this.loginId);
		} else {
			this.getWallets(this.loginId);
		}
	}
	first(admno) {
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getWallets(this.loginId);
		} else {
			this.getWallets(this.loginId);
		}
	}
	last(admno) {
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getWallets(this.loginId);
		} else {
			this.getWallets(this.loginId);
		}
	}
	key(admno) {
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getWallets(this.loginId);
		} else {
			this.getWallets(this.loginId);
		}
	}
	next2(admno) {
		this.feeLoginId = admno;
	}
	prev2(admno) {
		this.feeLoginId = admno;
	}
	first2(admno) {
		this.feeLoginId = admno;
	}
	last2(admno) {
		this.feeLoginId = admno;
	}
	key2(admno) {
		this.feeLoginId = admno;
	}
	isExist(mod_id) {
		return this.common.isExistUserAccessMenu(mod_id);
	}
	checkStatus() {
		if (this.commonStu.studentdetails.editable_status === '1') {
			return true;
		} else {
			return false;
		}
	}
	openReceiptDialog(element, args): void {
		console.log("i am here",);
		if (args.cell === args.grid.getColumnIndex('txn_id')) {
			let check = args.grid.getDataItem(args.row);
			if (check.w_amount_status == 'deposit' || check.w_amount_status == 'withdrawal') {
				const dialogRef = this.dialog.open(WalletReceiptDetailsModalComponent, {
					width: '80%',
					data: {
						rpt_id: check.txn_id,
						admission_id: this.loginId,
						edit: false
					},
					hasBackdrop: true
				});

				dialogRef.afterClosed().subscribe(result => {
				});
			} else if (element.w_amount_status == 'purchase') {
				this.feeService.allStoreBill({ bill_no: parseInt(check.txn_id) }).subscribe((result: any) => {
					if (result && result.length > 0) {
						this.billDetailsModal.openModal(result[result.length - 1]);

					}
				})
			}
		} else if(args.cell === args.grid.getColumnIndex('action')) {
			let check = args.grid.getDataItem(args.row);
			this.deleteConfirm(check);
		}

		console.log(element);

	}
	ngOnDestroy() {
		this.studentRouteMoveStoreService.setInvoiceId({ });
	}
	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}
	exportAsExcel(json: any[]) {
		let reportType: any = '';
		let reportType2: any = '';
		const columns: any[] = [];
		const columValue: any[] = [];
		this.exportColumnDefinitions = [];
		this.exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
		console.log("-------------------", this.exportColumnDefinitions);
		
		// columns.push({
		// 	key: 'w_rpt_no',
		// 	width: this.checkWidth('w_rpt_no', 'Txn Id')
		// });
		// columns.push({
		// 	key: 'w_transaction_date',
		// 	width: this.checkWidth('w_transaction_date', 'Date')
		// });
		// columns.push({
		// 	key: 'particulars',
		// 	width: this.checkWidth('particulars', 'Particulars')
		// });

		// columns.push({
		// 	key: 'w_amount',
		// 	width: this.checkWidth('w_amount', 'Amount')
		// });

		reportType = new TitleCasePipe().transform('wallet_ledger_report: ' + this.sessionName + '_' + this.commonStu.studentdetails.au_full_name + '_' + this.commonStu.studentdetails.em_admission_no);
		reportType2 = new TitleCasePipe().transform('wallet ledger report: ' + this.sessionName + '_' + this.commonStu.studentdetails.au_full_name + '_' + this.commonStu.studentdetails.em_admission_no);

		const fileName = reportType + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		for (const item of this.exportColumnDefinitions) {
			if(item.id != "action") {
				columns.push({
					key: item.id,
					width: this.checkWidth(item.id, item.name)
				});
				columValue.push(item.name);
			}
			
		}
		worksheet.properties.defaultRowHeight = 60;
		worksheet.mergeCells('A1:' + this.alphabetJSON[7] + '1');
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[7] + '2');
		worksheet.getCell('A2').value = reportType2;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('A3:' + this.alphabetJSON[7] + '3');
		worksheet.getCell('A3').value = this.commonStu.studentdetails.au_full_name + '(' +
			this.commonStu.studentdetails.em_admission_no + ')';
		worksheet.getCell(`A3`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('A4:' + this.alphabetJSON[7] + '4');
		worksheet.getCell('A4').value = 'Class : ' + this.commonStu.studentdetails.class_name + ' ' +
			this.commonStu.studentdetails.sec_name;
		worksheet.getCell(`A4`).alignment = { horizontal: 'left' };
		worksheet.getRow(6).values = columValue;
		worksheet.columns = columns;
		this.length = worksheet._rows.length;
		for (const dety of this.ELEMENT_DATA) {
			const prev = this.length + 1;
			const obj: any = { };
			this.length++;
			console.log("i am dety", dety);
			
			// worksheet.getCell('A' + this.length).value = dety.w_rpt_no;
			// worksheet.getCell('B' + this.length).value = dety.w_transaction_date;
			// worksheet.getCell('C' + this.length).value = dety.particulars + (dety.subparticulars ? '-' + dety.subparticulars : '');
			// worksheet.getCell('D' + this.length).value = dety.w_amount_sign + dety.w_amount;
			worksheet.addRow(dety);
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
			if (rowNum === 6) {
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
			if (rowNum > 6 && rowNum <= worksheet._rows.length) {
				row.eachCell(cell => {
					// tslint:disable-next-line: max-line-length
					if (cell._address.charAt(0) !== 'A' && cell._address.charAt(0) !== 'F' && cell._address.charAt(0) !== 'J' && cell._address.charAt(0) !== 'L') {
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

		const obj3: any = this.totalRow
		worksheet.addRow(obj3);
		worksheet.eachRow((row, rowNum) => {
			if (rowNum === worksheet._rows.length) {
				row.eachCell(cell => {
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: '004261' },
						bgColor: { argb: '004261' },
					};
					cell.font = {
						color: { argb: 'ffffff' },
						bold: true,
						name: 'Arial',
						size: 10
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center' };
				});
			}
		});
		workbook.xlsx.writeBuffer().then(data => {
			const blob = new Blob([data], { type: 'application/octet-stream' });
			saveAs(blob, fileName);
		});

	}
	checkWidth(id, header) {
		const res = this.ELEMENT_DATA.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}
	getColor(element) {
		if (element && element.colorCode) {
			return element.colorCode;
		}
	}
	angularGridReady(angularGrid: AngularGridInstance) {
		this.angularGrid = angularGrid;
		this.gridObj = angularGrid.slickGrid; // grid object
		this.dataviewObj = angularGrid.dataView;
		this.updateTotalRow(angularGrid.slickGrid);
		// this.updateClassSort(angularGrid.slickGrid, angularGrid.dataView);
	}

	getBorder(element) {
		if (element && element.colorCode) {
			return element.colorCode;
		}
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);

	deleteInvoiceFinal(value) {
		console.log(value);
		if (value.reason_id && value.reason_remark) {
			const param: any = { };
			param.w_reason_id = value.reason_id;
			param.w_reason_remark = value.reason_remark;
			param.w_id = value.inv_id.action.w_id;
			param.w_status = '5';
			this.feeService.updateWalletStatus(param).subscribe((result: any) => {
				if (result && result.status == 'ok') {
					this.common.showSuccessErrorMessage(result.data, 'success');
					this.getWallets(this.loginId);
				} else {
					this.common.showSuccessErrorMessage(result.data, 'error');
				}
			})
		}
	}
	deleteConfirm(value) {
		this.deleteWithReasonModal.openModal(value);
	}
	clearGrouping() {
		if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
			this.draggableGroupingPlugin.clearDroppedGroups();
		}
	}
	collapseAllGroups() {
		this.dataviewObj.collapseAllGroups();
		this.updateTotalRow(this.angularGrid.slickGrid);
	}

	expandAllGroups() {
		this.dataviewObj.expandAllGroups();
		this.updateTotalRow(this.angularGrid.slickGrid);
	}
	updateTotalRow(grid: any) {
		let columnIdx = grid.getColumns().length;
		while (columnIdx--) {
			const columnId = grid.getColumns()[columnIdx].id;
			const columnElement: HTMLElement = grid.getFooterRowColumn(columnId);
			columnElement.innerHTML = '<b>' + (this.totalRow[columnId] ? this.totalRow[columnId] : '') + '<b>';
		}
	}
	onGroupChanged(groups: Grouping[]) {
		if (Array.isArray(this.selectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
			// update all Group By select dropdown
			this.selectedGroupingFields.forEach((g, i) => {
				this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '';
			});
		}
	}
	checkReceiptFormatter(row, cell, value, columnDef, dataContext) {
		if (value === '-') {
			return '-';
		} else {
			if (value)
				return '<a>' + value + '</a>';
			else
				return '-';
		}
	}
	checkFeeFormatter(row, cell, value, columnDef, dataContext) {
		if (value === 0 || value === '0') {
			return '-';
		} else {
			if (value > 0) {
				return new IndianCurrency().transform(value);
			} else {
				if (value && value != '-') {
					return '-' + new IndianCurrency().transform(-value);
				}
			}

		}
	}

	getImageCheck(row, cell, value, columnDef, dataContext){ 
		if(value)
	 		return '<i class="material-icons icon-danger icon-spacer">delete</i>'
		else 
			return ''
	 }
	 exportAsPDF(json: any[]) {
		 this.dataset = json;
		const headerData: any[] = [];
		this.pdfrowdata = [];
		this.levelHeading = [];
		this.levelTotalFooter = [];
		this.levelSubtotalFooter = [];
		this.exportColumnDefinitions = [];
		this.exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
		let reportType: any = 'Wallet Ledger Report';
		
		
		const doc = new jsPDF('p', 'mm', 'a0');
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 22,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			head: [[reportType]],
			margin: { top: 0 },
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 20,
			},
			useCss: true,
			theme: 'striped'
		});
		const rowData: any[] = [];
		for (const item of this.exportColumnDefinitions) {
			if(item.id != 'action')
			headerData.push(item.name);
		}
		if (this.dataviewObj.getGroups().length === 0) {
			Object.keys(this.dataset).forEach((key: any) => {
				const arr: any[] = [];
				for (const item2 of this.exportColumnDefinitions) {
					if (this.dataset[key][item2.id] !== 'action' ) {
						arr.push(this.common.htmlToText(this.dataset[key][item2.id]));
					} 
				}
				rowData.push(arr);
				this.pdfrowdata.push(arr);
			});
		} 
		// if (this.totalRow) {
		// 	const arr: any[] = [];
		// 	for (const item of this.exportColumnDefinitions) {
		// 		arr.push(this.totalRow[item.id]);
		// 	}
		// 	rowData.push(arr);
		// 	this.pdfrowdata.push(arr);
		// }
		doc.levelHeading = this.levelHeading;
		doc.levelTotalFooter = this.levelTotalFooter;
		doc.levelSubtotalFooter = this.levelSubtotalFooter;
		doc.autoTable({
			head: [headerData],
			body: this.pdfrowdata,
			startY: doc.previousAutoTable.finalY + 0.5,
			tableLineColor: 'black',
			didDrawPage: function (data) {
				doc.setFontStyle('bold');

			},
			willDrawCell: function (data) {
				// tslint:disable-next-line:no-shadowed-variable
				const doc = data.doc;
				const rows = data.table.body;

				// level 0
				const lfIndex = doc.levelTotalFooter.findIndex(item => item === data.row.index);
				if (lfIndex !== -1) {
					doc.setFontStyle('bold');
					doc.setFontSize('18');
					doc.setTextColor('#ffffff');
					doc.setFillColor(0, 62, 120);
				}

				// level more than 0
				const lsfIndex = doc.levelSubtotalFooter.findIndex(item => item === data.row.index);
				if (lsfIndex !== -1) {
					doc.setFontStyle('bold');
					doc.setFontSize('18');
					doc.setTextColor('#ffffff');
					doc.setFillColor(229, 136, 67);
				}

				// group heading
				const lhIndex = doc.levelHeading.findIndex(item => item === data.row.index);
				if (lhIndex !== -1) {
					doc.setFontStyle('bold');
					doc.setFontSize('18');
					doc.setTextColor('#5e666d');
					doc.setFillColor('#c8d6e5');
				}

				// grand total
				if (data.row.index === rows.length - 1) {
					doc.setFontStyle('bold');
					doc.setFontSize('18');
					doc.setTextColor('#ffffff');
					doc.setFillColor(67, 160, 71);
				}
			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#c8d6e5',
				textColor: '#5e666d',
				fontSize: 18,
			},
			alternateRowStyles: {
				fillColor: '#f1f4f7'
			},
			useCss: true,
			styles: {
				fontSize: 22,
				// cellWidth: 50,
				textColor: 'black',
				lineColor: '#89a8c8',
			},
			theme: 'grid'
		});
		
		
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [['No of records: ' + json.length]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 20,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [['Generated On: '
				+ new DatePipe('en-in').transform(new Date(), 'd-MMM-y')]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 20,
			},
			useCss: true,
			theme: 'striped'
		});
		// doc.autoTable({
		// 	// tslint:disable-next-line:max-line-length
		// 	head: [['Generated By: ' + new TitleCasePipe().transform(this.currentUser.full_name)]],
		// 	didDrawPage: function (data) {

		// 	},
		// 	headStyles: {
		// 		fontStyle: 'bold',
		// 		fillColor: '#ffffff',
		// 		textColor: 'black',
		// 		halign: 'left',
		// 		fontSize: 20,
		// 	},
		// 	useCss: true,
		// 	theme: 'striped'
		// });
		doc.save('wallet_ledger_report: ' + this.sessionName + '_' + this.commonStu.studentdetails.au_full_name + '_' + this.commonStu.studentdetails.em_admission_no + '.pdf');
	}

}

// export interface Element {
// 	w_rpt_no: number;
// 	rpt_type: string;
// 	w_transaction_date: string;
// 	w_amount: number;
// 	w_amount_type: string;
// 	w_amount_status: string;
// 	w_amount_sign: string;
// 	w_pay_id: string;
// 	w_cheque_no: string;
// 	w_bnk_id: string;
// 	w_branch: string;
// 	w_transaction_id: string;
// 	w_remarks: string;
// 	w_cheque_date: string;
// 	w_opening: number;
// 	particulars: string;
// 	subparticulars: string;
// }
