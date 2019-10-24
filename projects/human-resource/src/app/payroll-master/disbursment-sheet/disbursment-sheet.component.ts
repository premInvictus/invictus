import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';

@Component({
	selector: 'app-disbursment-sheet',
	templateUrl: './disbursment-sheet.component.html',
	styleUrls: ['./disbursment-sheet.component.scss']
})
export class DisbursmentSheetComponent implements OnInit {
	
	searchForm:FormGroup;
	employeeData:any;
	SALARY_DISBURSMENT_ELEMENT: SalaryDisbursmentElement[] = [];
	salaryDisbursmentDataSource = new MatTableDataSource<SalaryDisbursmentElement>(this.SALARY_DISBURSMENT_ELEMENT);
	// tslint:disable-next-line: max-line-length
	displayedSalaryDisbursmentColumns: string[] = ['srno', 'emp_id','emp_name','emp_designation','emp_pay_scale','emp_salary_heads',	'emp_allowances',	'emp_total_earnings',	'emp_deductions',	'emp_present_days',	'emp_salary_payable',	'emp_pay_mode',	'emp_categories','emp_total', 'emp_acc_no',	'emp_status'];

	constructor(
		private fbuild:FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService
	) { }

	ngOnInit() {
		this.buildForm();
		//this.getAllEmployee();
	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			month_id: '',
			pay_date: ''

		});
	}

	getAllEmployee() {
		if (this.searchForm.value.month_id) {
			let inputJson = {
				month_id : this.searchForm.value.month_id,
			};
			this.commonAPIService.getAllEmployee(inputJson).subscribe((result: any) => {
				console.log('result', result);
				let element: any = {};
				let recordArray = [];
				this.employeeData = result;
				this.SALARY_DISBURSMENT_ELEMENT = [];
				this.salaryDisbursmentDataSource = new MatTableDataSource<SalaryDisbursmentElement>(this.SALARY_DISBURSMENT_ELEMENT);
				if (result && result.length > 0) {
					let pos = 1;
					let recordArray = result;
					
					let emp_present_days;
					for (const item of recordArray) {
						for (var i = 0; i < item.emp_month_attendance_data.length;i++) {
							var emp_month = item.emp_month_attendance_data[i].month_id;
							var emp_attendance_detail = item.emp_month_attendance_data[i];
							if (parseInt(this.searchForm.value.month_id, 10) === parseInt(emp_month,10)) {
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
							emp_salary_heads: item.emp_salary_detail.emp_salary_structure.emp_salary_heads,
							emp_allowances: '',
							emp_total_earnings: item.emp_salary_detail.emp_salary_structure.emp_total_earning,
							emp_deductions: item.emp_salary_detail.emp_salary_structure.emp_deduction_detail,
							emp_present_days: emp_present_days,
							emp_salary_payable: item.emp_salary_detail.emp_salary_structure.emp_net_salary,
							emp_pay_mode: item.emp_salary_detail.emp_salary_structure.emp_pay_mode.pm_name,
							emp_categories:item.emp_job_detail,
							emp_total: item.emp_salary_detail.emp_salary_structure.emp_net_salary,
							emp_acc_no :item.emp_salary_detail.emp_bank_detail[0]['bnk_detail'].bnk_acc_no,
							emp_status: item.emp_status ? item.emp_status : 'live',
						};
						this.SALARY_DISBURSMENT_ELEMENT.push(element);
						pos++;
	
					}
					this.salaryDisbursmentDataSource = new MatTableDataSource<SalaryDisbursmentElement>(this.SALARY_DISBURSMENT_ELEMENT);
				}
			});
		}
	}

	openFilter() {

	}

	resetAll() {

	}

	print() {

	}
	
	applyFilter(filterValue: string) {
		this.salaryDisbursmentDataSource.filter = filterValue.trim().toLowerCase();
  	}
}


export interface SalaryDisbursmentElement {
	srno: number;
	emp_id: string;
	emp_name: string;
	emp_designation: string;
	emp_pay_scale: string;
	emp_salary_heads: any;
	emp_allowances: any;
	emp_total_earnings: any;
	emp_deductions: any;
	emp_present_days: any;
	emp_salary_payable: any;
	emp_pay_mode: any;
	emp_categories:any;
	emp_total: any;
	emp_acc_no :string;
	emp_status: any;
	
}