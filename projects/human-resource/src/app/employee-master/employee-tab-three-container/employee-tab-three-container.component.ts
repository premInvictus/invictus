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
	@Input() employeeCommonDetails;
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
	tempData: any[] = [];
	bankArray: any[] = [];
	componentData: any[] = [];
	formGroupArray2: any[] = [];
	salaryFinalArray: any[] = [];
	salaryHeadsArray: any[] = [];
	netSalary = 0;
	totalEarning = 0;
	deduction = 0;
	earning = 0;
	payMode: any[] = [
		{ id: 0, name: 'Bank Transfer' },
		{ id: 1, name: 'Cash Payment' },
		{ id: 2, name: 'Cheque Payment' }
	];
	honrificArr = [
		{ hon_id: "1", hon_name: 'Mr.' },
		{ hon_id: "2", hon_name: 'Mrs.' },
		{ hon_id: "3", hon_name: 'Miss.' },
		{ hon_id: "4", hon_name: 'Ms.' },
		{ hon_id: "5", hon_name: 'Mx.' },
		{ hon_id: "6", hon_name: 'Sir.' },
		{ hon_id: "7", hon_name: 'Dr.' },
		{ hon_id: "8", hon_name: 'Lady.' }

	];
	departmentArray;
	designationArray;
	wingArray;
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
		this.getDepartment();
		this.getDesignation();
		this.getWing();
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
	getDepartment() {
		this.sisService.getDepartment({}).subscribe((result: any) => {
			if (result && result.status == 'ok') {
				this.departmentArray = result.data;
			} else {
				this.departmentArray = [];
			}

		});
	}
	getDesignation() {
		this.commonAPIService.getMaster({ type_id: '2' }).subscribe((result: any) => {
			if (result) {
				this.designationArray = result;
			} else {
				this.designationArray = [];
			}

		});
	}
	getWing() {
		this.commonAPIService.getMaster({ type_id: '1' }).subscribe((result: any) => {
			if (result) {
				this.wingArray = result;
			} else {
				this.wingArray = [];
			}

		});
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
		this.categoryTwoArray = [];
		this.commonAPIService.getMaster({ type_id: '4' }).subscribe((res: any) => {
			if (res) {
				this.categoryTwoArray = res;
			}
		});
	}
	getCategoryTwoName(config_id) {
		const findex = this.categoryTwoArray.findIndex(e => Number(e.config_id) === Number(config_id));
		if (findex !== -1) {
			return this.categoryTwoArray[findex].name;
		}
	}
	getCategoryThree() {
		this.categoryThreeArray = [];
		this.commonAPIService.getMaster({ type_id: '5' }).subscribe((res: any) => {
			if (res) {
				this.categoryThreeArray = res;
			}
		});
	}
	getCategoryThreeName(config_id) {
		const findex = this.categoryThreeArray.findIndex(e => Number(e.config_id) === Number(config_id));
		if (findex !== -1) {
			return this.categoryThreeArray[findex].name;
		}
	}
	getPayScale() {
		this.commonAPIService.getSalaryStr().subscribe((res: any) => {
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
		this.tempData = [];
		this.scaleData = [];
		const findex = this.scaleArray.findIndex(e => Number(e.ss_id) === Number(this.salaryDetails.value.sal_str));
		if (findex !== -1) {
			this.tempData = this.scaleArray[findex].ss_component_data;
		} else {
			this.tempData = [];
		}
		for (let item of this.tempData) {
			if (item.sc_type.type_id === '1' || Number(item.sc_type.type_id) === 1) {
				this.scaleData.push(item);
			}
		}
		for (let item of this.tempData) {
			if (item.sc_type.type_id === '2' || Number(item.sc_type.type_id) === 2) {
				this.scaleData.push(item);
			}
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
		if (Number(value) > 0) {
			return Number((Number(value) * Number(weigtage)) / 100);
		} else {
			return 0;
		}
	}
	dateConversion(value, format) {
		const datePipe = new DatePipe('en-in');
		return datePipe.transform(value, format);
	}
	getSalartDetails() {
		this.salaryHeadsArray = this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_salary_structure && this.employeedetails.emp_salary_detail.emp_salary_structure.emp_salary_heads ? this.employeedetails.emp_salary_detail.emp_salary_structure.emp_salary_heads : '';

		this.salaryDetails.patchValue({
			pan: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.account_docment_detail ? this.employeedetails.emp_salary_detail.account_docment_detail.pan_no : '',
			aadhar: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.account_docment_detail ? this.employeedetails.emp_salary_detail.account_docment_detail.aadhar_no : '',
			pf_ac: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.account_docment_detail ? this.employeedetails.emp_salary_detail.account_docment_detail.pf_acc_no : '',
			esi_ac: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.account_docment_detail ? this.employeedetails.emp_salary_detail.account_docment_detail.esi_ac_no : '',
			nominee: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.account_docment_detail ? this.employeedetails.emp_salary_detail.nominee_detail.name : '',
			doj: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_organisation_relation_detail ? this.dateConversion(this.employeedetails.emp_salary_detail.emp_organisation_relation_detail.doj, 'yyyy-MM-dd') : '',
			pf_doj: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_organisation_relation_detail ? this.dateConversion(this.employeedetails.emp_salary_detail.emp_organisation_relation_detail.pf_joining_date, 'yyyy-MM-dd') : '',
			esi_doj: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_organisation_relation_detail ? this.dateConversion(this.employeedetails.emp_salary_detail.emp_organisation_relation_detail.esic_joining_date, 'yyyy-MM-dd') : '',
			probation: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_organisation_relation_detail ? this.dateConversion(this.employeedetails.emp_salary_detail.emp_organisation_relation_detail.probation_till_date, 'yyyy-MM-dd') : '',
			confirm_date: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_organisation_relation_detail ? this.dateConversion(this.employeedetails.emp_salary_detail.emp_organisation_relation_detail.confirmation_date, 'yyyy-MM-dd') : '',
			//category_1: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_job_detail ? this.employeedetails.emp_salary_detail.emp_job_detail.category_1.cat_id : '',
			category_2: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_job_detail ? Number(this.employeedetails.emp_salary_detail.emp_job_detail.category_1.cat_id) : '',
			category_3: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_job_detail ? Number(this.employeedetails.emp_salary_detail.emp_job_detail.category_2.cat_id) : '',
			increment_month: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_incremental_month_detail ? this.employeedetails.emp_salary_detail.emp_incremental_month_detail.month_data : '',
			contract_period: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_job_detail ? this.employeedetails.emp_salary_detail.emp_job_detail.contact_period : '',
			bank_name: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_bank_detail[0] ? this.employeedetails.emp_salary_detail.emp_bank_detail[0].bnk_detail.bnk_id : '',
			bank_ac: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_bank_detail[0] ? this.employeedetails.emp_salary_detail.emp_bank_detail[0].bnk_detail.bnk_acc_no : '',
			ifsc_code: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_bank_detail[0] ? this.employeedetails.emp_salary_detail.emp_bank_detail[0].bnk_detail.bnk_ifsc : '',
			sal_str: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_salary_structure && this.employeedetails.emp_salary_detail.emp_salary_structure.emp_pay_scale ? parseInt(this.employeedetails.emp_salary_detail.emp_salary_structure.emp_pay_scale.pc_id, 10) : '',
			pay_mode: this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_salary_structure && this.employeedetails.emp_salary_detail.emp_salary_structure.emp_pay_mode && this.employeedetails.emp_salary_detail.emp_salary_structure.emp_pay_mode ? parseInt(this.employeedetails.emp_salary_detail.emp_salary_structure.emp_pay_mode.pm_id, 10) : '',
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
		if (this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_salary_structure && this.employeedetails.emp_salary_detail.emp_salary_structure.emp_pay_scale && this.employeedetails.emp_salary_detail.emp_salary_structure.emp_pay_scale.pc_id) {
			this.onChangeData();
			this.netSalary = this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_salary_structure ? this.employeedetails.emp_salary_detail.emp_salary_structure.emp_net_salary : '';
			this.totalEarning = this.employeedetails.emp_salary_detail && this.employeedetails.emp_salary_detail.emp_salary_structure ? this.employeedetails.emp_salary_detail.emp_salary_structure.emp_total_earning : '';
		}


	}
	saveForm() {
		if (this.salaryDetails.valid) {
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
			if (this.employeedetails) {
				this.employeedetails.emp_id = this.employeeCommonDetails.employeeDetailsForm.value.emp_id;
				this.employeedetails.emp_name = this.employeeCommonDetails.employeeDetailsForm.value.emp_name;
				this.employeedetails.emp_profile_pic = this.employeeCommonDetails.employeeDetailsForm.value.emp_profile_pic;
				this.employeedetails.emp_department_detail = {
					dpt_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_department_id,
					dpt_name: this.getDepartmentName(this.employeeCommonDetails.employeeDetailsForm.value.emp_department_id)
				};
				this.employeedetails.emp_designation_detail = {
					des_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_designation_id,
					des_name: this.getDesignationName(this.employeeCommonDetails.employeeDetailsForm.value.emp_designation_id)
				};
				this.employeedetails.emp_honorific_detail = {
					hon_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_honorific_id,
					hon_name: this.getHonorificName(this.employeeCommonDetails.employeeDetailsForm.value.emp_honorific_id)
				};
				this.employeedetails.emp_wing_detail = {
					wing_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_wing_id,
					wing_name: this.getWingName(this.employeeCommonDetails.employeeDetailsForm.value.emp_wing_id)
				};
				this.employeedetails.emp_category_detail = {
					cat_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_category_id,
					cat_name: this.getCategoryOneName(this.employeeCommonDetails.employeeDetailsForm.value.emp_category_id)
				};
			}
			this.commonAPIService.updateEmployee(this.employeedetails).subscribe((result: any) => {
				if (result) {
					this.commonAPIService.renderTab.next({ tabMove: true });
					this.commonAPIService.showSuccessErrorMessage('Employee Salary Detail Submitted Successfylly', 'success');
				} else {
					this.commonAPIService.showSuccessErrorMessage('Error While Inserting Employee Salary Details', 'error');
				}
			});

		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all required field', 'error');
		}
	}

	updateForm(moveNext) {
		if (this.salaryDetails.valid) {
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
						cat_id: this.salaryDetails.value.category_2,
						cat_name: this.getCategoryTwoName(this.salaryDetails.value.category_2)
					},
					category_2: {
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
			if (this.employeedetails) {
				this.employeedetails.emp_id = this.employeeCommonDetails.employeeDetailsForm.value.emp_id;
				this.employeedetails.emp_name = this.employeeCommonDetails.employeeDetailsForm.value.emp_name;
				this.employeedetails.emp_profile_pic = this.employeeCommonDetails.employeeDetailsForm.value.emp_profile_pic;
				this.employeedetails.emp_department_detail = {
					dpt_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_department_id,
					dpt_name: this.getDepartmentName(this.employeeCommonDetails.employeeDetailsForm.value.emp_department_id)
				};
				this.employeedetails.emp_designation_detail = {
					des_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_designation_id,
					des_name: this.getDesignationName(this.employeeCommonDetails.employeeDetailsForm.value.emp_designation_id)
				};
				this.employeedetails.emp_honorific_detail = {
					hon_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_honorific_id,
					hon_name: this.getHonorificName(this.employeeCommonDetails.employeeDetailsForm.value.emp_honorific_id)
				};
				this.employeedetails.emp_wing_detail = {
					wing_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_wing_id,
					wing_name: this.getWingName(this.employeeCommonDetails.employeeDetailsForm.value.emp_wing_id)
				};
				this.employeedetails.emp_category_detail = {
					cat_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_category_id,
					cat_name: this.getCategoryOneName(this.employeeCommonDetails.employeeDetailsForm.value.emp_category_id)
				};
			}

			this.commonAPIService.updateEmployee(this.employeedetails).subscribe((result: any) => {
				if (result) {
					if (!moveNext) {
						this.commonAPIService.renderTab.next({ tabMove: true });
					} else {
						this.getSalartDetails();
						this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
					}
					this.commonAPIService.showSuccessErrorMessage('Employee Salary Details Updated Successfully', 'success');

				} else {
					this.commonAPIService.showSuccessErrorMessage('Error While Updating Employee Salary Details', 'error');
				}
			});

		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all Required field', 'error');
		}
	}
	getNetSalary() {
		this.earning = 0;
		this.deduction = 0;
		this.totalEarning = 0;
		this.netSalary = 0;
		this.salaryFinalArray = [];
		if (this.formGroupArray2.length > 0) {
			let i = 0;
			this.netSalary = this.salaryDetails.value.basic_pay;
			for (const item of this.formGroupArray2) {
				if (item.formGroup.value['sc_calculation_type' + i].toLowerCase() === 'text') {
					if (Number(item.formGroup.value['type' + i]) === 1) {
						if (item.formGroup.value['sc_value' + i] === '') {
							this.earning = this.earning + Number(this.getValue(item.formGroup.value['sc_id' + i]));
							this.netSalary = Number(this.netSalary) + Number(this.getValue(item.formGroup.value['sc_id' + i]));
						} else {
							this.earning = this.earning + Number(item.formGroup.value['sc_value' + i]);
							this.netSalary = Number(this.netSalary) + Number(item.formGroup.value['sc_value' + i]);
						}

					} else {
						if (item.formGroup.value['sc_value' + i] === '') {
							this.deduction = this.deduction + Number(this.getValue(item.formGroup.value['sc_id' + i]));
							this.netSalary = Number(this.netSalary) - Number(this.getValue(item.formGroup.value['sc_id' + i]));
						} else {
							this.deduction = this.deduction + Number(item.formGroup.value['sc_value' + i]);
							this.netSalary = Number(this.netSalary) - Number(item.formGroup.value['sc_value' + i]);
						}
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
	getDepartmentName(dpt_id) {
		const findIndex = this.departmentArray.findIndex(f => Number(f.dept_id) === Number(dpt_id));
		if (findIndex !== -1) {
			return this.departmentArray[findIndex].dept_name;
		}
	}
	getHonorificName(hon_id) {
		const findIndex = this.honrificArr.findIndex(f => Number(f.hon_id) === Number(hon_id));
		if (findIndex !== -1) {
			return this.honrificArr[findIndex].hon_name;
		}
	}

	getWingName(wing_id) {
		const findIndex = this.wingArray.findIndex(f => Number(f.config_id) === Number(wing_id));
		if (findIndex !== -1) {
			return this.wingArray[findIndex].name;
		}
	}
	getDesignationName(des_id) {
		const findIndex = this.designationArray.findIndex(f => Number(f.config_id) === Number(des_id));
		if (findIndex !== -1) {
			return this.designationArray[findIndex].name;
		}
	}
	getValue(event) {
		if (this.salaryHeadsArray.length > 0) {
			const findIndex = this.salaryHeadsArray.findIndex(f => Number(f.sc_id) === Number(event));
			if (findIndex !== -1) {
				return this.salaryHeadsArray[findIndex].sc_value;
			}
		} else {
			return 0;
		}
	}


}
