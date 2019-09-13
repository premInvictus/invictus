import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	Formatters
} from 'angular-slickgrid';
import { TranslateService } from '@ngx-translate/core';
import { FeeService, CommonAPIService, SisService } from '../../../_services';
import { DecimalPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { CapitalizePipe } from '../../../_pipes';
import { ReceiptDetailsModalComponent } from '../../../sharedmodule/receipt-details-modal/receipt-details-modal.component';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportFilterComponent } from '../../reports-filter-sort/report-filter/report-filter.component';
import { ReportSortComponent } from '../../reports-filter-sort/report-sort/report-sort.component';
import { InvoiceDetailsModalComponent } from '../../../feemaster/invoice-details-modal/invoice-details-modal.component';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import * as Excel from 'exceljs/dist/exceljs';
import * as ExcelProper from 'exceljs';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
@Component({
	selector: 'app-feecon-report',
	templateUrl: './feecon-report.component.html',
	styleUrls: ['./feecon-report.component.css']
})
export class FeeconReportComponent implements OnInit {
	@Input() userName: any = '';
	totalRow: any;
	feeHeadJson: any[] = [];
	groupColumns: any[] = [];
	groupLength: any;
	exportColumnDefinitions: any[] = [];
	@Output() displyRep = new EventEmitter();
	columnDefinitions1: Column[] = [];
	columnDefinitions2: Column[] = [];
	gridOptions1: GridOption;
	gridOptions2: GridOption;
	tableFlag = false;
	dataset1: any[];
	dataset2: any[];
	initgrid = false;
	columnDefinitions: Column[] = [];
	gridOptions: GridOption = {};
	dataset: any[] = [];
	angularGrid: AngularGridInstance;
	dataviewObj: any;
	draggableGroupingPlugin: any;
	durationOrderByCount = false;
	gridObj: any;
	processing = false;
	selectedGroupingFields: string[] = ['', '', ''];
	totalRecords: number;
	aggregatearray: any[] = [];
	reportFilterForm: FormGroup;
	valueArray: any[] = [];
	classDataArray: any[] = [];
	reportTypeArray: any[] = [];
	valueLabel: any = '';
	reportType = '1';
	filterFlag = false;
	filterResult: any[] = [];
	sortResult: any[] = [];
	dataArr: any[] = [];
	hiddenValueArray5: any[] = [];
	hiddenValueArray4: any[] = [];
	sessionArray: any[] = [];
	schoolInfo: any = {};
	session: any = {};
	sessionName: any;
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
	filteredAs: any = {};
	currentUser: any;
	pdfrowdata: any[] = [];
	levelHeading: any[] = [];
	levelTotalFooter: any[] = [];
	levelSubtotalFooter: any[] = [];
	notFormatedCellArray: any[] = [];
	gridHeight: number;
	constructor(translate: TranslateService,
		private feeService: FeeService,
		private common: CommonAPIService,
		private sisService: SisService,
		public dialog: MatDialog,
		private fbuild: FormBuilder) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.getSchool();
		this.session = JSON.parse(localStorage.getItem('session'));
		this.getSession();
		this.buildForm();
		this.getClassData();
		this.reportTypeArray.push({
			report_type: 'concession', report_name: 'Concession Report'
		},
		{
			report_type: 'concessionAlloted', report_name: 'Concession Allotee Report'
		},
		{
			report_type: 'concessionAllotedSummary', report_name: 'Concession Allotee Summary Report'
		});
	}
	getSchool() {
		this.sisService.getSchool().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.schoolInfo = res.data[0];
				console.log(this.schoolInfo);
			}
		});
	}
	getSessionName(id) {
		const findex = this.sessionArray.findIndex(f => f.ses_id === id);
		if (findex !== -1) {
			return this.sessionArray[findex].ses_name;
		}
	}
	getSession() {
		this.sisService.getSession().subscribe((result2: any) => {
			if (result2.status === 'ok') {
				this.sessionArray = result2.data;
			}
		});
	}
	angularGridReady(angularGrid: AngularGridInstance) {
		this.angularGrid = angularGrid;
		this.gridObj = angularGrid.slickGrid; // grid object
		this.dataviewObj = angularGrid.dataView;
		this.updateTotalRow(angularGrid.slickGrid);
	}
	updateTotalRow(grid: any) {
		let columnIdx = grid.getColumns().length;
		while (columnIdx--) {
			const columnId = grid.getColumns()[columnIdx].id;
			const columnElement: HTMLElement = grid.getFooterRowColumn(columnId);
			columnElement.innerHTML = '<b>' + this.totalRow[columnId] + '<b>';
		}
	}
	buildForm() {
		this.reportFilterForm = this.fbuild.group({
			'report_type': '',
			'fee_value': '',
			'from_date': '',
			'to_date': '',
			'downloadAll': '',
			'hidden_value': '',
			'hidden_value2': '',
			'hidden_value3': '',
			'hidden_value4': '',
			'hidden_value5': '',
			'filterReportBy': '',
			'admission_no': '',
			'au_full_name': '',
			'pageSize': '10',
			'pageIndex': '0',
			'login_id': '',
			'orderBy': ''
		});
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
	getConReport(value: any) {
		value.from_date = new DatePipe('en-in').transform(value.from_date, 'yyyy-MM-dd');
		value.to_date = new DatePipe('en-in').transform(value.to_date, 'yyyy-MM-dd');
		this.dataArr = [];
		this.aggregatearray = [];
		this.columnDefinitions = [];
		this.dataset = [];
		this.tableFlag = false;
		let repoArray = [];
		this.columnDefinitions = [];
		this.dataset = [];
		if (this.reportType === 'concession') {
			const collectionJSON: any = {
				'admission_no': '',
				'studentName': '',
				'report_type': value.report_type,
				'routeId': value.fee_value,
				'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': '10',
				'pageIndex': '0',
				'filterReportBy': 'collection',
				'login_id': value.login_id,
				'orderBy': value.orderBy,
				'downloadAll': true
			};
			this.feeService.getFeeConcessionReport(collectionJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage('Report Data Fetched Successfully', 'success');
					console.log('result', result);
					repoArray = result.data.reportData;
					let i = 0;
					const j = 0;
					Object.keys(repoArray).forEach((keys: any) => {
						const obj: any = {};
						if (Number(keys) === 0) {
							this.columnDefinitions = [
								{
									id: 'srno',
									name: 'SNo.',
									field: 'srno',
									sortable: true,
									maxWidth: 80
								},
								{
									id: 'fcg_name',
									name: 'Concession Group.',
									field: 'fcg_name',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									width: 180,
									grouping: {
										getter: 'fcg_name',
										formatter: (g) => {
											return `${g.value}  <span style="color:green">(${g.count})</span>`;
										},
										aggregators: this.aggregatearray,
										aggregateCollapsed: true,
										collapsed: false,
									},
									groupTotalsFormatter: this.srnTotalsFormatter
								},
								{
									id: 'fcg_concession_category',
									name: 'Concession Category',
									field: 'fcg_concession_category',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									width: 360,
									formatter: this.checkFeeHeadFormatter
								},
								{
									id: 'fcg_description',
									name: 'Description',
									field: 'fcg_description',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									width: 700,
								}];
						}

						if (repoArray[Number(keys)]['fcgr_fcc_id']) {
							let k = 0;
							const tot = 0;

							obj['id'] = repoArray[Number(keys)]['fcg_id'] + keys;
							obj['srno'] = (collectionJSON.pageSize * collectionJSON.pageIndex) +
								(Number(keys) + 1);
							obj['fcg_name'] = repoArray[Number(keys)]['fcg_name'];
							obj['fcg_description'] = repoArray[Number(keys)]['fcg_description'];
							let feeHead = '';
							for (const titem of repoArray[Number(keys)]['fcgr_fcc_id']) {
								Object.keys(titem).forEach((key2: any) => {
									if (key2 === 'fcc_name') {
										feeHead = feeHead + '<b>' + new CapitalizePipe().transform(titem.fcc_name) + '(' + titem.fcrt_alias + ') :'
											+ titem.fcc_amount + '</b><br>';
										let classAmt = '';
										if (titem.fh_class_amount_detail &&
											JSON.parse(titem.fh_class_amount_detail).length > 0) {
											for (const titem1 of JSON.parse(titem.fh_class_amount_detail)) {
												classAmt = classAmt + 'Class ' +
													titem1.class_name + ' :' + new DecimalPipe('en-us').transform(Number(titem1.head_amt)) + ', ';
											}
											classAmt = classAmt.substring(0, classAmt.length - 2);
										}
										feeHead = feeHead + classAmt + '<br>';
										obj['fcg_concession_category'] = feeHead;
										k++;
									}
								});
							}
						}
						i++;

						if (Object.keys(obj).length > 0) {
							this.dataset.push(obj);
						}
					});
					this.tableFlag = true;
				} else {
					this.tableFlag = true;
				}
			});
		} else if (this.reportType === 'concessionAlloted') {
			const collectionJSON: any = {
				'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': value.pageSize,
				'pageIndex': value.pageIndex,
				'classId': value.fee_value,
				'secId': value.hidden_value4,
				'stoppageId': value.hidden_value5,
				'admission_no': value.admission_no,
				'studentName': value.au_full_name,
				'login_id': value.login_id,
				'orderBy': value.orderBy,
				'downloadAll': true
			};
			this.feeService.getFeeConcessionAllotedReport(collectionJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage('Report Data Fetched Successfully', 'success');
					this.totalRecords = Number(result.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					repoArray = result.data.reportData;
					let i = 0;
					let j = 0;
					const feeHead: any[] = [];
					Object.keys(repoArray).forEach((keys: any) => {
						const obj: any = {};
						if (Number(keys) === 0) {
							this.columnDefinitions = [
								{
									id: 'srno',
									name: 'SNo.',
									field: 'srno',
									sortable: true,
									width: 80
								},
								{
									id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									grouping: {
										getter: 'stu_admission_no',
										formatter: (g) => {
											return `${g.value}  <span style="color:green">(${g.count})</span>`;
										},
										aggregators: this.aggregatearray,
										aggregateCollapsed: true,
										collapsed: false,
									},
									width: 140,
								},
								{
									id: 'stu_full_name', name: 'Student Name', field: 'stu_full_name',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									grouping: {
										getter: 'stu_full_name',
										formatter: (g) => {
											return `${g.value}  <span style="color:green">(${g.count})</span>`;
										},
										aggregators: this.aggregatearray,
										aggregateCollapsed: true,
										collapsed: false,
									},
									width: 140,
								},
								{
									id: 'stu_class_name', name: 'Class-Section', field: 'stu_class_name',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									grouping: {
										getter: 'stu_class_name',
										formatter: (g) => {
											return `${g.value}  <span style="color:green">(${g.count})</span>`;
										},
										aggregators: this.aggregatearray,
										aggregateCollapsed: true,
										collapsed: false,
									},
									width: 140,
								},
								{
									id: 'fcg_name',
									name: 'Concession Group.',
									field: 'fcg_name',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									width: 350,
									grouping: {
										getter: 'fcg_name',
										formatter: (g) => {
											return `${g.value}  <span style="color:green">(${g.count})</span>`;
										},
										aggregators: this.aggregatearray,
										aggregateCollapsed: true,
										collapsed: false,
									},
									groupTotalsFormatter: this.srnTotalsFormatter
								},
								{
									id: 'fcg_description',
									name: 'Description',
									field: 'fcg_description',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									width: 180,
								}];
						}
						if (repoArray[Number(keys)]['stu_concession_arr']) {
							let k = 0;
							let tot = 0;
							for (const titem of repoArray[Number(keys)]['stu_concession_arr']) {
								Object.keys(titem).forEach((key2: any) => {
									if (key2 === 'fh_name' && Number(keys) === 0) {
										const feeObj: any = {};
										this.columnDefinitions.push({
											id: 'fh_name' + j,
											name: new CapitalizePipe().transform(titem[key2]),
											field: 'fh_name' + j,
											cssClass: 'amount-report-fee',
											sortable: true,
											filterable: true,
											filterSearchType: FieldType.number,
											filter: { model: Filters.compoundInput },
											formatter: this.checkFeeFormatter,
											groupTotalsFormatter: this.sumTotalsFormatter
										});
										feeObj['fh_name' + j] = '';
										feeHead.push(feeObj);
										this.feeHeadJson.push(feeObj);
										this.aggregatearray.push(new Aggregators.Sum('fh_name' + j));
										j++;
									}
									if (key2 === 'fh_name') {
										obj['id'] = repoArray[Number(keys)]['stu_admission_no'] + keys +
											repoArray[Number(keys)]['inv_id'];
										obj['srno'] = (collectionJSON.pageSize * collectionJSON.pageIndex) +
											(Number(keys) + 1);
										obj['stu_admission_no'] = repoArray[Number(keys)]['stu_admission_no'];
										obj['stu_admission_no'] = repoArray[Number(keys)]['stu_admission_no'];
										obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(keys)]['stu_full_name']);
										if (repoArray[Number(keys)]['stu_sec_id'] !== '0') {
											obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'] + '-' +
												repoArray[Number(keys)]['stu_sec_name'];
										} else {
											obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'];
										}
										obj['fh_name'] = repoArray[Number(keys)]['stu_concession_arr']['fh_name'];
										obj['fcg_name'] = repoArray[Number(keys)]['fcg_name'];
										obj['fcg_description'] = repoArray[Number(keys)]['fcg_description'];
										obj[key2 + k] = titem['invg_fcc_amount'] ? Number(titem['invg_fcc_amount']) : 0;
										tot = tot + (titem['invg_fcc_amount'] ? Number(titem['invg_fcc_amount']) : 0);
										obj['total'] = tot;
										// obj['approved_by'] = repoArray[Number(keys)]['approved_by'] ? repoArray[Number(keys)]['approved_by'] : '-';
										// obj['mod_review_date'] = repoArray[Number(keys)]['mod_review_date'] ? repoArray[Number(keys)]['mod_review_date'] : '-';
										// obj['mod_review_remark'] = repoArray[Number(keys)]['mod_review_remark'] ? repoArray[Number(keys)]['mod_review_remark'] : '-';
										// obj['reason_title'] = repoArray[Number(keys)]['reason_title'] ? repoArray[Number(keys)]['reason_title'] : '-';
										k++;
									}
								});
							}
						}
						i++;
						this.dataset.push(obj);
					});
					this.columnDefinitions.push(
						{
							id: 'total', name: 'Total', field: 'total',
							filterable: true,
							filterSearchType: FieldType.number,
							filter: { model: Filters.compoundInputNumber },
							sortable: true,
							formatter: this.checkTotalFormatter,
							cssClass: 'amount-report-fee',
							groupTotalsFormatter: this.sumTotalsFormatter
						},
					);
					// this.columnDefinitions.push({
					// 	id: 'approved_by', name: 'Approved By', field: 'approved_by',
					// 	sortable: true,
					// 	filterable: true,
					// 	filterSearchType: FieldType.string,
					// 	filter: { model: Filters.compoundInput },
					// 	width: 140,
					// });
					// this.columnDefinitions.push({
					// 	id: 'mod_review_date', name: 'Approved Date', field: 'mod_review_date',
					// 	sortable: true,
					// 	formatter: this.checkDateFormatter,
					// 	filterable: true,
					// 	filterSearchType: FieldType.string,
					// 	filter: { model: Filters.compoundInput },
					// 	width: 140,
					// });
					// this.columnDefinitions.push({
					// 	id: 'mod_review_remark', name: 'Remarks', field: 'mod_review_remark',
					// 	sortable: true,
					// 	filterable: true,
					// 	filterSearchType: FieldType.string,
					// 	filter: { model: Filters.compoundInput },
					// 	width: 140,
					// });
					// this.columnDefinitions.push({
					// 	id: 'reason_title', name: 'Reasons', field: 'reason_title',
					// 	sortable: true,
					// 	filterable: true,
					// 	filterSearchType: FieldType.string,
					// 	filter: { model: Filters.compoundInput },
					// 	width: 140,
					// });
					this.totalRow = {};
					const obj3: any = {};
					obj3['id'] = 'footer';
					obj3['srno'] = this.common.htmlToText('<b>Grand Total</b>');
					obj3['stu_admission_no'] = '';
					obj3['stu_full_name'] = '';
					obj3['stu_class_name'] = '';
					obj3['fh_name'] = '';
					Object.keys(feeHead).forEach((key: any) => {
						Object.keys(feeHead[key]).forEach(key2 => {
							Object.keys(this.dataset).forEach(key3 => {
								Object.keys(this.dataset[key3]).forEach(key4 => {
									if (key4 === key2) {
										obj3[key2] = new DecimalPipe('en-in').transform(this.dataset.map(t => t[key2]).reduce((acc, val) => acc + val, 0));
									}
								});
							});
						});
					});
					obj3['fcg_name'] = '';
					obj3['fcg_description'] = '';
					obj3['total'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t.total).reduce((acc, val) => acc + val, 0));
					// obj3['approved_by'] = '';
					// obj3['mod_review_date'] = '';
					// obj3['mod_review_remark'] = '';
					// obj3['reason_title'] = '';
					this.totalRow = obj3;
					if (this.dataset.length <= 5) {
						this.gridHeight = 300;
					} else if (this.dataset.length <= 10 && this.dataset.length > 5) {
						this.gridHeight = 400;
					} else if (this.dataset.length > 10 && this.dataset.length <= 20) {
						this.gridHeight = 550;
					} else if (this.dataset.length > 20) {
						this.gridHeight = 750;
					}
					this.tableFlag = true;
				} else {
					this.tableFlag = true;
				}
			});
		} else if (this.reportType === 'concessionAllotedSummary') {
			const collectionJSON: any = {
				'from_date': value.from_date,
				'to_date': value.to_date,
				'pageSize': value.pageSize,
				'pageIndex': value.pageIndex,
				'classId': value.fee_value,
				'secId': value.hidden_value4,
				'stoppageId': value.hidden_value5,
				'admission_no': value.admission_no,
				'studentName': value.au_full_name,
				'login_id': value.login_id,
				'orderBy': value.orderBy,
				'downloadAll': true
			};
			this.feeService.getFeeConcessionAllotedSummaryReport(collectionJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage('Report Data Fetched Successfully', 'success');
					this.totalRecords = Number(result.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					repoArray = result.data.reportData;
					let i = 0;
					let j = 0;
					const feeHead: any[] = [];
					Object.keys(repoArray).forEach((keys: any) => {
						const obj: any = {};
						if (Number(keys) === 0) {
							this.columnDefinitions = [
								{
									id: 'srno',
									name: 'SNo.',
									field: 'srno',
									sortable: true,
									width: 80
								},
								{
									id: 'stu_admission_no', name: 'Enrollment No', field: 'stu_admission_no',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									grouping: {
										getter: 'stu_admission_no',
										formatter: (g) => {
											return `${g.value}  <span style="color:green">(${g.count})</span>`;
										},
										aggregators: this.aggregatearray,
										aggregateCollapsed: true,
										collapsed: false,
									},
									width: 140,
								},
								{
									id: 'stu_full_name', name: 'Student Name', field: 'stu_full_name',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									grouping: {
										getter: 'stu_full_name',
										formatter: (g) => {
											return `${g.value}  <span style="color:green">(${g.count})</span>`;
										},
										aggregators: this.aggregatearray,
										aggregateCollapsed: true,
										collapsed: false,
									},
									width: 140,
									groupTotalsFormatter: this.srnTotalsFormatter
								},
								{
									id: 'stu_class_name', name: 'Class-Section', field: 'stu_class_name',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									grouping: {
										getter: 'stu_class_name',
										formatter: (g) => {
											return `${g.value}  <span style="color:green">(${g.count})</span>`;
										},
										aggregators: this.aggregatearray,
										aggregateCollapsed: true,
										collapsed: false,
									},
									width: 140,
								},
								{
									id: 'fcg_name',
									name: 'Concession Group.',
									field: 'fcg_name',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									width: 350,
									grouping: {
										getter: 'fcg_name',
										formatter: (g) => {
											return `${g.value}  <span style="color:green">(${g.count})</span>`;
										},
										aggregators: this.aggregatearray,
										aggregateCollapsed: true,
										collapsed: false,
									}
								},
								{
									id: 'fcg_description',
									name: 'Description',
									field: 'fcg_description',
									sortable: true,
									filterable: true,
									filterSearchType: FieldType.string,
									filter: { model: Filters.compoundInput },
									width: 180,
								}];
						}
						if (repoArray[Number(keys)]['stu_concession_arr']) {
							let k = 0;
							let tot = 0;
							for (const titem of repoArray[Number(keys)]['stu_concession_arr']) {
								Object.keys(titem).forEach((key2: any) => {
										obj['id'] = repoArray[Number(keys)]['stu_admission_no'] + keys 
										obj['srno'] = (collectionJSON.pageSize * collectionJSON.pageIndex) +
											(Number(keys) + 1);
										obj['stu_admission_no'] = repoArray[Number(keys)]['stu_admission_no'];
										obj['stu_admission_no'] = repoArray[Number(keys)]['stu_admission_no'];
										obj['stu_full_name'] = new CapitalizePipe().transform(repoArray[Number(keys)]['stu_full_name']);
										if (repoArray[Number(keys)]['stu_sec_id'] !== '0') {
											obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'] + '-' +
												repoArray[Number(keys)]['stu_sec_name'];
										} else {
											obj['stu_class_name'] = repoArray[Number(keys)]['stu_class_name'];
										}
										obj['fcg_name'] = repoArray[Number(keys)]['fcg_name'];
										obj['fcg_description'] = repoArray[Number(keys)]['fcg_description'];
										obj[key2 + k] = titem['invg_fcc_amount'] ? Number(titem['invg_fcc_amount']) : 0;
										tot = tot + (titem['invg_fcc_amount'] ? Number(titem['invg_fcc_amount']) : 0);
										obj['total'] = tot;
										obj['approved_by'] = repoArray[Number(keys)]['approved_by'] ? repoArray[Number(keys)]['approved_by'] : '-';
										obj['mod_review_date'] = repoArray[Number(keys)]['mod_review_date'] ? repoArray[Number(keys)]['mod_review_date'] : '-';
										obj['mod_review_remark'] = repoArray[Number(keys)]['mod_review_remark'] ? repoArray[Number(keys)]['mod_review_remark'] : '-';
										obj['reason_title'] = repoArray[Number(keys)]['reason_title'] ? repoArray[Number(keys)]['reason_title'] : '-';
										k++;
								});
							}
						}
						i++;
						this.dataset.push(obj);
					});
					this.columnDefinitions.push(
						{
							id: 'total', name: 'Total', field: 'total',
							filterable: true,
							filterSearchType: FieldType.number,
							filter: { model: Filters.compoundInputNumber },
							sortable: true,
							formatter: this.checkTotalFormatter,
							cssClass: 'amount-report-fee',
							groupTotalsFormatter: this.sumTotalsFormatter
						},
					);
					this.columnDefinitions.push({
						id: 'approved_by', name: 'Approved By', field: 'approved_by',
						sortable: true,
						filterable: true,
						filterSearchType: FieldType.string,
						filter: { model: Filters.compoundInput },
						width: 140,
					});
					this.columnDefinitions.push({
						id: 'mod_review_date', name: 'Approved Date', field: 'mod_review_date',
						sortable: true,
						formatter: this.checkDateFormatter,
						filterable: true,
						filterSearchType: FieldType.string,
						filter: { model: Filters.compoundInput },
						width: 140,
					});
					this.columnDefinitions.push({
						id: 'mod_review_remark', name: 'Remarks', field: 'mod_review_remark',
						sortable: true,
						filterable: true,
						filterSearchType: FieldType.string,
						filter: { model: Filters.compoundInput },
						width: 140,
					});
					this.columnDefinitions.push({
						id: 'reason_title', name: 'Reasons', field: 'reason_title',
						sortable: true,
						filterable: true,
						filterSearchType: FieldType.string,
						filter: { model: Filters.compoundInput },
						width: 140,
					});
					this.totalRow = {};
					const obj3: any = {};
					obj3['id'] = 'footer';
					obj3['srno'] = '';
					obj3['stu_admission_no'] = '';
					obj3['stu_full_name'] = this.common.htmlToText('<b>Grand Total</b>');
					obj3['stu_class_name'] = '';
					obj3['fcg_name'] = '';
					obj3['fcg_description'] = '';
					obj3['total'] = new DecimalPipe('en-in').transform(this.dataset.map(t => t.total).reduce((acc, val) => acc + val, 0));
					obj3['approved_by'] = '';
					obj3['mod_review_date'] = '';
					obj3['mod_review_remark'] = '';
					obj3['reason_title'] = '';
					this.totalRow = obj3;
					if (this.dataset.length <= 5) {
						this.gridHeight = 300;
					} else if (this.dataset.length <= 10 && this.dataset.length > 5) {
						this.gridHeight = 400;
					} else if (this.dataset.length > 10 && this.dataset.length <= 20) {
						this.gridHeight = 550;
					} else if (this.dataset.length > 20) {
						this.gridHeight = 750;
					}
					this.aggregatearray.push(new Aggregators.Sum('total'));
					this.tableFlag = true;
				} else {
					this.tableFlag = true;
				}
			});
		}
	}
	checkReturn(data) {
		if (Number(data)) {
			return Number(data);
		} else {
			return data;
		}
	}
	resetValues() {
		this.reportFilterForm.patchValue({
			'login_id': '',
			'orderBy': '',
			'fee_value': '',
			'from_date': '',
			'to_date': '',
			'downloadAll': '',
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
		this.sortResult = [];
		this.filterResult = [];
	}
	clearGroupsAndSelects() {
		this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = '');
		this.clearGrouping();
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
	onGroupChanged(groups: Grouping[]) {
		if (Array.isArray(this.selectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
			// update all Group By select dropdown
			this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '');
		}
	}

	showPreHeader() {
		this.gridObj.setPreHeaderPanelVisibility(true);
	}

	selectTrackByFn(index, item) {
		return index;
	}

	toggleDraggableGroupingRow() {
		this.clearGrouping();
		this.gridObj.setPreHeaderPanelVisibility(!this.gridObj.getOptions().showPreHeaderPanel);
	}
	onCellClicked(e, args) {
		if (args.cell === args.grid.getColumnIndex('receipt_no')) {
			const item: any = args.grid.getDataItem(args.row);
			if (item['receipt_no'] !== '-') {
				this.openDialogReceipt(item['receipt_no'], false);
			}
		}
		if (e.target.className === 'invoice-span-mfr') {
			const inv_id = Number(e.target.innerHTML);
			this.renderDialog(inv_id, false);
		}
	}
	onCellChanged(e, args) {
		console.log(e);
		console.log(args);
	}
	sumTotalsFormatter(totals, columnDef) {
		console.log(totals);
		console.log(columnDef);
		const val = totals.sum && totals.sum[columnDef.field];
		if (val != null) {
			return '<b class="total-footer-report">' + new DecimalPipe('en-in').transform(((Math.round(parseFloat(val) * 100) / 100))) + '</b>';
		}
		return '';
	}
	checkFeeFormatter(row, cell, value, columnDef, dataContext) {
		if (value === 0) {
			return '-';
		} else {
			return new DecimalPipe('en-in').transform(value);
		}
	}
	checkTotalFormatter(row, cell, value, columnDef, dataContext) {
		if (value === 0) {
			return '-';
		} else {
			return new DecimalPipe('en-in').transform(value);
		}
	}
	checkFeeHeadFormatter(row, cell, value, columnDef, dataContext) {
		console.log(value);
		return value;
	}
	checkReceiptFormatter(row, cell, value, columnDef, dataContext) {
		if (value === '-') {
			return '-';
		} else {
			return '<a>' + value + '</a>';
		}
	}
	checkDateFormatter(row, cell, value, columnDef, dataContext) {
		if (value !== '-') {
			return new DatePipe('en-in').transform(value, 'd-MMM-y');
		} else {
			return value;
		}
	}
	srnTotalsFormatter(totals, columnDef) {
		if (totals.group.level === 0) {
			return '<b class="total-footer-report">Total</b>';
		}
		if (totals.group.level > 0) {
			return '<b class="total-footer-report">Sub Total (' + totals.group.value + ') </b>';
		}
	}
	getMFRFormatter(row, cell, value, columnDef, dataContext) {
		if (value.status === 'unpaid') {
			return '<div style="background-color:#f93435 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
				+ '<span class="invoice-span-mfr">' + value.invoice_id + '</span>' + '</div>';
		} else if (value.status === 'paid') {
			return '<div style="background-color:#27de80 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
				+ '<span class="invoice-span-mfr">' + value.invoice_id + '</span>' + '</div>';
		} else if (value.status === 'Not Generated') {
			return '<div style="background-color:#d2d8e0 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;' +
				'border-right: 1px solid #89a8c8; border-top: 0px !important;' +
				'border-bottom: 0px !important; border-left: 0px !important; margin: auto;">'
				+ '<span class="invoice-span-mfr">' + value.invoice_id + '</span>' + '</div>';
		} else if (value.status === 'Unpaid with fine') {
			return '<div style="background-color:#4a7bec !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
				+ '<span class="invoice-span-mfr">' + value.invoice_id + '</span>' + '</div>';
		} else {
			return '<div style="background-color:#7bd450 !important;position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;">'
				+ '<span class="invoice-span-mfr">' + value.invoice_id + '</span>' + '</div>';
		}
	}
	openDialogReceipt(invoiceNo, edit): void {
		const dialogRef = this.dialog.open(ReceiptDetailsModalComponent, {
			width: '80%',
			data: {
				invoiceNo: invoiceNo,
				edit: edit
			},
			hasBackdrop: true
		});
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
	getClassData() {
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.classDataArray = result.data;
				for (const item of this.classDataArray) {
					this.valueArray.push({
						id: item.class_id,
						name: item.class_name
					});
				}
			}
		});
	}
	getReportName(value) {
		const findex = this.reportTypeArray.findIndex(f => f.report_type === value);
		if (findex !== -1) {
			return this.reportTypeArray[findex].report_name;
		}
	}
	changeReportType($event) {
		this.filterResult = [];
		this.sortResult = [];
		this.tableFlag = false;
		this.reportType = $event.value,
			this.reportFilterForm.patchValue({
				'admission_no': '',
				'studentName': '',
				'fee_value': '',
				'feeHeadId': '',
				'classId': '',
				'secId': '',
				'from_date': '',
				'to_date': '',
				'pageSize': '10',
				'pageIndex': '0',
				'filterReportBy': 'collection',
				'login_id': '',
				'orderBy': '',
				'downloadAll': true
			});
		if ($event.value) {
			this.displyRep.emit({ report_index: 8, report_id: $event.value, report_name: this.getReportName($event.value) });
			if ($event.value === 'concession') {
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
					footerRowHeight: 21,
					rowHeight: 150,
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
						customItems: [
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
						},
						onColumnsChanged: (e, args) => {
							console.log('Column selection changed from Grid Menu, visible columns: ', args.columns);
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
						},
						onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
					}
				};
				this.filterFlag = false;
				this.getConReport(this.reportFilterForm.value);
			} else if ($event.value === 'concessionAlloted') {
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
					fullWidthRows: true,
					enableAutoTooltip: true,
					enableCellNavigation: true,
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
								// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
								this.exportAsPDF(this.dataset);
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
								// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
								this.exportToExcel(this.dataset);
							}
						},
						onColumnsChanged: (e, args) => {
							console.log('Column selection changed from Grid Menu, visible columns: ', args.columns);
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
				};
				this.valueLabel = 'Class';
				this.filterFlag = true;
				this.getClassData();
			} else if ($event.value === 'concessionAllotedSummary') {
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
					fullWidthRows: true,
					enableAutoTooltip: true,
					enableCellNavigation: true,
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
								// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
								this.exportAsPDF(this.dataset);
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
								// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
								this.exportToExcel(this.dataset);
							}
						},
						onColumnsChanged: (e, args) => {
							console.log('Column selection changed from Grid Menu, visible columns: ', args.columns);
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
				};
				this.valueLabel = 'Class';
				this.filterFlag = true;
				this.getClassData();
			}
		} else {
			this.displyRep.emit({ report_index: 8, report_id: '', report_name: 'Concession Report' });
			this.filterFlag = false;
		}
	}
	openFilterDialog() {
		const dialogRefFilter = this.dialog.open(ReportFilterComponent, {
			width: '70%',
			height: '80%',
			data: {
				filterResult: this.filterResult,
				pro_id: '3',
			}
		});
		dialogRefFilter.afterClosed().subscribe(result => {
		});
		dialogRefFilter.componentInstance.filterResult.subscribe((data: any) => {
			this.filterResult = [];
			this.filterResult = data;
			this.feeService.getStudentsForFilter({ filters: this.filterResult }).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					this.reportFilterForm.patchValue({
						login_id: res.data
					});
				}
			});
		});
	}
	openSort() {
		const sortDialog = this.dialog.open(ReportSortComponent, {
			width: '60vh',
			height: '50vh',
			data: {}
		});
		sortDialog.afterClosed().subscribe((result: any) => {
			if (result) {
				this.sortResult = result;
				this.reportFilterForm.patchValue({
					'orderBy': this.sortResult.length > 0 ? [this.sortResult] : ''
				});
			}
		});
	}
	renderDialog(inv_id, edit) {
		const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
			width: '80%',
			data: {
				invoiceNo: inv_id,
				edit: edit,
				paidStatus: 'paid'
			},
			hasBackdrop: true
		});
	}
	getSectionByClass($event) {
		this.hiddenValueArray4 = [];
		this.sisService.getSectionsByClass({ class_id: $event.value }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				for (const item of result.data) {
					this.hiddenValueArray4.push({
						id: item.sec_id,
						name: item.sec_name
					});
				}
			}
		});
	}
	getFromDate(value) {
		this.reportFilterForm.patchValue({
			from_date: new DatePipe('en-in').transform(value, 'yyyy-MM-dd')
		});
	}
	getToDate(value) {
		this.reportFilterForm.patchValue({
			to_date: new DatePipe('en-in').transform(value, 'yyyy-MM-dd')
		});
	}
	checkWidth(id, header) {
		const res = this.dataset.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}
	getGroupColumns(columns) {
		let grName = '';
		for (const item of columns) {
			for (const titem of this.columnDefinitions) {
				if (item.getter === titem.id) {
					grName = grName + titem.name + ',';
					break;
				}
			}
		}
		return grName.substring(0, grName.length - 1);
	}
	exportToExcel(json: any[]) {
		this.notFormatedCellArray = [];
		let reportType: any = '';
		const columns: any[] = [];
		const columValue: any[] = [];
		this.exportColumnDefinitions = [];
		this.exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
		for (const item of this.exportColumnDefinitions) {
			columns.push({
				key: item.id,
				width: this.checkWidth(item.id, item.name)
			});
			columValue.push(item.name);
		}
		this.sessionName = this.getSessionName(this.session.ses_id);
		reportType = new TitleCasePipe().transform('fee con allotee_') + this.sessionName;
		let reportType2: any = '';
		reportType2 = new TitleCasePipe().transform('fee concession allotee report: ') + this.sessionName;
		const fileName = reportType + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1'); // Extend cell over all column headers
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
		worksheet.getCell('A2').value = reportType2;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.getRow(4).values = columValue;
		worksheet.columns = columns;
		if (this.dataviewObj.getGroups().length === 0) {
			Object.keys(json).forEach(key => {
				const obj: any = {};
				for (const item2 of this.exportColumnDefinitions) {
					if (item2.id === 'inv_invoice_date' || item2.id === 'adjustment_date'
						|| item2.id === 'rpt_receipt_date') {
						obj[item2.id] = new DatePipe('en-in').transform((json[key][item2.id]));
					} else {
						obj[item2.id] = this.checkReturn(this.common.htmlToText(json[key][item2.id]));
					}
				}
				worksheet.addRow(obj);
			});
		} else {
			// iterate all groups
			this.checkGroupLevel(this.dataviewObj.getGroups(), worksheet);
		}
		if (this.totalRow) {
			worksheet.addRow(this.totalRow);
		}
		// style grand total
		worksheet.getRow(worksheet._rows.length).eachCell(cell => {
			this.columnDefinitions.forEach(element => {
				cell.font = {
					color: { argb: 'ffffff' },
					bold: true,
					name: 'Arial',
					size: 10
				};
				cell.alignment = { wrapText: true, horizontal: 'center' };
				cell.fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '439f47' },
					bgColor: { argb: '439f47' }
				};
				cell.border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				};
			});
		});
		// style all row of excel
		worksheet.eachRow((row, rowNum) => {
			if (rowNum === 1) {
				row.font = {
					name: 'Arial',
					size: 14,
					bold: true
				};
			} else if (rowNum === 2) {
				row.font = {
					name: 'Arial',
					size: 12,
					bold: true
				};
			} else if (rowNum === 4) {
				row.eachCell((cell) => {
					cell.font = {
						name: 'Arial',
						size: 12,
						bold: true
					};
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: 'bdbdbd' },
						bgColor: { argb: 'bdbdbd' },
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center' };
				});
			} else if (rowNum > 4 && rowNum < worksheet._rows.length) {
				const cellIndex = this.notFormatedCellArray.findIndex(item => item === rowNum);
				if (cellIndex === -1) {
					row.eachCell((cell) => {
						cell.font = {
							name: 'Arial',
							size: 10,
						};
						cell.alignment = { wrapText: true, horizontal: 'center' };
					});
					if (rowNum % 2 === 0) {
						row.eachCell((cell) => {
							cell.fill = {
								type: 'pattern',
								pattern: 'solid',
								fgColor: { argb: 'ffffff' },
								bgColor: { argb: 'ffffff' },
							};
							cell.border = {
								top: { style: 'thin' },
								left: { style: 'thin' },
								bottom: { style: 'thin' },
								right: { style: 'thin' }
							};
						});
					} else {
						row.eachCell((cell) => {
							cell.fill = {
								type: 'pattern',
								pattern: 'solid',
								fgColor: { argb: 'ffffff' },
								bgColor: { argb: 'ffffff' },
							};
							cell.border = {
								top: { style: 'thin' },
								left: { style: 'thin' },
								bottom: { style: 'thin' },
								right: { style: 'thin' }
							};
						});
					}

				}
			}
		});

		worksheet.addRow({});
		if (this.groupColumns.length > 0) {
			worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
				this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
			worksheet.getCell('A' + worksheet._rows.length).value = 'Groupded As: ' + this.getGroupColumns(this.groupColumns);
			worksheet.getCell('A' + worksheet._rows.length).font = {
				name: 'Arial',
				size: 10,
				bold: true
			};
		}

		worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
			this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
		worksheet.getCell('A' + worksheet._rows.length).value = 'Report Filtered as:' + this.getParamValue();
		worksheet.getCell('A' + worksheet._rows.length).font = {
			name: 'Arial',
			size: 10,
			bold: true
		};

		worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
			this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
		worksheet.getCell('A' + worksheet._rows.length).value = 'No of records: ' + json.length;
		worksheet.getCell('A' + worksheet._rows.length).font = {
			name: 'Arial',
			size: 10,
			bold: true
		};

		worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
			this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
		worksheet.getCell('A' + worksheet._rows.length).value = 'Generated On: '
			+ new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
		worksheet.getCell('A' + worksheet._rows.length).font = {
			name: 'Arial',
			size: 10,
			bold: true
		};

		worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
			this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
		worksheet.getCell('A' + worksheet._rows.length).value = 'Generated By: ' + this.currentUser.full_name;
		worksheet.getCell('A' + worksheet._rows.length).font = {
			name: 'Arial',
			size: 10,
			bold: true
		};
		workbook.xlsx.writeBuffer().then(data => {
			const blob = new Blob([data], { type: 'application/octet-stream' });
			saveAs(blob, fileName);
		});
	}
	filtered(event) {
		this.filteredAs[event.source.ngControl.name] = event.source._placeholder + ' - ' + event.source.selected.viewValue;
	}
	getParamValue() {
		const filterArr = [];
		Object.keys(this.filteredAs).forEach(key => {
			filterArr.push(this.filteredAs[key]);
		});
		filterArr.push(
			this.common.dateConvertion(this.reportFilterForm.value.from_date, 'd-MMM-y') + ' - ' +
			this.common.dateConvertion(this.reportFilterForm.value.to_date, 'd-MMM-y'));
	}
	getLevelFooter(level, groupItem) {
		if (level === 0) {
			return 'Total';
		}
		if (level > 0) {
			return 'Sub Total (' + groupItem.value + ')';
		}
	}
	checkGroupLevel(item, worksheet) {
		if (item.length > 0) {
			for (const groupItem of item) {
				worksheet.addRow({});
				this.notFormatedCellArray.push(worksheet._rows.length);
				// style for groupeditem level heading
				worksheet.mergeCells('A' + (worksheet._rows.length) + ':' +
					this.alphabetJSON[this.exportColumnDefinitions.length] + (worksheet._rows.length));
				worksheet.getCell('A' + worksheet._rows.length).value = this.common.htmlToText(groupItem.title);
				worksheet.getCell('A' + worksheet._rows.length).fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'c8d6e5' },
					bgColor: { argb: 'ffffff' },
				};
				worksheet.getCell('A' + worksheet._rows.length).border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				};
				worksheet.getCell('A' + worksheet._rows.length).font = {
					name: 'Arial',
					size: 10,
					bold: true
				};

				if (groupItem.groups) {
					this.checkGroupLevel(groupItem.groups, worksheet);
					const obj3: any = {};
					obj3['id'] = 'footer';
					obj3['srno'] = '';
					obj3['stu_admission_no'] = '';
					obj3['stu_full_name'] = this.getLevelFooter(groupItem.level, groupItem);
					obj3['stu_class_name'] = '';
					obj3['fh_name'] = '';
					Object.keys(this.feeHeadJson).forEach((key: any) => {
						Object.keys(this.feeHeadJson[key]).forEach(key2 => {
							Object.keys(groupItem.rows).forEach(key3 => {
								Object.keys(groupItem.rows[key3]).forEach(key4 => {
									if (key4 === key2) {
										obj3[key2] = groupItem.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
									}
								});
							});
						});
					});
					obj3['fcg_name'] = '';
					obj3['fcg_description'] = '';
					obj3['total'] = groupItem.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
					obj3['approved_by'] = '';
					obj3['mod_review_date'] = '';
					obj3['mod_review_remark'] = '';
					obj3['reason_title'] = '';
					worksheet.addRow(obj3);
					this.notFormatedCellArray.push(worksheet._rows.length);
					// style row having total
					if (groupItem.level === 0) {
						worksheet.getRow(worksheet._rows.length).eachCell(cell => {
							this.exportColumnDefinitions.forEach(element => {
								cell.font = {
									name: 'Arial',
									size: 10,
									bold: true,
									color: { argb: 'ffffff' }
								};
								cell.alignment = { wrapText: true, horizontal: 'center' };
								cell.fill = {
									type: 'pattern',
									pattern: 'solid',
									fgColor: { argb: '004261' },
									bgColor: { argb: '004261' },
								};
								cell.border = {
									top: { style: 'thin' },
									left: { style: 'thin' },
									bottom: { style: 'thin' },
									right: { style: 'thin' }
								};
							});
						});
					} else if (groupItem.level > 0) {
						worksheet.getRow(worksheet._rows.length).eachCell(cell => {
							this.exportColumnDefinitions.forEach(element => {
								cell.font = {
									name: 'Arial',
									size: 10,
								};
								cell.alignment = { wrapText: true, horizontal: 'center' };
								cell.border = {
									top: { style: 'thin' },
									left: { style: 'thin' },
									bottom: { style: 'thin' },
									right: { style: 'thin' }
								};
							});
						});
					}
				} else {
					Object.keys(groupItem.rows).forEach(key => {
						const obj = {};
						for (const item2 of this.exportColumnDefinitions) {
							if (item2.id === 'inv_invoice_date' || item2.id === 'adjustment_date'
								|| item2.id === 'rpt_receipt_date') {
								obj[item2.id] = new DatePipe('en-in').transform((groupItem.rows[key][item2.id]));
							} else {
								obj[item2.id] = this.checkReturn(this.common.htmlToText(groupItem.rows[key][item2.id]));
							}

						}
						worksheet.addRow(obj);
					});
					const obj3: any = {};
					obj3['id'] = 'footer';
					obj3['srno'] = '';
					obj3['stu_admission_no'] = '';
					obj3['stu_full_name'] = this.getLevelFooter(groupItem.level, groupItem);
					obj3['stu_class_name'] = '';
					obj3['fh_name'] = '';
					Object.keys(this.feeHeadJson).forEach((key: any) => {
						Object.keys(this.feeHeadJson[key]).forEach(key2 => {
							Object.keys(groupItem.rows).forEach(key3 => {
								Object.keys(groupItem.rows[key3]).forEach(key4 => {
									if (key4 === key2) {
										obj3[key2] = groupItem.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
									}
								});
							});
						});
					});
					obj3['fcg_name'] = '';
					obj3['fcg_description'] = '';
					obj3['total'] = groupItem.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
					obj3['approved_by'] = '';
					obj3['mod_review_date'] = '';
					obj3['mod_review_remark'] = '';
					obj3['reason_title'] = '';
					worksheet.addRow(obj3);
					this.notFormatedCellArray.push(worksheet._rows.length);
					if (groupItem.level === 0) {
						worksheet.getRow(worksheet._rows.length).eachCell(cell => {
							this.exportColumnDefinitions.forEach(element => {
								cell.font = {
									name: 'Arial',
									size: 10,
									bold: true,
									color: { argb: 'ffffff' }
								};
								cell.alignment = { wrapText: true, horizontal: 'center' };
								cell.fill = {
									type: 'pattern',
									pattern: 'solid',
									fgColor: { argb: '004261' },
									bgColor: { argb: '004261' },
								};
								cell.border = {
									top: { style: 'thin' },
									left: { style: 'thin' },
									bottom: { style: 'thin' },
									right: { style: 'thin' }
								};
							});
						});
					} else if (groupItem.level > 0) {
						worksheet.getRow(worksheet._rows.length).eachCell(cell => {
							this.exportColumnDefinitions.forEach(element => {
								cell.font = {
									name: 'Arial',
									size: 10,
								};
								cell.alignment = { wrapText: true, horizontal: 'center' };
								cell.border = {
									top: { style: 'thin' },
									left: { style: 'thin' },
									bottom: { style: 'thin' },
									right: { style: 'thin' }
								};
							});
						});
					}
				}
			}
		}
	}
	exportAsPDF(json: any[]) {
		const headerData: any[] = [];
		this.pdfrowdata = [];
		this.levelHeading = [];
		this.levelTotalFooter = [];
		this.levelSubtotalFooter = [];
		this.exportColumnDefinitions = [];
		this.exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
		let reportType: any = '';
		this.sessionName = this.getSessionName(this.session.ses_id);
		reportType = new TitleCasePipe().transform('fee concession allotee report: ') + this.sessionName;
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
			headerData.push(item.name);
		}
		if (this.dataviewObj.getGroups().length === 0) {
			Object.keys(this.dataset).forEach((key: any) => {
				const arr: any[] = [];
				for (const item2 of this.exportColumnDefinitions) {
					if (item2.id === 'inv_invoice_date' || item2.id === 'adjustment_date'
						|| item2.id === 'rpt_receipt_date') {
						arr.push(new DatePipe('en-in').transform((this.dataset[key][item2.id])));
					} else {
						arr.push(this.common.htmlToText(this.dataset[key][item2.id]));
					}
				}
				rowData.push(arr);
				this.pdfrowdata.push(arr);
			});
		} else {
			// iterate all groups
			this.checkGroupLevelPDF(this.dataviewObj.getGroups(), doc, headerData);
		}
		if (this.totalRow) {
			const arr: any[] = [];
			for (const item of this.exportColumnDefinitions) {
				arr.push(this.totalRow[item.id]);
			}
			rowData.push(arr);
			this.pdfrowdata.push(arr);
		}
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
				fontSize: 18,
				cellWidth: 'auto',
				textColor: 'black',
				lineColor: '#89a8c8',
			},
			theme: 'grid'
		});
		if (this.groupColumns.length > 0) {
			doc.autoTable({
				// tslint:disable-next-line:max-line-length
				head: [['Groupded As:  ' + this.getGroupColumns(this.groupColumns)]],
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
		}
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [['Report Filtered as:  ' + this.getParamValue()]],
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
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [['Generated By: ' + new TitleCasePipe().transform(this.currentUser.full_name)]],
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
		doc.save(reportType + '_' + new Date() + '.pdf');
	}
	checkGroupLevelPDF(item, doc, headerData) {
		if (item.length > 0) {
			for (const groupItem of item) {
				// add and style for groupeditem level heading
				this.pdfrowdata.push([groupItem.value + ' (' + groupItem.rows.length + ')']);
				this.levelHeading.push(this.pdfrowdata.length - 1);
				if (groupItem.groups) {
					this.checkGroupLevelPDF(groupItem.groups, doc, headerData);
					const levelArray: any[] = [];
					const obj3: any = {};
					obj3['srno'] = '';
					obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
					obj3['stu_full_name'] = '';
					obj3['stu_class_name'] = '';
					obj3['fh_name'] = '';
					Object.keys(this.feeHeadJson).forEach((key: any) => {
						Object.keys(this.feeHeadJson[key]).forEach(key2 => {
							Object.keys(groupItem.rows).forEach(key3 => {
								Object.keys(groupItem.rows[key3]).forEach(key4 => {
									if (key4 === key2) {
										obj3[key2] = groupItem.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
									}
								});
							});
						});
					});
					obj3['fcg_name'] = '';
					obj3['fcg_description'] = '';
					obj3['total'] = groupItem.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
					obj3['approved_by'] = '';
					obj3['mod_review_date'] = '';
					obj3['mod_review_remark'] = '';
					obj3['reason_title'] = '';
					for (const col of this.exportColumnDefinitions) {
						Object.keys(obj3).forEach((key: any) => {
							if (col.id === key) {
								levelArray.push(obj3[key]);
							}
						});
					}
					if (groupItem.level === 0) {
						this.pdfrowdata.push(levelArray);
						this.levelTotalFooter.push(this.pdfrowdata.length - 1);
					} else if (groupItem.level > 0) {
						this.pdfrowdata.push(levelArray);
						this.levelSubtotalFooter.push(this.pdfrowdata.length - 1);
					}

				} else {
					const rowData: any[] = [];
					Object.keys(groupItem.rows).forEach(key => {
						const arr: any = [];
						for (const item2 of this.columnDefinitions) {
							if (item2.id === 'inv_invoice_date' || item2.id === 'flgr_created_date'
								|| item2.id === 'rpt_receipt_date') {
								arr.push(new DatePipe('en-in').transform((groupItem.rows[key][item2.id])));
							} else {
								arr.push(this.common.htmlToText(groupItem.rows[key][item2.id]));
							}
						}
						rowData.push(arr);
						this.pdfrowdata.push(arr);
					});
					const levelArray: any[] = [];
					const obj3: any = {};
					obj3['srno'] = '';
					obj3['stu_admission_no'] = this.getLevelFooter(groupItem.level, groupItem);
					obj3['stu_full_name'] = '';
					obj3['stu_class_name'] = '';
					obj3['fh_name'] = '';
					Object.keys(this.feeHeadJson).forEach((key: any) => {
						Object.keys(this.feeHeadJson[key]).forEach(key2 => {
							Object.keys(groupItem.rows).forEach(key3 => {
								Object.keys(groupItem.rows[key3]).forEach(key4 => {
									if (key4 === key2) {
										obj3[key2] = groupItem.rows.map(t => t[key2]).reduce((acc, val) => acc + val, 0);
									}
								});
							});
						});
					});
					obj3['fcg_name'] = '';
					obj3['fcg_description'] = '';
					obj3['total'] = groupItem.rows.map(t => t.total).reduce((acc, val) => acc + val, 0);
					obj3['approved_by'] = '';
					obj3['mod_review_date'] = '';
					obj3['mod_review_remark'] = '';
					obj3['reason_title'] = '';
					for (const col of this.exportColumnDefinitions) {
						Object.keys(obj3).forEach((key: any) => {
							if (col.id === key) {
								levelArray.push(obj3[key]);
							}
						});
					}
					if (groupItem.level === 0) {
						this.pdfrowdata.push(levelArray);
						this.levelTotalFooter.push(this.pdfrowdata.length - 1);
					} else if (groupItem.level > 0) {
						this.pdfrowdata.push(levelArray);
						this.levelSubtotalFooter.push(this.pdfrowdata.length - 1);
					}
				}
			}
		}
	}
}
