import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { reportTable } from './reports.table';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FeeService, CommonAPIService, SisService } from '../../_services';
import { MatTableDataSource, MatPaginator, PageEvent, MatDialog, MatPaginatorIntl } from '@angular/material';
import { DatePipe, DecimalPipe } from '@angular/common';
import { InvoiceDetailsModalComponent } from '../../feemaster/invoice-details-modal/invoice-details-modal.component';
import * as XLSX from 'xlsx';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import { MatPaginatorI18n } from '../../sharedmodule/customPaginatorClass';
import { ReceiptDetailsModalComponent } from '../../sharedmodule/receipt-details-modal/receipt-details-modal.component';
import { reduce } from 'rxjs/operators';
@Component({
	selector: 'app-reports',
	templateUrl: './reports.component.html',
	styleUrls: ['./reports.component.scss'],
	providers: [
		{ provide: MatPaginatorIntl, useClass: MatPaginatorI18n }
	]
})
export class ReportsComponent implements OnInit, AfterViewInit, OnDestroy {
	reportsTable: any;
	renderTable: any = {};
	toggleSearch = false;
	finalTable: any = {};
	reportHeader: any = 'Default';
	reportType: any = {};
	panelOpenState = true;
	previousIndex = 0;
	accountFlag = false;
	tableFlag = false;
	reportFlag = true;
	reportTypeArray: any[] = [];
	reportFilterForm: FormGroup;
	REPORT_ELEMENT_DATA: any[] = [];
	REPORT_ELEMENT_DATA2: any[] = [];
	valueLabel: any = 'Value';
	totalRecords: any;
	currentDate = new Date();
	minDate: any;
	schoolInfo: any;
	startMonth: any;
	valueArray: any[] = [];
	advSearchFlag = true;
	hiddenFieldLabel: any = '';
	@ViewChild('paginator') paginator: MatPaginator;
	dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
	dataSource2 = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA2);
	feePeriod: any[] = [];
	hiddenValueArray: any[] = [];
	hiddenValueArray2: any[] = [];
	hiddenValueArray3: any[] = [];
	hiddenValueArray4: any[] = [];
	hiddenValueArray5: any[] = [];
	hiddenFieldLabel2: any = '';
	classDataArray: any[] = [];
	pageEvent: PageEvent;
	feeReportArray: any[] = [
		{
			report_id: '1',
			report_name: 'Collection Report',
			report_image: '/assets/images/Fee Reports/collection_report.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '2',
			report_name: 'Fee Outstanding Report',
			report_image: '/assets/images/Fee Reports/fee_defaulter_list.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '3',
			report_name: 'Fee Projection Report',
			report_image: '/assets/images/Fee Reports/fee_projection.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '4',
			report_name: 'Fee Transaction Report',
			report_image: '/assets/images/Fee Reports/fee_transaction.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '5',
			report_name: 'Fee Ledger Report',
			report_image: '/assets/images/Fee Reports/fee_ledger.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '6',
			report_name: 'Deleted Fee Transactions',
			report_image:
				'/assets/images/Fee Reports/deleted_fee_transaction.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '7',
			report_name: 'Fee Adjustment Report',
			report_image: '/assets/images/Fee Reports/fee_adjustment.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '8',
			report_name: 'Fee Concession Report',
			report_image: '/assets/images/Fee Reports/fee_concession.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '9',
			report_name: 'Missing Fee Invoice',
			report_image:
				'/assets/images/Fee Reports/missing_fee_invoice.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '10',
			report_name: 'Fee Structure Report',
			report_image: '/assets/images/Fee Reports/fee_structure.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '11',
			report_name: 'Cheque Clearance Report',
			report_image: '/assets/images/Fee Reports/cheque_clearance.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '12',
			report_name: 'Advanced Security Deposit',
			report_image: '/assets/images/Fee Reports/advanced_security.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '13',
			report_name: 'Online Transaction Details',
			report_image: '/assets/images/Fee Reports/online_transaction.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '14',
			report_name: 'Dynamic Report',
			report_image: '/assets/images/Fee Reports/dynamics.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '15',
			report_name: 'Transport Report',
			report_image: '/assets/images/Fee Reports/transport_report.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		}
	];
	constructor(private fbuild: FormBuilder,
		private feeService: FeeService,
		private common: CommonAPIService,
		private sisService: SisService,
		public dialog: MatDialog) { }

	ngOnInit() {
		this.getFeePeriod();
		localStorage.removeItem('invoiceBulkRecords');
		this.getSchool();
		this.buildForm();
		this.getClassData();
		this.getRoutes2();
		this.getStoppages();
		this.getSlabs();
		this.reportsTable = reportTable;
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource2.paginator = this.paginator;
	}
	buildForm() {
		this.reportFilterForm = this.fbuild.group({
			'report_type': '',
			'fee_value': '',
			'from_date': '',
			'to_date': '',
			'hidden_value': '',
			'hidden_value2': '',
			'hidden_value3': '',
			'hidden_value4': '',
			'hidden_value5': '',
			'filterReportBy': '',
			'admission_no': '',
			'au_full_name': '',
			'pageSize': '10',
			'pageIndex': '0'
		});
	}
	getFeePeriod() {
		this.feeService.getFeePeriods({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feePeriod = result.data;
			}
		});
	}
	executeReport(report_id) {
		this.reportTypeArray = [];
		this.reportFlag = true;
		this.advSearchFlag = true;
		this.accountFlag = false;
		this.reportType = '';
		this.tableFlag = false;
		this.reportFilterForm.patchValue({
			'report_type': '',
			'fee_value': '',
			'from_date': '',
			'to_date': '',
			'hidden_value2': '',
			'hidden_value': '',
			'hidden_value3': '',
			'hidden_value4': '',
			'hidden_value5': '',
			'pageSize': '10',
			'pageIndex': '0',
			'filterReportBy': '',
			'admission_no': '',
			'au_full_name': ''
		});
		if (this.previousIndex >= 0) {
			this.feeReportArray[this.previousIndex].main_text_class = 'text-center';
			this.feeReportArray[this.previousIndex].report_main_image_class = '';
			this.feeReportArray[this.previousIndex].report_middle_class = '';
			this.feeReportArray[this.previousIndex].report_check_icon_class = '';
		}
		const findex = this.feeReportArray.findIndex(
			f => Number(f.report_id) === Number(report_id)
		);
		if (findex !== -1) {
			this.feeReportArray[findex].main_text_class =
				'text-center main-text-container';
			this.feeReportArray[findex].report_main_image_class = 'report-main-image';
			this.feeReportArray[findex].report_middle_class = 'report-middle';
			this.feeReportArray[findex].report_check_icon_class =
				'report-check-icon fas fa-check-circle';
			this.reportHeader = this.feeReportArray[findex].report_name;
			let renderingArray: any[] = [];
			renderingArray = this.reportsTable.report;
			const findex2 = renderingArray.findIndex(f => Number(f.report_id) === Number(report_id));
			if (findex2 !== -1) {
				this.renderTable = renderingArray[findex2]['dataReport'];
				this.reportType = report_id;
			}
			if (Number(report_id) === 1) {
				this.reportTypeArray.push({
					report_type: 'headwise', report_name: 'Head Wise'
				},
					{
						report_type: 'classwise', report_name: 'Class Wise'
					},
					{
						report_type: 'modewise', report_name: 'Mode Wise'
					},
					{
						report_type: 'routewise', report_name: 'Route Wise'
					},
					{
						report_type: 'mfr', report_name: 'MFR Report'
					});
			}
			if (Number(report_id) === 2) {
				this.reportTypeArray.push({
					report_type: 'headwise', report_name: 'Head Wise'
				},
					{
						report_type: 'classwise', report_name: 'Class Wise'
					},
					{
						report_type: 'modewise', report_name: 'Mode Wise'
					},
					{
						report_type: 'routewise', report_name: 'Route Wise'
					});
			}
			if (Number(report_id) === 8) {
				this.reportTypeArray.push({
					report_type: 'concession', report_name: 'Concession Report'
				},
					{
						report_type: 'concessionAlloted', report_name: 'Concession Alloted Report'
					});
			}
			if (Number(report_id) === 9) {
				this.valueLabel = 'Class';
				this.getClass();
				this.hiddenFieldLabel2 = 'Section';
				this.finalTable = this.renderTable['missingFeeInvoice'];
			}
			if (Number(report_id) === 11) {
				this.finalTable = this.renderTable['chequeControlList'];
				this.valueLabel = 'Class';
				this.hiddenFieldLabel2 = 'Section';
				this.getClass();
			}
			if (Number(report_id) === 5) {
				this.finalTable = this.renderTable['feeLedger'];
				this.valueLabel = 'Class';
				this.hiddenFieldLabel2 = 'Section';
				this.getClass();
			}
			if (Number(report_id) === 6) {
				this.finalTable = this.renderTable['deletedFeeTransaction'];
				this.valueLabel = 'Class';
				this.hiddenFieldLabel2 = 'Section';
				this.getClass();
			}
			if (Number(report_id) === 10) {
				this.reportTypeArray.push({
					report_type: 'feestructure',
					report_name: 'Fee Structure Report'
				},
					{
						report_type: 'feestructurealloted',
						report_name: 'Fee Structure Alloted Report'
					});
			}
			if (Number(report_id) === 7) {
				this.finalTable = this.renderTable['feeAdjustment'];
				this.valueLabel = 'Class';
				this.hiddenFieldLabel2 = 'Section';
				this.getClass();
			}
			if (Number(report_id) === 12) {
				this.finalTable = this.renderTable['securityDeposit'];
				this.valueLabel = 'Class';
				this.hiddenFieldLabel2 = 'Section';
				this.getClass();
			}
			if (Number(report_id) === 15) {
				this.finalTable = this.renderTable['transport'];
				this.valueLabel = 'Class';
				this.hiddenFieldLabel2 = 'Section';
				this.getClass();
			}
			this.previousIndex = findex;
			this.reportFlag = false;
			this.accountFlag = true;
		}
	}
	getHiddenFieldValue($event, type) {
		this.hiddenValueArray = [];
		if (Number(type) === 1 && (this.reportFilterForm.value.report_type === 'classwise'
			|| this.reportFilterForm.value.report_type === 'mfr')) {
			this.sisService.getSectionsByClass({ class_id: $event.value }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					for (const item of result.data) {
						this.hiddenValueArray.push({
							id: item.sec_id,
							name: item.sec_name
						});
					}
				}
			});
		}
		if (Number(type) === 1 && (this.reportFilterForm.value.report_type === 'headwise ' ||
			this.reportFilterForm.value.report_type === 'routewise' ||
			this.reportFilterForm.value.report_type === 'modewise')) {
			this.getClass2();
		}
		if (Number(type) >= 5) {
			this.hiddenValueArray2 = [];
			this.sisService.getSectionsByClass({ class_id: $event.value }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					for (const item of result.data) {
						this.hiddenValueArray2.push({
							id: item.sec_id,
							name: item.sec_name
						});
					}
				}
			});
		}
	}
	getHiddenFieldValue2($event, type) {
		this.hiddenValueArray2 = [];
		if (this.reportFilterForm.value.report_type !== 'classwise') {
			this.sisService.getSectionsByClass({ class_id: $event.value }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					for (const item of result.data) {
						this.hiddenValueArray2.push({
							id: item.sec_id,
							name: item.sec_name
						});
					}
				}
			});
		}
	}
	switchReport() {
		this.accountFlag = false;
		this.advSearchFlag = true;
		this.toggleSearch = false;
		this.valueLabel = 'Value';
		this.reportFlag = true;
		this.valueArray = [];
		this.hiddenValueArray = [];
		this.reportFilterForm.patchValue({
			'report_type': '',
			'fee_value': '',
			'from_date': '',
			'to_date': '',
			'hidden_value': '',
			'hidden_value2': '',
			'hidden_value3': '',
			'hidden_value4': '',
			'hidden_value5': '',
			'filterReportBy': '',
			'pageSize': '10',
			'pageIndex': '0',
			'admission_no': '',
			'au_full_name': ''
		});
	}
	changeReportType($event, type) {
		this.reportFilterForm.patchValue({
			'fee_value': '',
			'from_date': '',
			'to_date': '',
			'hidden_value': '',
			'hidden_value2': '',
			'hidden_value3': '',
			'hidden_value4': '',
			'hidden_value5': '',
			'filterReportBy': '',
			'pageSize': '10',
			'pageIndex': '0',
			'admission_no': '',
			'au_full_name': ''
		});
		if (Number(this.reportType) === 1) {
			this.hiddenValueArray2 = [];
		}
		this.tableFlag = false;
		this.toggleSearch = false;
		this.advSearchFlag = true;
		this.REPORT_ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
		this.reportFilterForm.value.report_type = $event.value;
		if ($event.value) {
			this.finalTable = this.renderTable[$event.value];
		}
		if ($event.value === 'headwise') {
			this.valueLabel = 'Fee Heads';
			this.getFeeHeads();
			this.hiddenFieldLabel = 'Class';
			this.getClass2();
			this.hiddenFieldLabel2 = 'Section';
		}
		if ($event.value === 'classwise') {
			this.hiddenValueArray = [];
			this.valueLabel = 'Class';
			this.hiddenFieldLabel = 'Section';
			this.getClass();
		}
		if ($event.value === 'mfr') {
			this.hiddenValueArray = [];
			this.valueLabel = 'Class';
			this.hiddenFieldLabel = 'Section';
			this.getClass();
		}
		if ($event.value === 'modewise') {
			this.valueLabel = 'Mode';
			this.hiddenFieldLabel = 'Class';
			this.getModes();
			this.hiddenFieldLabel2 = 'Section';
			this.getClass2();
		}
		if ($event.value === 'routewise') {
			this.valueLabel = 'Route';
			this.getRoutes();
			this.hiddenFieldLabel = 'Class';
			this.hiddenFieldLabel2 = 'Section';
			this.getClass2();
		}
		if ($event.value === 'concessionAlloted') {
			this.valueLabel = 'Class';
			this.getClass();
		}
		if ($event.value === 'feestructurealloted') {
			this.valueLabel = 'Class';
			this.getClass();
		}
		if ($event.value === 'concession') {
			this.advSearchFlag = false;
		}
		if ($event.value === 'feestructure') {
			this.advSearchFlag = false;
		}
	}
	getFeeHeads() {
		this.valueArray = [];
		this.feeService.getFeeHeads({ fh_is_hostel_fee: '' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				for (const item of result.data) {
					this.valueArray.push({
						id: item.fh_id,
						name: item.fh_name
					});
				}
			}
		});
	}
	getClass() {
		this.valueArray = [];
		for (const item of this.classDataArray) {
			this.valueArray.push({
				id: item.class_id,
				name: item.class_name
			});
		}
	}
	getClass2() {
		this.hiddenValueArray = [];
		for (const item of this.classDataArray) {
			this.hiddenValueArray.push({
				id: item.class_id,
				name: item.class_name
			});
		}
	}
	getModes() {
		this.valueArray = [];
		this.feeService.getPaymentMode({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				for (const item of result.data) {
					this.valueArray.push({
						id: item.pay_id,
						name: item.pay_name
					});
				}
			}
		});
	}
	getRoutes() {
		this.valueArray = [];
		this.feeService.getRoutes({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				for (const item of result.data) {
					this.valueArray.push({
						id: item.tr_id,
						name: item.tr_route_name
					});
				}
			}
		});
	}
	generateReport(value: any) {
		this.tableFlag = false;
		value.from_date = new DatePipe('en-in').transform(value.from_date, 'yyyy-MM-dd');
		value.to_date = new DatePipe('en-in').transform(value.to_date, 'yyyy-MM-dd');
		let collectionJSON = {};
		let filterBy: any;
		if (Number(this.reportType) === 1) {
			filterBy = 'collection';
		}
		if (Number(this.reportType) === 2) {
			filterBy = 'outstanding';
		}
		if (this.reportFilterForm.value.report_type === 'headwise') {
			collectionJSON = {
				'admission_no': value.admission_no,
				'studentName': value.au_full_name,
				'report_type': value.report_type,
				'feeHeadId': value.fee_value,
				'classId': value.hidden_value,
				'secId': value.hidden_value2,
				'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': value.pageSize,
				'pageIndex': value.pageIndex,
				'filterReportBy': filterBy
			};
		}
		if (this.reportFilterForm.value.report_type === 'classwise') {
			collectionJSON = {
				'admission_no': value.admission_no,
				'studentName': value.au_full_name,
				'report_type': value.report_type,
				'classId': value.fee_value,
				'secId': value.hidden_value,
				'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': value.pageSize,
				'pageIndex': value.pageIndex,
				'filterReportBy': filterBy
			};
		}
		if (this.reportFilterForm.value.report_type === 'modewise') {
			collectionJSON = {
				'report_type': value.report_type,
				'fee_value': '',
				'admission_no': value.admission_no,
				'studentName': value.au_full_name,
				'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': value.pageSize,
				'classId': value.hidden_value,
				'secId': value.hidden_value2,
				'pageIndex': value.pageIndex,
				'modeId': value.fee_value,
				'filterReportBy': filterBy
			};
		}
		if (this.reportFilterForm.value.report_type === 'routewise') {
			collectionJSON = {
				'report_type': value.report_type,
				'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': value.pageSize,
				'pageIndex': value.pageIndex,
				'routeId': value.fee_value,
				'classId': value.hidden_value,
				'admission_no': value.admission_no,
				'secId': value.hidden_value2,
				'studentName': value.au_full_name,
				'filterReportBy': filterBy
			};
		}
		let repoArray: any[] = [];
		this.REPORT_ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
		this.REPORT_ELEMENT_DATA2 = [];
		this.dataSource2 = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA2);
		if ((Number(this.reportType) === 1 || Number(this.reportType) === 2)
			&& this.reportFilterForm.value.report_type) {
			if (this.reportFilterForm.value.report_type !== 'mfr') {
				this.feeService.getHeadWiseCollection(collectionJSON).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage(result.message, 'success');
						repoArray = result.data.reportData;
						this.totalRecords = Number(result.data.totalRecords);
						localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
						if (this.reportFilterForm.value.report_type === 'headwise') {
							let i = 0;
							let j = 0;
							const fee_head_data: any[] = [];
							const fee_head_data_name: any[] = [];
							Object.keys(repoArray).forEach((keys: any) => {
								const obj: any = {};
								if (Number(keys) === 0) {
									fee_head_data.push('srno', 'invoice_created_date', 'stu_admission_no', 'stu_full_name',
										'stu_class_name', 'invoice_no', 'receipt_no');
									fee_head_data_name.push('SNo.', 'Date', 'Admission No', 'Student Name',
										'Class-Section', 'Invoice No.', 'Reciept No.');
								}
								if (repoArray[Number(keys)]['fee_head_data']) {
									let k = 0;
									let tot = 0;
									for (const titem of repoArray[Number(keys)]['fee_head_data']) {
										Object.keys(titem).forEach((key2: any) => {
											if (key2 === 'fh_id' && Number(keys) === 0) {
												fee_head_data.push(key2 + j);
												j++;
											}
											if (key2 === 'fh_name' && Number(keys) === 0) {
												fee_head_data_name.push(titem[key2]);
											}
											if (key2 === 'fh_id') {
												obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
													(Number(keys) + 1);
												obj['invoice_created_date'] = repoArray[Number(keys)]['invoice_created_date'];
												obj[key2 + k] = titem['fh_amt'] ? new DecimalPipe('en-us').transform(titem['fh_amt']) : '0';
												obj['invoice_no'] = repoArray[Number(keys)]['invoice_no'] ?
													repoArray[Number(keys)]['invoice_no'] : '-';
												obj['invoice_id'] = repoArray[Number(keys)]['invoice_id'] ?
													repoArray[Number(keys)]['invoice_id'] : '0';
												obj['receipt_id'] = repoArray[Number(keys)]['rpt_id'] ?
													repoArray[Number(keys)]['rpt_id'] : '0';
												obj['receipt_no'] = repoArray[Number(keys)]['receipt_no'] ?
													repoArray[Number(keys)]['receipt_no'] : 'NA';
												obj['stu_admission_no'] = repoArray[Number(keys)]['stu_admission_no'] ?
													repoArray[Number(keys)]['stu_admission_no'] : '-';
												obj['stu_full_name'] = repoArray[Number(keys)]['stu_full_name'];
												obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'] + '-' +
													repoArray[Number(keys)]['stu_sec_name'];
												tot = tot + (titem['fh_amt'] ? Number(titem['fh_amt']) : 0);
												obj['total'] = new DecimalPipe('en-us').transform(tot);
												obj['receipt_mode_name'] = repoArray[Number(keys)]['pay_name'] ?
													repoArray[Number(keys)]['pay_name'] : 'NA';
												k++;
											}
										});
									}
								}
								i++;
								this.REPORT_ELEMENT_DATA.push(obj);
							});
							fee_head_data.push('total', 'receipt_mode_name');
							fee_head_data_name.push('Total', 'Mode');
							this.tableFlag = true;
							this.finalTable.columnDef = fee_head_data;
							this.finalTable.colunmHeader = fee_head_data_name;
						} else if (this.reportFilterForm.value.report_type === 'classwise') {
							let index = 0;
							for (const item of repoArray) {
								const obj: any = {};
								obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
									(index + 1);
								obj['invoice_created_date'] = repoArray[Number(index)]['invoice_created_date'];
								obj['invoice_no'] = repoArray[Number(index)]['invoice_no'] ?
									repoArray[Number(index)]['invoice_no'] : '-';
								obj['invoice_id'] = repoArray[Number(index)]['invoice_id'] ?
									repoArray[Number(index)]['invoice_id'] : '0';
								obj['receipt_no'] = repoArray[Number(index)]['receipt_no'] ?
									repoArray[Number(index)]['receipt_no'] : 'NA';
								obj['receipt_id'] = repoArray[Number(index)]['rpt_id'] ?
									repoArray[Number(index)]['rpt_id'] : '0';
								obj['stu_admission_no'] = repoArray[Number(index)]['stu_admission_no'] ?
									repoArray[Number(index)]['stu_admission_no'] : '-';
								obj['stu_full_name'] = repoArray[Number(index)]['stu_full_name'];
								obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
									repoArray[Number(index)]['stu_sec_name'];
								obj['rpt_amount'] = repoArray[Number(index)]['rpt_amount'] ?
									new DecimalPipe('en-us').transform(repoArray[Number(index)]['rpt_amount'])
									: '0';
								obj['fp_name'] = repoArray[Number(index)]['fp_name'] ?
									repoArray[Number(index)]['fp_name'] : '-';
								this.REPORT_ELEMENT_DATA.push(obj);
								this.tableFlag = true;
								index++;
							}
						} else if (this.reportFilterForm.value.report_type === 'modewise') {
							let index = 0;
							for (const item of repoArray) {
								const obj: any = {};
								obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
									(index + 1);
								obj['invoice_created_date'] = repoArray[Number(index)]['invoice_created_date'];
								obj['invoice_no'] = repoArray[Number(index)]['invoice_no'] ?
									repoArray[Number(index)]['invoice_no'] : '-';
								obj['invoice_id'] = repoArray[Number(index)]['invoice_id'] ?
									repoArray[Number(index)]['invoice_id'] : '0';
								obj['receipt_no'] = repoArray[Number(index)]['receipt_no'] ?
									repoArray[Number(index)]['receipt_no'] : 'NA';
								obj['receipt_id'] = repoArray[Number(index)]['rpt_id'] ?
									repoArray[Number(index)]['rpt_id'] : '0';
								obj['stu_admission_no'] = repoArray[Number(index)]['stu_admission_no'] ?
									repoArray[Number(index)]['stu_admission_no'] : '-';
								obj['stu_full_name'] = repoArray[Number(index)]['stu_full_name'];
								obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
									repoArray[Number(index)]['stu_sec_name'];
								obj['rpt_amount'] = repoArray[Number(index)]['rpt_amount'] ?
									new DecimalPipe('en-us').transform(repoArray[Number(index)]['rpt_amount'])
									: 0;
								obj['fp_name'] = repoArray[Number(index)]['fp_name'] ?
									repoArray[Number(index)]['fp_name'] : 'NA';
								obj['pay_name'] = repoArray[Number(index)]['pay_name'] ?
									repoArray[Number(index)]['pay_name'] : 'NA';
								this.REPORT_ELEMENT_DATA.push(obj);
								this.tableFlag = true;
								index++;
							}
						} else if (this.reportFilterForm.value.report_type === 'routewise') {
							let index = 0;
							for (const item of repoArray) {
								const obj: any = {};
								obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
									(index + 1);
								obj['invoice_created_date'] = repoArray[Number(index)]['invoice_created_date'];
								obj['invoice_no'] = repoArray[Number(index)]['invoice_no'] ?
									repoArray[Number(index)]['invoice_no'] : '-';
								obj['invoice_id'] = repoArray[Number(index)]['invoice_id'] ?
									repoArray[Number(index)]['invoice_id'] : '0';
								obj['receipt_no'] = repoArray[Number(index)]['receipt_no'] ?
									repoArray[Number(index)]['receipt_no'] : 'NA';
								obj['receipt_id'] = repoArray[Number(index)]['rpt_id'] ?
									repoArray[Number(index)]['rpt_id'] : '0';
								obj['stu_admission_no'] = repoArray[Number(index)]['stu_admission_no'] ?
									repoArray[Number(index)]['stu_admission_no'] : '-';
								obj['stu_full_name'] = repoArray[Number(index)]['stu_full_name'];
								obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
									repoArray[Number(index)]['stu_sec_name'];
								obj['rpt_amount'] = repoArray[Number(index)]['transport_amount'] ?
									new DecimalPipe('en-us').transform(repoArray[Number(index)]['transport_amount'])
									: 0;
								obj['route_name'] = repoArray[Number(index)]['route_name'] ?
									repoArray[Number(index)]['route_name'] : 'NA';
								obj['stoppages_name'] = repoArray[Number(index)]['stoppages_name'] ?
									repoArray[Number(index)]['stoppages_name'] : 'NA';
								this.REPORT_ELEMENT_DATA.push(obj);
								this.tableFlag = true;
								index++;
							}
						}
						this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
						this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
						this.dataSource.paginator = this.paginator;
					} else {
						this.common.showSuccessErrorMessage(result.message, 'error');
						this.REPORT_ELEMENT_DATA = [];
						this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
						this.tableFlag = true;
					}
				});
			}
			if (this.reportFilterForm.value.report_type === 'mfr') {
				const columnData: any[] = [];
				const columnHeaderData: any[] = [];
				collectionJSON = {
					'report_type': value.report_type,
					'from_date': value.from_date,
					'to_date': value.to_date,
					'pageSize': value.pageSize,
					'pageIndex': value.pageIndex,
					'classId': value.fee_value,
					'admission_no': value.admission_no,
					'secId': value.hidden_value,
					'studentName': value.au_full_name,
					'filterReportBy': 'collection'
				};
				this.feeService.getMFRReport(collectionJSON).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage(result.message, 'success');
						repoArray = result.data.reportData;
						this.totalRecords = Number(result.data.totalRecords);
						localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
						let index = 0;
						let qindex = 1;
						columnData.push('srno', 'au_admission_no', 'au_full_name', 'class_name');
						columnHeaderData.push('SNo', 'Admission No.', 'Student Name', 'Class');
						for (const item of repoArray) {
							const obj: any = {};
							obj['fp_id'] = item.inv_fp_id;
							obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
								(index + 1);
							obj['au_admission_no'] = repoArray[Number(index)]['stu_admission_no'] ?
								repoArray[Number(index)]['stu_admission_no'] : '-';
							obj['au_full_name'] = repoArray[Number(index)]['stu_full_name'] ?
								repoArray[Number(index)]['stu_full_name'] : '-';
							obj['class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
								repoArray[Number(index)]['stu_sec_name'];
							for (const titem of item['inv_invoice_generated_status']) {
								Object.keys(titem).forEach((key: any) => {
									if (key === 'fm_name' && index === 0 &&
										Number(item.inv_fp_id) === 2) {
										columnData.push('Q' + qindex);
										qindex++;
										columnHeaderData.push(titem[key]);
									} else if (key === 'fm_name' && index === 0 &&
										Number(item.inv_fp_id) === 1) {
										columnData.push('Q' + qindex);
										qindex++;
										columnHeaderData.push(titem[key]);
									} else if (key === 'fm_name' && index === 0 &&
										Number(item.inv_fp_id) === 3) {
										columnData.push('Q' + qindex);
										qindex++;
										columnHeaderData.push(titem[key]);
									} else if (key === 'fm_name' && index === 0 &&
										Number(item.inv_fp_id) === 4) {
										columnData.push('Q' + qindex);
										qindex++;
										columnHeaderData.push(titem[key]);
									}
									if (key === 'fm_name' &&
										Number(item.inv_fp_id) === 2) {
										obj['Q1'] = item['inv_invoice_generated_status'][0]['invoice_paid_status'];
										obj['Q2'] = item['inv_invoice_generated_status'][1]['invoice_paid_status'];
										obj['Q3'] = item['inv_invoice_generated_status'][2]['invoice_paid_status'];
										obj['Q4'] = item['inv_invoice_generated_status'][3]['invoice_paid_status'];
										obj['inv_id1'] = item['inv_invoice_generated_status'][0]['invoice_id'];
										obj['inv_id2'] = item['inv_invoice_generated_status'][1]['invoice_id'];
										obj['inv_id3'] = item['inv_invoice_generated_status'][2]['invoice_id'];
										obj['inv_id4'] = item['inv_invoice_generated_status'][3]['invoice_id'];
									} else if (key === 'fm_name' &&
										Number(item.inv_fp_id) === 1) {
										obj['Q1'] = item['inv_invoice_generated_status'][0]['invoice_paid_status'];
										obj['Q2'] = item['inv_invoice_generated_status'][1]['invoice_paid_status'];
										obj['Q3'] = item['inv_invoice_generated_status'][2]['invoice_paid_status'];
										obj['Q4'] = item['inv_invoice_generated_status'][3]['invoice_paid_status'];
										obj['Q5'] = item['inv_invoice_generated_status'][4]['invoice_paid_status'];
										obj['Q6'] = item['inv_invoice_generated_status'][5]['invoice_paid_status'];
										obj['Q7'] = item['inv_invoice_generated_status'][6]['invoice_paid_status'];
										obj['Q8'] = item['inv_invoice_generated_status'][7]['invoice_paid_status'];
										obj['Q9'] = item['inv_invoice_generated_status'][8]['invoice_paid_status'];
										obj['Q10'] = item['inv_invoice_generated_status'][9]['invoice_paid_status'];
										obj['Q11'] = item['inv_invoice_generated_status'][10]['invoice_paid_status'];
										obj['Q12'] = item['inv_invoice_generated_status'][11]['invoice_paid_status'];
										obj['inv_id1'] = item['inv_invoice_generated_status'][0]['invoice_id'];
										obj['inv_id2'] = item['inv_invoice_generated_status'][1]['invoice_id'];
										obj['inv_id3'] = item['inv_invoice_generated_status'][2]['invoice_id'];
										obj['inv_id4'] = item['inv_invoice_generated_status'][3]['invoice_id'];
										obj['inv_id5'] = item['inv_invoice_generated_status'][4]['invoice_id'];
										obj['inv_id6'] = item['inv_invoice_generated_status'][5]['invoice_id'];
										obj['inv_id7'] = item['inv_invoice_generated_status'][6]['invoice_id'];
										obj['inv_id8'] = item['inv_invoice_generated_status'][7]['invoice_id'];
										obj['inv_id9'] = item['inv_invoice_generated_status'][8]['invoice_id'];
										obj['inv_id10'] = item['inv_invoice_generated_status'][9]['invoice_id'];
										obj['inv_id11'] = item['inv_invoice_generated_status'][10]['invoice_id'];
										obj['inv_id12'] = item['inv_invoice_generated_status'][11]['invoice_id'];
									} else if (key === 'fm_name' &&
										Number(item.inv_fp_id) === 3) {
										obj['Q1'] = item['inv_invoice_generated_status'][0]['invoice_paid_status'];
										obj['Q2'] = item['inv_invoice_generated_status'][1]['invoice_paid_status'];
										obj['inv_id1'] = item['inv_invoice_generated_status'][0]['invoice_id'];
										obj['inv_id2'] = item['inv_invoice_generated_status'][1]['invoice_id'];
									} else if (key === 'fm_name' &&
										Number(item.inv_fp_id) === 4) {
										obj['Q1'] = item['inv_invoice_generated_status'][0]['invoice_paid_status'];
										obj['inv_id1'] = item['inv_invoice_generated_status'][0]['invoice_id'];
									}
								});
								this.finalTable.columnDef = columnData;
								this.finalTable.colunmHeader = columnHeaderData;
							}
							this.REPORT_ELEMENT_DATA2.push(obj);
							this.tableFlag = true;
							index++;
						}
						this.dataSource2 = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA2);
						this.dataSource2.paginator.length = this.paginator.length = this.totalRecords;
						this.dataSource2.paginator = this.paginator;
					} else {
						this.common.showSuccessErrorMessage(result.message, 'error');
						this.REPORT_ELEMENT_DATA2 = [];
						this.dataSource2 = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA2);
						this.tableFlag = true;
					}
				});
			}
		} else if (Number(this.reportType) === 9) {
			const missingInvoiceJSON = {
				'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': value.pageSize,
				'pageIndex': value.pageIndex,
				'classId': value.fee_value,
				'admission_no': value.admission_no,
				'secId': value.hidden_value2,
				'studentName': value.au_full_name
			};
			this.feeService.getMissingFeeInvoiceReport(missingInvoiceJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					repoArray = result.data.reportData;
					this.totalRecords = Number(result.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					let index = 0;
					for (const item of repoArray) {
						const obj: any = {};
						obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
							(index + 1);
						obj['invoice_created_date'] = repoArray[Number(index)]['invoice_created_date'];
						obj['au_login_id'] = repoArray[Number(index)]['au_admission_no'] ?
							repoArray[Number(index)]['au_admission_no'] : '-';
						obj['au_full_name'] = repoArray[Number(index)]['au_full_name'] ?
							repoArray[Number(index)]['au_full_name'] : '-';
						let feePeriod: any = '';
						for (const period of repoArray[Number(index)]['inv_invoice_generated_status']) {
							feePeriod = feePeriod + period.fm_name + '<br>';
						}
						obj['fp_name'] = feePeriod ? feePeriod : 'NA';
						this.REPORT_ELEMENT_DATA.push(obj);
						this.tableFlag = true;
						index++;
					}
					this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
					this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
					this.dataSource.paginator = this.paginator;
				} else {
					this.REPORT_ELEMENT_DATA = [];
					this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
					this.tableFlag = true;
				}
			});
		} else if (Number(this.reportType) === 11) {
			let CheckControlJson = {};
			CheckControlJson = {
				'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': value.pageSize,
				'pageIndex': value.pageIndex,
				'classId': value.hidden_value,
				'secId': value.hidden_value2,
				'admission_no': value.admission_no,
				'studentName': value.au_full_name,
			};
			this.feeService.getCheckControlReport(CheckControlJson).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					repoArray = result.data.reportData;
					this.totalRecords = Number(result.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					let index = 0;
					for (const item of repoArray) {
						const obj: any = {};
						obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
							(index + 1);
						obj['cheque_date'] = repoArray[Number(index)]['cheque_date'];
						obj['dishonor_date'] = repoArray[Number(index)]['dishonor_date'];
						obj['au_admission_no'] = repoArray[Number(index)]['au_admission_no'] ?
							repoArray[Number(index)]['au_admission_no'] : '-';
						obj['au_full_name'] = repoArray[Number(index)]['au_full_name'] ?
							repoArray[Number(index)]['au_full_name'] : '-';
						obj['class_name'] = repoArray[Number(index)]['class_name'] + '-' +
							repoArray[Number(index)]['sec_name'];
						obj['invoice_no'] = repoArray[Number(index)]['invoice_no'] ?
							repoArray[Number(index)]['invoice_no'] : '-';
						obj['invoice_id'] = repoArray[Number(index)]['invoice_id'] ?
							repoArray[Number(index)]['invoice_id'] : '-';
						obj['receipt_no'] = repoArray[Number(index)]['receipt_no'] ?
							repoArray[Number(index)]['receipt_no'] : 'NA';
						obj['receipt_id'] = repoArray[Number(index)]['receipt_id'] ?
							repoArray[Number(index)]['receipt_id'] : '-';
						obj['receipt_amount'] = repoArray[Number(index)]['receipt_amount'] ?
							new DecimalPipe('en-us').transform(repoArray[Number(index)]['receipt_amount'])
							: 0;
						obj['bank_name'] = repoArray[Number(index)]['bank_name'] ?
							repoArray[Number(index)]['bank_name'] : 'NA';
						if (Number(repoArray[Number(index)]['status']) === 1) {
							obj['status'] = 'Cleared';
						} else if (Number(repoArray[Number(index)]['status']) === 2) {
							obj['status'] = 'Bounced';
						} else {
							obj['status'] = 'Pending';
						}
						obj['fcc_reason_id'] = repoArray[Number(index)]['fcc_reason_id'] ?
							repoArray[Number(index)]['fcc_reason_id'] : '-';
						obj['fcc_remarks'] = repoArray[Number(index)]['fcc_remarks'] ?
							repoArray[Number(index)]['fcc_remarks'] : 'NA';
						this.REPORT_ELEMENT_DATA.push(obj);
						this.tableFlag = true;
						index++;
					}
					this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
					this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
					this.dataSource.paginator = this.paginator;
				} else {
					this.REPORT_ELEMENT_DATA = [];
					this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
					this.tableFlag = true;
				}
			});
		} else if (Number(this.reportType) === 5) {
			let feeLedgerJson = {};
			feeLedgerJson = {
				'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': value.pageSize,
				'pageIndex': value.pageIndex,
				'classId': value.fee_value,
				'secId': value.hidden_value2,
				'admission_no': value.admission_no,
				'studentName': value.au_full_name,
			};
			this.feeService.getFeeLedgerReport(feeLedgerJson).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					repoArray = result.data.reportData;
					this.totalRecords = Number(result.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					let index = 0;
					for (const item of repoArray) {
						for (const stu_arr of item.stu_ledger_arr) {
							const obj: any = {};
							obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
								(++index);
							obj['class_name'] = item['class_name'] + '-' +
								item['sec_name'];
							obj['au_full_name'] = item['au_full_name'] ? item['au_full_name'] : '-';
							obj['au_admission_no'] = item['au_admission_no'] ?
								item['au_admission_no'] : '-';
							obj['flgr_particulars'] = stu_arr['flgr_particulars'] ?
								stu_arr['flgr_particulars'] : '-';
							obj['invoice_id'] = stu_arr['flgr_inv_id'] ?
								stu_arr['flgr_inv_id'] : '-';
							obj['flgr_invoice_type'] = stu_arr['flgr_invoice_type'];
							if (stu_arr['flgr_invoice_type'] === 'R') {
								obj['flgr_invoice_receipt_no'] = 'R-#' + (stu_arr['flgr_invoice_receipt_no'] ?
									stu_arr['flgr_invoice_receipt_no'] : '-');
							} else {
								obj['flgr_invoice_receipt_no'] = 'I-#' + (stu_arr['flgr_invoice_receipt_no'] ?
									stu_arr['flgr_invoice_receipt_no'] : '-');
							}
							obj['flgr_invoice_type'] = stu_arr['flgr_invoice_type'];
							obj['flgr_amount'] = stu_arr['flgr_amount'] ?
								new DecimalPipe('en-us').transform(stu_arr['flgr_amount']) : '0';
							obj['flgr_concession'] = stu_arr['flgr_concession'] ?
								new DecimalPipe('en-us').transform(stu_arr['flgr_concession']) : '-';
							obj['flgr_receipt'] = stu_arr['flgr_receipt'] ?
								new DecimalPipe('en-us').transform(stu_arr['flgr_receipt']) : '-';
							obj['receipt_id'] = stu_arr['receipt_id'];
							obj['flgr_balance'] = stu_arr['flgr_balance'] ?
								new DecimalPipe('en-us').transform(stu_arr['flgr_balance']) : '-';
							this.REPORT_ELEMENT_DATA.push(obj);
						}
						this.tableFlag = true;
					}
					this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
					this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
					this.dataSource.paginator = this.paginator;
				} else {
					this.REPORT_ELEMENT_DATA = [];
					this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
					this.tableFlag = true;
				}
			});
		} else if (Number(this.reportType) === 6) {
			let deletedFeeTransJson = {};
			deletedFeeTransJson = {
				'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': value.pageSize,
				'pageIndex': value.pageIndex,
				'classId': value.fee_value,
				'secId': value.hidden_value2,
				'admission_no': value.admission_no,
				'studentName': value.au_full_name,
			};
			this.feeService.getDeletedFeeTransactionReport(deletedFeeTransJson).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					repoArray = result.data.reportData;
					this.totalRecords = Number(result.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					let index = 0;
					for (const item of repoArray) {
						const obj: any = {};
						obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
							(index + 1);
						obj['invoice_created_date'] = repoArray[Number(index)]['inv_due_date'];
						obj['stu_admission_no'] = repoArray[Number(index)]['au_admission_no'] ?
							repoArray[Number(index)]['au_admission_no'] : '-';
						obj['stu_full_name'] = repoArray[Number(index)]['au_full_name'] ?
							repoArray[Number(index)]['au_full_name'] : '-';
						obj['stu_class_name'] = repoArray[Number(index)]['class_name'] + '-' +
							repoArray[Number(index)]['sec_name'];
						obj['invoice_no'] = repoArray[Number(index)]['inv_invoice_no'] ?
							repoArray[Number(index)]['inv_invoice_no'] : '-';
						obj['invoice_id'] = repoArray[Number(index)]['inv_id'] ?
							repoArray[Number(index)]['inv_id'] : '0';
						obj['fp_name'] = this.getFeePeriodName(repoArray[Number(index)]['inv_fp_id']);
						obj['inv_paid_status'] = item['inv_paid_status'];
						this.REPORT_ELEMENT_DATA.push(obj);
						this.tableFlag = true;
						index++;
					}
					this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
					this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
					this.dataSource.paginator = this.paginator;
				} else {
					this.REPORT_ELEMENT_DATA = [];
					this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
					this.tableFlag = true;
				}
			});
		} else if (Number(this.reportType) === 10) {
			if (this.reportFilterForm.value.report_type === 'feestructure') {
				this.feeService.getFeeStructureReport(this.reportFilterForm.value).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage(result.message, 'success');
						repoArray = result.data.reportData;
						this.totalRecords = Number(result.data.totalRecords);
						localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
						let index = 0;
						for (const item of repoArray) {
							const obj: any = {};
							obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
								(index + 1);
							obj['fs_name'] = repoArray[Number(index)]['fs_name'];
							let feeStructure: any = '';
							let grandTotal = 0;
							for (const fee of item['fs_structure']) {
								if (fee['fc_classfication'] === 'head') {
									feeStructure = feeStructure + '<b>' + fee['fh_name'] + '(' +
										fee['ft_name'] + ')</b>: ' +
										new DecimalPipe('en-us').transform(fee['fh_amount']) + ' (' +
										new DecimalPipe('en-us').transform((Number(fee['fh_amount']) * fee['fh_fm_id'].length))
										+ ')' +
										'<br>';
									grandTotal = grandTotal + (Number(fee['fh_amount']) * fee['fh_fm_id'].length);
								} else if (fee['fc_classfication'] === 'group') {
									let totalAmount = 0;
									for (const amt of fee['fee_groups']) {
										totalAmount = totalAmount + Number(amt['fh_amount']);
									}
									feeStructure = feeStructure + '<b>' + fee['fs_name'] + ' (' +
										fee['fee_groups'][0]['ft_name'] + ')</b> : ' + totalAmount + '<br>';
									grandTotal = grandTotal + Number(totalAmount);
								}
							}
							feeStructure = feeStructure;
							obj['fs_structure'] = feeStructure;
							obj['fs_description'] = item['fs_description'];
							this.REPORT_ELEMENT_DATA.push(obj);
							this.tableFlag = true;
							index++;
						}
						this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
						this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
						this.dataSource.paginator = this.paginator;
					} else {
						this.REPORT_ELEMENT_DATA = [];
						this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
						this.tableFlag = true;
					}
				});
			}
			if (this.reportFilterForm.value.report_type === 'feestructurealloted') {
				let feestructureallotedJson = {};
				feestructureallotedJson = {
					'from_date': value.from_date,
					'to_date': value.to_date,
					'pageSize': value.pageSize,
					'pageIndex': value.pageIndex,
					'classId': value.fee_value,
					'secId': value.hidden_value2,
					'admission_no': value.admission_no,
					'studentName': value.au_full_name,
				};
				this.feeService.getFeeStructureAllotedReport(feestructureallotedJson).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage(result.message, 'success');
						repoArray = result.data.reportData;
						this.totalRecords = Number(result.data.totalRecords);
						localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
						let index = 0;
						for (const item of repoArray) {
							const obj: any = {};
							obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
								(index + 1);
							obj['fs_name'] = repoArray[Number(index)]['fs_name'] ?
								repoArray[Number(index)]['fs_name'] : 'NA';
							obj['class_name'] = item['class_name'] + '-' +
								item['sec_name'];
							obj['au_full_name'] = item['au_full_name'] ? item['au_full_name'] : '-';
							obj['au_admission_no'] = item['au_admission_no'] ?
								item['au_admission_no'] : '-';
							let feeStructure: any = '';
							let grandTotal = 0;
							for (const fee of item['fee_structure_head_group']) {
								if (fee['fc_classfication'] === 'head') {
									feeStructure = feeStructure + '<b>' + fee['fh_name'] + '(' +
										fee['ft_name'] + ')</b>: ' +
										new DecimalPipe('en-us').transform(fee['fh_amount']) + ' (' +
										new DecimalPipe('en-us').transform((Number(fee['fh_amount']) * fee['fh_fm_id'].length))
										+ ')' +
										'<br>';
									grandTotal = grandTotal + (Number(fee['fh_amount']) * fee['fh_fm_id'].length);
								} else if (fee['fc_classfication'] === 'group') {
									let totalAmount = 0;
									for (const amt of fee['fee_groups']) {
										totalAmount = totalAmount + Number(amt['fh_amount']);
									}
									feeStructure = feeStructure + '<b>' + fee['fs_name'] + ' (' +
										fee['fee_groups'][0]['ft_name'] + ')</b> : ' + totalAmount + '<br>';
									grandTotal = grandTotal + Number(totalAmount);
								}
							}
							feeStructure = feeStructure;
							obj['fs_structure'] = feeStructure;
							this.REPORT_ELEMENT_DATA.push(obj);
							this.tableFlag = true;
							index++;
						}
						this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
						this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
						this.dataSource.paginator = this.paginator;
					} else {
						this.REPORT_ELEMENT_DATA = [];
						this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
						this.tableFlag = true;
					}
				});
			}
		} else if (Number(this.reportType) === 8 && this.reportFilterForm.value.report_type === 'concession') {
			const obj2: any = {};
			obj2['from_date'] = this.reportFilterForm.value.from_date;
			obj2['to_date'] = this.reportFilterForm.value.to_date;
			obj2['pageSize'] = this.reportFilterForm.value.pageSize;
			obj2['pageIndex'] = this.reportFilterForm.value.pageIndex;
			this.feeService.getFeeConcessionReport(obj2).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					repoArray = result.data.reportData;
					this.totalRecords = Number(result.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					let index = 0;
					for (const item of repoArray) {
						const obj: any = {};
						obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
							(index + 1);
						obj['fcc_name'] = repoArray[Number(index)]['fcc_name'];
						obj['fh_name'] = repoArray[Number(index)]['fh_name'];
						obj['fcc_class_id'] =
							this.getClassName(repoArray[Number(index)]['fcc_class_id']);
						obj['fcrt_name'] = repoArray[Number(index)]['fcrt_name'];
						obj['fcc_amount'] =
							new DecimalPipe('en-us').transform(repoArray[Number(index)]['fcc_amount']);
						this.REPORT_ELEMENT_DATA.push(obj);
						this.tableFlag = true;
						index++;
					}
					this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
					this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
					this.dataSource.paginator = this.paginator;
				} else {
					this.REPORT_ELEMENT_DATA = [];
					this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
					this.tableFlag = true;
				}
			});
		} else if (Number(this.reportType) === 8 && this.reportFilterForm.value.report_type === 'concessionAlloted') {
			let conAllotedJson = {};
			conAllotedJson = {
				'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': value.pageSize,
				'pageIndex': value.pageIndex,
				'classId': value.fee_value,
				'secId': value.hidden_value2,
				'admission_no': value.admission_no,
				'studentName': value.au_full_name,
			};
			this.feeService.getFeeConcessionAllotedReport(conAllotedJson).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					repoArray = result.data.reportData;
					this.totalRecords = Number(result.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					let index = 0;
					for (const item of repoArray) {
						for (const cons of item['stu_concession_arr']) {
							const obj: any = {};
							obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
								(++index);
							obj['stu_admission_no'] = item['stu_admission_no'];
							obj['stu_full_name'] = item['stu_full_name'];
							obj['stu_class_name'] = item['stu_class_name'] + '-' +
								item['stu_sec_name'];
							obj['fee_amount'] = cons['invg_fh_amount'] ?
								new DecimalPipe('en-us').transform(cons['invg_fh_amount']) : 0;
							obj['concession_cat'] = cons['invg_fcc_name'] ? cons['invg_fcc_name'] : '-';
							obj['con_amount'] = cons['invg_fcc_amount'] ?
								new DecimalPipe('en-us').transform(cons['invg_fcc_amount']) : 0;
							this.REPORT_ELEMENT_DATA.push(obj);
						}
						this.tableFlag = true;
					}
					this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
					this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
					this.dataSource.paginator = this.paginator;
				} else {
					this.REPORT_ELEMENT_DATA = [];
					this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
					this.tableFlag = true;
				}
			});
		} else if (Number(this.reportType) === 7) {
			let feeAdjustmentJson = {};
			feeAdjustmentJson = {
				'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': value.pageSize,
				'pageIndex': value.pageIndex,
				'classId': value.fee_value,
				'secId': value.hidden_value2,
				'admission_no': value.admission_no,
				'studentName': value.au_full_name,
			};
			this.feeService.getFeeAdjustmentReport(feeAdjustmentJson).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					repoArray = result.data.reportData;
					this.totalRecords = Number(result.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					let index = 0;
					for (const item of repoArray) {
						const obj: any = {};
						obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
							(index + 1);
						obj['au_admission_no'] = item['au_admission_no'] ? item['au_admission_no'] : '-';
						obj['au_full_name'] = item['au_full_name'];
						obj['class_name'] = item['class_name'] + '-' +
							item['sec_name'];
						obj['invoice_no'] = item['inv_invoice_no'];
						obj['invoice_id'] = item['inv_id'];
						obj['invoice_created_date'] = item['inv_created_date'];
						obj['cheque_date'] = item['inv_due_date'];
						obj['invg_fh_name'] = item['invg_fh_name'] ? item['invg_fh_name'] : 'NA';
						obj['invg_fh_amount'] = item['invg_fh_amount'] ?
							new DecimalPipe('en-us').transform(item['invg_fh_amount']) : 0;
						obj['invg_fcc_name'] = item['invg_fcc_name'] ? item['invg_fcc_name'] : 'NA';
						obj['invg_adj_amount'] = item['invg_adj_amount'] ?
							new DecimalPipe('en-us').transform(item['invg_adj_amount']) : 0;
						obj['receipt_no'] = item['rpt_receipt_no'] ? item['rpt_receipt_no'] : 'NA';
						obj['receipt_id'] = item['receipt_id'];
						obj['dishonor_date'] = item['rpt_receipt_date'];
						obj['inv_remark'] = item['inv_remark'] ? item['inv_remark'] : 'NA';
						index++;
						this.REPORT_ELEMENT_DATA.push(obj);
						this.tableFlag = true;
					}
					this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
					this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
					this.dataSource.paginator = this.paginator;
				} else {
					this.REPORT_ELEMENT_DATA = [];
					this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
					this.tableFlag = true;
				}
			});
		} else if (Number(this.reportType) === 12) {
			let secureJson = {};
			secureJson = {
				'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': value.pageSize,
				'pageIndex': value.pageIndex,
				'classId': value.fee_value,
				'secId': value.hidden_value2,
				'admission_no': value.admission_no,
				'studentName': value.au_full_name,
			};
			this.feeService.getAdvanceSecurityDepositReport(secureJson).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					repoArray = result.data.reportData;
					this.totalRecords = Number(result.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					let index = 0;
					for (const item of repoArray) {
						const obj: any = {};
						obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
							(index + 1);
						obj['invoice_created_date'] = repoArray[Number(index)]['invoice_created_date'];
						obj['au_admission_no'] = repoArray[Number(index)]['stu_admission_no'] ?
							repoArray[Number(index)]['stu_admission_no'] : '-';
						obj['au_full_name'] = repoArray[Number(index)]['stu_full_name'] ?
							repoArray[Number(index)]['stu_full_name'] : '-';
						obj['class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
							repoArray[Number(index)]['stu_sec_name'];
						obj['invoice_no'] = repoArray[Number(index)]['invoice_no'] ?
							repoArray[Number(index)]['invoice_no'] : '-';
						obj['invoice_id'] = repoArray[Number(index)]['invoice_id'] ?
							repoArray[Number(index)]['invoice_id'] : '0';
						obj['receipt_no'] = repoArray[Number(index)]['receipt_no'] ?
							repoArray[Number(index)]['receipt_no'] : 'NA';
						obj['receipt_id'] = repoArray[Number(index)]['receipt_id'] ?
							repoArray[Number(index)]['receipt_id'] : '0';
						obj['fh_amount'] = item['fh_amount'] ?
							new DecimalPipe('en-us').transform(item['fh_amount']) : 0;
						this.REPORT_ELEMENT_DATA.push(obj);
						this.tableFlag = true;
						index++;
					}
					this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
					this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
					this.dataSource.paginator = this.paginator;
				} else {
					this.REPORT_ELEMENT_DATA = [];
					this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
					this.tableFlag = true;
				}
			});
		} else if (Number(this.reportType) === 15) {
			let transportJSON = {};
			transportJSON = {
				'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': value.pageSize,
				'pageIndex': value.pageIndex,
				'classId': value.fee_value,
				'secId': value.hidden_value2,
				'routeId': value.hidden_value3,
				'slabId': value.hidden_value4,
				'stoppageId': value.hidden_value5,
				'admission_no': value.admission_no,
				'studentName': value.au_full_name,
			};
			this.feeService.getTransportReport(transportJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					repoArray = result.data.reportData;
					this.totalRecords = Number(result.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					let index = 0;
					for (const item of repoArray) {
						const obj: any = {};
						obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
							(index + 1);
						obj['invoice_created_date'] = repoArray[Number(index)]['applicable_from'];
						obj['cheque_date'] = repoArray[Number(index)]['applicable_to'];
						obj['au_admission_no'] = repoArray[Number(index)]['stu_admission_no'] ?
							repoArray[Number(index)]['stu_admission_no'] : '-';
						obj['au_full_name'] = repoArray[Number(index)]['stu_full_name'] ?
							repoArray[Number(index)]['stu_full_name'] : '-';
						obj['class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
							repoArray[Number(index)]['stu_sec_name'];
						obj['route_name'] = repoArray[Number(index)]['route_name'] ?
							repoArray[Number(index)]['route_name'] : 'NA';
						obj['slab_name'] = repoArray[Number(index)]['slab_name'] ?
							repoArray[Number(index)]['slab_name'] : 'NA';
						obj['stoppages_name'] = repoArray[Number(index)]['stoppages_name'] ?
							repoArray[Number(index)]['stoppages_name'] : 'NA';
						this.REPORT_ELEMENT_DATA.push(obj);
						this.tableFlag = true;
						index++;
					}
					this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
					this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
					this.dataSource.paginator = this.paginator;
				} else {
					this.REPORT_ELEMENT_DATA = [];
					this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
					this.tableFlag = true;
				}
			});
		}
	}
	fetchData(event?: PageEvent) {
		this.reportFilterForm.value.pageIndex = event.pageIndex;
		this.reportFilterForm.value.pageSize = event.pageSize;
		this.generateReport(this.reportFilterForm.value);
		return event;
	}
	openDialog(item: any, edit): void {
		let inv_id: any = '';
		if (Number(this.reportType) === 5) {
			if (item['flgr_invoice_type'] === 'R') {
				inv_id = item['receipt_id'];
				this.openDialogReceipt(inv_id, edit);
			}
			if (item['flgr_invoice_type'] === 'I') {
				inv_id = item['invoice_id'];
				const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
					width: '80%',
					height: '80vh',
					data: {
						invoiceNo: inv_id,
						edit: edit
					},
					hasBackdrop: false
				});
			}
		} else {
			inv_id = item['invoice_id'];
			const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
				width: '80%',
				height: '80vh',
				data: {
					invoiceNo: inv_id,
					edit: edit
				},
				hasBackdrop: false
			});
		}
	}
	openDialogReceipt(invoiceNo, edit): void {
		const dialogRef = this.dialog.open(ReceiptDetailsModalComponent, {
			width: '80%',
			height: '80vh',
			data: {
				invoiceNo: invoiceNo,
				edit: edit
			},
			hasBackdrop: false
		});
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
	getRoutes2() {
		this.hiddenValueArray3 = [];
		this.feeService.getRoutes({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				for (const item of result.data) {
					this.hiddenValueArray3.push({
						id: item.tr_id,
						name: item.tr_route_name
					});
				}
			}
		});
	}
	getSlabs() {
		this.hiddenValueArray4 = [];
		this.feeService.getSlabs({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				for (const item of result.data) {
					this.hiddenValueArray4.push({
						id: item.ts_id,
						name: item.ts_name
					});
				}
			}
		});
	}
	getStoppages() {
		this.hiddenValueArray5 = [];
		this.feeService.getStoppages({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				for (const item of result.data) {
					this.hiddenValueArray5.push({
						id: item.tsp_id,
						name: item.tsp_name
					});
				}
			}
		});
	}
	exportAsExcel() {
		// tslint:disable-next-line:max-line-length
		let id: any;
		if (this.reportFilterForm.value.report_type === 'mfr') {
			id = 'report_table2';
		} else {
			id = 'report_table';
		}
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById(id)); // converts a DOM TABLE element to a worksheet
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		XLSX.writeFile(wb, 'Report_' + (new Date).getTime() + '.xlsx');

	}
	getFeePeriodName(fp_id) {
		const findex = this.feePeriod.findIndex(f => Number(f.fp_id) === Number(fp_id));
		if (findex !== -1) {
			return this.feePeriod[findex].fp_name;
		}
	}
	getClassName(classArray) {
		let className = '';
		for (const item of classArray) {
			for (const titem of this.classDataArray) {
				if (item === titem.class_id) {
					className = className + titem.class_name + ',';
				}
			}
		}
		return className;
	}
	getClassData() {
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.classDataArray = result.data;
			}
		});
	}
	ngOnDestroy() {
		localStorage.removeItem('invoiceBulkRecords');
	}
	exportAsPDF() {
		let id: any;
		if (this.reportFilterForm.value.report_type === 'mfr') {
			id = 'report_table2';
		} else {
			id = 'report_table';
		}
		const doc = new jsPDF('landscape');
		doc.setFont('helvetica');
		doc.setFontSize(5);
		doc.autoTable({ html: '#' + id });
		doc.save('table.pdf');
	}
	enableSearch($event) {
		if ($event.checked) {
			this.toggleSearch = true;
		} else {
			this.toggleSearch = false;
		}
	}
	getColor(status) {
		if (status === 'unpaid') {
			return '#e2564b';
		} else if (status === 'paid') {
			return '#7bd451';
		} else if (status === 'Not Generated') {
			return '#a5cede';
		} else if (status === 'Unpaid with fine') {
			return '#598ac5';
		} else {
			return '';
		}
	}
	getColor2(status) {
		if (status === 'unpaid' || status === 'paid' ||
			status === 'Not Generated' || status === 'Unpaid with fine') {
			return '#fff';
		} else {
			return '';
		}
	}
	getBorder(status) {
		if (status === 'unpaid' || status === 'paid' || status === 'Not Generated' ||
			status === 'Unpaid with fine') {
			return '1px solid #fff';
		} else {
			return '';
		}
	}
	getColumn(item, column) {
		if (Number(item['fp_id']) === 2) {
			if (column === 'Q1') {
				return item['inv_id1'];
			}
			if (column === 'Q2') {
				return item['inv_id2'];
			}
			if (column === 'Q3') {
				return item['inv_id3'];
			}
			if (column === 'Q4') {
				return item['inv_id4'];
			}
			return item[column];
		} else if (Number(item['fp_id']) === 1) {
			if (column === 'Q1') {
				return item['inv_id1'];
			}
			if (column === 'Q2') {
				return item['inv_id2'];
			}
			if (column === 'Q3') {
				return item['inv_id3'];
			}
			if (column === 'Q4') {
				return item['inv_id4'];
			}
			if (column === 'Q5') {
				return item['inv_id5'];
			}
			if (column === 'Q6') {
				return item['inv_id6'];
			}
			if (column === 'Q7') {
				return item['inv_id7'];
			}
			if (column === 'Q8') {
				return item['inv_id8'];
			}
			if (column === 'Q9') {
				return item['inv_id9'];
			}
			if (column === 'Q10') {
				return item['inv_id10'];
			}
			if (column === 'Q11') {
				return item['inv_id11'];
			}
			if (column === 'Q12') {
				return item['inv_id12'];
			}
			return item[column];
		} else if (Number(item['fp_id']) === 3) {
			if (column === 'Q1') {
				return item['inv_id1'];
			}
			if (column === 'Q2') {
				return item['inv_id2'];
			}
			return item[column];
		} else if (Number(item['fp_id']) === 4) {
			if (column === 'Q1') {
				return item['inv_id1'];
			}
			return item[column];
		}
	}
	checkColumnStatus(item, column) {
		if (Number(item['fp_id']) === 2) {
			if (column === 'Q1') {
				return true;
			}
			if (column === 'Q2') {
				return true;
			}
			if (column === 'Q3') {
				return true;
			}
			if (column === 'Q4') {
				return true;
			}
			return false;
		} else if (Number(item['fp_id']) === 1) {
			if (column === 'Q1') {
				return true;
			}
			if (column === 'Q2') {
				return true;
			}
			if (column === 'Q3') {
				return true;
			}
			if (column === 'Q4') {
				return true;
			}
			if (column === 'Q5') {
				return true;
			}
			if (column === 'Q6') {
				return true;
			}
			if (column === 'Q7') {
				return true;
			}
			if (column === 'Q8') {
				return true;
			}
			if (column === 'Q9') {
				return true;
			}
			if (column === 'Q10') {
				return true;
			}
			if (column === 'Q11') {
				return true;
			}
			if (column === 'Q12') {
				return true;
			}
			return false;
		} else if (Number(item['fp_id']) === 3) {
			if (column === 'Q1') {
				return true;
			}
			if (column === 'Q2') {
				return true;
			}
			return false;
		} else if (Number(item['fp_id']) === 4) {
			if (column === 'Q1') {
				return true;
			}
			return false;
		}
	}
	openDialogNew(item, column) {
		if (Number(item['fp_id']) === 2) {
			if (column === 'Q1') {
				this.renderDialog(item['inv_id1'], false);
			}
			if (column === 'Q2') {
				this.renderDialog(item['inv_id2'], false);
			}
			if (column === 'Q3') {
				this.renderDialog(item['inv_id3'], false);
			}
			if (column === 'Q4') {
				this.renderDialog(item['inv_id4'], false);
			}
		}
		if (Number(item['fp_id']) === 3) {
			if (column === 'Q1') {
				this.renderDialog(item['inv_id1'], false);
			}
			if (column === 'Q2') {
				this.renderDialog(item['inv_id2'], false);
			}
		}
		if (Number(item['fp_id']) === 4) {
			if (column === 'Q1') {
				this.renderDialog(item['inv_id1'], false);
			}
		}
		if (Number(item['fp_id']) === 1) {
			if (column === 'Q1') {
				this.renderDialog(item['inv_id1'], false);
			}
			if (column === 'Q2') {
				this.renderDialog(item['inv_id2'], false);
			}
			if (column === 'Q3') {
				this.renderDialog(item['inv_id3'], false);
			}
			if (column === 'Q4') {
				this.renderDialog(item['inv_id4'], false);
			}
			if (column === 'Q5') {
				this.renderDialog(item['inv_id5'], false);
			}
			if (column === 'Q6') {
				this.renderDialog(item['inv_id6'], false);
			}
			if (column === 'Q7') {
				this.renderDialog(item['inv_id7'], false);
			}
			if (column === 'Q8') {
				this.renderDialog(item['inv_id8'], false);
			}
			if (column === 'Q9') {
				this.renderDialog(item['inv_id9'], false);
			}
			if (column === 'Q10') {
				this.renderDialog(item['inv_id10'], false);
			}
			if (column === 'Q11') {
				this.renderDialog(item['inv_id11'], false);
			}
			if (column === 'Q12') {
				this.renderDialog(item['inv_id12'], false);
			}
		}

	}
	renderDialog(inv_id, edit) {
		const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
			width: '80%',
			height: '80vh',
			data: {
				invoiceNo: inv_id,
				edit: edit
			},
			hasBackdrop: false
		});
	}
}
