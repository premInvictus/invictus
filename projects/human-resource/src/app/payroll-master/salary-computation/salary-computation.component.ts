import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';

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
	employeeData: any;
	salaryHeadsArr: any[] = [];
	shacolumns = [];
	shdcolumns = [];
	formGroupArray = [];
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
	displayedSalaryComputeColumns: string[] = ['srno', 'emp_id', 'emp_name', 'emp_designation', 'emp_pay_scale'];

	constructor(
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService
	) { }

	ngOnInit() {
		this.buildForm();
		this.getSalaryHeads();
		

	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			month_id: '',
			pay_date: ''

		});
	}

	getSalaryHeads() {
		this.commonAPIService.getSalaryHeads({}).subscribe((res: any) => {
			if (res) {
				this.salaryHeadsArr = [];
				this.salaryHeadsArr = res;
				for (var i = 0; i < this.salaryHeadsArr.length; i++) {
					console.log("this.salaryHeadsArr[i]['sc_type']", this.salaryHeadsArr[i]['sc_type']);
					if (this.salaryHeadsArr[i]['sc_type']['type_id'] === 1) {
						this.shacolumns.push({ columnDef: this.salaryHeadsArr[i]['sc_name'], header: this.salaryHeadsArr[i]['sc_name'] });
					}
					if (this.salaryHeadsArr[i]['sc_type']['type_id'] === 2) {
						this.shdcolumns.push({ columnDef: this.salaryHeadsArr[i]['sc_name'], header: this.salaryHeadsArr[i]['sc_name'] });
					}
				}
				
				console.log('this.shacolumns', this.shacolumns);
				this.getAllEmployee();
			}
		});
	}

	getAllEmployee() {
		for (let i = 0; i<this.shacolumns.length;i++) {
			this.displayedSalaryComputeColumns.push(this.shacolumns[i]['header']);
		}
		this.displayedSalaryComputeColumns.push('emp_total_earnings');
		for (let i = 0; i<this.shdcolumns.length;i++) {
			this.displayedSalaryComputeColumns.push(this.shdcolumns[i]['header']);
		}
		this.displayedSalaryComputeColumns.push('emp_present_days', 'emp_salary_payable','emp_advance');
		for (let i = 0; i<this.paymentModeArray.length;i++) {
			this.displayedSalaryComputeColumns.push(this.paymentModeArray[i]['pm_id']);
		}
		this.displayedSalaryComputeColumns.push( 'emp_total', 'emp_status');
		console.log(this.displayedSalaryComputeColumns);
		//this.displayedSalaryComputeColumns.push('emp_salary_heads', 'emp_allowances', 'emp_total_earnings', 'emp_deductions', 'emp_present_days', 'emp_salary_payable', 'emp_pay_mode', 'emp_total', 'emp_status']
		let inputJson = {
		};
		this.commonAPIService.getAllEmployee(inputJson).subscribe((result: any) => {
			console.log('result', result);
			let element: any = {};
			let recordArray = [];
			this.employeeData = result;
			this.SALARY_COMPUTE_ELEMENT = [];
			this.salaryComputeDataSource = new MatTableDataSource<SalaryComputeElement>(this.SALARY_COMPUTE_ELEMENT);
			if (result && result.length > 0) {
				let pos = 1;
				let recordArray = result;

				let emp_present_days;
				for (const item of recordArray) {
					for (var i = 0; i < item.emp_month_attendance_data.length; i++) {
						var emp_month = item.emp_month_attendance_data[i].month_id;
						var emp_attendance_detail = item.emp_month_attendance_data[i];
						if (parseInt(this.searchForm.value.month_id, 10) === parseInt(emp_month, 10)) {
							emp_present_days = emp_attendance_detail.attendance_detail.emp_present ? emp_attendance_detail.attendance_detail.emp_present : 0;
							break;
						} else {
							emp_present_days = 0;
						}
					}

					var formJson = {
						emp_id: item.emp_id,
						advance: ''
					};

					for (var i=0; i<this.paymentModeArray.length;i++) {
						// var fgroup = this.fbuild.group({
						// 	pm_id: item.pm_id,
						// });
						// this.formGroupArray[pos-1].push(fgroup);
						formJson['pm_id_'+this.paymentModeArray[i]['pm_id']] = '';
					}

					this.formGroupArray[pos-1] = this.fbuild.group(formJson);
					
					
					element = {
						srno: pos,
						emp_id: item.emp_id,
						emp_name: item.emp_name,
						emp_designation: item.emp_designation_detail.des_name,
						emp_pay_scale: item.emp_salary_detail.emp_salary_structure.emp_basic_pay_scale.bps_name,
						emp_salary_structure: item.emp_salary_detail.emp_salary_structure,
						emp_salary_heads: item.emp_salary_detail.emp_salary_structure.emp_salary_heads,
						emp_allowances: '',
						emp_total_earnings: item.emp_salary_detail.emp_salary_structure.emp_total_earning,
						emp_deductions: item.emp_salary_detail.emp_salary_structure.emp_deduction_detail,
						emp_present_days: emp_present_days,
						emp_salary_payable: item.emp_salary_detail.emp_salary_structure.emp_net_salary,
						emp_pay_mode: item.emp_salary_detail.emp_salary_structure.emp_pay_mode.pm_name,
						emp_total: item.emp_salary_detail.emp_salary_structure.emp_net_salary,
						emp_status: item.emp_status ? item.emp_status : 'live',
					};
					this.SALARY_COMPUTE_ELEMENT.push(element);
					pos++;

				}
				console.log(this.formGroupArray);
				this.salaryComputeDataSource = new MatTableDataSource<SalaryComputeElement>(this.SALARY_COMPUTE_ELEMENT);
				this.salaryComputeDataSource.paginator = this.paginator;
						if (this.sort) {
							this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
							this.salaryComputeDataSource.sort = this.sort;
						}
			}
		});

	}

	openFilter() {
		this.searchModal.openModal();
	}

	resetAll() {
		this.buildForm();
		this.getSalaryHeads();
	}

	save() {
		let inputJson = this.SALARY_COMPUTE_ELEMENT;
		this.commonAPIService.updateEmployee(inputJson).subscribe((result:any) => {
			console.log('result', result);
		});
	}

	print() {

	}

	applyFilter(filterValue: string) {
		this.salaryComputeDataSource.filter = filterValue.trim().toLowerCase();
	}

	searchOk(event) {
		this.commonAPIService.getFilterData(event).subscribe((result: any) => {
			console.log('result', result);
			let element: any = {};
			let recordArray = [];
			this.employeeData = result;
			this.SALARY_COMPUTE_ELEMENT = [];
			this.salaryComputeDataSource = new MatTableDataSource<SalaryComputeElement>(this.SALARY_COMPUTE_ELEMENT);
			if (result && result.length > 0) {
				let pos = 1;
				let recordArray = result;

				let emp_present_days;
				for (const item of recordArray) {
					for (var i = 0; i < item.emp_month_attendance_data.length; i++) {
						var emp_month = item.emp_month_attendance_data[i].month_id;
						var emp_attendance_detail = item.emp_month_attendance_data[i];
						if (parseInt(this.searchForm.value.month_id, 10) === parseInt(emp_month, 10)) {
							emp_present_days = emp_attendance_detail.attendance_detail.emp_present ? emp_attendance_detail.attendance_detail.emp_present : 0;
							break;
						} else {
							emp_present_days = 0;
						}
					}
					element = {
						srno: pos,
						emp_id: item.emp_id,
						emp_name: item.emp_name,
						emp_designation: item.emp_designation_detail.des_name,
						emp_pay_scale: item.emp_salary_detail.emp_salary_structure.emp_basic_pay_scale.bps_name,
						emp_salary_structure: item.emp_salary_detail.emp_salary_structure,
						emp_salary_heads: item.emp_salary_detail.emp_salary_structure.emp_salary_heads,
						emp_allowances: '',
						emp_total_earnings: item.emp_salary_detail.emp_salary_structure.emp_total_earning,
						emp_deductions: item.emp_salary_detail.emp_salary_structure.emp_deduction_detail,
						emp_present_days: emp_present_days,
						emp_salary_payable: item.emp_salary_detail.emp_salary_structure.emp_net_salary,
						emp_pay_mode: item.emp_salary_detail.emp_salary_structure.emp_pay_mode.pm_name,
						emp_total: item.emp_salary_detail.emp_salary_structure.emp_net_salary,
						emp_status: item.emp_status ? item.emp_status : 'live',
					};
					this.SALARY_COMPUTE_ELEMENT.push(element);
					pos++;

				}
				this.salaryComputeDataSource = new MatTableDataSource<SalaryComputeElement>(this.SALARY_COMPUTE_ELEMENT);
			}
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
}
