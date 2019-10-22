import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-employee-tab-three-container',
	templateUrl: './employee-tab-three-container.component.html',
	styleUrls: ['./employee-tab-three-container.component.scss']
})
export class EmployeeTabThreeContainerComponent implements OnInit, OnChanges {

	@ViewChild('general_remark') general_remark;
	@ViewChild('management_remark') management_remark;
	@ViewChild('admission_remark') admission_remark;

	addOnly = false;
	editOnly = false;
	viewOnly = true;
	saveFlag = false;
	isSubmit = false;
	login_id;
	parentId;
	generalRemarkData: any[] = [];
	admissionRemarkData: any;
	managementRemarkData: any;
	settingsArray: any[] = [];
	currentTab: number;
	salaryDetails: FormGroup;
	salaryDetailsArray: any[] = [];
	constructor(public commonAPIService: CommonAPIService, private fbuild: FormBuilder,
		private sisService: SisService) {

	}

	ngOnInit() {
		this.buildForm();
	}
	buildForm() {
		this.salaryDetails = this.fbuild.group({
			pan: '',
			aadhar: '',
			pf_ac: '',
			esi_ac: '',
			nominee: '',
			doj: '',
			pf_doj: '',
			esi_doj: '',
			probation: '',
			confirm_date: '',
			category_1: '',
			category_2: '',
			category_3: '',
			increment_month: '',
			contract_period: '',
			bank_name: '',
			bank_ac: '',
			ifsc_code: '',
			sal_str: '',
			pay_mode: '',
			basic_pay: '',
			da: '',
			hra: '',
			allowances: '',
			pf_deduction: '',
			esi_deduction: '',
			tds_deduction: '',
			net_salary: '',
			total_deduction: ''
		});
	}
	ngOnChanges() {
		// this.getRemarkData(this.login_id);
	}

	saveForm() {
		this.salaryDetailsArray['emp_salary_detail'] = {
			account_docment_detail: {
				pan_no: this.salaryDetails.value.pan,
				aadhar_no: this.salaryDetails.value.addhar,
				pf_acc_no: this.salaryDetails.value.pf_ac,
				esi_ac_no: this.salaryDetails.value.esi_ac
			},
			nominee_detail: {
				name: this.salaryDetails.value.nominee
			},
			emp_organisation_relation_detail: {
				doj: this.salaryDetails.value.doj,
				pf_joining_date: this.salaryDetails.value.pf_doj,
				esic_joining_date: this.salaryDetails.value.esi_doj,
				probation_till_date: this.salaryDetails.value.probation
			},
			emp_job_detail: {
				category_1: {
					cat_id: this.salaryDetails.value.category_1,
					cat_name: this.salaryDetails.value.category_1
				},
				category_2: {
					cat_id: this.salaryDetails.value.category_2,
					cat_name: this.salaryDetails.value.category_2
				},
				category_3: {
					cat_id: this.salaryDetails.value.category_3,
					cat_name: this.salaryDetails.value.category_3
				},
				contact_period: this.salaryDetails.value.contract_period
			},
			emp_incremental_month_detail: {
				month_data: {
					month_id: this.salaryDetails.value.increment_month,
					month_name: this.salaryDetails.value.increment_month
				}
			},
			emp_bank_detail: [
				{
					bnk_detail: {
						bnk_id: this.salaryDetails.value.bank_name,
						bnk_name: this.salaryDetails.value.bank_name,
						bnk_ifsc: this.salaryDetails.value.ifsc_code,
						bnk_acc_no: this.salaryDetails.value.bank_ac
					}
				}
			],
			emp_salary_structure: {
				emp_pay_scale: {
					pc_id: this.salaryDetails.value.sal_str,
					pc_name: this.salaryDetails.value.sal_str
				},
				emp_pay_mode: {
					pm_id: this.salaryDetails.value.pay_mode,
					pm_name: this.salaryDetails.value.pay_mode
				},
				emp_basic_pay_scale: {
					bps_id: this.salaryDetails.value.basic_pay,
					bps_name: this.salaryDetails.value.basic_pay
				},
				emp_salary_heads: [
					{
						id: '',
						name: '',
						value: ''
					}
				],
				emp_deduction_detail: [
					{
						pf_deduction: this.salaryDetails.value.pf_deduction,
						esic_deduction: this.salaryDetails.value.esi_deduction,
						tds_deduction: this.salaryDetails.value.tds_deduction
					}
				],
				emp_net_salary: this.salaryDetails.value.net_salary,
				emp_total_earning: this.salaryDetails.value.total_deduction
			}
		};

	}

}
