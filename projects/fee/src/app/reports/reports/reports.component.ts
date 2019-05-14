import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { reportTable } from './reports.table';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FeeService, CommonAPIService, SisService } from '../../_services';
import { MatTableDataSource, MatPaginator, PageEvent, MatDialog, MatPaginatorIntl } from '@angular/material';
import { DatePipe, DecimalPipe } from '@angular/common';
import { InvoiceDetailsModalComponent } from '../../feemaster/invoice-details-modal/invoice-details-modal.component';
import * as XLSX from 'xlsx';
import { MatPaginatorI18n } from '../../sharedmodule/customPaginatorClass';
import { ReceiptDetailsModalComponent } from '../../sharedmodule/receipt-details-modal/receipt-details-modal.component';
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
	totalRecords: any;
	currentDate = new Date();
	minDate: any;
	schoolInfo: any;
	startMonth: any;
	@ViewChild('paginator') paginator: MatPaginator;
	dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
	feePeriod: any[] = [];
	classDataArray: any[] = [];
	pageEvent: PageEvent;
	feeReportArray: any[] = [
		{
			report_id: '1',
			report_name: 'Collection Report',
			report_image: '../../../assets/images/Fee Reports/collection_report.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '2',
			report_name: 'Fee Outstanding Report',
			report_image: '../../../assets/images/Fee Reports/fee_defaulter_list.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '3',
			report_name: 'Fee Projection Report',
			report_image: '../../../assets/images/Fee Reports/fee_projection.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '4',
			report_name: 'Fee Transaction Report',
			report_image: '../../../assets/images/Fee Reports/fee_transaction.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '5',
			report_name: 'Fee Ledger Report',
			report_image: '../../../assets/images/Fee Reports/fee_ledger.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '6',
			report_name: 'Deleted Fee Transactions',
			report_image:
				'../../../assets/images/Fee Reports/deleted_fee_transaction.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '7',
			report_name: 'Fee Adjustment Report',
			report_image: '../../../assets/images/Fee Reports/fee_adjustment.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '8',
			report_name: 'Fee Concession Report',
			report_image: '../../../assets/images/Fee Reports/fee_concession.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '9',
			report_name: 'Missing Fee Invoice',
			report_image:
				'../../../assets/images/Fee Reports/missing_fee_invoice.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '10',
			report_name: 'Fee Structure Report',
			report_image: '../../../assets/images/Fee Reports/fee_structure.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '11',
			report_name: 'Cheque Clearance Report',
			report_image: '../../../assets/images/Fee Reports/cheque_clearance.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '12',
			report_name: 'Advanced Security Deposit',
			report_image: '../../../assets/images/Fee Reports/advanced_security.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '13',
			report_name: 'Online Transaction Details',
			report_image: '../../../assets/images/Fee Reports/online_transaction.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '14',
			report_name: 'Dynamic Report',
			report_image: '../../../assets/images/Fee Reports/dynamics.svg',
			main_text_class: 'text-center',
			report_main_image_class: '',
			report_middle_class: '',
			report_check_icon_class: ''
		},
		{
			report_id: '15',
			report_name: 'Transport Report',
			report_image: '../../../assets/images/Fee Reports/transport_report.svg',
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
		this.reportsTable = reportTable;
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}
	buildForm() {
		this.reportFilterForm = this.fbuild.group({
			'report_type': '',
			'fee_value': '',
			'from_date': '',
			'to_date': '',
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
		this.accountFlag = false;
		this.tableFlag = false;
		this.reportFilterForm.patchValue({
			'report_type': '',
			'fee_value': '',
			'from_date': '',
			'to_date': '',
			'pageSize': '10',
			'pageIndex': '0'
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
				this.finalTable = this.renderTable['missingFeeInvoice'];
			}
			if (Number(report_id) === 11) {
				this.finalTable = this.renderTable['chequeControlList'];
			}
			if (Number(report_id) === 5) {
				this.finalTable = this.renderTable['feeLedger'];
			}
			if (Number(report_id) === 6) {
				this.finalTable = this.renderTable['deletedFeeTransaction'];
			}
			if (Number(report_id) === 10) {
				this.finalTable = this.renderTable['feeStructure'];
			}
			if (Number(report_id) === 7) {
				this.finalTable = this.renderTable['feeAdjustment'];
			}
			this.previousIndex = findex;
			this.reportFlag = false;
			this.accountFlag = true;
		}
	}
	switchReport() {
		this.accountFlag = false;
		this.reportFlag = true;
	}
	changeReportType($event, type) {
		this.tableFlag = false;
		this.REPORT_ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
		this.reportFilterForm.value.report_type = $event.value;
		this.finalTable = this.renderTable[$event.value];
	}
	generateReport(value: any) {
		this.tableFlag = false;
		value.from_date = new DatePipe('en-in').transform(value.from_date, 'yyyy-MM-dd');
		value.to_date = new DatePipe('en-in').transform(value.to_date, 'yyyy-MM-dd');
		let repoArray: any[] = [];
		this.REPORT_ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<any>(this.REPORT_ELEMENT_DATA);
		if (Number(this.reportType) === 1 && this.reportFilterForm.value.report_type) {
			this.feeService.getHeadWiseCollection(value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
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
											obj['receipt_no'] = repoArray[Number(keys)]['receipt_no'] ?
												repoArray[Number(keys)]['receipt_no'] : '-';
											obj['stu_admission_no'] = repoArray[Number(keys)]['stu_admission_no'] ?
												repoArray[Number(keys)]['stu_admission_no'] : '-';
											obj['stu_full_name'] = repoArray[Number(keys)]['stu_full_name'];
											obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'] + '-' +
												repoArray[Number(keys)]['stu_sec_name'];
											obj['total'] = repoArray[Number(keys)][''];
											obj['receipt_mode_name'] = repoArray[Number(keys)]['receipt_mode_name'] ?
												repoArray[Number(keys)]['receipt_mode_name'] : '-';
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
					}
					if (this.reportFilterForm.value.report_type === 'classwise') {
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
								repoArray[Number(index)]['receipt_no'] : '-';
							obj['stu_admission_no'] = repoArray[Number(index)]['stu_admission_no'] ?
								repoArray[Number(index)]['stu_admission_no'] : '-';
							obj['stu_full_name'] = repoArray[Number(index)]['stu_full_name'];
							obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
								repoArray[Number(index)]['stu_sec_name'];
							obj['rpt_amount'] = repoArray[Number(index)]['rpt_amount'] ?
								repoArray[Number(index)]['rpt_amount'] : '-';
							obj['fp_name'] = repoArray[Number(index)]['fp_name'] ?
								repoArray[Number(index)]['fp_name'] : '-';
							this.REPORT_ELEMENT_DATA.push(obj);
							this.tableFlag = true;
							index++;
						}
					}
					if (this.reportFilterForm.value.report_type === 'modewise') {
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
								repoArray[Number(index)]['receipt_no'] : '-';
							obj['stu_admission_no'] = repoArray[Number(index)]['stu_admission_no'] ?
								repoArray[Number(index)]['stu_admission_no'] : '-';
							obj['stu_full_name'] = repoArray[Number(index)]['stu_full_name'];
							obj['stu_class_name'] = repoArray[Number(index)]['stu_class_name'] + '-' +
								repoArray[Number(index)]['stu_sec_name'];
							obj['rpt_amount'] = repoArray[Number(index)]['rpt_amount'] ?
								repoArray[Number(index)]['rpt_amount'] : '-';
							obj['fp_name'] = repoArray[Number(index)]['fp_name'] ?
								repoArray[Number(index)]['fp_name'] : '-';
							obj['pay_name'] = repoArray[Number(index)]['pay_name'] ?
								repoArray[Number(index)]['pay_name'] : '-';
							this.REPORT_ELEMENT_DATA.push(obj);
							this.tableFlag = true;
							index++;
						}
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
		if (Number(this.reportType) === 9) {
			this.feeService.getMissingFeeInvoiceReport(value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					repoArray = result.data.reportData;
					this.totalRecords = Number(result.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					let index = 0;
					for (const item of repoArray) {
						const obj: any = {};
						obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
							(index + 1);
						obj['invoice_created_date'] = repoArray[Number(index)]['invoice_created_date'];
						obj['au_login_id'] = repoArray[Number(index)]['au_login_id'] ?
							repoArray[Number(index)]['au_login_id'] : '-';
						obj['au_full_name'] = repoArray[Number(index)]['au_full_name'] ?
							repoArray[Number(index)]['au_full_name'] : '-';
						let feePeriod: any = '';
						for (const period of repoArray[Number(index)]['inv_invoice_generated_status']) {
							feePeriod = feePeriod + period.fm_name + '<br>';
						}
						obj['fp_name'] = feePeriod ? feePeriod : '-';
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
		if (Number(this.reportType) === 11) {
			this.feeService.getCheckControlReport(value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
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
						obj['receipt_id'] = repoArray[Number(index)]['receipt_id'] ?
							repoArray[Number(index)]['receipt_id'] : '-';
						obj['receipt_amount'] = repoArray[Number(index)]['receipt_amount'] ?
							repoArray[Number(index)]['receipt_amount'] : '-';
						obj['bank_name'] = repoArray[Number(index)]['bank_name'] ?
							repoArray[Number(index)]['bank_name'] : '-';
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
							repoArray[Number(index)]['fcc_remarks'] : '-';
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
		if (Number(this.reportType) === 5) {
			this.feeService.getFeeLedgerReport(value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					repoArray = result.data.reportData;
					this.totalRecords = Number(result.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					let index = 0;
					for (const item of repoArray) {
						for (const stu_arr of item.stu_ledger_arr) {
							const obj: any = {};
						obj['srno'] = (this.reportFilterForm.value.pageSize * this.reportFilterForm.value.pageIndex) +
							(++index);
						obj['class_name'] = item['flgr_au_class_name'] + '-' +
							item['flgr_au_sec_name'];
						obj['au_full_name'] = item['flgr_au_full_name'] ? item.flgr_au_full_name : '-';
							obj['au_admission_no'] = stu_arr['flgr_login_id'] ?
								stu_arr['flgr_login_id'] : '-';
							obj['au_admission_no'] = stu_arr['flgr_login_id'] ?
								stu_arr['flgr_login_id'] : '-';
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
		}

		if (Number(this.reportType) === 6) {
			this.feeService.getDeletedFeeTransactionReport(value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
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
		}
		if (Number(this.reportType) === 10) {
			this.feeService.getFeeStructureReport(this.reportFilterForm.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
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
									fee['ft_name'] + ')</b>: ' + fee['fh_amount'] + ' (' +
									(Number(fee['fh_amount']) * fee['fh_fm_id'].length) + ')' +
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
						feeStructure = feeStructure + '<b>Total :</b>'
							+ grandTotal;
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
		if (Number(this.reportType) === 8 && this.reportFilterForm.value.report_type === 'concession') {
			const obj2: any = {};
			obj2['from_date'] = this.reportFilterForm.value.from_date;
			obj2['to_date'] = this.reportFilterForm.value.to_date;
			obj2['pageSize'] = this.reportFilterForm.value.pageSize;
			obj2['pageIndex'] = this.reportFilterForm.value.pageIndex;
			this.feeService.getFeeConcessionReport(obj2).subscribe((result: any) => {
				if (result && result.status === 'ok') {
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
						obj['fcc_amount'] = repoArray[Number(index)]['fcc_amount'];
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
		if (Number(this.reportType) === 8 && this.reportFilterForm.value.report_type === 'concessionAlloted') {
			const obj2: any = {};
			obj2['from_date'] = this.reportFilterForm.value.from_date;
			obj2['to_date'] = this.reportFilterForm.value.to_date;
			obj2['pageSize'] = this.reportFilterForm.value.pageSize;
			obj2['pageIndex'] = this.reportFilterForm.value.pageIndex;
			this.feeService.getFeeConcessionAllotedReport(obj2).subscribe((result: any) => {
				if (result && result.status === 'ok') {
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
							obj['fee_amount'] = cons['invg_fh_amount'] ? cons['invg_fh_amount'] : '-';
							obj['concession_cat'] = cons['invg_fcc_name'] ? cons['invg_fcc_name'] : '-';
							obj['con_amount'] = cons['invg_fcc_amount'] ? cons['invg_fcc_amount'] : '-';
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
		}
		if (Number(this.reportType) === 7) {
			this.feeService.getFeeAdjustmentReport(value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
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
						obj['invg_fh_name'] = item['invg_fh_name'] ? item['invg_fh_name'] : '-';
						obj['invg_fh_amount'] = item['invg_fh_amount'] ? item['invg_fh_amount'] : '-';
						obj['invg_fcc_name'] = item['invg_fcc_name'] ? item['invg_fcc_name'] : '-';
						obj['invg_adj_amount'] = item['invg_adj_amount'] ? item['invg_adj_amount'] : '-' ;
						obj['receipt_no'] = item['rpt_receipt_no'];
						obj['receipt_id'] = item['receipt_id'];
						obj['dishonor_date'] = item['rpt_receipt_date'];
						obj['inv_remark'] = item['inv_remark'] ? item['inv_remark'] : '-';
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
		}
	}
	fetchData(event?: PageEvent) {
		this.reportFilterForm.value.pageIndex = event.pageIndex;
		this.reportFilterForm.value.pageSize = event.pageSize;
		this.generateReport(this.reportFilterForm.value);
		return event;
	}
	openDialog(invoiceNo, edit): void {
		const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
			width: '100%',
			data: {
				invoiceNo: invoiceNo,
				edit: edit
			},
			hasBackdrop: false
		});
	}
	openDialogReceipt(invoiceNo, edit): void {
		const dialogRef = this.dialog.open(ReceiptDetailsModalComponent, {
			width: '100%',
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
	exportAsExcel() {
		// tslint:disable-next-line:max-line-length
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('report_table')); // converts a DOM TABLE element to a worksheet
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
}
