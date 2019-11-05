import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService } from 'src/app/_services';
import { TitleCasePipe, DatePipe } from '@angular/common';
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
	selector: 'app-disbursment-sheet',
	templateUrl: './disbursment-sheet.component.html',
	styleUrls: ['./disbursment-sheet.component.scss']
})
export class DisbursmentSheetComponent implements OnInit {
	@ViewChild('searchModal') searchModal;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	searchForm: FormGroup;
	employeeData: any;
	salaryHeadsArr: any[] = [];
	shacolumns = [];
	empShacolumns = [];
	shdcolumns = [];
	empShdcolumns = [];
	formGroupArray = [];
	schoolInfo: any;
	length: any;
	settingData: any;
	currentUser: any;
	showPdf = false;
	sessionArray: any[] = [];
	sessionName: any;
	session_id;
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
	paymentModeArray: any[] = [
		{
			pm_id: 'bank_transfer',
			pm_name: 'Bank Transfer',
		},
		{
			pm_id: 'cash_payment',
			pm_name: 'Cash Payment',
		},
		{
			pm_id: 'cheque_payment',
			pm_name: 'Cheque Payment',
		},
	];

	SALARY_COMPUTE_ELEMENT: SalaryComputeElement[] = [];
	salaryComputeDataSource = new MatTableDataSource<SalaryComputeElement>(this.SALARY_COMPUTE_ELEMENT);
	// tslint:disable-next-line: max-line-length
	displayedSalaryComputeColumns: string[] = [];

	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private erpCommonService: ErpCommonService
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
		this.session_id = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
		this.buildForm();
		this.getSalaryHeads();
		this.getSchool();
		this.getSession();


	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			month_id: '',
			//pay_date: ''

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

	getSalaryHeads() {
		this.commonAPIService.getSalaryHeads({}).subscribe((res: any) => {
			if (res) {
				this.salaryHeadsArr = [];
				this.salaryHeadsArr = res;
				this.shacolumns = [];
				this.shdcolumns = [];
				this.shacolumns[0] = { columnDef: 'Basic Pay', header: 'Basic Pay', data: { sc_type: { 'type_id': 1 } } };
				for (var i = 0; i < this.salaryHeadsArr.length; i++) {
					//console.log("this.salaryHeadsArr[i]['sc_type']", this.salaryHeadsArr[i]['sc_type']);
					if (Number(this.salaryHeadsArr[i]['sc_type']['type_id']) === 1) {
						this.shacolumns.push({ columnDef: this.salaryHeadsArr[i]['sc_name'], header: this.salaryHeadsArr[i]['sc_name'], data: this.salaryHeadsArr[i] });
					}
					if (Number(this.salaryHeadsArr[i]['sc_type']['type_id']) === 2) {
						this.shdcolumns.push({ columnDef: this.salaryHeadsArr[i]['sc_name'], header: this.salaryHeadsArr[i]['sc_name'], data: this.salaryHeadsArr[i], value: 0 });
					}
				}

				//console.log('this.shacolumns', this.shacolumns);
				//this.getAllEmployee();
			}
		});
	}

	getAllEmployee() {
		//this.displayedSalaryComputeColumns.push('emp_salary_heads', 'emp_allowances', 'emp_total_earnings', 'emp_deductions', 'emp_present_days', 'emp_salary_payable', 'emp_pay_mode', 'emp_total', 'emp_status']
		let inputJson = {
			'month_id': this.searchForm.value.month_id
		};
		this.commonAPIService.getSalaryCompute(inputJson).subscribe((result: any) => {

			let element: any = {};
			let recordArray = [];
			this.employeeData = result;
			this.SALARY_COMPUTE_ELEMENT = [];
			//			this.displayedSalaryComputeColumns = ['srno', 'emp_id', 'emp_name', 'emp_designation', 'emp_pay_scale'];
			this.displayedSalaryComputeColumns = ['srno', 'emp_id', 'emp_name', 'emp_designation'];
			this.salaryComputeDataSource = new MatTableDataSource<SalaryComputeElement>(this.SALARY_COMPUTE_ELEMENT);
			if (result && result.length > 0) {
				for (let i = 0; i < this.shacolumns.length; i++) {
					//this.displayedSalaryComputeColumns.push(this.shacolumns[i]['header']);
				}
				//this.displayedSalaryComputeColumns.push('emp_total_earnings');
				for (let i = 0; i < this.shdcolumns.length; i++) {
					//this.displayedSalaryComputeColumns.push(this.shdcolumns[i]['header']);
				}
				//this.displayedSalaryComputeColumns.push('emp_present_days', 'emp_advance', 'emp_salary_payable');
				this.displayedSalaryComputeColumns.push('emp_salary_payable');
				for (let i = 0; i < this.paymentModeArray.length; i++) {
					this.displayedSalaryComputeColumns.push(this.paymentModeArray[i]['pm_id']);
				}
				//				this.displayedSalaryComputeColumns.push('emp_total', 'emp_status');
				this.displayedSalaryComputeColumns.push('emp_total');
				let pos = 1;
				let recordArray = [];

				for (var i = 0; i < result.length; i++) {
					if (Number(result[i]['emp_salary_compute_month_id']) === Number(this.searchForm.value.month_id)) {
						recordArray.push(result[i]['emp_salary_compute_data']);
					}
				}

				let emp_present_days;
				for (const item of recordArray) {
					this.empShacolumns = [];
					this.empShdcolumns = [];
					var total_deductions = 0;
					var total_earnings = 0;

					var formJson = {
						emp_id: item.emp_id,
						advance: ''
					};

					for (var i = 0; i < this.paymentModeArray.length; i++) {
						formJson[this.paymentModeArray[i]['pm_id']] = '';
					}

					this.formGroupArray[pos - 1] = this.fbuild.group(formJson);
					var empBasicPay = item.emp_salary_structure && item.emp_salary_structure.emp_basic_pay_scale ? Number(item.emp_salary_structure.emp_basic_pay_scale) : 0;


					for (var i = 0; i < this.shacolumns.length; i++) {
						if (Number(this.shacolumns[i]['data']['sc_type']['type_id']) === 1) {
							var value = 0;

							if (this.shacolumns[i]['header'] === 'Basic Pay') {
								this.empShacolumns[i] = { columnDef: this.shacolumns[i]['data']['sc_name'], header: this.shacolumns[i]['data']['sc_name'], value: empBasicPay };
							} else {
								this.empShacolumns[i] = { columnDef: this.shacolumns[i]['data']['sc_name'], header: this.shacolumns[i]['data']['sc_name'], value: 0 };
							}


							console.log('item', item);
							console.log(this.shacolumns[i]['data']);
							if (item.emp_salary_structure.emp_salary_heads) {
								for (var j = 0; j < item.emp_salary_structure.emp_salary_heads.length; j++) {
									if (item.emp_salary_structure.emp_salary_heads && item.emp_salary_structure.emp_salary_heads[j] && Number(this.shacolumns[i]['data']['sc_id']) === Number(item.emp_salary_structure.emp_salary_heads[j]['sc_id'])) {

										if (item.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] &&
											item.emp_salary_structure.emp_salary_heads[j]['sc_type'] &&
											Number(item.emp_salary_structure.emp_salary_heads[j]['sc_type']['type_id']) === 1
										) {
											if ((item.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type']).toLowerCase() === 'text') {
												value = Number(item.emp_salary_structure.emp_salary_heads[j]['sc_value']);
											}

											if (item.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] === '%') {
												value = (Number(empBasicPay) * Number(item.emp_salary_structure.emp_salary_heads[j]['sc_value'])) / 100;

											}

											this.empShacolumns[i]['value'] = value;
											this.shacolumns[i]['value'] = value;
											total_earnings = total_earnings + Number(value);

										} else {
											this.shacolumns[i]['value'] = 0;
											this.empShacolumns[i]['value'] = 0;
										}
									}
								}
							}


						}
					}
					for (var i = 0; i < this.shdcolumns.length; i++) {
						if (Number(this.shdcolumns[i]['data']['sc_type']['type_id']) === 2) {
							var value = 0;


							this.empShdcolumns[i] = { columnDef: this.shdcolumns[i]['data']['sc_name'], header: this.shdcolumns[i]['data']['sc_name'], value: 0 };




							for (var j = 0; j < item.emp_salary_structure.emp_deduction_detail.length; j++) {
								if (Number(this.shdcolumns[i]['data']['sc_id']) === Number(item.emp_salary_structure.emp_deduction_detail[j]['sc_id'])) {

									if (item.emp_salary_structure.emp_deduction_detail[j]['sc_calculation_type'] &&
										item.emp_salary_structure.emp_deduction_detail[j]['sc_type'] &&
										Number(item.emp_salary_structure.emp_deduction_detail[j]['sc_type']['type_id']) === 2
									) {
										if ((item.emp_salary_structure.emp_deduction_detail[j]['sc_calculation_type']).toLowerCase() === 'text') {
											value = Number(item.emp_salary_structure.emp_deduction_detail[j]['sc_value']);
										}

										if (item.emp_salary_structure.emp_deduction_detail[j]['sc_calculation_type'] === '%') {
											value = (Number(empBasicPay) * Number(item.emp_salary_structure.emp_deduction_detail[j]['sc_value'])) / 100;

										}
										this.empShdcolumns[i]['value'] = value;
										this.shdcolumns[i]['value'] = value;
										total_deductions = total_deductions - Number(value);

									} else {
										this.shdcolumns[i]['value'] = 0;
										this.empShdcolumns[i]['value'] = 0;
									}
								}
							}
						}

					}


					// for (var i = 0; i < item.emp_month_attendance_data.month_data.length; i++) {
					// 	var emp_month = item.emp_month_attendance_data.month_data[i].month_id;
					// 	var emp_attendance_detail = item.emp_month_attendance_data.month_data[i];
					// 	if (parseInt(this.searchForm.value.month_id, 10) === parseInt(emp_month, 10)) {
					// 		emp_present_days = emp_attendance_detail.attendance_detail.emp_present ? emp_attendance_detail.attendance_detail.emp_present : 0;

					// 	} else {
					// 		emp_present_days = 0;
					// 	}
					// }

					emp_present_days = item.emp_present_days;

					var salary_payable = 0;
					var no_of_days = this.getDaysInMonth(this.searchForm.value.month_id, 2019);
					emp_present_days = emp_present_days ? emp_present_days : 0;

					console.log(total_earnings, total_deductions, emp_present_days, Number(no_of_days));
					salary_payable = Math.round(((Number(total_earnings) + Number(total_deductions)) * Number(emp_present_days)) / Number(no_of_days));

					var modeTotal = 0;
					for (var i = 0; i < item.emp_modes_data.mode_data.length; i++) {
						modeTotal = Number(item.emp_modes_data.mode_data[i]['pm_value']) + modeTotal;
					}

					element = {
						srno: pos,
						emp_id: item.emp_id,
						emp_name: item.emp_name,
						emp_salary_compute_month_id: this.searchForm.value.month_id,
						emp_designation: item.emp_designation,
						emp_pay_scale: item.emp_salary_structure && item.emp_salary_structure.emp_pay_scale ? item.emp_salary_structure.emp_pay_scale.pc_name : '',
						emp_salary_structure: item.emp_salary_structure,
						emp_salary_heads: item.emp_salary_structure.emp_salary_heads,
						emp_allowances: '',
						empShacolumns: this.empShacolumns,
						empShdcolumns: this.empShdcolumns,
						emp_total_earnings: total_earnings,
						emp_deductions: item.emp_salary_structure.emp_deduction_detail,
						emp_present_days: emp_present_days,
						emp_salary_payable: item.emp_salary_payable,
						emp_pay_mode: item.emp_salary_structure && item.emp_salary_structure.emp_pay_mode ? item.emp_salary_structure.emp_pay_mode.pm_name : '',
						emp_modes_data: {
							emp_id: item.emp_id,
							advance: item.emp_modes_data.advance,
							mode_data: item.emp_modes_data.mode_data
						},
						emp_total: modeTotal,
						emp_status: item.emp_status ? item.emp_status : 'live',
					};

					this.SALARY_COMPUTE_ELEMENT.push(element);
					pos++;
				}

				this.salaryComputeDataSource = new MatTableDataSource<SalaryComputeElement>(this.SALARY_COMPUTE_ELEMENT);
				this.salaryComputeDataSource.paginator = this.paginator;
				if (this.sort) {
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.salaryComputeDataSource.sort = this.sort;
				}
			}
		});

	}

	getDaysInMonth(month, year) {
		// Here January is 1 based
		//Day 0 is the last day in the previous month
		return new Date(year, month, 0).getDate();
		// Here January is 0 based
		// return new Date(year, month+1, 0).getDate();
	};

	setNetTotal(element, event) {
		var value = 0;
		if (event.target.value) {
			value = event.target.value;
		}
		for (var i = 0; i < this.SALARY_COMPUTE_ELEMENT.length; i++) {
			if (this.SALARY_COMPUTE_ELEMENT[i]['emp_id'] === element.emp_id) {
				this.SALARY_COMPUTE_ELEMENT[i]['emp_total'] = Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_total']) + Number(value)
			}
		}
	}

	setNetSalary(element, event) {
		var value = 0;
		if (event.target.value) {
			value = event.target.value;
		}
		for (var i = 0; i < this.SALARY_COMPUTE_ELEMENT.length; i++) {
			if (this.SALARY_COMPUTE_ELEMENT[i]['emp_id'] === element.emp_id) {
				this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable'] = Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable']) + Number(value)
			}
		}
	}


	openFilter() {
		this.searchModal.openModal();
	}

	resetAll() {
		this.buildForm();
		this.getSalaryHeads();
	}

	save() {
		var inputArr = [];
		let inputJson = {};
		var finJson = {};
		for (var i = 0; i < this.SALARY_COMPUTE_ELEMENT.length; i++) {
			inputJson = this.SALARY_COMPUTE_ELEMENT[i];
			inputJson['emp_modes_data']['emp_id'] = this.formGroupArray[i]['value']['emp_id'];
			inputJson['emp_modes_data']['advance'] = this.formGroupArray[i]['value']['advance'];
			inputJson['emp_modes_data']['advance'] = this.formGroupArray[i]['value']['advance'];
			inputJson['emp_modes_data']['mode_data'] = [];
			for (var j = 0; j < this.paymentModeArray.length; j++) {
				if (Object.keys(this.formGroupArray[i]['value']).indexOf(this.paymentModeArray[j]['pm_id']) > -1) {

					inputJson['emp_modes_data']['mode_data'].push(
						{ pm_id: this.paymentModeArray[j]['pm_id'], pm_name: this.paymentModeArray[j]['pm_name'], pm_value: this.formGroupArray[i]['value'][this.paymentModeArray[j]['pm_id']] }
					)


				}
			}
			// delete inputJson['empShacolumns'];
			// delete inputJson['empShdcolumns'];
			//inputJson['emp_modes_data'] = this.formGroupArray[i]['value'];
			inputArr.push(inputJson);
		}


		finJson['emp_salary_compute_month_id'] = this.searchForm.value.month_id;
		finJson['emp_salary_compute_data'] = inputArr;
		console.log('inputJson', finJson);
		this.commonAPIService.insertSalaryCompute(finJson).subscribe((result: any) => {
			this.commonAPIService.showSuccessErrorMessage('Slary Compute Successfully', 'success');
		});
	}

	print() {

	}

	applyFilter(filterValue: string) {
		this.salaryComputeDataSource.filter = filterValue.trim().toLowerCase();
	}

	searchOk(event) {
		var emp_ids = [];
		this.commonAPIService.getFilterData(event).subscribe((results: any) => {
			if (results) {
				console.log('result', results);
				for (var i = 0; i < results.length; i++) {
					emp_ids.push(results[i]['emp_id']);

				}
				console.log(emp_ids);
				if (emp_ids.length > 0) {
					let inputJson = {
						'emp_ids': emp_ids
					};
					this.commonAPIService.getSalaryCompute(inputJson).subscribe((result: any) => {
						let element: any = {};
						let recordArray = [];
						this.employeeData = result;
						this.SALARY_COMPUTE_ELEMENT = [];
						this.displayedSalaryComputeColumns = ['srno', 'emp_id', 'emp_name', 'emp_designation', 'emp_pay_scale'];
						this.salaryComputeDataSource = new MatTableDataSource<SalaryComputeElement>(this.SALARY_COMPUTE_ELEMENT);
						if (result && result.length > 0) {
							for (let i = 0; i < this.shacolumns.length; i++) {
								this.displayedSalaryComputeColumns.push(this.shacolumns[i]['header']);
							}
							this.displayedSalaryComputeColumns.push('emp_total_earnings');
							for (let i = 0; i < this.shdcolumns.length; i++) {
								this.displayedSalaryComputeColumns.push(this.shdcolumns[i]['header']);
							}
							this.displayedSalaryComputeColumns.push('emp_present_days', 'emp_advance', 'emp_salary_payable');
							for (let i = 0; i < this.paymentModeArray.length; i++) {
								this.displayedSalaryComputeColumns.push(this.paymentModeArray[i]['pm_id']);
							}
							this.displayedSalaryComputeColumns.push('emp_total', 'emp_status');
							let pos = 1;

							for (var i = 0; i < result.length; i++) {
								recordArray.push(result[i]['emp_salary_compute_data']);
							}

							console.log('recordArray', recordArray);

							let emp_present_days;
							for (const item of recordArray) {
								this.empShacolumns = [];
								this.empShdcolumns = [];
								var total_deductions = 0;
								var total_earnings = 0;

								var formJson = {
									emp_id: item.emp_id,
									advance: ''
								};

								for (var i = 0; i < this.paymentModeArray.length; i++) {
									formJson[this.paymentModeArray[i]['pm_id']] = '';
								}

								this.formGroupArray[pos - 1] = this.fbuild.group(formJson);
								var empBasicPay = item.emp_salary_structure && item.emp_salary_structure.emp_basic_pay_scale ? Number(item.emp_salary_structure.emp_basic_pay_scale) : 0;


								for (var i = 0; i < this.shacolumns.length; i++) {
									if (Number(this.shacolumns[i]['data']['sc_type']['type_id']) === 1) {
										var value = 0;

										if (this.shacolumns[i]['header'] === 'Basic Pay') {
											this.empShacolumns[i] = { columnDef: this.shacolumns[i]['data']['sc_name'], header: this.shacolumns[i]['data']['sc_name'], value: empBasicPay };
										} else {
											this.empShacolumns[i] = { columnDef: this.shacolumns[i]['data']['sc_name'], header: this.shacolumns[i]['data']['sc_name'], value: 0 };
										}



										for (var j = 0; j < item.emp_salary_structure.emp_salary_heads.length; j++) {
											if (Number(this.shacolumns[i]['data']['sc_id']) === Number(item.emp_salary_structure.emp_salary_heads[j]['sc_id'])) {

												if (item.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] &&
													item.emp_salary_structure.emp_salary_heads[j]['sc_type'] &&
													Number(item.emp_salary_structure.emp_salary_heads[j]['sc_type']['type_id']) === 1
												) {
													if ((item.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type']).toLowerCase() === 'text') {
														value = Number(item.emp_salary_structure.emp_salary_heads[j]['sc_value']);
													}

													if (item.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] === '%') {
														value = (Number(empBasicPay) * Number(item.emp_salary_structure.emp_salary_heads[j]['sc_value'])) / 100;

													}

													this.empShacolumns[i]['value'] = value;
													this.shacolumns[i]['value'] = value;
													total_earnings = total_earnings + Number(value);

												} else {
													this.shacolumns[i]['value'] = 0;
													this.empShacolumns[i]['value'] = 0;
												}
											}
										}

									}
								}
								for (var i = 0; i < this.shdcolumns.length; i++) {
									if (Number(this.shdcolumns[i]['data']['sc_type']['type_id']) === 2) {
										var value = 0;


										this.empShdcolumns[i] = { columnDef: this.shdcolumns[i]['data']['sc_name'], header: this.shdcolumns[i]['data']['sc_name'], value: 0 };




										for (var j = 0; j < item.emp_salary_structure.emp_salary_heads.length; j++) {
											if (Number(this.shdcolumns[i]['data']['sc_id']) === Number(item.emp_salary_structure.emp_salary_heads[j]['sc_id'])) {

												if (item.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] &&
													item.emp_salary_structure.emp_salary_heads[j]['sc_type'] &&
													Number(item.emp_salary_structure.emp_salary_heads[j]['sc_type']['type_id']) === 2
												) {
													if ((item.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type']).toLowerCase() === 'text') {
														value = Number(item.emp_salary_structure.emp_salary_heads[j]['sc_value']);
													}

													if (item.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] === '%') {
														value = (Number(empBasicPay) * Number(item.emp_salary_structure.emp_salary_heads[j]['sc_value'])) / 100;

													}
													this.empShdcolumns[i]['value'] = value;
													this.shdcolumns[i]['value'] = value;
													total_deductions = total_deductions - Number(value);

												} else {
													this.shdcolumns[i]['value'] = 0;
													this.empShdcolumns[i]['value'] = 0;
												}
											}
										}
									}

								}


								// for (var i = 0; i < item.emp_month_attendance_data.month_data.length; i++) {
								// 	var emp_month = item.emp_month_attendance_data.month_data[i].month_id;
								// 	var emp_attendance_detail = item.emp_month_attendance_data.month_data[i];
								// 	if (parseInt(this.searchForm.value.month_id, 10) === parseInt(emp_month, 10)) {
								// 		emp_present_days = emp_attendance_detail.attendance_detail.emp_present ? emp_attendance_detail.attendance_detail.emp_present : 0;

								// 	} else {
								// 		emp_present_days = 0;
								// 	}
								// }

								emp_present_days = item.emp_present_days;

								var salary_payable = 0;
								var no_of_days = this.getDaysInMonth(this.searchForm.value.month_id, 2019);
								emp_present_days = emp_present_days ? emp_present_days : 0;
								salary_payable = Math.round(((Number(total_earnings) + Number(empBasicPay) + Number(total_deductions)) * Number(emp_present_days)) / Number(no_of_days));

								var modeTotal = 0;
								for (var i = 0; i < item.emp_modes_data.mode_data.length; i++) {
									modeTotal = Number(item.emp_modes_data.mode_data[i]['pm_value']) + modeTotal;
								}

								element = {
									srno: pos,
									emp_id: item.emp_id,
									emp_name: item.emp_name,
									emp_salary_compute_month_id: this.searchForm.value.month_id,
									emp_designation: item.emp_designation,
									emp_pay_scale: item.emp_salary_structure && item.emp_salary_structure.emp_pay_scale ? item.emp_salary_structure.emp_pay_scale.pc_name : '',
									emp_salary_structure: item.emp_salary_structure,
									emp_salary_heads: item.emp_salary_structure.emp_salary_heads,
									emp_allowances: '',
									empShacolumns: this.empShacolumns,
									empShdcolumns: this.empShdcolumns,
									emp_total_earnings: total_earnings,
									emp_deductions: item.emp_salary_structure.emp_deduction_detail,
									emp_present_days: emp_present_days,
									emp_salary_payable: Number(salary_payable) + Number(item.emp_modes_data.advance),
									emp_pay_mode: item.emp_salary_structure && item.emp_salary_structure.emp_pay_mode ? item.emp_salary_structure.emp_pay_mode.pm_name : '',
									emp_modes_data: {
										emp_id: item.emp_id,
										advance: item.emp_modes_data.advance,
										mode_data: item.emp_modes_data.mode_data
									},
									emp_total: modeTotal,
									emp_status: item.emp_status ? item.emp_status : 'live',
								};

								this.SALARY_COMPUTE_ELEMENT.push(element);
								pos++;
								console.log('element', element);
							}

							this.salaryComputeDataSource = new MatTableDataSource<SalaryComputeElement>(this.SALARY_COMPUTE_ELEMENT);
							this.salaryComputeDataSource.paginator = this.paginator;
							if (this.sort) {
								this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
								this.salaryComputeDataSource.sort = this.sort;
							}
						}
					});
				}
			}
		});


	}

	downloadPdf() {
		this.showPdf = true;
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
			head: [[new TitleCasePipe().transform('Employee Disbursment Sheet report: ') + this.sessionName]],
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
			html: '#salary_compute_log',
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
			head: [['No. of Records : ' + this.employeeData.length]],
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

		doc.save('EmployeeDisbursmentSheet_' + this.searchForm.value.searchId + '_' + (new Date).getTime() + '.pdf');
		this.showPdf = false;
	}
	checkWidth(id, header) {

		const res = this.employeeData.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}

	downloadExcel() {
		let reportType: any = '';
		let reportType2: any = '';
		const columns: any = [];
		columns.push({
			key: 'emp_id',
			width: this.checkWidth('emp_id', 'Emp. ID')
		});
		columns.push({
			key: 'emp_name',
			width: this.checkWidth('emp_name', 'Emp Name')
		});
		columns.push({
			key: 'emp_designation',
			width: this.checkWidth('emp_designation', 'Designation')
		});
		columns.push({
			key: 'emp_salary_payable',
			width: this.checkWidth('emp_salary_payable', 'Salary Payable')
		});
		columns.push({
			key: 'emp_modes_data',
			width: this.checkWidth('emp_modes_data', 'Bank Transfer')
		});
		columns.push({
			key: 'emp_modes_data2',
			width: this.checkWidth('emp_modes_data2', 'Check')
		});
		columns.push({
			key: 'emp_modes_data3',
			width: this.checkWidth('emp_modes_data3', 'Cash')
		});
		columns.push({
			key: 'emp_total',
			width: this.checkWidth('emp_total', 'Total')
		});


		reportType2 = new TitleCasePipe().transform(' employeeDisbursmentSheet_') + this.sessionName;
		reportType = new TitleCasePipe().transform(' Employee Disbursment Sheet report: ') + this.sessionName;
		const fileName = reportType + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[8] + '1');
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[8] + '2');
		worksheet.getCell('A2').value = new TitleCasePipe().transform(' Employee Disbursment Sheet report: ') + this.sessionName;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('A3:B3');
		worksheet.getCell('A3').value = '';
		worksheet.getCell(`A3`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('C3:D3');
		worksheet.getCell('C3').value = '';
		worksheet.getCell(`C3`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('E3:F3');
		worksheet.getCell('E3').value = '';
		worksheet.getCell(`E3`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('A5:C5');
		worksheet.getCell('A5').value = ' ';
		worksheet.mergeCells('D5:G5');
		worksheet.getCell('D5').value = 'Modes';
		worksheet.getCell('H5').value = '';
		worksheet.getCell('A6').value = 'Emp. ID';
		worksheet.getCell('B6').value = 'Emp Name';
		worksheet.getCell('C6').value = 'Designation';
		worksheet.getCell('D6').value = 'Salary Payable';
		worksheet.getCell('E6').value = 'Bank Transfer';
		worksheet.getCell('F6').value = 'Cheque';
		worksheet.getCell('G6').value = 'Cash';
		worksheet.getCell('H6').value = 'Total';

		worksheet.columns = columns;
		this.length = worksheet._rows.length;
		let totRow = this.length + this.employeeData.length + 5;
		console.log(worksheet._rows.length, this.currentUser, totRow);

		worksheet.mergeCells('A' + totRow + ':' + 'D' + totRow);
		worksheet.getCell('A' + totRow + ':' + 'B' + totRow).value = 'Report Generated By : ' + this.currentUser.full_name;
		worksheet.getCell('A' + totRow + ':' + 'B' + totRow).alignment = { horizontal: 'left' };
		worksheet.mergeCells('A' + (totRow + 1) + ':' + 'B' + (totRow + 1));
		worksheet.getCell('A' + (totRow + 1) + ':' + 'B' + (totRow + 1)).value = 'No. of Records : ' + this.employeeData.length;
		worksheet.getCell('A' + (totRow + 1) + ':' + 'B' + (totRow + 1)).alignment = { horizontal: 'left' };
		for (const item of this.SALARY_COMPUTE_ELEMENT) {
			const prev = this.length + 1;
			const obj: any = {};
			this.length++;
			worksheet.getCell('A' + this.length).value = item.emp_id;
			worksheet.getCell('B' + this.length).value = item.emp_name;
			worksheet.getCell('C' + this.length).value = item.emp_designation;
			worksheet.getCell('D' + this.length).value = item.emp_salary_payable ? item.emp_salary_payable : '-';
			worksheet.getCell('E' + this.length).value = item.emp_modes_data.mode_data[0].pm_value ? item.emp_modes_data.mode_data[0].pm_value : '-';
			worksheet.getCell('F' + this.length).value = item.emp_modes_data.mode_data[1].pm_value ? item.emp_modes_data.mode_data[1].pm_value : '-';
			worksheet.getCell('G' + this.length).value = item.emp_modes_data.mode_data[2].pm_value ? item.emp_modes_data.mode_data[2].pm_value : '-';
			worksheet.getCell('H' + this.length).value = item.emp_total ? item.emp_total : '-';

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
			if (rowNum === 5 || rowNum === 6) {
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
			if (rowNum >= 7 && rowNum <= this.employeeData.length + 7) {
				row.eachCell(cell => {
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
}


export interface SalaryComputeElement {
	srno: number;
	emp_id: string;
	emp_name: string;
	emp_designation: string;
	emp_pay_scale: string;
	// emp_salary_heads: any;
	// emp_allowances: any;
	emp_total_earnings: any;
	// emp_deductions: any;
	emp_present_days: any;
	emp_salary_payable: any;
	emp_advance: any;
	// emp_pay_mode: any;
	emp_total: any;
	emp_status: any;
	emp_modes_data: any;
}
