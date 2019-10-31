import { Component, OnInit, ViewChild, OnChanges, Input } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { saveAs } from 'file-saver';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { FeeService } from 'projects/fee/src/app/_services';
import { DatePipe } from '@angular/common';
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
	categoryOneArray: any[] = [];
	categoryTwoArray: any[] = [];
	categoryThreeArray: any[] = [];
	scaleArray: any[] = [];
	scaleData: any[] = [];
	bankArray: any[] = [];
	componentData: any[] = [];
	formGroupArray2: any[] = [];
	salaryFinalArray: any[] = [];
	netSalary = 0;
	totalEarning = 0;
	deduction = 0;
	earning = 0;
	payMode: any[] = [
		{ id: 0, name: 'Bank Transfer' },
		{ id: 1, name: 'Cash Payment' },
		{ id: 2, name: 'Cheque Payment' }
	];
	constructor(
		public commonAPIService: CommonAPIService,
		private fbuild: FormBuilder,
		private feeService: FeeService,
		private sisService: SisService
	) { }
	ngOnInit() {
		this.commonAPIService.reRenderForm.subscribe((data: any) => {
			if (data) {
				if (data.addMode) {
					this.setActionControls({ addMode: true });
				}
				if (data.editMode) {
					this.setActionControls({ editMode: true });
				} 
				if (data.viewMode) {
					this.setActionControls({ viewMode: true });
				} 
			}
		});
	}
	setActionControls(data) {
		if (data.addMode) {
			this.addOnly = true;
			this.editOnly = false;
			this.viewOnly = false;
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
				total_earning: ''
			});
		}
		if (data.editMode) {
			this.editOnly = true;
			this.saveFlag = true;
			this.viewOnly = false;
			this.addOnly = false;
		}
		if (data.viewMode) {
			this.viewOnly = true;
			this.addOnly = false;
			this.editOnly = false;
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
			total_earning: ''
		});
	}
	ngOnChanges() {
		this.buildForm();
		this.getPayScale();
		this.getBank();
		this.getCategoryOne();
		this.getCategoryTwo();
		this.getCategoryThree();		
		if (this.employeedetails) {						
			this.getSalartDetails();
			this.onChangeData();
		}
		
	}
	getPayModeName(id) {
		const findex = this.payMode.findIndex(e => Number(e.id) === Number(id));
		if (findex !== -1) {
			return this.payMode[findex].name;
		}
	}
	getCategoryOne() {
		this.commonAPIService.getCategoryOne({}).subscribe((res: any) => {
			if (res) {
				this.categoryOneArray = [];
				this.categoryOneArray = res;
			}
		});
	}
	getCategoryOneName(cat_id) {
		const findex = this.categoryOneArray.findIndex(e => Number(e.cat_id) === Number(cat_id));
		if (findex !== -1) {
			return this.categoryOneArray[findex].cat_name;
		}
	}
	getCategoryTwo() {
		this.commonAPIService.getCategoryTwo({}).subscribe((res: any) => {
			if (res) {
				this.categoryTwoArray = [];
				this.categoryTwoArray = res;
			}
		});
	}
	getCategoryTwoName(cat_id) {
		const findex = this.categoryTwoArray.findIndex(e => Number(e.cat_id) === Number(cat_id));
		if (findex !== -1) {
			return this.categoryTwoArray[findex].cat_name;
		}
	}
	getCategoryThree() {
		this.commonAPIService.getCategoryThree({}).subscribe((res: any) => {
			if (res) {
				this.categoryThreeArray = [];
				this.categoryThreeArray = res;
			}
		});
	}
	getCategoryThreeName(cat_id) {
		const findex = this.categoryThreeArray.findIndex(e => Number(e.cat_id) === Number(cat_id));
		if (findex !== -1) {
			return this.categoryThreeArray[findex].cat_name;
		}
	}
	getPayScale() {
		this.commonAPIService.getSalaryStructure({}).subscribe((res: any) => {
			if (res) {
				this.scaleArray = [];
				this.scaleArray = res;
			}
		});
	}

	getPayScaleName(ss_id) {
		const findex = this.scaleArray.findIndex(e => Number(e.ss_id) === Number(ss_id));
		if (findex !== -1) {
			return this.scaleArray[findex].ss_name;
		}
	}
	getBank() {
		this.feeService.getBanksAll({}).subscribe((res: any) => {
			if (res) {
				this.bankArray = [];
				this.bankArray = res.data;
			}
		});
	}
	getBankName(bank_id) {
		const findex = this.bankArray.findIndex(e => Number(e.tb_id) === Number(bank_id));
		if (findex !== -1) {
			return this.bankArray[findex].tb_name;
		}
	}

	onChangeData() {
		const findex = this.scaleArray.findIndex(e => Number(e.ss_id) === Number(this.salaryDetails.value.sal_str));
		if (findex !== -1) {
			this.scaleData = this.scaleArray[findex].ss_component_data;
		} else {
			this.scaleData = [];
		}
		let i = 0;
		for (let item of this.scaleData) {
			const salaryData: any = {};
			salaryData['sc_calculation_type' + i] = item.sc_calculation_type;
			salaryData['sc_name' + i] = item.sc_name;
			salaryData['sc_order' + i] = item.sc_order;
			salaryData['sc_id' + i] = item.sc_id;
			salaryData['sc_type' + i] = item.sc_type;
			salaryData['type' + i] = item.sc_type.type_id;
			salaryData['sc_value' + i] = item.sc_value;
			this.formGroupArray2.push({
				formGroup: this.fbuild.group(salaryData)
			});
			i++;
		}
	}
	getDynamicValue(weigtage, value) {
		if (value > 0) {
			return (value * weigtage) / 100;
		} else {
			return 0;
		}
	}
	dateConversion(value, format) {
		const datePipe = new DatePipe('en-in');
		return datePipe.transform(value, format);
	}
	getSalartDetails() {
		console.log('this.employeedetails', this.employeedetails);
		if (this.employeedetails) {
			this.salaryDetails.patchValue({
				pan: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.account_docment_detail ? this.employeedetails.emp_salary_detail.account_docment_detail.pan_no : '',
				aadhar: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.account_docment_detail ? this.employeedetails.emp_salary_detail.account_docment_detail.aadhar_no: '',
				pf_ac: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.account_docment_detail ? this.employeedetails.emp_salary_detail.account_docment_detail.pf_acc_no : '',
				esi_ac: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.account_docment_detail ? this.employeedetails.emp_salary_detail.account_docment_detail.esi_ac_no : '',
				nominee: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.account_docment_detail ? this.employeedetails.emp_salary_detail.nominee_detail.name : '',
				doj: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_organisation_relation_detail ? this.dateConversion(this.employeedetails.emp_salary_detail.emp_organisation_relation_detail.doj, 'yyyy-MM-dd') : '',
				pf_doj: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_organisation_relation_detail ?  this.dateConversion(this.employeedetails.emp_salary_detail.emp_organisation_relation_detail.pf_joining_date, 'yyyy-MM-dd') : '',
				esi_doj: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_organisation_relation_detail ?  this.dateConversion(this.employeedetails.emp_salary_detail.emp_organisation_relation_detail.esic_joining_date, 'yyyy-MM-dd') : '',
				probation: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_organisation_relation_detail ?  this.dateConversion(this.employeedetails.emp_salary_detail.emp_organisation_relation_detail.probation_till_date, 'yyyy-MM-dd') : '',
				confirm_date: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_organisation_relation_detail ?  this.dateConversion(this.employeedetails.emp_salary_detail.emp_organisation_relation_detail.confirmation_date, 'yyyy-MM-dd') : '',
				category_1: this.employeedetails.emp_salary_detail.emp_job_detail ? this.employeedetails.emp_salary_detail.emp_job_detail.category_1.cat_id : '',
				category_2: this.employeedetails.emp_salary_detail.emp_job_detail ? this.employeedetails.emp_salary_detail.emp_job_detail.category_2.cat_id : '',
				category_3: this.employeedetails.emp_salary_detail.emp_job_detail ? this.employeedetails.emp_salary_detail.emp_job_detail.category_3.cat_id : '',
				increment_month: this.employeedetails.emp_salary_detail.emp_incremental_month_detail ? this.employeedetails.emp_salary_detail.emp_incremental_month_detail.month_data : '',
				contract_period: this.employeedetails.emp_salary_detail.emp_job_detail ? this.employeedetails.emp_salary_detail.emp_job_detail.contact_period : '',
				bank_name:this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_bank_detail[0] ? this.employeedetails.emp_salary_detail.emp_bank_detail[0].bnk_detail.bnk_id : '',
				bank_ac: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_bank_detail[0] ? this.employeedetails.emp_salary_detail.emp_bank_detail[0].bnk_detail.bnk_acc_no : '',
				ifsc_code: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_bank_detail[0] ? this.employeedetails.emp_salary_detail.emp_bank_detail[0].bnk_detail.bnk_ifsc : '',
				sal_str: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_salary_structure ? parseInt(this.employeedetails.emp_salary_detail.emp_salary_structure.emp_pay_scale.pc_id,10) : '',
				pay_mode: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_salary_structure  && this.employeedetails.emp_salary_detail.emp_salary_structure.emp_pay_mode ? parseInt(this.employeedetails.emp_salary_detail.emp_salary_structure.emp_pay_mode.pm_id, 10) : '',
				basic_pay: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_salary_structure && this.employeedetails.emp_salary_detail.emp_salary_structure.emp_basic_pay_scale ? this.employeedetails.emp_salary_detail.emp_salary_structure.emp_basic_pay_scale : '',
				da: '',
				hra: '',
				allowances: '',
				pf_deduction: '',
				esi_deduction: '',
				tds_deduction: '',
				net_salary: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_salary_structure ? this.employeedetails.emp_salary_detail.emp_salary_structure.emp_net_salary : '',
				total_earning: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_salary_structure ? this.employeedetails.emp_salary_detail.emp_salary_structure.emp_total_earning : '',
			});
			if (this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_salary_structure && this.employeedetails.emp_salary_detail.emp_salary_structure.emp_pay_scale.pc_id) {
				this.onChangeData();
				this.netSalary = this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_salary_structure ? this.employeedetails.emp_salary_detail.emp_salary_structure.emp_net_salary : '';
				this.totalEarning = this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_salary_structure ? this.employeedetails.emp_salary_detail.emp_salary_structure.emp_total_earning : '';
			}
		}

	}
	saveForm() {
		this.employeedetails['emp_salary_detail'] = {
			account_docment_detail: {
				pan_no: this.salaryDetails.value.pan,
				aadhar_no: this.salaryDetails.value.aadhar,
				pf_acc_no: this.salaryDetails.value.pf_ac,
				esi_ac_no: this.salaryDetails.value.esi_ac
			},
			nominee_detail: {
				name: this.salaryDetails.value.nominee
			},
			emp_organisation_relation_detail: {
				doj: this.dateConversion(this.salaryDetails.value.doj, 'yyyy-MM-dd'),
				pf_joining_date: this.dateConversion(this.salaryDetails.value.pf_doj, 'yyyy-MM-dd'),
				esic_joining_date: this.dateConversion(this.salaryDetails.value.esi_doj, 'yyyy-MM-dd'),
				probation_till_date: this.dateConversion(this.salaryDetails.value.probation, 'yyyy-MM-dd'),
				confirmation_date: this.dateConversion(this.salaryDetails.value.confirm_date, 'yyyy-MM-dd')
			},
			emp_job_detail: {
				category_1: {
					cat_id: this.salaryDetails.value.category_1,
					cat_name: this.getCategoryOneName(this.salaryDetails.value.category_1)
				},
				category_2: {
					cat_id: this.salaryDetails.value.category_2,
					cat_name: this.getCategoryTwoName(this.salaryDetails.value.category_2)
				},
				category_3: {
					cat_id: this.salaryDetails.value.category_3,
					cat_name: this.getCategoryThreeName(this.salaryDetails.value.category_3)
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
						bnk_name: this.getBankName(this.salaryDetails.value.bank_name),
						bnk_ifsc: this.salaryDetails.value.ifsc_code,
						bnk_acc_no: this.salaryDetails.value.bank_ac
					}
				}
			],
			emp_salary_structure: {
				emp_pay_scale: {
					pc_id: this.salaryDetails.value.sal_str,
					pc_name: this.getPayScaleName(this.salaryDetails.value.sal_str)
				},
				emp_pay_mode: {
					pm_id: this.salaryDetails.value.pay_mode,
					pm_name: this.getPayModeName(this.salaryDetails.value.pay_mode)
				},
				emp_basic_pay_scale: this.salaryDetails.value.basic_pay,
				emp_salary_heads: this.salaryFinalArray,
				emp_deduction_detail: [
					{
						pf_deduction: this.salaryDetails.value.pf_deduction,
						esic_deduction: this.salaryDetails.value.esi_deduction,
						tds_deduction: this.salaryDetails.value.tds_deduction
					}
				],
				emp_net_salary: this.netSalary,
				emp_total_earning: this.totalEarning
			}
		};
		this.commonAPIService.updateEmployee(this.employeedetails).subscribe((result: any) => {
			if (result) {
				this.commonAPIService.renderTab.next({ tabMove: true });
				this.commonAPIService.showSuccessErrorMessage('Employee Salary Detail Submitted Successfylly', 'success');
			} else {
				this.commonAPIService.showSuccessErrorMessage('Error While Inserting Employee Salary Details', 'error');
			}
		});
	}

	updateForm(moveNext) {
		this.employeedetails['emp_salary_detail'] = {
			account_docment_detail: {
				pan_no: this.salaryDetails.value.pan,
				aadhar_no: this.salaryDetails.value.aadhar,
				pf_acc_no: this.salaryDetails.value.pf_ac,
				esi_ac_no: this.salaryDetails.value.esi_ac
			},
			nominee_detail: {
				name: this.salaryDetails.value.nominee
			},
			emp_organisation_relation_detail: {
				doj: this.dateConversion(this.salaryDetails.value.doj, 'yyyy-MM-dd'),
				pf_joining_date: this.dateConversion(this.salaryDetails.value.pf_doj, 'yyyy-MM-dd'),
				esic_joining_date: this.dateConversion(this.salaryDetails.value.esi_doj, 'yyyy-MM-dd'),
				probation_till_date: this.dateConversion(this.salaryDetails.value.probation, 'yyyy-MM-dd'),
				confirmation_date: this.dateConversion(this.salaryDetails.value.confirm_date, 'yyyy-MM-dd')
			},
			emp_job_detail: {
				category_1: {
					cat_id: this.salaryDetails.value.category_1,
					cat_name: this.getCategoryOneName(this.salaryDetails.value.category_1)
				},
				category_2: {
					cat_id: this.salaryDetails.value.category_2,
					cat_name: this.getCategoryTwoName(this.salaryDetails.value.category_2)
				},
				category_3: {
					cat_id: this.salaryDetails.value.category_3,
					cat_name: this.getCategoryThreeName(this.salaryDetails.value.category_3)
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
						bnk_name: this.getBankName(this.salaryDetails.value.bank_name),
						bnk_ifsc: this.salaryDetails.value.ifsc_code,
						bnk_acc_no: this.salaryDetails.value.bank_ac
					}
				}
			],
			emp_salary_structure: {
				emp_pay_scale: {
					pc_id: this.salaryDetails.value.sal_str,
					pc_name: this.getPayScaleName(this.salaryDetails.value.sal_str)
				},
				emp_pay_mode: {
					pm_id: this.salaryDetails.value.pay_mode,
					pm_name: this.getPayModeName(this.salaryDetails.value.pay_mode)
				},
				emp_basic_pay_scale: this.salaryDetails.value.basic_pay,
				emp_salary_heads: this.salaryFinalArray,
				emp_deduction_detail: [
					{
						pf_deduction: this.salaryDetails.value.pf_deduction,
						esic_deduction: this.salaryDetails.value.esi_deduction,
						tds_deduction: this.salaryDetails.value.tds_deduction
					}
				],
				emp_net_salary: this.netSalary,
				emp_total_earning: this.totalEarning
			}
		};

		this.commonAPIService.updateEmployee(this.employeedetails).subscribe((result: any) => {
			if (result) {
				if (moveNext) {
					this.commonAPIService.renderTab.next({ tabMove: true });
				}
				this.commonAPIService.showSuccessErrorMessage('Employee Salary Details Updated Successfully', 'success');
				
			} else {
				this.commonAPIService.showSuccessErrorMessage('Error While Updating Employee Salary Details', 'error');
			}
		});
	}


	getNetSalary() {
		this.earning = 0;
		this.deduction = 0;
		this.totalEarning = 0;
		this.netSalary = 0;

		this.salaryFinalArray = [];
		console.log(this.formGroupArray2);
		if (this.formGroupArray2.length > 0) {
			let i = 0;
			this.netSalary = this.salaryDetails.value.basic_pay;
			for (const item of this.formGroupArray2) {
				if (item.formGroup.value['sc_calculation_type' + i] === 'text') {
					if (Number(item.formGroup.value['type' + i]) === 1) {
						this.earning = this.earning + Number(item.formGroup.value['sc_value' + i]);
						this.netSalary = Number(this.netSalary) + Number(item.formGroup.value['sc_value' + i]);
					} else {
						this.deduction = this.deduction + Number(item.formGroup.value['sc_value' + i]);
						this.netSalary = Number(this.netSalary) - Number(item.formGroup.value['sc_value' + i]);
					}

				} else if (item.formGroup.value['sc_calculation_type' + i] === '%') {
					if (Number(item.formGroup.value['type' + i]) === 1) {
						this.earning = this.earning + Number((this.salaryDetails.value.basic_pay * item.formGroup.value['sc_value' + i]) / 100);
						this.netSalary = Number(this.netSalary) + Number((this.salaryDetails.value.basic_pay * item.formGroup.value['sc_value' + i]) / 100);
					} else {
						this.deduction = this.deduction + Number((this.salaryDetails.value.basic_pay * item.formGroup.value['sc_value' + i]) / 100);
						this.netSalary = Number(this.netSalary) - Number((this.salaryDetails.value.basic_pay * item.formGroup.value['sc_value' + i]) / 100);
					}
				}
				this.salaryFinalArray.push(
					{
						sc_calculation_type: item.formGroup.value['sc_calculation_type' + i],
						sc_id: item.formGroup.value['sc_id' + i],
						sc_name: item.formGroup.value['sc_name' + i],
						sc_order: item.formGroup.value['sc_order' + i],
						sc_type: item.formGroup.value['sc_type' + i],
						sc_value: item.formGroup.value['sc_value' + i]
					}
				);
				i++;
			}
			this.totalEarning = Number(this.salaryDetails.value.basic_pay) + Number(this.deduction) + Number(this.earning);
		}
	}
	cancelForm() {
		if (this.addOnly) {
			this.commonAPIService.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
		} else if (this.saveFlag) {
			this.getSalartDetails();
			this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
		}
	}

	remainOnSame() {
		
	}

}
