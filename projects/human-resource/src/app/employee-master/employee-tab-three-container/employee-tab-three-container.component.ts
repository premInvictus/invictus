import { Component, OnInit, ViewChild, OnChanges, Input } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { saveAs } from 'file-saver';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
@Component({
	selector: 'app-employee-tab-three-container',
	templateUrl: './employee-tab-three-container.component.html',
	styleUrls: ['./employee-tab-three-container.component.scss']
})
export class EmployeeTabThreeContainerComponent implements OnInit, OnChanges {
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	@Input() employeedetails;
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
	documentsArray: any;
	currentTab: number;
	salaryDetails: FormGroup;
	salaryDetailsArray: any[] = [];
	constructor(public commonAPIService: CommonAPIService, private fbuild: FormBuilder,
		private sisService: SisService) {

	}

	ngOnInit() {
		this.buildForm();
		if (this.employeedetails) {
			this.getSalartDetails();
		}

		this.commonAPIService.reRenderForm.subscribe((data: any) => {
			console.log('data', data);
			if (data) {
				if (data.addMode) {
					this.setActionControls({ addMode: true });
				}
			}
		});
	}

	setActionControls(data) {
		if (data.addMode) {
			this.addOnly = true;
			this.salaryDetails.patchValue({
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
		if (data.editMode) {
			this.editOnly = true;
			//this.viewOnly = false;
			this.saveFlag = true;
		}
		if (data.viewMode) {
			this.viewOnly = true;
			this.saveFlag = false;


		}
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
		this.buildForm();
		// this.getRemarkData(this.login_id);

		if (this.employeedetails) {
			this.getSalartDetails();
		}
	}

	getSalartDetails() {
		if (this.employeedetails && this.salaryDetails) {
			this.salaryDetails.patchValue({
				pan: this.employeedetails.emp_salary_detail.account_docment_detail.pan_no,
				aadhar: this.employeedetails.emp_salary_detail.account_docment_detail.aadhar_no,
				pf_ac: this.employeedetails.emp_salary_detail.account_docment_detail.pf_acc_no,
				esi_ac: this.employeedetails.emp_salary_detail.account_docment_detail.esi_acc_no,
				nominee: this.employeedetails.emp_salary_detail.nominee_detail.name,
				doj: this.employeedetails.emp_salary_detail.emp_organisation_relation_detail.doj,
				pf_doj: this.employeedetails.emp_salary_detail.emp_organisation_relation_detail.pf_joining_date,
				esi_doj: this.employeedetails.emp_salary_detail.emp_organisation_relation_detail.esic_joining_date,
				probation: this.employeedetails.emp_salary_detail.emp_organisation_relation_detail.probation_till_date,
				confirm_date: this.employeedetails.emp_salary_detail.emp_organisation_relation_detail.confirmation_date,
				category_1: this.employeedetails.emp_salary_detail.emp_job_detail.category_1.cat_id,
				category_2: this.employeedetails.emp_salary_detail.emp_job_detail.category_2.cat_id,
				category_3: this.employeedetails.emp_salary_detail.emp_job_detail.category_3.cat_id,
				increment_month: this.employeedetails.emp_salary_detail.emp_incremental_month_detail.month_data,
				contract_period: this.employeedetails.emp_salary_detail.emp_job_detail.contact_period,
				bank_name: this.employeedetails.emp_salary_detail.emp_bank_detail[0].bnk_detail.bnk_id,
				bank_ac: this.employeedetails.emp_salary_detail.emp_bank_detail[0].bnk_detail.bnk_acc_no,
				ifsc_code: this.employeedetails.emp_salary_detail.emp_bank_detail[0].bnk_detail.bnk_ifsc,
				sal_str: this.employeedetails.emp_salary_detail.emp_bank_detail[0].bnk_detail.bnk_name,
				pay_mode: '',
				basic_pay: '',
				da: '',
				hra: '',
				allowances: '',
				pf_deduction: '',
				esi_deduction: '',
				tds_deduction: '',
				net_salary: this.employeedetails.emp_salary_detail.emp_net_salary ? this.employeedetails.emp_salary_detail.emp_net_salary : 0,
				total_deduction: this.employeedetails.emp_salary_detail.emp_total_earning ? this.employeedetails.emp_salary_detail.emp_total_earning : 0,
			});
		}

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
				probation_till_date: this.salaryDetails.value.probation,
				confirmation_date: this.salaryDetails.value.confirm_date
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
				month_data: this.salaryDetails.value.increment_month
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
