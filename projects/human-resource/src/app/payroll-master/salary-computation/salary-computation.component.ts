import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { ErpCommonService } from 'src/app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
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
import { forEach } from '@angular/router/src/utils/collection';
import { isThursday } from 'date-fns';
@Component({
	selector: 'app-salary-computation',
	templateUrl: './salary-computation.component.html',
	styleUrls: ['./salary-computation.component.scss']
})
export class SalaryComputationComponent implements OnInit {
	@ViewChild('searchModal') searchModal;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	searchForm: FormGroup;
	year: any;
	currentYear: any;
	deductions: any = {};
	employeeData: any[] = [];
	salaryHeadsArr: any[] = [];
	nod: any = 0;
	shacolumns = [];
	currSess: any;
	empShacolumns = [];
	monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	monthArr: any[] = [
		{ id: '4', name: 'April' },
		{ id: '5', name: 'May' },
		{ id: '6', name: 'June' },
		{ id: '7', name: 'July' },
		{ id: '8', name: 'August' },
		{ id: '9', name: 'September' },
		{ id: '10', name: 'October' },
		{ id: '11', name: 'November' },
		{ id: '12', name: 'December' },
		{ id: '1', name: 'January' },
		{ id: '2', name: 'February' },
		{ id: '3', name: 'March' }
	];
	shdcolumns = [];
	empShdcolumns = [];
	formGroupArray = [];
	session_id;
	editFlag = false;
	fromFilter = false;
	filterJson = {};
	totalEarnings: any[] = [];
	totalDeductions: any[] = [];
	disabledApiButton = false;
	paymentModeArray: any[] = [
		// {
		// 	pm_id: 'bank_transfer',
		// 	pm_name: 'Bank Transfer',
		// 	pm_value: 0
		// },
		// {
		// 	pm_id: 'cash_payment',
		// 	pm_name: 'Cash Payment',
		// 	pm_value: 0

		// },
		// {
		// 	pm_id: 'cheque_payment',
		// 	pm_name: 'Cheque Payment',
		// 	pm_value: 0
		// },
	];
	footerrow: any;
	SALARY_COMPUTE_ELEMENT: SalaryComputeElement[] = [];
	salaryComputeDataSource = new MatTableDataSource<SalaryComputeElement>(this.SALARY_COMPUTE_ELEMENT);
	// tslint:disable-next-line: max-line-length
	displayedSalaryComputeColumns: string[] = [];
	salaryComputeEmployeeData: any[] = [];
	salaryComputeEmployeeIds: any[] = [];
	sessionArray: any[] = [];
	currentVcType = 'Journal Voucher';
	sessionName: any;
	vcData: any;
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
	currentUser: any;
	showPdf = false;
	searchByFilter = false;
	tdArr: any[] = [];
	tAr :any[] = [];
	transMode: any[] = [
		{ id: 1, name: 'Bank Transfer' },
		{ id: 2, name: 'Cheque Transfer' }
	];
	records: any[] = [];
	chartsOfAccount: any[] = [];
	paymentModeAccount: any[] = [];
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
	getChartsOfAccount() {
		this.erpCommonService.getChartsOfAccount({}).subscribe((result: any) => {


			for (var i = 0; i < result.length; i++) {
				if ((result[i]['dependencies_type']) === "internal" && result[i]['coa_dependencies'][0]['dependenecy_component'] === "salary_component") {
					this.chartsOfAccount.push(result[i]);
				}
				if ((result[i]['dependencies_type']) === "internal" && (result[i]['coa_dependencies'][0]['dependenecy_component'] === "payment_mode" || result[i]['coa_dependencies'][0]['dependenecy_component'] === "cash")) {
					this.paymentModeAccount.push(result[i]);
				}
			}
		});
	}
	ngOnInit() {

		console.log(this.monthArr);
		this.buildForm();
		this.getSession();
		this.getSchool();
		this.getGlobalSettings();
		this.getPaymentModes();
		this.getSalaryHeads();

	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			month_id: '',
			//pay_date: ''

		});
	}

	getPaymentModes() {
		this.commonAPIService.getBanks({}).subscribe((res: any) => {
			if (res && res.status === 'ok') {

				this.paymentModeArray.push(
					{
						'pm_id': 'Cash' ? 'Cash'.trim().toLowerCase().replace(' ', '_') : '',
						'pm_name': 'Cash',
						'pm_value': 0,
						'calculation_type': '',
						'calculation_value': '',
						'config_id': '0',
						'transfer_id': 0

					}
				);
				for (const item of res.data) {
					let i = 0;
					for (const trans of this.transMode) {
						this.paymentModeArray.push(
							{
								'pm_id': item.bank_name ? (item.bank_name + i).trim().toLowerCase().replace(' ', '_') : '',
								'pm_name': item.bank_name + '\n (' + trans.name + ')',
								'pm_value': 0,
								'pm_acc_name': item.bank_name,
								'calculation_type': '',
								'calculation_value': '',
								'config_id': item.bnk_id,
								'transfer_id': trans.id,

							}
						);
						i++;
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
							this.year = this.sessionName.split('-');
							this.currentYear = this.year[0];
							const year = new Date().getFullYear();
							if (Number(this.sessionName.split('-')[0]) >= year) {
								if (year + '-' + (year + 1) === this.sessionName
									&& (Number(this.sessionName.split('-')[1]) !== year
									)) {
									const month = new Date().getMonth() + 1;
									this.monthArr = this.monthArr.filter(item => {
										if (Number(month) > 4) {
											return Number(item.id) > 3 && (Number(item.id) <= Number(month));
										} else if (Number(month) < 4) {
											return Number(item.id) <= month || (
												(Number(item.id) !== 1 &&
													Number(item.id) !== 2 &&
													Number(item.id) !== 3) && (Number(item.id) > Number(month)));
										}
									});
								}
								if (year - 1 + '-' + (year) === this.sessionName
									&& (Number(this.sessionName.split('-')[1]) === year
									)) {

									const month = new Date().getMonth() + 1;
									this.monthArr = this.monthArr.filter(item => {
										if (Number(month) < 4) {
											return Number(item.id) <= month || (
												(Number(item.id) !== 1 &&
													Number(item.id) !== 2 &&
													Number(item.id) !== 3) && (Number(item.id) > Number(month)));
										}
									});
								}
							}
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
					//////console.log("this.salaryHeadsArr[i]['sc_type']", this.salaryHeadsArr[i]['sc_type']);
					if (Number(this.salaryHeadsArr[i]['sc_type']['type_id']) === 1 &&
						Number(this.salaryHeadsArr[i]['sc_status']) === 1) {
						this.shacolumns.push({ columnDef: this.salaryHeadsArr[i]['sc_name'], header: this.salaryHeadsArr[i]['sc_name'], data: this.salaryHeadsArr[i] });
					}
					if (Number(this.salaryHeadsArr[i]['sc_type']['type_id']) === 2 &&
						!this.salaryHeadsArr[i]['sc_type']['optional']
						&& Number(this.salaryHeadsArr[i]['sc_status']) === 1) {
						this.shdcolumns.push({ columnDef: this.salaryHeadsArr[i]['sc_name'], header: this.salaryHeadsArr[i]['sc_name'], data: this.salaryHeadsArr[i], value: 0 });
					}
				}
				//this.getAllEmployee();
			}
		});
	}
	getCalculationType(value, id) {
		if (value.emp_salary_detail && value.emp_salary_detail.empPaymentModeDetail
			&& value.emp_salary_detail.empPaymentModeDetail.length > 0) {
			console.log('yes')
			const arr: any[] = value.emp_salary_detail.empPaymentModeDetail;
			const index = arr.findIndex(f => Number(f.pay_mode) === Number(id));
			if (index !== -1) {
				return arr[index].calculation_type;
			}

		} else {
			return '';
		}
	}
	getTransferType(value, id) {
		if (value.emp_salary_detail && value.emp_salary_detail.empPaymentModeDetail
			&& value.emp_salary_detail.empPaymentModeDetail.length > 0) {
			console.log('yes')
			const arr: any[] = value.emp_salary_detail.empPaymentModeDetail;
			const index = arr.findIndex(f => Number(f.pay_mode) === Number(id));
			if (index !== -1) {
				return arr[index].transfer_type;
			}

		} else {
			return '';
		}
	}
	getAllEmployee() {
		let element: any = {};
		let recordArray = [];
		// this.employeeData = result;
		this.SALARY_COMPUTE_ELEMENT = [];
		this.displayedSalaryComputeColumns = ['srno', 'emp_id', 'emp_name', 'emp_designation', 'emp_pay_scale_master', 'emp_pay_scale'];
		this.salaryComputeDataSource = new MatTableDataSource<SalaryComputeElement>(this.SALARY_COMPUTE_ELEMENT);
		//this.getSalaryComputeEmployee();
		let inputJson = {
			'month_id': this.searchForm.value.month_id,
			'emp_status': 'all',
			from_attendance: true,
			year: this.currSess
		};
		this.commonAPIService.getAllEmployee(inputJson).subscribe((result: any) => {
			if (result && result.length > 0) {
				////console.log(result);
				var temp_arr = [];
				for (let i = 0; i < this.shacolumns.length; i++) {
					this.displayedSalaryComputeColumns.push(this.shacolumns[i]['header'] + this.shacolumns[i]['data']['sc_id']);
				}
				this.displayedSalaryComputeColumns.push('td', 'emp_total_earnings', 'emp_arrear');
				for (let i = 0; i < this.shdcolumns.length; i++) {
					this.displayedSalaryComputeColumns.push(this.shdcolumns[i]['header'] + this.shdcolumns[i]['data']['sc_id']);
				}
				if (this.deductions && this.deductions.tds) {
					this.displayedSalaryComputeColumns.push('tds', 'emp_present_days', 'emp_advance', 'emp_salary_payable');
				} else {
					this.displayedSalaryComputeColumns.push('emp_present_days', 'emp_advance', 'emp_salary_payable');
				}
				for (let i = 0; i < this.paymentModeArray.length; i++) {
					this.displayedSalaryComputeColumns.push(this.paymentModeArray[i]['pm_id']);
				}
				if (this.deductions && this.deductions.gratuity) {
					this.displayedSalaryComputeColumns.push('emp_total', 'balance', 'emp_status', 'gratuity');
				} else {
					this.displayedSalaryComputeColumns.push('emp_total', 'balance', 'emp_status');
				}
				let pos = 1;
				let recordArray = result;
				this.records = [];
				this.records = result;


				for (const item of recordArray) {
					console.log(item);
					element = {};
					var editableStatus = false;
					let emp_present_days = 0;
					this.empShacolumns = [];
					this.empShdcolumns = [];
					var total_deductions = 0;
					var total_earnings = 0;

					var formJson: any = {
						emp_id: item.emp_id,
						arrear: '',
						advance: '',
						td: '',
						tds: ''
					};

					var empBasicPay = item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.emp_basic_pay_scale ? Math.round(Number(item.emp_salary_detail.emp_salary_structure.emp_basic_pay_scale)) : 0;

					for (var i = 0; i < this.shacolumns.length; i++) {
						if (Number(this.shacolumns[i]['data']['sc_type']['type_id']) === 1) {
							var value = 0;

							if (this.shacolumns[i]['header'] === 'Basic Pay') {
								this.empShacolumns[i] = { columnDef: this.shacolumns[i]['data']['sc_name'], header: this.shacolumns[i]['data']['sc_name'], value: empBasicPay };
							} else {
								this.empShacolumns[i] = { columnDef: this.shacolumns[i]['data']['sc_name'], header: this.shacolumns[i]['data']['sc_name'], value: 0 };
							}

							if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads) {
								for (var j = 0; j < item.emp_salary_detail.emp_salary_structure.emp_salary_heads.length; j++) {
									if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j] && Number(this.shacolumns[i]['data']['sc_id']) === Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_id'])) {

										if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] &&
											item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type'] &&
											Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type']['type_id']) === 1
										) {
											if ((item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type']).toLowerCase() === 'text') {
												value = Math.round(Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value']));
											}

											if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] === '%') {
												value = Math.round((Number(empBasicPay) * Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value'])) / 100);
											}

											this.empShacolumns[i]['value'] = value.toFixed(2);
											this.shacolumns[i]['value'] = value.toFixed(2);
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

							if (item.emp_salary_detail
								&& item.emp_salary_detail.emp_salary_structure
								&& item.emp_salary_detail.emp_salary_structure.emp_salary_heads) {
								for (var j = 0; j < item.emp_salary_detail.emp_salary_structure.emp_salary_heads.length; j++) {
									if (this.shdcolumns[i]['data'] && item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j] && Number(this.shdcolumns[i]['data']['sc_id']) === Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_id'])) {

										if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] &&
											item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type'] &&
											Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type']['type_id']) === 2
										) {
											if ((item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type']).toLowerCase() === 'text') {
												value = Math.round(Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value']));
											}

											if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] === '%') {
												value = Math.round((Number(empBasicPay) * Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value'])) / 100);

											}
											const upperVal = this.shdcolumns[i]['data']['sc_type']['upper_value'] ?
												this.shdcolumns[i]['data']['sc_type']['upper_value'] : '';
											if (upperVal && value) {
												if (Number(value) > Number(upperVal)) {
													value = upperVal;
												}
											}
											this.empShdcolumns[i]['value'] = value.toFixed(2);
											this.shdcolumns[i]['value'] = value.toFixed(2);
											total_deductions = total_deductions - Number(value);

										} else {
											this.shdcolumns[i]['value'] = 0;
											this.empShdcolumns[i]['value'] = 0;
										}
									}
								}
							}

						}

					}


					if (item.emp_month_attendance_data && item.emp_month_attendance_data.month_data) {
						for (let i = 0; i < item.emp_month_attendance_data.month_data.length; i++) {
							let emp_month = item.emp_month_attendance_data.month_data[i].month_id;
							let emp_attendance_detail = item.emp_month_attendance_data.month_data[i];
							if (Number(this.searchForm.value.month_id) === Number(emp_month)) {
								console.log('yes');
								var tPresent = emp_attendance_detail && emp_attendance_detail.attendance_detail ? emp_attendance_detail.attendance_detail.emp_present : 0;
								var lwpDays = emp_attendance_detail && emp_attendance_detail.attendance_detail ? emp_attendance_detail.attendance_detail.emp_lwp : 0;
								var totalDays = emp_attendance_detail && emp_attendance_detail.attendance_detail &&
									emp_attendance_detail.attendance_detail.emp_total_attendance ? emp_attendance_detail.attendance_detail.emp_total_attendance : 0;
								var presentDays = totalDays;
								emp_present_days = presentDays;
							}
						}
					}


					var eIndex = this.salaryComputeEmployeeIds.indexOf(Number(item.emp_id));
					if (eIndex > -1) {
						if (this.salaryComputeEmployeeData[eIndex] && Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_id']) === Number(item.emp_id)
							&& Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_month_id']) === Number(this.searchForm.value.month_id)
							&& Number(this.salaryComputeEmployeeData[eIndex]['session_id']) === Number(this.session_id.ses_id)) {
							editableStatus = true;
						} else {
							editableStatus = false;
						}
					} else {
						editableStatus = false;
					}
					console.log('pos-->' + pos);
					console.log('editable-->' + editableStatus);
					if (editableStatus) {
						var salary_payable = 0;
						let arrearValue = Math.round(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].arrear || 0);
						formJson['arrear'] = arrearValue;
						let advanceValue = Math.round(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].advance || 0);
						total_earnings = this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total_earnings'] ? Math.round(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total_earnings']) : 0;
						var no_of_days = this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear());

						emp_present_days = emp_present_days ? emp_present_days : 0;
						salary_payable = Math.round((((Number(total_earnings)) * Number(emp_present_days)) / Number(no_of_days)) +
							((Number(total_deductions) * Number(emp_present_days)) / Number(no_of_days)) + Number(arrearValue) - Number(advanceValue));

						for (var i = 0; i < this.paymentModeArray.length; i++) {
							formJson[this.paymentModeArray[i]['pm_id']] = this.salaryComputeEmployeeData[eIndex] && this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data'] && this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].mode_data[i] && this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].mode_data[i]['pm_value'] ? Math.round(Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].mode_data[i]['pm_value'])) : '';
						}
						formJson['td'] = Math.round(Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].td));
						if (this.deductions && this.deductions.tds) {
							formJson['tds'] = Math.round(Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].tds));
						}
						else {
							formJson['tds'] = 0;
						}
						formJson['advance'] = Math.round(Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].advance));

						this.formGroupArray[pos - 1] = this.fbuild.group(formJson);
						element = {
							srno: pos,
							emp_id: item.emp_id,
							emp_code_no: item.emp_code_no ? item.emp_code_no : '-',
							emp_name: item.emp_name,
							emp_salary_compute_month_id: this.searchForm.value.month_id,
							emp_designation: item.emp_designation_detail ? item.emp_designation_detail.name : '',
							emp_pay_scale: item.emp_salary_detail.emp_salary_structure.emp_pay_scale ? item.emp_salary_detail.emp_salary_structure.emp_pay_scale.ss_name : '',
							emp_pay_scale_master: item.emp_salary_detail.emp_salary_structure &&
								item.emp_salary_detail.emp_salary_structure.emp_pay_scale_master &&
								item.emp_salary_detail.emp_salary_structure.emp_pay_scale_master.pay_scale_name ?
								item.emp_salary_detail.emp_salary_structure.emp_pay_scale_master.pay_scale_name : '',
							emp_salary_structure: item.emp_salary_detail.emp_salary_structure,
							emp_salary_heads: item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_salary_heads : [],
							emp_allowances: '',
							empShacolumns: this.empShacolumns,
							empShdcolumns: this.empShdcolumns,
							emp_total_earnings: total_earnings,
							emp_total_deductions: Math.round(total_deductions),
							emp_deductions: item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_deduction_detail : [],
							emp_present_days: emp_present_days,
							emp_salary_payable: emp_present_days ? salary_payable : 0,
							emp_pay_mode: item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.emp_pay_mode ? item.emp_salary_detail.emp_salary_structure.emp_pay_mode.pm_name : [],
							emp_modes_data: {
								emp_id: item.emp_id,
								arrear: Math.round(Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data']['arrear'])) || '',
								td: Math.round(Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data']['td'])) || '',
								tds: this.deductions && this.deductions.tds ?
									Math.round(Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data']['tds'])) || '' : 0,
								advance: Math.round(Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data']['advance'])),
								mode_data: this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data']['mode_data']
							},
							emp_total: Math.round(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total']),
							emp_status: item.emp_status ? item.emp_status : 'live',
							// td: this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['td'],
							// tds: this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['tds'],
							gratuity: this.deductions && this.deductions.gratuity ? Math.round(Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['gratuity'])) : 0,
							balance: Math.round(Number(emp_present_days ? salary_payable : 0) - Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total'])),
							isEditable: editableStatus
						};
						this.tAr.push(element.emp_modes_data.arrear);
						this.tdArr.push(element.emp_modes_data.td);
						this.totalEarnings.push(element.emp_total_earnings);
						element.emp_salary_payable = Math.round((Number(element.emp_total_earnings) * Number(element.emp_present_days) / Number(no_of_days))
							- Number(element.emp_modes_data.tds) - Number(element.emp_modes_data.advance) + Number(element.emp_modes_data.arrear) +
							(Number(total_deductions) * Number(element.emp_present_days) / Number(no_of_days)));
						element.balance = Number(element.emp_salary_payable) - Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total']);
					} else {
						let advance_salary = 0;
						if (item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.advance_details && item.emp_salary_detail.emp_salary_structure.advance_details) {
							const obj: any = item.emp_salary_detail.emp_salary_structure.advance_details;
							const objArr: any[] = item.emp_salary_detail.emp_salary_structure.advance_details;
							if (obj.constructor === Object) {
								console.log('yes adv');
								if (Number(this.session_id.ses_id) === Number(item.emp_salary_detail.emp_salary_structure.advance_details.session_id)) {
									if (Number(this.searchForm.value.month_id) >= Number(item.emp_salary_detail.emp_salary_structure.advance_details.starting_month)) {
										let remaining_advance = item.emp_salary_detail.emp_salary_structure.advance_details.advance;
										let total_advance_deposite = 0;
										if (item.emp_salary_detail.emp_salary_structure.advance_month_wise) {
											for (const dety of item.emp_salary_detail.emp_salary_structure.advance_month_wise) {
												total_advance_deposite = total_advance_deposite + Number(dety.deposite_amount);
											}
											remaining_advance = Math.round(Number(remaining_advance) - Number(total_advance_deposite));
										}
										if (Number(remaining_advance) > 0) {
											if (Number(remaining_advance) > Number(item.emp_salary_detail.emp_salary_structure.advance_details.deposite_month_amount)) {
												advance_salary = Math.round(item.emp_salary_detail.emp_salary_structure.advance_details.deposite_month_amount);

											} else {
												advance_salary = Math.round(item.emp_salary_detail.emp_salary_structure.advance_details.remaining_advance);
											}
										} else {
											advance_salary = 0;
										}
									} else {
										advance_salary = 0;
									}
								} else {
									let remaining_advance = Math.round(item.emp_salary_detail.emp_salary_structure.advance_details.advance);
									let total_advance_deposite = 0;
									if (item.emp_salary_detail.emp_salary_structure.advance_month_wise) {
										for (const dety of item.emp_salary_detail.emp_salary_structure.advance_month_wise) {
											total_advance_deposite = Math.round(total_advance_deposite + Number(dety.deposite_amount));
										}
										remaining_advance = Number(remaining_advance) - Number(total_advance_deposite);
									}
									if (Number(remaining_advance) > 0) {
										if (Number(remaining_advance) > Number(item.emp_salary_detail.emp_salary_structure.advance_details.deposite_month_amount)) {
											advance_salary = item.emp_salary_detail.emp_salary_structure.advance_details.deposite_month_amount;

										} else {
											advance_salary = Math.round(item.emp_salary_detail.emp_salary_structure.advance_details.remaining_advance);
										}
									} else {
										advance_salary = 0;
									}

								}
							}
							if (Array.isArray(objArr)) {

								for (const it of objArr) {
									if (Number(this.session_id.ses_id) === Number(it.session_id)) {
										if (Number(this.searchForm.value.month_id) >= Number(it.starting_month)) {

											let remaining_advance = it.advance;
											let total_advance_deposite = 0;
											if (item.emp_salary_detail.emp_salary_structure.advance_month_wise) {
												for (const dety of item.emp_salary_detail.emp_salary_structure.advance_month_wise) {
													total_advance_deposite = total_advance_deposite + Number(dety.deposite_amount);
												}
												remaining_advance = Math.round(Number(remaining_advance) - Number(total_advance_deposite));
											}
											if (Number(remaining_advance) > 0) {
												if (Number(remaining_advance) > Number(it.deposite_month_amount)) {
													advance_salary += Math.round(it.deposite_month_amount);

												} else {
													advance_salary += Math.round(it.remaining_advance);
												}
											} else {
												advance_salary += 0;
											}
										} else {
											advance_salary += 0;
										}

									} else {

										let remaining_advance = Math.round(it.advance);
										let total_advance_deposite = 0;
										if (item.emp_salary_detail.emp_salary_structure.advance_month_wise) {
											for (const dety of item.emp_salary_detail.emp_salary_structure.advance_month_wise) {
												total_advance_deposite = Math.round(total_advance_deposite + Number(dety.deposite_amount));
											}
											remaining_advance = Number(remaining_advance) - Number(total_advance_deposite);
										}
										if (Number(remaining_advance) > 0) {
											if (Number(remaining_advance) > Number(it.deposite_month_amount)) {
												advance_salary += it.deposite_month_amount;

											} else {
												advance_salary += Math.round(it.remaining_advance);
											}
										} else {
											advance_salary += 0;
										}

									}
								}
							}


						}
						console.log(advance_salary);

						item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.advance_details ? item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.advance_details.deposite_month_amount : 0;

						var salary_payable = 0;
						var no_of_days = this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear());
						emp_present_days = emp_present_days ? emp_present_days : 0;

						total_earnings = total_earnings
						salary_payable = Math.round((((Number(empBasicPay) + total_earnings) * Number(emp_present_days)) / Number(no_of_days)) +
							((Number(total_deductions) * Number(emp_present_days)) / Number(no_of_days)));
						//////console.log('salary_payable',total_earnings, salary_payable);
						element = {
							srno: pos,
							emp_id: item.emp_id,
							emp_code_no: item.emp_code_no ? item.emp_code_no : '-',
							emp_name: item.emp_name,
							emp_salary_compute_month_id: this.searchForm.value.month_id,
							emp_designation: item.emp_designation_detail ? item.emp_designation_detail.name : '',
							emp_pay_scale: item.emp_salary_detail.emp_salary_structure.emp_pay_scale ? item.emp_salary_detail.emp_salary_structure.emp_pay_scale.ss_name : '',
							emp_pay_scale_master: item.emp_salary_detail.emp_salary_structure &&
								item.emp_salary_detail.emp_salary_structure.emp_pay_scale_master &&
								item.emp_salary_detail.emp_salary_structure.emp_pay_scale_master.pay_scale_name ?
								item.emp_salary_detail.emp_salary_structure.emp_pay_scale_master.pay_scale_name : '',
							emp_salary_structure: item.emp_salary_detail.emp_salary_structure,
							emp_salary_heads: item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_salary_heads : [],
							emp_allowances: '',
							empShacolumns: this.empShacolumns,
							empShdcolumns: this.empShdcolumns,
							emp_total_earnings: Math.round((Number(empBasicPay) + total_earnings)),
							emp_total_deductions: Math.round(total_deductions),
							emp_deductions: item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_deduction_detail : [],
							emp_present_days: emp_present_days,
							emp_salary_payable: emp_present_days ? salary_payable : 0,
							emp_pay_mode: item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.emp_pay_mode ? item.emp_salary_detail.emp_salary_structure.emp_pay_mode.pm_name : [],
							emp_modes_data: {
								emp_id: item.emp_id,
								arrear: '',
								td: item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.td ? Math.round(Number(item.emp_salary_detail.emp_salary_structure.td)) : 0,
								tds: this.deductions && this.deductions.tds ?
									(item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.tds ? Math.round(Number(item.emp_salary_detail.emp_salary_structure.tds)) : 0) : 0,
								advance: Math.round(Number(advance_salary)),
								mode_data: []
							},
							emp_total: 0,
							gratuity: this.deductions && this.deductions.gratuity ?
								(item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure
									? Math.round(Number(item.emp_salary_detail.emp_salary_structure.gratuity)) : 0) : 0,
							emp_status: item.emp_status ? item.emp_status : 'live',
							isEditable: editableStatus,
							colorCode: '',
							balance: Number(emp_present_days ? Number(empBasicPay) + salary_payable : 0) - 0,
						};
						element.emp_total_earnings = Math.round(element.emp_total_earnings + element.emp_modes_data.td);
						this.tAr.push(element.emp_modes_data.arrear);
						this.tdArr.push(element.emp_modes_data.td);
						this.totalEarnings.push(element.emp_total_earnings);
						element.emp_salary_payable = Math.round((Number(element.emp_total_earnings) * Number(element.emp_present_days) / Number(no_of_days))
							- Number(element.emp_modes_data.tds) - Number(element.emp_modes_data.advance) + Number(element.emp_modes_data.arrear) +
							(Number(total_deductions) * Number(element.emp_present_days) / Number(no_of_days)));
						element.balance = Number(element.emp_present_days ? Math.round(Number(empBasicPay) + element.emp_salary_payable) : 0) - 0;
						if (element) {
							var deduction = 0;
							let empPaymentModeDetail: any[] = [];
							if (item.emp_salary_detail && item.emp_salary_detail.empPaymentModeDetail && item.emp_salary_detail.empPaymentModeDetail.length > 0) {
								empPaymentModeDetail = item.emp_salary_detail.empPaymentModeDetail;
							}
							for (let pi = 0; pi < this.paymentModeArray.length; pi++) {
								console.log(this.getCalculationType(item, this.paymentModeArray[pi]['config_id']));
								let curpaymetmode = empPaymentModeDetail.find(e => e.pay_mode == this.paymentModeArray[pi]['config_id'] &&
									e.transfer_type === this.paymentModeArray[pi]['transfer_id']);
								if (curpaymetmode) {
									if (Number(this.getCalculationType(item, this.paymentModeArray[pi]['config_id'])) === 2) { // % type
										var inputJson = {
											'pm_id': this.paymentModeArray[pi]['pm_id'],
											'pm_name': this.paymentModeArray[pi]['pm_name'],
											'pm_value': Math.round((Number(element.emp_salary_payable) * Number(curpaymetmode['value'])) / 100),
											'calculation_type': this.getCalculationType(item, this.paymentModeArray[pi]['config_id']),
											'calculation_value': curpaymetmode['value'],
											'transfer_type': curpaymetmode['transfer_id']
										};
										console.log(inputJson);
										element.emp_modes_data.mode_data.push(inputJson);
										if (element.emp_modes_data.mode_data[pi]) {
											deduction = Math.round(deduction + Number(element.emp_modes_data.mode_data[pi]['pm_value']));
										}

										//element.balance = (Number(emp_present_days ? Number(empBasicPay) + salary_payable : 0) - 0) - deduction;
										element.balance = element.emp_salary_payable - deduction;
										element.emp_total = deduction;

										formJson[this.paymentModeArray[pi]['pm_id']] = Math.round((Number(element.emp_salary_payable) * Number(curpaymetmode['value'])) / 100)
										////console.log(formJson);

									} else {
										//////console.log(this.paymentModeArray[pi]['calculation_value']);
										var tdeduction = 0;
										var inputJson = {
											'pm_id': this.paymentModeArray[pi]['pm_id'],
											'pm_name': this.paymentModeArray[pi]['pm_name'],
											'pm_value': Number(curpaymetmode['value']),
											'calculation_type': this.getCalculationType(item, this.paymentModeArray[pi]['config_id']),
											'calculation_value': curpaymetmode['value'],
											'transfer_type': this.paymentModeArray[pi]['transfer_type']
										};
										console.log(inputJson);
										formJson[this.paymentModeArray[pi]['pm_id']] = 0;
										element.emp_modes_data.mode_data.push(inputJson);

										tdeduction = Math.round(Number(element.emp_modes_data.mode_data[pi]['pm_value']));

										element.balance = Math.round(element.balance - tdeduction);
									}

								} else {
									//////console.log(this.paymentModeArray[pi]['calculation_value']);
									var tdeduction = 0;
									var inputJson = {
										'pm_id': this.paymentModeArray[pi]['pm_id'],
										'pm_name': this.paymentModeArray[pi]['pm_name'],
										'pm_value': 0,
										'calculation_type': null,
										'calculation_value': null,
										'transfer_type': this.paymentModeArray[pi]['transfer_type']
									};

									formJson[this.paymentModeArray[pi]['pm_id']] = 0;
									element.emp_modes_data.mode_data.push(inputJson);

									tdeduction = Math.round(Number(element.emp_modes_data.mode_data[pi]['pm_value']));

									element.balance = Math.round(element.balance - tdeduction);
								}
							}
							formJson['td'] = item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.td ?
								Math.round(item.emp_salary_detail.emp_salary_structure.td) : 0,
								formJson['tds'] = item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.tds ? Math.round(item.emp_salary_detail.emp_salary_structure.tds) : 0,
								formJson['advance'] = advance_salary.toString();
							this.formGroupArray[pos - 1] = this.fbuild.group(formJson);
							//console.log(this.formGroupArray, '2345');
						}
					}


					this.SALARY_COMPUTE_ELEMENT.push(element);
					pos++;
				}

				////console.log('this.SALARY_COMPUTE_ELEMENT', this.SALARY_COMPUTE_ELEMENT);
				this.footerrow = {
					emp_salary_payable: this.SALARY_COMPUTE_ELEMENT.reduce((a, b) => a + Number(b.emp_salary_payable || 0), 0),
					emp_total_earnings: this.SALARY_COMPUTE_ELEMENT.reduce((a, b) => a + Number(b.emp_total_earnings || 0), 0),
					balance: this.SALARY_COMPUTE_ELEMENT.reduce((a, b) => a + Number(b.balance || 0), 0)
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
	getArrearTotal() {
		let ttotal = 0;
		for (let i = 0; i < this.formGroupArray.length; i++) {
			ttotal += Number(this.formGroupArray[i].value.arrear);
		}
		return ttotal;
	}
	getTDSTotal() {
		let ttotal = 0;
		for (let i = 0; i < this.formGroupArray.length; i++) {
			ttotal += Number(this.formGroupArray[i].value.tds);
		}
		return ttotal;
	}
	getTATotal() {
		let ttotal = 0;
		for (let i = 0; i < this.formGroupArray.length; i++) {
			ttotal += Number(this.formGroupArray[i].value.td);
		}
		return ttotal;
	}

	salaryheadGT(index) {
		return this.SALARY_COMPUTE_ELEMENT.reduce((a, b) => a + Number(b.empShacolumns[index]['value'] || 0), 0);
	}

	deductionGT(index) {
		return this.SALARY_COMPUTE_ELEMENT.reduce((a, b) => a + (
			Math.round(Number(b.empShdcolumns[index]['value']
				* Number(b.emp_present_days) / this.nod)) || 0), 0);
	}

	salarypayableGT() {
		return this.SALARY_COMPUTE_ELEMENT.reduce((a, b) => a + Number(b.emp_salary_payable || 0), 0);
	}

	balanceGT() {
		return this.SALARY_COMPUTE_ELEMENT.reduce((a, b) => a + Number(b.balance || 0), 0);
	}

	emptotalGT() {
		return this.SALARY_COMPUTE_ELEMENT.reduce((a, b) => a + Number(b.emp_total || 0), 0);
	}
	getShdData(element, index) {
		if (element && element.empShdcolumns[index]['value']) {
			return Math.round((Number(element.empShdcolumns[index]['value']) * Number(element.emp_present_days)
				/ Number(this.nod)));
		} else {
			return 0;
		}
	}
	checkForFilter() {
		// ////console.log('searchByFilter--', this.searchByFilter);
		this.nod = this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear());
		if (!this.searchByFilter) {
			this.searchWithoutFilter();
		} else {
			////console.log(Object.keys(this.filterJson).length);
			if (this.searchByFilter) {
				if (Object.keys(this.filterJson).length === 0) {
					this.searchModal.openModal();
				} else {
					this.searchOk(this.filterJson);
				}
			}
			

		}
		if (Number(this.searchForm.value.month_id) === 1
			|| Number(this.searchForm.value.month_id) === 2
			|| Number(this.searchForm.value.month_id) === 3) {
			this.currSess = this.sessionName.split('-')[1];
		} else {
			this.currSess = this.sessionName.split('-')[0];
		}
		this.getChartsOfAccount();
	}
	getVcName(vcData, voucherEntryArray) {
		let vcType = '';
		const vcTypeArr = this.currentVcType.split(" ");
		if (vcTypeArr.length > 0) {
			vcTypeArr.forEach(element => {
				vcType += element.substring(0, 1).toUpperCase();
			});
		}
		//vcType = (this.currentVcType.split(" ")[0].substring(0,1)+this.currentVcType.split(" ")[1].substring(0,1)).toUpperCase();
		let currentSessionFirst = this.sessionName.split('-')[0];
		let currentSessionSecond = this.sessionName.split('-')[1];
		var nYear: any = '';
		var month_id = this.searchForm.value.month_id;
		if ((Number(month_id) != 1) && (Number(month_id) != 2) && (Number(month_id) != 3)) {
			nYear = currentSessionFirst;
		} else {
			nYear = currentSessionSecond;
		}
		const monthNames = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];
		var no_of_days = new Date(nYear, month_id, 0).getDate();


		let vcDay = no_of_days;
		let vcMonth = monthNames[Number(month_id) - 1].substring(0, 3);
		let vcYear = nYear;
		let vcNumber = vcData.vc_code;
		this.vcData = { vc_code: vcData.vc_code, vc_name: vcType + '/' + vcDay + '/' + vcMonth + '/' + vcYear + '/' + ((vcNumber.toString()).padStart(4, '0')), vc_date: nYear + '-' + (month_id).padStart(2, '0') + '-' + no_of_days, vc_month: monthNames[Number(month_id)] };
		console.log(voucherEntryArray, 'test');


		if (this.vcData) {
			var fJson = {
				vc_id: null,
				vc_type: 'Journal Voucher',
				vc_number: { vc_code: this.vcData.vc_code, vc_name: this.vcData.vc_name },
				vc_date: this.vcData.vc_date,
				vc_narrations: 'Salary Computation of Month ' + vcMonth,
				vc_attachments: [],
				vc_particulars_data: voucherEntryArray,
				vc_state: 'draft'
			}


			console.log('fjJson--', fJson);
			this.erpCommonService.insertVoucherEntry(fJson).subscribe((data: any) => {
				if (data) {
					this.commonAPIService.showSuccessErrorMessage('Voucher entry Published Successfully', 'success');


				} else {
					this.commonAPIService.showSuccessErrorMessage('Error While Publish Voucher Entry', 'error');
				}
			});
		}


	}
	getVoucherTypeMaxId(voucherEntryArray) {
		let param: any = {};
		param.vc_type = this.currentVcType;
		let flag = 0;
		let result: any;

		this.commonAPIService.getVoucherTypeMaxId(param).subscribe((data: any) => {
			if (data) {
				flag = 1;
				result = data;

				this.getVcName(result, voucherEntryArray);

			}
		});

	}
	async confirm() {
		this.disabledApiButton = true;
		var empArr = [];
		let inputArr: any[] = [];
		let empJson = {};
		let monthWiseAdvance = [];
		var edit = false;
		let inputJson = {};
		var finJson = {};
		var validationStatus = false;
		for (var i = 0; i < this.SALARY_COMPUTE_ELEMENT.length; i++) {
			if (this.SALARY_COMPUTE_ELEMENT[i]['colorCode']) {
				this.commonAPIService.showSuccessErrorMessage('Please Correct Higlighted Employee Salary Total Amount, Should not be gretaer than Salary Payble', 'error');
				validationStatus = true;
				this.disabledApiButton = false;
			}
		}
		if (!validationStatus) {
			for (var i = 0; i < this.SALARY_COMPUTE_ELEMENT.length; i++) {
				monthWiseAdvance = [];
				empJson = {};
				let inputJson = {};
				monthWiseAdvance = this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure'].advance_month_wise ? this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure'].advance_month_wise : [];
				const findex = monthWiseAdvance.findIndex(f => Number(f.month_id) === Number(this.searchForm.value.month_id) && Number(f.currentYear) === Number(this.currentYear));
				if (findex !== -1) {
					monthWiseAdvance[findex] = {
						'month_id': this.searchForm.value.month_id,
						'deposite_amount': this.formGroupArray[i]['value']['advance'],
						'currentYear': this.currentYear,
						'session_id': this.session_id.ses_id
					}
				} else {
					monthWiseAdvance.push({
						'month_id': this.searchForm.value.month_id,
						'deposite_amount': this.formGroupArray[i]['value']['advance'],
						'currentYear': this.currentYear,
						'session_id': this.session_id.ses_id
					});
				}

				empJson["emp_salary_detail.emp_salary_structure.advance_month_wise"] = monthWiseAdvance;
				empJson["emp_id"] = this.SALARY_COMPUTE_ELEMENT[i].emp_id;
				empJson["emp_salary_detail.emp_salary_structure.emp_pay_scale"] = {
					pc_id: this.SALARY_COMPUTE_ELEMENT[i] &&
						this.SALARY_COMPUTE_ELEMENT[i] &&
						this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure'] &&
						this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure']['emp_pay_scale'] &&
						this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure']['emp_pay_scale']['ss_id'] ?
						this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure']['emp_pay_scale']['ss_id'] : '',
					pc_name: this.SALARY_COMPUTE_ELEMENT[i] &&
						this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure'] &&
						this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure']['emp_pay_scale'] &&
						this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure']['emp_pay_scale']['ss_name'] ?
						this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure']['emp_pay_scale']['ss_name'] : '',
				};
				empArr.push(empJson);
				inputJson = this.SALARY_COMPUTE_ELEMENT[i];
				inputJson['emp_modes_data']['emp_id'] = this.formGroupArray[i]['value']['emp_id'];
				inputJson['emp_modes_data']['arrear'] = Number(this.formGroupArray[i]['value']['arrear']);
				inputJson['emp_modes_data']['td'] = Number(this.formGroupArray[i]['value']['td']);
				inputJson['emp_modes_data']['tds'] = Number(this.formGroupArray[i]['value']['tds']);
				inputJson['emp_modes_data']['advance'] = Number(this.formGroupArray[i]['value']['advance']);
				inputJson['emp_modes_data']['mode_data'] = [];
				if (this.SALARY_COMPUTE_ELEMENT[i]['isEditable']) {
					edit = true;
				} else {
					edit = false;
				}
				for (var j = 0; j < this.paymentModeArray.length; j++) {
					if (Object.keys(this.formGroupArray[i]['value']).indexOf(this.paymentModeArray[j]['pm_id']) > -1) {
						inputJson['emp_modes_data']['mode_data'].push(
							{
								pm_id: this.paymentModeArray[j]['pm_id'], pm_name: this.paymentModeArray[j]['pm_name'], pm_value: Number(this.formGroupArray[i]['value'][this.paymentModeArray[j]['pm_id']]),
								config_id: this.paymentModeArray[j]['config_id'],
								pm_acc_name: this.paymentModeArray[j]['pm_acc_name'],
							}
						)
					}
				}
				inputArr.push({
					emp_id: this.SALARY_COMPUTE_ELEMENT[i].emp_id,
					session_id: this.session_id.ses_id,
					emp_salary_compute_month_id: this.searchForm.value.month_id,
					emp_salary_compute_data: inputJson
				});
			}
			finJson['emp_salary_compute_month_id'] = this.searchForm.value.month_id;
			finJson['emp_salary_compute_data'] = inputArr;
			console.log(', this.salaryHeadsArr--', this.salaryHeadsArr);
			var salaryDedArr = [];
			for (var i = 0; i < this.salaryHeadsArr.length; i++) {

				if (Number(this.salaryHeadsArr[i]['sc_type']['type_id']) === 2) {
					salaryDedArr.push(this.salaryHeadsArr[i]['sc_name']);
				}
			}
			if (this.chartsOfAccount.length > 0) {
				var voucherEntryArray = [];
				console.log('this.chart', this.chartsOfAccount, this.salaryHeadsArr, salaryDedArr);
				for (let i = 0; i < this.chartsOfAccount.length; i++) {
					console.log(this.chartsOfAccount[i]['coa_dependencies'][0]['dependency_name']);
					if (this.chartsOfAccount[i]['coa_dependencies'][0]['dependency_name'] === 'Salary A/C') {
						var salary_total = 0;
						for (var ci = 0; ci < finJson['emp_salary_compute_data'].length; ci++) {
							salary_total = salary_total + finJson['emp_salary_compute_data'][ci]['emp_total_earnings'];

						}
						if (salary_total > 0) {
							let vFormJson = {};
							vFormJson = {
								vc_account_type: this.chartsOfAccount[i]['coa_acc_name'],
								vc_account_type_id: this.chartsOfAccount[i]['coa_id'],
								vc_particulars: 'salary a/c',
								vc_grno: '',
								vc_invoiceno: '',
								vc_debit: salary_total,
								vc_credit: 0
							};
							voucherEntryArray.push(vFormJson);
						}

					}
					if (this.chartsOfAccount[i]['coa_dependencies'][0]['dependency_name'] === 'Salary Payable') {
						var salary_pay_total = 0;
						for (var ci = 0; ci < finJson['emp_salary_compute_data'].length; ci++) {
							salary_pay_total = salary_pay_total + finJson['emp_salary_compute_data'][ci]['emp_salary_payable'];

						}
						if (salary_pay_total) {
							let vFormJson = {};
							vFormJson = {
								vc_account_type: this.chartsOfAccount[i]['coa_acc_name'],
								vc_account_type_id: this.chartsOfAccount[i]['coa_id'],
								vc_particulars: 'salary payable',
								vc_grno: '',
								vc_invoiceno: '',
								vc_debit: salary_pay_total,
								vc_credit: 0
							};
							voucherEntryArray.push(vFormJson);
						}

					}

					if (salaryDedArr.indexOf(this.chartsOfAccount[i]['coa_dependencies'][0]['dependency_name']) > -1) {
						var salary_total = 0;
						for (var ci = 0; ci < finJson['emp_salary_compute_data'].length; ci++) {
							for (var cj = 0; cj < finJson['emp_salary_compute_data'][ci]['empShdcolumns'].length; cj++) {

								if (finJson['emp_salary_compute_data'][ci]['empShdcolumns'][cj]['header'] === this.chartsOfAccount[i]['coa_dependencies'][0]['dependency_name'])
									salary_total = salary_total + Number(finJson['emp_salary_compute_data'][ci]['empShdcolumns'][cj]['value']);

							}


						}
						if (salary_total != 0) {
							let vFormJson = {};
							vFormJson = {
								vc_account_type: this.chartsOfAccount[i]['coa_acc_name'],
								vc_account_type_id: this.chartsOfAccount[i]['coa_id'],
								vc_particulars: 'salary a/c',
								vc_grno: '',
								vc_invoiceno: '',
								vc_debit: salary_total,
								vc_credit: 0
							};
							console.log('vFormJson--deduction', vFormJson);
							voucherEntryArray.push(vFormJson);
						}

					}
					if (this.chartsOfAccount[i]['coa_dependencies'][0]['dependency_name'] === 'Advance') {
						var advance_total = 0;
						for (var ci = 0; ci < finJson['emp_salary_compute_data'].length; ci++) {
							advance_total = advance_total + Number(finJson['emp_salary_compute_data'][ci]['emp_modes_data']['advance']);
							if (advance_total != 0) {
								let vFormJson = {};
								vFormJson = {
									vc_account_type: this.chartsOfAccount[i]['coa_acc_name'],
									vc_account_type_id: this.chartsOfAccount[i]['coa_id'],
									vc_particulars: 'advance',
									vc_grno: '',
									vc_invoiceno: '',
									vc_debit: advance_total,
									vc_credit: 0
								};
								voucherEntryArray.push(vFormJson);
							}
						}

					}
					if (this.chartsOfAccount[i]['coa_dependencies'][0]['dependency_name'] === 'Arrear') {
						var arrear_total = 0;
						for (var ci = 0; ci < finJson['emp_salary_compute_data'].length; ci++) {
							arrear_total = arrear_total + Number(finJson['emp_salary_compute_data'][ci]['emp_modes_data']['arrear']);
							if (arrear_total != 0) {
								let vFormJson = {};
								vFormJson = {
									vc_account_type: this.chartsOfAccount[i]['coa_acc_name'],
									vc_account_type_id: this.chartsOfAccount[i]['coa_id'],
									vc_particulars: 'arrear',
									vc_grno: '',
									vc_invoiceno: '',
									vc_debit: arrear_total,
									vc_credit: 0
								};
								voucherEntryArray.push(vFormJson);
							}
						}

					}
				}
				this.getVoucherTypeMaxId(voucherEntryArray);

			}

			var tempPMArr = [];
			for (var i = 0; i < 1; i++) {
				for (var j = 0; j < finJson['emp_salary_compute_data'][i]['emp_modes_data']['mode_data'].length; j++) {
					tempPMArr.push(finJson['emp_salary_compute_data'][i]['emp_modes_data']['mode_data'][j]['pm_name']);
				}
			}

			if (this.paymentModeAccount.length > 0) {
				var paymentParticularData = [];
				// console.log('finJson salarycompute data==', finJson['emp_salary_compute_data'])
				// console.log('paymentModeAccount--', this.paymentModeAccount)
				for (var i = 0; i < this.paymentModeAccount.length; i++) {
					var amt_total = 0;
					// console.log('dependancey_name===', this.paymentModeAccount[i]['coa_dependencies'][0]['dependency_name'])
					for (var j = 0; j < finJson['emp_salary_compute_data'].length; j++) {

						for (var k = 0; k < finJson['emp_salary_compute_data'][j]['emp_modes_data']['mode_data'].length; k++) {
							// console.log(finJson['emp_salary_compute_data'][j]['emp_modes_data']['mode_data'][k]['pm_acc_name'] == this.paymentModeAccount[i]['coa_dependencies'][0]['dependency_name'], finJson['emp_salary_compute_data'][j]['emp_modes_data']['mode_data'][k]['pm_acc_name'] , this.paymentModeAccount[i]['coa_dependencies'][0]['dependency_name']);
							if (finJson['emp_salary_compute_data'][j]['emp_modes_data']['mode_data'][k]['pm_acc_name'] == this.paymentModeAccount[i]['coa_dependencies'][0]['dependency_name']) {
								// console.log('in1111');
								amt_total = amt_total + Number(finJson['emp_salary_compute_data'][j]['emp_modes_data']['mode_data'][k]['pm_value'] ? finJson['emp_salary_compute_data'][j]['emp_modes_data']['mode_data'][k]['pm_value'] : 0);
								console.log('amt_total--', amt_total, this.paymentModeAccount[i]['coa_dependencies'][0]['dependency_name']);
							}

						}
					}

					let vFormJson = {};
					vFormJson = {
						vc_account_type: this.paymentModeAccount[i]['coa_acc_name'],
						vc_account_type_id: this.paymentModeAccount[i]['coa_id'],
						vc_particulars: this.paymentModeAccount[i]['coa_acc_name'] + 'salary distribution',
						vc_grno: '',
						vc_invoiceno: '',
						vc_debit: '',
						vc_credit: amt_total
					};
					paymentParticularData.push(vFormJson);
					console.log('paymentParticularData--', vFormJson);
				}
				this.getVoucherTypeMaxId(paymentParticularData);

			}
			if (!edit) {
				this.commonAPIService.insertInBulk(inputArr).subscribe((result: any) => {
					this.disabledApiButton = false;
					this.commonAPIService.updateEmployeeDatainBulk(empArr).subscribe((result: any) => {
						this.commonAPIService.showSuccessErrorMessage('Salary Compute Successfully', 'success');
						this.checkForFilter();
					});
				});
			} else {
				this.commonAPIService.updateInBulk(inputArr).subscribe((result: any) => {
					this.disabledApiButton = false;
					this.commonAPIService.updateEmployeeDatainBulk(empArr).subscribe((result: any) => {
						this.checkForFilter();
						this.commonAPIService.showSuccessErrorMessage('Salary Compute Successfully', 'success');
					});
				});
			}
		}


	}

	searchWithoutFilter() {
		if (this.searchForm.value.month_id) {
			let inputJson = {
				'month_id': this.searchForm.value.month_id
			};

			this.commonAPIService.getSalaryCompute(inputJson).subscribe((result: any) => {
				if (result) {
					this.salaryComputeEmployeeData = result;
					for (var i = 0; i < result.length; i++) {
						this.salaryComputeEmployeeIds.push(Number(result[i]['emp_salary_compute_data']['emp_id']));
					}
					this.getAllEmployee();
				} else {
					this.salaryComputeEmployeeData = [];
					this.getAllEmployee();
				}

			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please Choose Pay Month', 'error');
		}

	}

	// getSalaryComputeEmployee() {

	// }

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
				this.SALARY_COMPUTE_ELEMENT[i]['emp_total'] = 0;
				for (var j = 0; j < this.paymentModeArray.length; j++) {
					if (Object.keys(this.formGroupArray[i]['value']).indexOf(this.paymentModeArray[j]['pm_id']) > -1) {
						this.SALARY_COMPUTE_ELEMENT[i]['emp_total'] = Math.round(Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_total']) + Number(this.formGroupArray[i]['value'][this.paymentModeArray[j]['pm_id']]));
						this.SALARY_COMPUTE_ELEMENT[i]['balance'] = Math.round(Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable']) - Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_total']));
						if (element['emp_total'] > element['emp_salary_payable']) {
							element.colorCode = 'rgb(252, 191, 188)';
						} else {
							element.colorCode = '';
						}
					} else {
						this.SALARY_COMPUTE_ELEMENT[i]['emp_total'] = Math.round(Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_total']) + 0);

						this.SALARY_COMPUTE_ELEMENT[i]['balance'] = Math.round(Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable']) - Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_total']));
					}
				}
			}
		}


	}


	setNetPerTA(element, event) {

		var value = 0;
		if (event.target.value) {

			value = event.target.value;

			for (var i = 0; i < this.SALARY_COMPUTE_ELEMENT.length; i++) {
				if (Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_id']) === Number(element.emp_id)) {
					//this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable'] = Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable']) + Number(value)
					var total_earnings = 0;
					total_earnings = Number(this.totalEarnings[i]);
					var no_of_days = this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear());
					let tdValue = value || 0;
					let tdsValue = this.formGroupArray[i].value.tds || 0;
					let arrearValue = this.formGroupArray[i].value.arrear || 0;
					let advanceValue = this.formGroupArray[i].value.advance || 0;

					if (this.tdArr[i] < tdValue) {
						this.SALARY_COMPUTE_ELEMENT[i]['emp_total_earnings'] = Math.round(Number(total_earnings) + Number(tdValue));
					} else if (this.tdArr[i] > tdValue) {
						this.SALARY_COMPUTE_ELEMENT[i]['emp_total_earnings'] = Math.round(Number(total_earnings) - (Number(this.tdArr[i] - Number(tdValue))));
					} else {
						this.SALARY_COMPUTE_ELEMENT[i]['emp_total_earnings'] = Math.round(Number(total_earnings));
					}
					//this.SALARY_COMPUTE_ELEMENT[i]['balance'] = this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable'];
					this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable'] = Math.round((((Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_total_earnings'])) * (Number(element.emp_present_days)) / Number(no_of_days))) + Number(arrearValue) - Number(advanceValue) - Number(tdsValue) +
						(Number(element.emp_total_deductions) * (Number(element.emp_present_days) / Number(no_of_days))));
					this.SALARY_COMPUTE_ELEMENT[i]['emp_total'] = 0;
					this.SALARY_COMPUTE_ELEMENT[i]['emp_total'] = Math.round(((Number(total_earnings)) * (Number(element.emp_present_days) / Number(no_of_days))) + Number(arrearValue) - Number(advanceValue) + Number(tdValue) - Number(tdsValue) +
						Number(element.emp_total_deductions) * (Number(element.emp_present_days) / Number(no_of_days)));
					if (element) {
						const formJson: any = {};
						var deduction = 0;
						let empPaymentModeDetail: any[] = [];
						if (this.records[i].emp_salary_detail && this.records[i].emp_salary_detail.empPaymentModeDetail && this.records[i].emp_salary_detail.empPaymentModeDetail.length > 0) {
							empPaymentModeDetail = this.records[i].emp_salary_detail.empPaymentModeDetail;
						}

						for (let pi = 0; pi < this.paymentModeArray.length; pi++) {

							let curpaymetmode = empPaymentModeDetail.find(
								e => e.pay_mode == this.paymentModeArray[pi]['config_id'] &&
									e.transfer_type === this.paymentModeArray[pi]['transfer_id']);
							if (curpaymetmode) {
								if (Number(this.getCalculationType(this.records[i], this.paymentModeArray[pi]['config_id'])) === 2) { // % type
									var inputJson = {
										'pm_id': this.paymentModeArray[pi]['pm_id'],
										'pm_name': this.paymentModeArray[pi]['pm_name'],
										'pm_value': Math.round((Number(element.emp_salary_payable) * Number(curpaymetmode['value'])) / 100),
										'calculation_type': this.getCalculationType(this.records[i], this.paymentModeArray[pi]['config_id']),
										'calculation_value': curpaymetmode['value'],
										'transfer_type': curpaymetmode['transfer_id']
									};
									console.log(inputJson);
									element.emp_modes_data.mode_data.push(inputJson);
									if (element.emp_modes_data.mode_data[pi]) {
										deduction = Math.round(deduction + Number(element.emp_modes_data.mode_data[pi]['pm_value']));
									}

									//element.balance = (Number(emp_present_days ? Number(empBasicPay) + salary_payable : 0) - 0) - deduction;
									element.balance = Math.round(element.emp_salary_payable - deduction);
									element.emp_total = Math.round(deduction);

									this.formGroupArray[i]['value'][this.paymentModeArray[pi]['pm_id']] = Math.round((Number(element.emp_salary_payable) * Number(curpaymetmode['value'])) / 100)
									////console.log(formJson);

								} else {
									//////console.log(this.paymentModeArray[pi]['calculation_value']);
									var tdeduction = 0;
									var inputJson = {
										'pm_id': this.paymentModeArray[pi]['pm_id'],
										'pm_name': this.paymentModeArray[pi]['pm_name'],
										'pm_value': Number(curpaymetmode['value']),
										'calculation_type': this.getCalculationType(this.records[i], this.paymentModeArray[pi]['config_id']),
										'calculation_value': curpaymetmode['value'],
										'transfer_type': this.paymentModeArray[pi]['transfer_id']
									};
									console.log(inputJson);
									this.formGroupArray[i]['value'][this.paymentModeArray[pi]['pm_id']] = 0;
									element.emp_modes_data.mode_data.push(inputJson);

									tdeduction = Math.round(Number(element.emp_modes_data.mode_data[pi]['pm_value']));

									element.balance = Math.round(element.balance - tdeduction);
								}

							} else {
								//////console.log(this.paymentModeArray[pi]['calculation_value']);
								var tdeduction = 0;
								var inputJson = {
									'pm_id': this.paymentModeArray[pi]['pm_id'],
									'pm_name': this.paymentModeArray[pi]['pm_name'],
									'pm_value': 0,
									'calculation_type': null,
									'calculation_value': null,
									'transfer_type': this.paymentModeArray[pi]['transfer_id']
								};

								this.formGroupArray[i]['value'][this.paymentModeArray[pi]['pm_id']] = 0;
								element.emp_modes_data.mode_data.push(inputJson);

								tdeduction = Math.round(Number(element.emp_modes_data.mode_data[pi]['pm_value']));

								element.balance = Math.round(element.balance - tdeduction);
							}
						}
						this.formGroupArray[i]['value']['td'] = Math.round(tdValue);
						//formJson['tds'] = this.records[i].emp_salary_detail.emp_salary_structure && this.records[i].emp_salary_detail.emp_salary_structure.tds ? this.records[i].emp_salary_detail.emp_salary_structure.tds : 0,
						// formJson['advance'] = advance_salary.toString();
						//this.formGroupArray[i] = this.fbuild.group(formJson);
						console.log(this.formGroupArray[i]);
						if (element['emp_total'] > element['emp_salary_payable']) {
							element.colorCode = 'rgb(252, 191, 188)';
						}
						//console.log(this.formGroupArray, '2345');
					}
				}
			}
			this.setNetTotal(element, event);
		}
	}
	setNetPerAdv(element, event) {

		var value = 0;
		if (event.target.value) {

			value = event.target.value;

			for (var i = 0; i < this.SALARY_COMPUTE_ELEMENT.length; i++) {
				if (Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_id']) === Number(element.emp_id)) {
					//this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable'] = Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable']) + Number(value)
					var total_earnings = 0;
					total_earnings = Number(this.totalEarnings[i]);
					var no_of_days = this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear());
					let tdValue = this.formGroupArray[i].value.td || 0;
					let tdsValue = this.formGroupArray[i].value.tds || 0;
					let arrearValue = this.formGroupArray[i].value.arrear || 0;
					let advanceValue = value || 0;


					//this.SALARY_COMPUTE_ELEMENT[i]['balance'] = this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable'];
					this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable'] = Math.round((((Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_total_earnings'])) * (Number(element.emp_present_days)) / Number(no_of_days))) + Number(arrearValue) - Number(advanceValue) - Number(tdsValue) +
						(Number(element.emp_total_deductions) * (Number(element.emp_present_days) / Number(no_of_days))));
					this.SALARY_COMPUTE_ELEMENT[i]['emp_total'] = 0;
					this.SALARY_COMPUTE_ELEMENT[i]['emp_total'] = Math.round(((Number(total_earnings)) * (Number(element.emp_present_days) / Number(no_of_days))) + Number(arrearValue) - Number(advanceValue) + Number(tdValue) - Number(tdsValue) +
						(Number(element.emp_total_deductions) * (Number(element.emp_present_days) / Number(no_of_days))));
					if (element) {
						const formJson: any = {};
						var deduction = 0;
						let empPaymentModeDetail: any[] = [];
						if (this.records[i].emp_salary_detail && this.records[i].emp_salary_detail.empPaymentModeDetail && this.records[i].emp_salary_detail.empPaymentModeDetail.length > 0) {
							empPaymentModeDetail = this.records[i].emp_salary_detail.empPaymentModeDetail;
						}
						for (let pi = 0; pi < this.paymentModeArray.length; pi++) {
							console.log(this.getCalculationType(this.records[i], this.paymentModeArray[pi]['config_id']));
							let curpaymetmode = empPaymentModeDetail.find(
								e => e.pay_mode == this.paymentModeArray[pi]['config_id'] &&
									e.transfer_type === this.paymentModeArray[pi]['transfer_id']);
							if (curpaymetmode) {
								if (Number(this.getCalculationType(this.records[i], this.paymentModeArray[pi]['config_id'])) === 2) { // % type
									var inputJson = {
										'pm_id': this.paymentModeArray[pi]['pm_id'],
										'pm_name': this.paymentModeArray[pi]['pm_name'],
										'pm_value': Math.round((Number(element.emp_salary_payable) * Number(curpaymetmode['value'])) / 100),
										'calculation_type': this.getCalculationType(this.records[i], this.paymentModeArray[pi]['config_id']),
										'calculation_value': curpaymetmode['value'],
										'transfer_type': curpaymetmode['transfer_id']
									};
									console.log(inputJson);
									element.emp_modes_data.mode_data.push(inputJson);
									if (element.emp_modes_data.mode_data[pi]) {
										deduction = Math.round(deduction + Number(element.emp_modes_data.mode_data[pi]['pm_value']));
									}

									//element.balance = (Number(emp_present_days ? Number(empBasicPay) + salary_payable : 0) - 0) - deduction;
									element.balance = Math.round(element.emp_salary_payable - deduction);
									element.emp_total = Math.round(deduction);

									this.formGroupArray[i]['value'][this.paymentModeArray[pi]['pm_id']] = Math.round((Number(element.emp_salary_payable) * Number(curpaymetmode['value'])) / 100)
									////console.log(formJson);

								} else {
									//////console.log(this.paymentModeArray[pi]['calculation_value']);
									var tdeduction = 0;
									var inputJson = {
										'pm_id': this.paymentModeArray[pi]['pm_id'],
										'pm_name': this.paymentModeArray[pi]['pm_name'],
										'pm_value': Number(curpaymetmode['value']),
										'calculation_type': this.getCalculationType(this.records[i], this.paymentModeArray[pi]['config_id']),
										'calculation_value': curpaymetmode['value'],
										'transfer_type': curpaymetmode['transfer_id']
									};
									console.log(inputJson);
									this.formGroupArray[i]['value'][this.paymentModeArray[pi]['pm_id']] = 0;
									element.emp_modes_data.mode_data.push(inputJson);

									tdeduction = Math.round(Number(element.emp_modes_data.mode_data[pi]['pm_value']));

									element.balance = Math.round(element.balance - tdeduction);
								}

							} else {
								//////console.log(this.paymentModeArray[pi]['calculation_value']);
								var tdeduction = 0;
								var inputJson = {
									'pm_id': this.paymentModeArray[pi]['pm_id'],
									'pm_name': this.paymentModeArray[pi]['pm_name'],
									'pm_value': 0,
									'calculation_type': null,
									'calculation_value': null,
									'transfer_type': this.paymentModeArray[pi]['transfer_id']
								};

								this.formGroupArray[i]['value'][this.paymentModeArray[pi]['pm_id']] = 0;
								element.emp_modes_data.mode_data.push(inputJson);

								tdeduction = Math.round(Number(element.emp_modes_data.mode_data[pi]['pm_value']));

								element.balance = Math.round(element.balance - tdeduction);
							}
						}

						this.formGroupArray[i]['value']['advance'] = Math.round(Number(advanceValue));
						//this.formGroupArray[i] = this.fbuild.group(formJson);
						if (element['emp_total'] > element['emp_salary_payable']) {
							element.colorCode = 'rgb(252, 191, 188)';
						}
						//console.log(this.formGroupArray, '2345');
					}
				}
			}
			this.setNetTotal(element, event);
		}
	}
	setNetPerTDS(element, event) {

		var value = 0;
		if (event.target.value) {

			value = event.target.value;

			for (var i = 0; i < this.SALARY_COMPUTE_ELEMENT.length; i++) {
				if (Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_id']) === Number(element.emp_id)) {
					//this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable'] = Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable']) + Number(value)
					var total_earnings = 0;
					total_earnings = Number(this.totalEarnings[i]);
					var no_of_days = this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear());

					let tdsValue = value || 0;
					let arrearValue = this.formGroupArray[i].value.arrear || 0;
					let advanceValue = this.formGroupArray[i].value.advance || 0;
					console.log(tdsValue);

					//this.SALARY_COMPUTE_ELEMENT[i]['balance'] = this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable'];
					this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable'] = Math.round(((Number(element['emp_total_earnings']) * (Number(element.emp_present_days)) / Number(no_of_days))) + - Number(tdsValue) - Number(advanceValue) +
						(Number(element.emp_total_deductions) * (Number(element.emp_present_days) / Number(no_of_days))));
					console.log(element.emp_total_deductions);
					console.log(element);
					this.SALARY_COMPUTE_ELEMENT[i]['emp_total'] = 0;
					this.SALARY_COMPUTE_ELEMENT[i]['emp_total'] = Math.round(((Number(total_earnings)) * (Number(element.emp_present_days) / Number(no_of_days))) + Number(arrearValue) - Number(advanceValue) - Number(tdsValue) +
						(Number(element.emp_total_deductions) * (Number(element.emp_present_days) / Number(no_of_days))));
					if (element.emp_id) {
						const formJson: any = {};
						var deduction = 0;
						let empPaymentModeDetail: any[] = [];
						if (this.records[i].emp_salary_detail && this.records[i].emp_salary_detail.empPaymentModeDetail && this.records[i].emp_salary_detail.empPaymentModeDetail.length > 0) {
							empPaymentModeDetail = this.records[i].emp_salary_detail.empPaymentModeDetail;
						}
						for (let pi = 0; pi < this.paymentModeArray.length; pi++) {
							console.log(this.getCalculationType(this.records[i], this.paymentModeArray[pi]['config_id']));
							let curpaymetmode = empPaymentModeDetail.find(
								e => e.pay_mode == this.paymentModeArray[pi]['config_id'] &&
									e.transfer_type === this.paymentModeArray[pi]['transfer_id']);
							if (curpaymetmode) {
								if (Number(this.getCalculationType(this.records[i], this.paymentModeArray[pi]['config_id'])) === 2) { // % type
									var inputJson = {
										'pm_id': this.paymentModeArray[pi]['pm_id'],
										'pm_name': this.paymentModeArray[pi]['pm_name'],
										'pm_value': Math.round((Number(element.emp_salary_payable) * Number(curpaymetmode['value'])) / 100),
										'calculation_type': this.getCalculationType(this.records[i], this.paymentModeArray[pi]['config_id']),
										'calculation_value': curpaymetmode['value'],
										'transfer_type': curpaymetmode['transfer_id']
									};
									console.log(inputJson);
									element.emp_modes_data.mode_data.push(inputJson);
									if (element.emp_modes_data.mode_data[pi]) {
										deduction = Math.round(deduction + Number(element.emp_modes_data.mode_data[pi]['pm_value']));
									}

									//element.balance = (Number(emp_present_days ? Number(empBasicPay) + salary_payable : 0) - 0) - deduction;
									element.balance = Math.round(element.emp_salary_payable - deduction);
									element.emp_total = Math.round(deduction);

									this.formGroupArray[i]['value'][this.paymentModeArray[pi]['pm_id']] = Math.round((Number(element.emp_salary_payable) * Number(curpaymetmode['value'])) / 100)
									////console.log(this.formGroupArray[i]['value']);

								} else {
									//////console.log(this.paymentModeArray[pi]['calculation_value']);
									var tdeduction = 0;
									var inputJson = {
										'pm_id': this.paymentModeArray[pi]['pm_id'],
										'pm_name': this.paymentModeArray[pi]['pm_name'],
										'pm_value': Number(curpaymetmode['value']),
										'calculation_type': this.getCalculationType(this.records[i], this.paymentModeArray[pi]['config_id']),
										'calculation_value': curpaymetmode['value'],
										'transfer_type': curpaymetmode['transfer_id']
									};
									console.log(inputJson);
									this.formGroupArray[i]['value'][this.paymentModeArray[pi]['pm_id']] = 0;
									element.emp_modes_data.mode_data.push(inputJson);

									tdeduction = Math.round(Number(element.emp_modes_data.mode_data[pi]['pm_value']));

									element.balance = Math.round(element.balance - tdeduction);
								}

							} else {
								//////console.log(this.paymentModeArray[pi]['calculation_value']);
								var tdeduction = 0;
								var inputJson = {
									'pm_id': this.paymentModeArray[pi]['pm_id'],
									'pm_name': this.paymentModeArray[pi]['pm_name'],
									'pm_value': 0,
									'calculation_type': null,
									'calculation_value': null,
									'transfer_type': this.paymentModeArray[pi]['transfer_id']
								};

								this.formGroupArray[i]['value'][this.paymentModeArray[pi]['pm_id']] = 0;
								element.emp_modes_data.mode_data.push(inputJson);

								tdeduction = Math.round(Number(element.emp_modes_data.mode_data[pi]['pm_value']));

								element.balance = Math.round(element.balance - tdeduction);
							}
						}
						// formJson['td'] = this.records[i].emp_salary_detail.emp_salary_structure && this.records[i].emp_salary_detail.emp_salary_structure.td ?
						//this.records[i].emp_salary_detail.emp_salary_structure.td : 0,
						this.formGroupArray[i]['value']['tds'] = Math.round(tdsValue);
						// formJson['advance'] = advance_salary.toString();
						//this.formGroupArray[i] = this.fbuild.group(formJson);
						console.log(this.formGroupArray[i]);
						if (element['emp_total'] > element['emp_salary_payable']) {
							element.colorCode = 'rgb(252, 191, 188)';
						}
						//console.log(this.formGroupArray, '2345');
					}
				}
			}
			this.setNetTotal(element, event);
		}
	}
	setNetPerArr(element, event) {

		var value = 0;
		if (event.target.value) {

			value = event.target.value;

			for (var i = 0; i < this.SALARY_COMPUTE_ELEMENT.length; i++) {
				if (Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_id']) === Number(element.emp_id)) {
					//this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable'] = Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable']) + Number(value)
					var total_earnings = 0;
					total_earnings = Number(this.totalEarnings[i]);
					var no_of_days = this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear());
					let tdValue = this.formGroupArray[i].value.td || 0;
					let tdsValue = this.formGroupArray[i].value.tds || 0;
					let arrearValue = value || 0;
					let advanceValue = this.formGroupArray[i].value.advance || 0;


					//this.SALARY_COMPUTE_ELEMENT[i]['balance'] = this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable'];
					this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_payable'] = Math.round((((Number(this.SALARY_COMPUTE_ELEMENT[i]['emp_total_earnings'])) * (Number(element.emp_present_days)) / Number(no_of_days))) + Number(arrearValue) - Number(advanceValue) - Number(tdsValue) +
						(Number(element.emp_total_deductions) * (Number(element.emp_present_days) / Number(no_of_days))));
					this.SALARY_COMPUTE_ELEMENT[i]['emp_total'] = 0;
					this.SALARY_COMPUTE_ELEMENT[i]['emp_total'] = Math.round(((Number(total_earnings)) * (Number(element.emp_present_days) / Number(no_of_days))) + Number(arrearValue) - Number(advanceValue) + Number(tdValue) - Number(tdsValue)
						+ (Number(element.emp_total_deductions) * (Number(element.emp_present_days) / Number(no_of_days))));
					if (element) {
						const formJson: any = {};
						var deduction = 0;
						let empPaymentModeDetail: any[] = [];
						if (this.records[i].emp_salary_detail && this.records[i].emp_salary_detail.empPaymentModeDetail && this.records[i].emp_salary_detail.empPaymentModeDetail.length > 0) {
							empPaymentModeDetail = this.records[i].emp_salary_detail.empPaymentModeDetail;
						}
						for (let pi = 0; pi < this.paymentModeArray.length; pi++) {
							console.log(this.getCalculationType(this.records[i], this.paymentModeArray[pi]['config_id']));
							let curpaymetmode = empPaymentModeDetail.find(
								e => e.pay_mode == this.paymentModeArray[pi]['config_id'] &&
									e.transfer_type === this.paymentModeArray[pi]['transfer_id']);
							if (curpaymetmode) {
								if (Number(this.getCalculationType(this.records[i], this.paymentModeArray[pi]['config_id'])) === 2) { // % type
									var inputJson = {
										'pm_id': this.paymentModeArray[pi]['pm_id'],
										'pm_name': this.paymentModeArray[pi]['pm_name'],
										'pm_value': Math.round((Number(element.emp_salary_payable) * Number(curpaymetmode['value'])) / 100),
										'calculation_type': this.getCalculationType(this.records[i], this.paymentModeArray[pi]['config_id']),
										'calculation_value': curpaymetmode['value'],
										'transfer_type': curpaymetmode['transfer_id']
									};
									console.log(inputJson);
									element.emp_modes_data.mode_data.push(inputJson);
									if (element.emp_modes_data.mode_data[pi]) {
										deduction = Math.round(deduction + Number(element.emp_modes_data.mode_data[pi]['pm_value']));
									}

									//element.balance = (Number(emp_present_days ? Number(empBasicPay) + salary_payable : 0) - 0) - deduction;
									element.balance = Math.round(element.emp_salary_payable - deduction);
									element.emp_total = Math.round(deduction);

									this.formGroupArray[i]['value'][this.paymentModeArray[pi]['pm_id']] = Math.round((Number(element.emp_salary_payable) * Number(curpaymetmode['value'])) / 100)
									////console.log(formJson);

								} else {
									//////console.log(this.paymentModeArray[pi]['calculation_value']);
									var tdeduction = 0;
									var inputJson = {
										'pm_id': this.paymentModeArray[pi]['pm_id'],
										'pm_name': this.paymentModeArray[pi]['pm_name'],
										'pm_value': Number(curpaymetmode['value']),
										'calculation_type': this.getCalculationType(this.records[i], this.paymentModeArray[pi]['config_id']),
										'calculation_value': curpaymetmode['value'],
										'transfer_type': curpaymetmode['transfer_id']
									};
									console.log(inputJson);
									this.formGroupArray[i]['value'][this.paymentModeArray[pi]['pm_id']] = 0;
									element.emp_modes_data.mode_data.push(inputJson);

									tdeduction = Math.round(Number(element.emp_modes_data.mode_data[pi]['pm_value']));

									element.balance = Math.round(element.balance - tdeduction);
								}

							} else {
								//////console.log(this.paymentModeArray[pi]['calculation_value']);
								var tdeduction = 0;
								var inputJson = {
									'pm_id': this.paymentModeArray[pi]['pm_id'],
									'pm_name': this.paymentModeArray[pi]['pm_name'],
									'pm_value': 0,
									'calculation_type': null,
									'calculation_value': null,
									'transfer_type': this.paymentModeArray[pi]['transfer_id']
								};

								this.formGroupArray[i]['value'][this.paymentModeArray[pi]['pm_id']] = 0;
								element.emp_modes_data.mode_data.push(inputJson);

								tdeduction = Math.round(Number(element.emp_modes_data.mode_data[pi]['pm_value']));

								element.balance = Math.round(element.balance - tdeduction);
							}
						}
						this.formGroupArray[i]['value']['arrear'] = Math.round(Number(arrearValue));
						if (element['emp_total'] > element['emp_salary_payable']) {
							element.colorCode = 'rgb(252, 191, 188)';
						}
						//console.log(this.formGroupArray, '2345');
					}
				}
			}
			this.setNetTotal(element, event);
		}
	}


	openFilter() {
		
		if (this.searchForm.value.month_id) {
			this.searchModal.openModal();
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please Choose Pay Month', 'error');
		}
	}

	searchCancel() {
		this.searchByFilter = false;
	}

	resetAll() {
		this.buildForm();
		this.getSalaryHeads();
		this.searchByFilter = false;
		this.SALARY_COMPUTE_ELEMENT = [];
		this.filterJson = {};
		this.salaryComputeDataSource = new MatTableDataSource<SalaryComputeElement>(this.SALARY_COMPUTE_ELEMENT);
		this.salaryComputeEmployeeData = [];
	}

	reset() {
		// this.getAllEmployee();
		if (!this.searchByFilter) {
			this.searchWithoutFilter();
		} else {
			//////console.log(Object.keys(this.filterJson).length);
			if (Object.keys(this.filterJson).length === 0) {
				this.searchModal.openModal();
			} else {
				this.searchOk(this.filterJson);
			}

		}
	}

	save() {
		this.disabledApiButton = true;
		var empArr = [];
		let empJson = {};
		let monthWiseAdvance = [];
		let inputArr: any[] = [];
		var edit = false;
		let finJson: any = {};
		var validationStatus = false;
		for (var i = 0; i < this.SALARY_COMPUTE_ELEMENT.length; i++) {
			if (this.SALARY_COMPUTE_ELEMENT[i]['colorCode']) {
				this.commonAPIService.showSuccessErrorMessage('Please Correct Higlighted Employee Salary Total Amount, Should not be gretaer than Salary Payble', 'error');
				validationStatus = true;
				this.disabledApiButton = false;
			}
		}
		if (!validationStatus) {
			for (let i = 0; i < this.SALARY_COMPUTE_ELEMENT.length; i++) {
				let inputJson = {};
				monthWiseAdvance = [];
				empJson = {};
				monthWiseAdvance = this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure'].advance_month_wise ? this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure'].advance_month_wise : [];
				const findex = monthWiseAdvance.findIndex(f => Number(f.month_id) === Number(this.searchForm.value.month_id) && Number(f.currentYear) === Number(this.currentYear));
				if (findex !== -1) {
					monthWiseAdvance[findex] = {
						'month_id': this.searchForm.value.month_id,
						'deposite_amount': this.formGroupArray[i]['value']['advance'],
						'currentYear': this.currentYear,
						'session_id': this.session_id.ses_id
					}
				} else {
					monthWiseAdvance.push({
						'month_id': this.searchForm.value.month_id,
						'deposite_amount': this.formGroupArray[i]['value']['advance'],
						'currentYear': this.currentYear,
						'session_id': this.session_id.ses_id
					});
				}

				empJson["emp_salary_detail.emp_salary_structure.advance_month_wise"] = monthWiseAdvance;
				empJson["emp_id"] = this.SALARY_COMPUTE_ELEMENT[i].emp_id;
				empJson["emp_salary_detail.emp_salary_structure.emp_pay_scale"] = {
					pc_id: this.SALARY_COMPUTE_ELEMENT[i] &&
						this.SALARY_COMPUTE_ELEMENT[i] &&
						this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure'] &&
						this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure']['emp_pay_scale'] &&
						this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure']['emp_pay_scale']['ss_id'] ?
						this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure']['emp_pay_scale']['ss_id'] : '',
					pc_name: this.SALARY_COMPUTE_ELEMENT[i] &&
						this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure'] &&
						this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure']['emp_pay_scale'] &&
						this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure']['emp_pay_scale']['ss_name'] ?
						this.SALARY_COMPUTE_ELEMENT[i]['emp_salary_structure']['emp_pay_scale']['ss_name'] : '',
				};
				empArr.push(empJson);
				inputJson = this.SALARY_COMPUTE_ELEMENT[i];
				inputJson['emp_modes_data']['emp_id'] = this.formGroupArray[i]['value']['emp_id'];
				inputJson['emp_modes_data']['arrear'] = this.formGroupArray[i]['value']['arrear'];
				inputJson['emp_modes_data']['td'] = this.formGroupArray[i]['value']['td'];
				inputJson['emp_modes_data']['tds'] = this.formGroupArray[i]['value']['tds'];
				inputJson['emp_modes_data']['advance'] = this.formGroupArray[i]['value']['advance'];
				inputJson['emp_modes_data']['mode_data'] = [];
				if (this.SALARY_COMPUTE_ELEMENT[i]['isEditable']) {
					edit = true;
				} else {
					edit = false;
				}
				for (var j = 0; j < this.paymentModeArray.length; j++) {
					if (Object.keys(this.formGroupArray[i]['value']).indexOf(this.paymentModeArray[j]['pm_id']) > -1) {
						inputJson['emp_modes_data']['mode_data'].push(
							{
								pm_id: this.paymentModeArray[j]['pm_id'], pm_name: this.paymentModeArray[j]['pm_name'], pm_value: this.formGroupArray[i]['value'][this.paymentModeArray[j]['pm_id']],
								config_id: this.paymentModeArray[j]['config_id'],
								'pm_acc_name': this.paymentModeArray[j]['pm_acc_name'],
							}
						)
					}
				}
				inputArr.push({
					emp_id: this.SALARY_COMPUTE_ELEMENT[i].emp_id,
					session_id: this.session_id.ses_id,
					emp_salary_compute_month_id: this.searchForm.value.month_id,
					emp_salary_compute_data: inputJson
				});
			}
			console.log(empArr);
			if (!edit) {
				this.commonAPIService.insertInBulk(inputArr).subscribe((result: any) => {
					this.disabledApiButton = false;
					this.commonAPIService.updateEmployeeDatainBulk(empArr).subscribe((result: any) => {
						this.commonAPIService.showSuccessErrorMessage('Salary Compute Successfully', 'success');
						this.checkForFilter();
					});
				});
			} else {
				this.commonAPIService.updateInBulk(inputArr).subscribe((result: any) => {
					this.disabledApiButton = false;
					this.commonAPIService.updateEmployeeDatainBulk(empArr).subscribe((result: any) => {
						this.checkForFilter();
						this.commonAPIService.showSuccessErrorMessage('Salary Compute Successfully', 'success');
					});
				});
			}
		}
	}
	applyFilter(filterValue: string) {
		this.salaryComputeDataSource.filter = filterValue.trim().toLowerCase();
	}

	searchOk(event) {
		//this.searchByFilter = false;
		this.searchByFilter = true;
		this.filterJson = event;
		////console.log('filterJson--', this.filterJson);
		var inputJson = {
			month_id: this.searchForm.value.month_id
		};
		this.commonAPIService.getSalaryCompute(inputJson).subscribe((result: any) => {
			if (result) {
				this.salaryComputeEmployeeData = result;
				for (var i = 0; i < result.length; i++) {
					this.salaryComputeEmployeeIds.push(Number(result[i]['emp_salary_compute_data']['emp_id']));
				}
				this.commonAPIService.getFilterData(event).subscribe((result: any) => {

					let element: any = {};
					let recordArray = [];
					this.employeeData = result;
					this.SALARY_COMPUTE_ELEMENT = [];
					this.displayedSalaryComputeColumns = ['emp_id', 'emp_name', 'emp_designation', 'emp_pay_scale_master', 'emp_pay_scale'];
					this.salaryComputeDataSource = new MatTableDataSource<SalaryComputeElement>(this.SALARY_COMPUTE_ELEMENT);

					if (result && result.length > 0) {
						////console.log(result);
						var temp_arr = [];
						for (let i = 0; i < this.shacolumns.length; i++) {
							this.displayedSalaryComputeColumns.push(this.shacolumns[i]['header'] + this.shacolumns[i]['data']['sc_id']);
						}
						this.displayedSalaryComputeColumns.push('td', 'emp_total_earnings', 'emp_arrear');
						for (let i = 0; i < this.shdcolumns.length; i++) {
							this.displayedSalaryComputeColumns.push(this.shdcolumns[i]['header'] + this.shdcolumns[i]['data']['sc_id']);
						}
						if (this.deductions && this.deductions.tds) {
							this.displayedSalaryComputeColumns.push('tds', 'emp_present_days', 'emp_advance', 'emp_salary_payable');
						} else {
							this.displayedSalaryComputeColumns.push('emp_present_days', 'emp_advance', 'emp_salary_payable');
						}
						for (let i = 0; i < this.paymentModeArray.length; i++) {
							this.displayedSalaryComputeColumns.push(this.paymentModeArray[i]['pm_id']);
						}
						if (this.deductions && this.deductions.gratuity) {
							this.displayedSalaryComputeColumns.push('emp_total', 'balance', 'emp_status', 'gratuity');
						} else {
							this.displayedSalaryComputeColumns.push('emp_total', 'balance', 'emp_status');
						}
						let pos = 1;
						let recordArray = result;
						this.records = [];
						this.records = result;


						for (const item of recordArray) {
							console.log(item);
							element = {};
							var editableStatus = false;
							let emp_present_days = 0;
							this.empShacolumns = [];
							this.empShdcolumns = [];
							var total_deductions = 0;
							var total_earnings = 0;

							var formJson: any = {
								emp_id: item.emp_id,
								arrear: '',
								advance: '',
								td: '',
								tds: ''
							};

							var empBasicPay = item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.emp_basic_pay_scale ? Math.round(Number(item.emp_salary_detail.emp_salary_structure.emp_basic_pay_scale)) : 0;

							for (var i = 0; i < this.shacolumns.length; i++) {
								if (Number(this.shacolumns[i]['data']['sc_type']['type_id']) === 1) {
									var value = 0;

									if (this.shacolumns[i]['header'] === 'Basic Pay') {
										this.empShacolumns[i] = { columnDef: this.shacolumns[i]['data']['sc_name'], header: this.shacolumns[i]['data']['sc_name'], value: empBasicPay };
									} else {
										this.empShacolumns[i] = { columnDef: this.shacolumns[i]['data']['sc_name'], header: this.shacolumns[i]['data']['sc_name'], value: 0 };
									}

									if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads) {
										for (var j = 0; j < item.emp_salary_detail.emp_salary_structure.emp_salary_heads.length; j++) {
											if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j] && Number(this.shacolumns[i]['data']['sc_id']) === Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_id'])) {

												if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] &&
													item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type'] &&
													Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type']['type_id']) === 1
												) {
													if ((item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type']).toLowerCase() === 'text') {
														value = Math.round(Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value']));
													}

													if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] === '%') {
														value = Math.round((Number(empBasicPay) * Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value'])) / 100);
													}

													this.empShacolumns[i]['value'] = value.toFixed(2);
													this.shacolumns[i]['value'] = value.toFixed(2);
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

									if (item.emp_salary_detail
										&& item.emp_salary_detail.emp_salary_structure
										&& item.emp_salary_detail.emp_salary_structure.emp_salary_heads) {
										for (var j = 0; j < item.emp_salary_detail.emp_salary_structure.emp_salary_heads.length; j++) {
											if (this.shdcolumns[i]['data'] && item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j] && Number(this.shdcolumns[i]['data']['sc_id']) === Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_id'])) {

												if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] &&
													item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type'] &&
													Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_type']['type_id']) === 2
												) {
													if ((item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type']).toLowerCase() === 'text') {
														value = Math.round(Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value']));
													}

													if (item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_calculation_type'] === '%') {
														value = Math.round((Number(empBasicPay) * Number(item.emp_salary_detail.emp_salary_structure.emp_salary_heads[j]['sc_value'])) / 100);

													}
													const upperVal = this.shdcolumns[i]['data']['sc_type']['upper_value'] ?
														this.shdcolumns[i]['data']['sc_type']['upper_value'] : '';
													if (upperVal && value) {
														if (Number(value) > Number(upperVal)) {
															value = upperVal;
														}
													}
													this.empShdcolumns[i]['value'] = value.toFixed(2);
													this.shdcolumns[i]['value'] = value.toFixed(2);
													total_deductions = total_deductions - Number(value);

												} else {
													this.shdcolumns[i]['value'] = 0;
													this.empShdcolumns[i]['value'] = 0;
												}
											}
										}
									}

								}

							}


							if (item.emp_month_attendance_data && item.emp_month_attendance_data.month_data) {
								for (let i = 0; i < item.emp_month_attendance_data.month_data.length; i++) {
									let emp_month = item.emp_month_attendance_data.month_data[i].month_id;
									let emp_attendance_detail = item.emp_month_attendance_data.month_data[i];
									if (Number(this.searchForm.value.month_id) === Number(emp_month)) {
										console.log('yes');
										var tPresent = emp_attendance_detail && emp_attendance_detail.attendance_detail ? emp_attendance_detail.attendance_detail.emp_present : 0;
										var lwpDays = emp_attendance_detail && emp_attendance_detail.attendance_detail ? emp_attendance_detail.attendance_detail.emp_lwp : 0;
										var totalDays = emp_attendance_detail && emp_attendance_detail.attendance_detail &&
											emp_attendance_detail.attendance_detail.emp_total_attendance ? emp_attendance_detail.attendance_detail.emp_total_attendance : 0;
										var presentDays = totalDays;
										emp_present_days = presentDays;
									}
								}
							}


							var eIndex = this.salaryComputeEmployeeIds.indexOf(Number(item.emp_id));
							if (eIndex > -1) {
								if (this.salaryComputeEmployeeData[eIndex] && Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_id']) === Number(item.emp_id)
									&& Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_month_id']) === Number(this.searchForm.value.month_id)
									&& Number(this.salaryComputeEmployeeData[eIndex]['session_id']) === Number(this.session_id.ses_id)) {
									editableStatus = true;
								} else {
									editableStatus = false;
								}
							} else {
								editableStatus = false;
							}
							console.log('pos-->' + pos);
							console.log('editable-->' + editableStatus);
							if (editableStatus) {
								var salary_payable = 0;
								let arrearValue = Math.round(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].arrear || 0);
								let advanceValue = Math.round(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].advance || 0);
								total_earnings = this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total_earnings'] ? Math.round(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total_earnings']) : 0;
								var no_of_days = this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear());
								formJson['arrear'] = arrearValue;
								emp_present_days = emp_present_days ? emp_present_days : 0;
								salary_payable = Math.round((((Number(total_earnings)) * Number(emp_present_days)) / Number(no_of_days)) +
									((Number(total_deductions) * Number(emp_present_days)) / Number(no_of_days)) + Number(arrearValue) - Number(advanceValue));

								for (var i = 0; i < this.paymentModeArray.length; i++) {
									formJson[this.paymentModeArray[i]['pm_id']] = this.salaryComputeEmployeeData[eIndex] && this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data'] && this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].mode_data[i] && this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].mode_data[i]['pm_value'] ? Math.round(Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].mode_data[i]['pm_value'])) : '';
								}
								formJson['td'] = Math.round(Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].td));
								if (this.deductions && this.deductions.tds) {
									formJson['tds'] = Math.round(Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].tds));
								}
								else {
									formJson['tds'] = 0;
								}
								formJson['advance'] = Math.round(Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data'].advance));

								this.formGroupArray[pos - 1] = this.fbuild.group(formJson);
								element = {
									srno: pos,
									emp_id: item.emp_id,
									emp_code_no: item.emp_code_no ? item.emp_code_no : '-',
									emp_name: item.emp_name,
									emp_salary_compute_month_id: this.searchForm.value.month_id,
									emp_designation: item.emp_designation_detail ? item.emp_designation_detail.name : '',
									emp_pay_scale: item.emp_salary_detail.emp_salary_structure.emp_pay_scale ? item.emp_salary_detail.emp_salary_structure.emp_pay_scale.ss_name : '',
									emp_pay_scale_master: item.emp_salary_detail.emp_salary_structure &&
										item.emp_salary_detail.emp_salary_structure.emp_pay_scale_master &&
										item.emp_salary_detail.emp_salary_structure.emp_pay_scale_master.pay_scale_name ?
										item.emp_salary_detail.emp_salary_structure.emp_pay_scale_master.pay_scale_name : '',
									emp_salary_structure: item.emp_salary_detail.emp_salary_structure,
									emp_salary_heads: item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_salary_heads : [],
									emp_allowances: '',
									empShacolumns: this.empShacolumns,
									empShdcolumns: this.empShdcolumns,
									emp_total_earnings: total_earnings,
									emp_total_deductions: Math.round(total_deductions),
									emp_deductions: item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_deduction_detail : [],
									emp_present_days: emp_present_days,
									emp_salary_payable: emp_present_days ? salary_payable : 0,
									emp_pay_mode: item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.emp_pay_mode ? item.emp_salary_detail.emp_salary_structure.emp_pay_mode.pm_name : [],
									emp_modes_data: {
										emp_id: item.emp_id,
										arrear: Math.round(Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data']['arrear'])) || '',
										td: Math.round(Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data']['td'])) || '',
										tds: this.deductions && this.deductions.tds ?
											Math.round(Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data']['tds'])) || '' : 0,
										advance: Math.round(Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data']['advance'])),
										mode_data: this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_modes_data']['mode_data']
									},
									emp_total: Math.round(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total']),
									emp_status: item.emp_status ? item.emp_status : 'live',
									// td: this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['td'],
									// tds: this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['tds'],
									gratuity: this.deductions && this.deductions.gratuity ? Math.round(Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['gratuity'])) : 0,
									balance: Math.round(Number(emp_present_days ? salary_payable : 0) - Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total'])),
									isEditable: editableStatus
								};
								this.tAr.push(element.emp_modes_data.arrear);
								this.tdArr.push(element.emp_modes_data.td);
								this.totalEarnings.push(element.emp_total_earnings);
								element.emp_salary_payable = Math.round((Number(element.emp_total_earnings) * Number(element.emp_present_days) / Number(no_of_days))
									- Number(element.emp_modes_data.tds) - Number(element.emp_modes_data.advance) + Number(element.emp_modes_data.arrear) +
									(Number(total_deductions) * Number(element.emp_present_days) / Number(no_of_days)));
								element.balance = Number(element.emp_salary_payable) - Number(this.salaryComputeEmployeeData[eIndex]['emp_salary_compute_data']['emp_total']);
							} else {
								let advance_salary = 0;
								if (item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.advance_details && item.emp_salary_detail.emp_salary_structure.advance_details) {
									const obj: any = item.emp_salary_detail.emp_salary_structure.advance_details;
									const objArr: any[] = item.emp_salary_detail.emp_salary_structure.advance_details;
									if (obj.constructor === Object) {
										console.log('yes adv');
										if (Number(this.session_id.ses_id) === Number(item.emp_salary_detail.emp_salary_structure.advance_details.session_id)) {
											if (Number(this.searchForm.value.month_id) >= Number(item.emp_salary_detail.emp_salary_structure.advance_details.starting_month)) {
												let remaining_advance = item.emp_salary_detail.emp_salary_structure.advance_details.advance;
												let total_advance_deposite = 0;
												if (item.emp_salary_detail.emp_salary_structure.advance_month_wise) {
													for (const dety of item.emp_salary_detail.emp_salary_structure.advance_month_wise) {
														total_advance_deposite = total_advance_deposite + Number(dety.deposite_amount);
													}
													remaining_advance = Math.round(Number(remaining_advance) - Number(total_advance_deposite));
												}
												if (Number(remaining_advance) > 0) {
													if (Number(remaining_advance) > Number(item.emp_salary_detail.emp_salary_structure.advance_details.deposite_month_amount)) {
														advance_salary = Math.round(item.emp_salary_detail.emp_salary_structure.advance_details.deposite_month_amount);

													} else {
														advance_salary = Math.round(item.emp_salary_detail.emp_salary_structure.advance_details.remaining_advance);
													}
												} else {
													advance_salary = 0;
												}
											} else {
												advance_salary = 0;
											}
										} else {
											let remaining_advance = Math.round(item.emp_salary_detail.emp_salary_structure.advance_details.advance);
											let total_advance_deposite = 0;
											if (item.emp_salary_detail.emp_salary_structure.advance_month_wise) {
												for (const dety of item.emp_salary_detail.emp_salary_structure.advance_month_wise) {
													total_advance_deposite = Math.round(total_advance_deposite + Number(dety.deposite_amount));
												}
												remaining_advance = Number(remaining_advance) - Number(total_advance_deposite);
											}
											if (Number(remaining_advance) > 0) {
												if (Number(remaining_advance) > Number(item.emp_salary_detail.emp_salary_structure.advance_details.deposite_month_amount)) {
													advance_salary = item.emp_salary_detail.emp_salary_structure.advance_details.deposite_month_amount;

												} else {
													advance_salary = Math.round(item.emp_salary_detail.emp_salary_structure.advance_details.remaining_advance);
												}
											} else {
												advance_salary = 0;
											}

										}
									}
									if (Array.isArray(objArr)) {

										for (const it of objArr) {
											if (Number(this.session_id.ses_id) === Number(it.session_id)) {
												if (Number(this.searchForm.value.month_id) >= Number(it.starting_month)) {

													let remaining_advance = it.advance;
													let total_advance_deposite = 0;
													if (item.emp_salary_detail.emp_salary_structure.advance_month_wise) {
														for (const dety of item.emp_salary_detail.emp_salary_structure.advance_month_wise) {
															total_advance_deposite = total_advance_deposite + Number(dety.deposite_amount);
														}
														remaining_advance = Math.round(Number(remaining_advance) - Number(total_advance_deposite));
													}
													if (Number(remaining_advance) > 0) {
														if (Number(remaining_advance) > Number(it.deposite_month_amount)) {
															advance_salary += Math.round(it.deposite_month_amount);

														} else {
															advance_salary += Math.round(it.remaining_advance);
														}
													} else {
														advance_salary += 0;
													}
												} else {
													advance_salary += 0;
												}

											} else {

												let remaining_advance = Math.round(it.advance);
												let total_advance_deposite = 0;
												if (item.emp_salary_detail.emp_salary_structure.advance_month_wise) {
													for (const dety of item.emp_salary_detail.emp_salary_structure.advance_month_wise) {
														total_advance_deposite = Math.round(total_advance_deposite + Number(dety.deposite_amount));
													}
													remaining_advance = Number(remaining_advance) - Number(total_advance_deposite);
												}
												if (Number(remaining_advance) > 0) {
													if (Number(remaining_advance) > Number(it.deposite_month_amount)) {
														advance_salary += it.deposite_month_amount;

													} else {
														advance_salary += Math.round(it.remaining_advance);
													}
												} else {
													advance_salary += 0;
												}

											}
										}
									}


								}
								console.log(advance_salary);

								item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.advance_details ? item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.advance_details.deposite_month_amount : 0;

								var salary_payable = 0;
								var no_of_days = this.getDaysInMonth(this.searchForm.value.month_id, new Date().getFullYear());
								emp_present_days = emp_present_days ? emp_present_days : 0;

								total_earnings = total_earnings
								salary_payable = Math.round((((Number(empBasicPay) + total_earnings) * Number(emp_present_days)) / Number(no_of_days)) +
									((Number(total_deductions) * Number(emp_present_days)) / Number(no_of_days)));
								//////console.log('salary_payable',total_earnings, salary_payable);
								element = {
									srno: pos,
									emp_id: item.emp_id,
									emp_code_no: item.emp_code_no ? item.emp_code_no : '-',
									emp_name: item.emp_name,
									emp_salary_compute_month_id: this.searchForm.value.month_id,
									emp_designation: item.emp_designation_detail ? item.emp_designation_detail.name : '',
									emp_pay_scale: item.emp_salary_detail.emp_salary_structure.emp_pay_scale ? item.emp_salary_detail.emp_salary_structure.emp_pay_scale.ss_name : '',
									emp_pay_scale_master: item.emp_salary_detail.emp_salary_structure &&
										item.emp_salary_detail.emp_salary_structure.emp_pay_scale_master &&
										item.emp_salary_detail.emp_salary_structure.emp_pay_scale_master.pay_scale_name ?
										item.emp_salary_detail.emp_salary_structure.emp_pay_scale_master.pay_scale_name : '',
									emp_salary_structure: item.emp_salary_detail.emp_salary_structure,
									emp_salary_heads: item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_salary_heads : [],
									emp_allowances: '',
									empShacolumns: this.empShacolumns,
									empShdcolumns: this.empShdcolumns,
									emp_total_earnings: Math.round((Number(empBasicPay) + total_earnings)),
									emp_total_deductions: Math.round(total_deductions),
									emp_deductions: item.emp_salary_detail.emp_salary_structure ? item.emp_salary_detail.emp_salary_structure.emp_deduction_detail : [],
									emp_present_days: emp_present_days,
									emp_salary_payable: emp_present_days ? salary_payable : 0,
									emp_pay_mode: item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.emp_pay_mode ? item.emp_salary_detail.emp_salary_structure.emp_pay_mode.pm_name : [],
									emp_modes_data: {
										emp_id: item.emp_id,
										arrear: '',
										td: item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.td ? Math.round(Number(item.emp_salary_detail.emp_salary_structure.td)) : 0,
										tds: this.deductions && this.deductions.tds ?
											(item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.tds ? Math.round(Number(item.emp_salary_detail.emp_salary_structure.tds)) : 0) : 0,
										advance: Math.round(Number(advance_salary)),
										mode_data: []
									},
									emp_total: 0,
									gratuity: this.deductions && this.deductions.gratuity ?
										(item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure
											? Math.round(Number(item.emp_salary_detail.emp_salary_structure.gratuity)) : 0) : 0,
									emp_status: item.emp_status ? item.emp_status : 'live',
									isEditable: editableStatus,
									colorCode: '',
									balance: Number(emp_present_days ? Number(empBasicPay) + salary_payable : 0) - 0,
								};
								element.emp_total_earnings = Math.round(element.emp_total_earnings + element.emp_modes_data.td);
								this.tAr.push(element.emp_modes_data.arrear);
								this.tdArr.push(element.emp_modes_data.td);
								this.totalEarnings.push(element.emp_total_earnings);
								element.emp_salary_payable = Math.round((Number(element.emp_total_earnings) * Number(element.emp_present_days) / Number(no_of_days))
									- Number(element.emp_modes_data.tds) - Number(element.emp_modes_data.advance) + Number(element.emp_modes_data.arrear) +
									(Number(total_deductions) * Number(element.emp_present_days) / Number(no_of_days)));
								element.balance = Number(element.emp_present_days ? Math.round(Number(empBasicPay) + element.emp_salary_payable) : 0) - 0;
								if (element) {
									var deduction = 0;
									let empPaymentModeDetail: any[] = [];
									if (item.emp_salary_detail && item.emp_salary_detail.empPaymentModeDetail && item.emp_salary_detail.empPaymentModeDetail.length > 0) {
										empPaymentModeDetail = item.emp_salary_detail.empPaymentModeDetail;
									}
									for (let pi = 0; pi < this.paymentModeArray.length; pi++) {
										console.log(this.getCalculationType(item, this.paymentModeArray[pi]['config_id']));
										let curpaymetmode = empPaymentModeDetail.find(e => e.pay_mode == this.paymentModeArray[pi]['config_id'] &&
											e.transfer_type === this.paymentModeArray[pi]['transfer_id']);
										if (curpaymetmode) {
											if (Number(this.getCalculationType(item, this.paymentModeArray[pi]['config_id'])) === 2) { // % type
												var inputJson = {
													'pm_id': this.paymentModeArray[pi]['pm_id'],
													'pm_name': this.paymentModeArray[pi]['pm_name'],
													'pm_value': Math.round((Number(element.emp_salary_payable) * Number(curpaymetmode['value'])) / 100),
													'calculation_type': this.getCalculationType(item, this.paymentModeArray[pi]['config_id']),
													'calculation_value': curpaymetmode['value'],
													'transfer_type': curpaymetmode['transfer_id']
												};
												console.log(inputJson);
												element.emp_modes_data.mode_data.push(inputJson);
												if (element.emp_modes_data.mode_data[pi]) {
													deduction = Math.round(deduction + Number(element.emp_modes_data.mode_data[pi]['pm_value']));
												}

												//element.balance = (Number(emp_present_days ? Number(empBasicPay) + salary_payable : 0) - 0) - deduction;
												element.balance = element.emp_salary_payable - deduction;
												element.emp_total = deduction;

												formJson[this.paymentModeArray[pi]['pm_id']] = Math.round((Number(element.emp_salary_payable) * Number(curpaymetmode['value'])) / 100)
												////console.log(formJson);

											} else {
												//////console.log(this.paymentModeArray[pi]['calculation_value']);
												var tdeduction = 0;
												var inputJson = {
													'pm_id': this.paymentModeArray[pi]['pm_id'],
													'pm_name': this.paymentModeArray[pi]['pm_name'],
													'pm_value': Number(curpaymetmode['value']),
													'calculation_type': this.getCalculationType(item, this.paymentModeArray[pi]['config_id']),
													'calculation_value': curpaymetmode['value'],
													'transfer_type': this.paymentModeArray[pi]['transfer_type']
												};
												console.log(inputJson);
												formJson[this.paymentModeArray[pi]['pm_id']] = 0;
												element.emp_modes_data.mode_data.push(inputJson);

												tdeduction = Math.round(Number(element.emp_modes_data.mode_data[pi]['pm_value']));

												element.balance = Math.round(element.balance - tdeduction);
											}

										} else {
											//////console.log(this.paymentModeArray[pi]['calculation_value']);
											var tdeduction = 0;
											var inputJson = {
												'pm_id': this.paymentModeArray[pi]['pm_id'],
												'pm_name': this.paymentModeArray[pi]['pm_name'],
												'pm_value': 0,
												'calculation_type': null,
												'calculation_value': null,
												'transfer_type': this.paymentModeArray[pi]['transfer_type']
											};

											formJson[this.paymentModeArray[pi]['pm_id']] = 0;
											element.emp_modes_data.mode_data.push(inputJson);

											tdeduction = Math.round(Number(element.emp_modes_data.mode_data[pi]['pm_value']));

											element.balance = Math.round(element.balance - tdeduction);
										}
									}
									formJson['td'] = item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.td ?
										Math.round(item.emp_salary_detail.emp_salary_structure.td) : 0,
										formJson['tds'] = item.emp_salary_detail.emp_salary_structure && item.emp_salary_detail.emp_salary_structure.tds ? Math.round(item.emp_salary_detail.emp_salary_structure.tds) : 0,
										formJson['advance'] = advance_salary.toString();
									this.formGroupArray[pos - 1] = this.fbuild.group(formJson);
									//console.log(this.formGroupArray, '2345');
								}
							}


							this.SALARY_COMPUTE_ELEMENT.push(element);
							pos++;
						}

						////console.log('this.SALARY_COMPUTE_ELEMENT', this.SALARY_COMPUTE_ELEMENT);
						this.footerrow = {
							emp_salary_payable: this.SALARY_COMPUTE_ELEMENT.reduce((a, b) => a + Number(b.emp_salary_payable || 0), 0),
							emp_total_earnings: this.SALARY_COMPUTE_ELEMENT.reduce((a, b) => a + Number(b.emp_total_earnings || 0), 0),
							balance: this.SALARY_COMPUTE_ELEMENT.reduce((a, b) => a + Number(b.balance || 0), 0)
						}
						this.salaryComputeDataSource = new MatTableDataSource<SalaryComputeElement>(this.SALARY_COMPUTE_ELEMENT);
						this.salaryComputeDataSource.paginator = this.paginator;
						if (this.sort) {
							this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
							this.salaryComputeDataSource.sort = this.sort;
						}
					}
				});
				// this.getAllEmployee();
			} else {
				this.salaryComputeEmployeeData = [];
				// this.getAllEmployee();
			}

		});


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
			key: 'emp_pay_scale_master',
			width: this.checkWidth('emp_pay_scale_master', 'Pay Scale')
		});
		columns.push({
			key: 'emp_pay_scale',
			width: this.checkWidth('emp_pay_scale', 'Structure')
		});
		// columns.push({
		// 	key: 'emp_total_earnings',
		// 	width: this.checkWidth('emp_total_earnings', 'Total Earnings')
		// });
		columns.push({
			key: 'emp_present_days',
			width: this.checkWidth('emp_present_days', 'Present Days')
		});
		columns.push({
			key: 'emp_salary_payable',
			width: this.checkWidth('emp_salary_payable', 'Salary Payable')
		});
		columns.push({
			key: 'emp_pay_scale',
			width: this.checkWidth('emp_pay_scale', 'Total')
		});
		columns.push({
			key: 'emp_status',
			width: this.checkWidth('emp_status', 'Status')
		});
		columns.push({
			key: 'balance',
			width: this.checkWidth('balance', 'Balance')
		});
		columns.push({
			key: 'td',
			width: this.checkWidth('td', 'TA')
		});
		columns.push({
			key: 'tds',
			width: this.checkWidth('tds', 'TDS')
		});
		columns.push({
			key: 'gratuity',
			width: this.checkWidth('gratuity', 'Gratuity')
		});

		reportType2 = new TitleCasePipe().transform('employeesalarycomputereport_') + this.sessionName;
		reportType = new TitleCasePipe().transform('Employee Salary Compute report: ') + this.sessionName;
		const fileName = reportType + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[8] + '1');
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[8] + '2');
		worksheet.getCell('A2').value = new TitleCasePipe().transform('Employee Salary Computation For The Month Of '
			+ this.getMonthWithYear());
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

		worksheet.mergeCells('A5:E5');
		worksheet.getCell('A5').value = 'General Details';
		let w = 6;
		for (let a = 0; a < this.shacolumns.length; a++) {
			w++;
		}
		worksheet.mergeCells('F5:' + this.alphabetJSON[w] + '5');
		worksheet.getCell('F5').value = 'Salary Heads';
		w = w + 1;
		worksheet.getCell(this.alphabetJSON[w] + '5').value = 'Earning';
		//w=w+1;
		let x = w;
		for (let b = 0; b < this.shdcolumns.length; b++) {
			x++;
		}
		worksheet.mergeCells(this.alphabetJSON[w + 1] + '5:' + this.alphabetJSON[x] + '5');
		worksheet.getCell(this.alphabetJSON[w + 1] + '5').value = 'Deduction';
		worksheet.mergeCells(this.alphabetJSON[x + 1] + '5:' + this.alphabetJSON[x + 3] + '5');
		worksheet.getCell(this.alphabetJSON[x + 1] + '5').value = '';

		let y = x + 3;
		for (let b = 0; b < this.paymentModeArray.length; b++) {
			y++;
		}
		worksheet.mergeCells(this.alphabetJSON[x + 4] + '5:' + this.alphabetJSON[y + 1] + '5');
		worksheet.getCell(this.alphabetJSON[x + 4] + '5').value = 'Modes';

		worksheet.mergeCells(this.alphabetJSON[y + 2] + '5:' + this.alphabetJSON[y + 3] + '5');
		worksheet.getCell(this.alphabetJSON[y + 2] + '5').value = '';

		worksheet.getCell('A6').value = 'Emp. ID';
		worksheet.getCell('B6').value = 'Emp Name';
		worksheet.getCell('C6').value = 'Designation';
		worksheet.getCell('D6').value = 'Pay Scale';
		worksheet.getCell('E6').value = 'Structure';
		let k = 6;
		for (let i = 0; i < this.shacolumns.length; i++) {
			worksheet.getCell(this.alphabetJSON[6 + i] + '6').value = this.shacolumns[i].header;
			k++;
		}
		worksheet.getCell(this.alphabetJSON[k] + '6').value = 'TA';
		k = k + 1;
		worksheet.getCell(this.alphabetJSON[k] + '6').value = 'Total Earnings';

		let l = k;
		for (let j = 0; j < this.shdcolumns.length; j++) {
			worksheet.getCell(this.alphabetJSON[k + j + 1] + '6').value = this.shdcolumns[j].header;
			l++;
		}
		worksheet.getCell(this.alphabetJSON[l + 1] + '6').value = 'TDS';
		l = l + 1;
		worksheet.getCell(this.alphabetJSON[l + 1] + '6').value = 'Present Days';
		worksheet.getCell(this.alphabetJSON[l + 2] + '6').value = 'Advance/Arrear';
		worksheet.getCell(this.alphabetJSON[l + 3] + '6').value = 'Salary Payable';

		let m = l + 3;
		let o = l + 3
		for (let n = 0; n < this.paymentModeArray.length; n++) {
			worksheet.getCell(this.alphabetJSON[o + n + 1] + '6').value = this.paymentModeArray[n].pm_name;
			m++;
		}
		worksheet.getCell(this.alphabetJSON[m + 1] + '6').value = 'Total';
		worksheet.getCell(this.alphabetJSON[m + 2] + '6').value = 'Balance';
		worksheet.getCell(this.alphabetJSON[m + 3] + '6').value = 'Status';
		worksheet.columns = columns;
		this.length = worksheet._rows.length;
		let gtRow = this.length + this.SALARY_COMPUTE_ELEMENT.length + 1;
		worksheet.getCell('A' + gtRow).value = '';
		worksheet.getCell('B' + gtRow).value = 'Grand Total';
		worksheet.getCell('C' + gtRow).value = '';
		worksheet.getCell('D' + gtRow).value = '';
		worksheet.getCell('E' + gtRow).value = '';

		let k2 = 6;
		for (let i = 0; i < this.shacolumns.length; i++) {
			worksheet.getCell(this.alphabetJSON[6 + i] + gtRow).value = this.SALARY_COMPUTE_ELEMENT.
				map(f => Math.round(Number(f.empShacolumns[i]['value']))).reduce((acc, val) => acc + val);
			k2++;
		}
		worksheet.getCell(this.alphabetJSON[k2] + gtRow).value = this.SALARY_COMPUTE_ELEMENT.map(f =>
			Math.round(Number(f.emp_modes_data.td))).reduce((acc, val) => acc + val);
		k2 = k2 + 1;
		worksheet.getCell(this.alphabetJSON[k2] + gtRow).value = this.SALARY_COMPUTE_ELEMENT.map(f =>
			Math.round(Number(f.emp_total_earnings))).reduce((acc, val) => acc + val);
		let l2 = k2;
		for (let j = 0; j < this.shdcolumns.length; j++) {
			worksheet.getCell(this.alphabetJSON[k2 + j + 1] + gtRow).value =
				this.SALARY_COMPUTE_ELEMENT.
					map(f => Math.round(Number(f.empShdcolumns[j]['value']) * Number(f.emp_present_days) / this.nod)).reduce((acc, val) => acc + val);
			l2++;
		}
		worksheet.getCell(this.alphabetJSON[l2 + 1] + gtRow).value =
			this.SALARY_COMPUTE_ELEMENT.map(f =>
				Math.round(Number(f.emp_modes_data.tds))).reduce((acc, val) => acc + val);
		l2 = l2 + 1;
		worksheet.getCell(this.alphabetJSON[l2 + 1] + gtRow).value =
			this.SALARY_COMPUTE_ELEMENT.map(f =>
				Math.round(Number(f.emp_present_days))).reduce((acc, val) => acc + val);
		worksheet.getCell(this.alphabetJSON[l2 + 2] + gtRow).value =
			this.SALARY_COMPUTE_ELEMENT.map(f =>
				Math.round(Number(f.emp_modes_data.advance))).reduce((acc, val) => acc + val);;
		worksheet.getCell(this.alphabetJSON[l2 + 3] + gtRow).value =
			this.SALARY_COMPUTE_ELEMENT.map(f =>
				Math.round(Number(f.emp_salary_payable))).reduce((acc, val) => acc + val);
		let m2 = l2 + 3;
		let o2 = l2 + 3
		for (let n = 0; n < this.paymentModeArray.length; n++) {
			worksheet.getCell(this.alphabetJSON[o2 + n + 1] + gtRow).value = this.SALARY_COMPUTE_ELEMENT.map(f =>
				Math.round(Number(f.emp_modes_data.mode_data[n]['pm_value']))).reduce((acc, val) => acc + val);
			m2++;
		}
		worksheet.getCell(this.alphabetJSON[m2 + 1] + gtRow).value =
			this.SALARY_COMPUTE_ELEMENT.map(f =>
				Math.round(Number(f.emp_total))).reduce((acc, val) => acc + val);
		worksheet.getCell(this.alphabetJSON[m2 + 2] + gtRow).value =
			this.SALARY_COMPUTE_ELEMENT.map(f =>
				Math.round(Number(f.balance))).reduce((acc, val) => acc + val);
		worksheet.getCell(this.alphabetJSON[m2 + 3] + gtRow).value = '';
		let totRow = this.length + this.SALARY_COMPUTE_ELEMENT.length + 6;

		worksheet.mergeCells('A' + totRow + ':' + 'E' + totRow);
		worksheet.getCell('A' + totRow + ':' + 'B' + totRow).value = 'Report Generated By : ' + this.currentUser.full_name;
		worksheet.getCell('A' + totRow + ':' + 'B' + totRow).alignment = { horizontal: 'left' };
		worksheet.mergeCells('A' + (totRow + 1) + ':' + 'B' + (totRow + 1));
		worksheet.getCell('A' + (totRow + 1) + ':' + 'B' + (totRow + 1)).value = 'No. of Records : ' + this.SALARY_COMPUTE_ELEMENT.length;
		worksheet.getCell('A' + (totRow + 1) + ':' + 'B' + (totRow + 1)).alignment = { horizontal: 'left' };
		for (const item of this.SALARY_COMPUTE_ELEMENT) {
			const prev = this.length + 1;
			const obj: any = {};
			this.length++;
			worksheet.getCell('A' + this.length).value = item.emp_code_no;
			worksheet.getCell('B' + this.length).value = item.emp_name;
			worksheet.getCell('C' + this.length).value = item.emp_designation;
			worksheet.getCell('D' + this.length).value = item.emp_pay_scale_master;
			worksheet.getCell('E' + this.length).value = item.emp_pay_scale;
			let k = 6;
			for (let i = 0; i < this.shacolumns.length; i++) {
				worksheet.getCell(this.alphabetJSON[6 + i] + this.length).value = this.twoDecimalwithRound(item.empShacolumns[i]['value']);
				k++;
			}
			worksheet.getCell(this.alphabetJSON[k] + this.length).value = this.twoDecimalwithRound(item.emp_modes_data.td);
			k = k + 1
			worksheet.getCell(this.alphabetJSON[k] + this.length).value = this.twoDecimalwithRound(item.emp_total_earnings);
			let l = k;
			for (let j = 0; j < this.shdcolumns.length; j++) {
				worksheet.getCell(this.alphabetJSON[k + j + 1] + this.length).value =
					this.twoDecimalwithRound(Number(item.empShdcolumns[j]['value']) * Number(item.emp_present_days) / Number(this.nod));
				l++;
			}
			worksheet.getCell(this.alphabetJSON[l + 1] + this.length).value = this.twoDecimalwithRound(item.emp_modes_data.tds);
			l = l + 1;
			worksheet.getCell(this.alphabetJSON[l + 1] + this.length).value = item.emp_present_days;
			worksheet.getCell(this.alphabetJSON[l + 2] + this.length).value = this.twoDecimalwithRound(item.emp_modes_data.advance);
			worksheet.getCell(this.alphabetJSON[l + 3] + this.length).value = this.twoDecimalwithRound(item.emp_salary_payable);

			let m = l + 3;
			let o = l + 3
			for (let n = 0; n < this.paymentModeArray.length; n++) {
				worksheet.getCell(this.alphabetJSON[o + n + 1] + this.length).value = this.twoDecimalwithRound(item.emp_modes_data.mode_data[n]['pm_value']);
				m++;
			}
			worksheet.getCell(this.alphabetJSON[m + 1] + this.length).value = this.twoDecimalwithRound(item.emp_total);
			worksheet.getCell(this.alphabetJSON[m + 2] + this.length).value = this.twoDecimalwithRound(item.balance);
			worksheet.getCell(this.alphabetJSON[m + 3] + this.length).value = item.emp_status;
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
			if (rowNum === gtRow) {
				row.eachCell(cell => {
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
			}
			if (rowNum >= 7 && rowNum !== gtRow && rowNum <= this.SALARY_COMPUTE_ELEMENT.length + 7) {
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
				fontSize: 12,
			},
			useCss: true,
			theme: 'striped'
		});

		doc.autoTable({
			head: [[
				new TitleCasePipe().transform('Employee Salary Computation For The Month Of '
					+ this.getMonthWithYear())
			]],
			didDrawPage: function (data) {
				doc.setFont('Roboto');
			},
			headerStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 10,
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
				fontSize: 9,
			},
			useCss: true,
			styles: {
				fontSize: 9,
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
				fontSize: 10,
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
				fontSize: 10,
			},
			useCss: true,
			theme: 'striped'
		});
		// doc.save('table.pdf');

		// const doc = new jsPDF('landscape');
		// doc.setFont('helvetica');
		// doc.setFontSize(5);
		// doc.autoTable({ html: '#book_log' });

		doc.save('EmployeeSalaryCompute_' + this.searchForm.value.searchId + '_' + (new Date).getTime() + '.pdf');
		this.showPdf = false;
	}
	getMonthWithYear() {
		let str = '';
		let nYear = 0;
		let currentSessionFirst = this.sessionName.split('-')[0];
		let currentSessionSecond = this.sessionName.split('-')[1];
		var month_id = this.searchForm.value.month_id;
		if ((Number(month_id) != 1) && (Number(month_id) != 2) && (Number(month_id) != 3)) {
			nYear = currentSessionFirst;
		} else {
			nYear = currentSessionSecond;
		}
		str = this.monthNames[Number(month_id) - 1].substring(0, 3) + '\'';
		str += nYear.toString().substring(nYear.toString().length - 2);
		return str;
	}
	twoDecimalwithRound(num) {
		if (!isNaN) {
			return Math.round(num * 100) / 100;
		} else {
			return num;
		}
	}
	getGlobalSettings() {
		this.erpCommonService.getGlobalSetting({ gs_alias: 'deduction_config' }).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				if (res.data[0] && res.data[0].gs_value) {
					this.deductions = JSON.parse(res.data[0].gs_value);
				} else {
					this.deductions = {};
				}
			}
		});

	}
}


export interface SalaryComputeElement {
	srno: number;
	emp_id: string;
	emp_code_no: any;
	emp_name: string;
	emp_designation: string;
	emp_pay_scale: string;
	emp_pay_scale_master: string;
	// emp_salary_heads: any;
	// emp_allowances: any;
	emp_total_earnings: any;
	// emp_deductions: any;
	emp_present_days: any;
	emp_salary_payable: any;
	emp_arrear: any;
	emp_advance: any;
	// emp_pay_mode: any;
	emp_total: any;
	emp_status: any;
	td: any;
	tds: any;
	gratuity: any;
	empShacolumns: any;
	empShdcolumns: any;
	emp_modes_data: any;
	balance: any;
}
