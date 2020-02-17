import { Component, OnInit, ViewChild, OnChanges, Input, ComponentRef } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';

@Component({
	selector: 'app-emp-enq-tab-one',
	templateUrl: './emp-enq-tab-one.component.html',
	styleUrls: ['./emp-enq-tab-one.component.scss']
})
export class EmpEnqTabOneComponent implements OnInit {
	private componentRef: ComponentRef<{}>;
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	@Input() employeeCommonDetails;
	@Input() employeedetails;
	personalDetails: FormGroup;
	personaldetails: any = {};
	cityId: any;
	cityId2: any;
	addressFlag = false;
	requiredOnly = false;
	panelOpenState = true;
	addOnly = false;
	editOnly = false;
	viewOnly = true;
	saveFlag = false;
	cityCountryArray: any[] = [];
	editRequestFlag = false;
	taboneform: any = {};
	login_id = '';
	studentdetails: any = {};
	parentDetails2: any = {};
	addressDetails: any[] = [];
	arrayState: any[] = [];
	parentJson: any[] = [];
	reqParamArray = [];
	finalSibReqArray = [];
	finalSibReqArray2 = [];
	checkChangedFieldsArray: any = [];
	finalArray: any = [];
	settingsArray: any[] = [];
	parentId;
	categoryOneArray: any[] = [];
	disabledApiButton = false;
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
	@ViewChild('editReference') editReference;

	constructor(public commonAPIService: CommonAPIService,
		private sisService: SisService, private fbuild: FormBuilder) {

	}
	setActionControls(data) {
		if (data.addMode) {
			this.addOnly = true;
			this.editOnly = false;
			this.viewOnly = false;
			this.personalDetails.patchValue({
				p_address: '',
				p_city: '',
				p_state: '',
				p_pincode: '',
				r_address: '',
				r_city: '',
				r_state: '',
				r_pincode: '',
				pri_mobile: '',
				sec_mobile: '',
				whatsapp_no: '',
				email_id: '',
				same_as_residential: false,
				emp_status: 'live',
				gender: '',
				dob: ''
			});
			this.addressFlag = false;
			this.requiredOnly = false;
		}
		if (data.editMode) {
			this.editOnly = true;
			this.addOnly = false;
			this.viewOnly = false;
			this.saveFlag = true;
		}
		if (data.viewMode) {
			this.viewOnly = true;
			this.addOnly = false;
			this.editOnly = false;
			this.saveFlag = false;
		}
	}

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
	ngOnChanges() {
		this.buildForm();
		this.getCategoryOne();
		this.getState();
		this.getDepartment();
		this.getDesignation();
		this.getWing();
		this.getPersonalDetailsdata();
	}
	buildForm() {
		this.personalDetails = this.fbuild.group({
			p_address: '',
			p_city: '',
			p_state: '',
			p_pincode: '',
			r_address: '',
			r_city: '',
			r_state: '',
			r_pincode: '',
			pri_mobile: '',
			sec_mobile: '',
			whatsapp_no: '',
			email_id: '',
			gender: '',
			dob: '',
			emp_status: 'live'
		});
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
	getPersonalDetailsdata() {
		if (this.employeedetails && this.employeedetails.emp_personal_detail) {
			this.personalDetails.patchValue({
				p_address: this.employeedetails.emp_personal_detail && this.employeedetails.emp_personal_detail.address_detail ? this.employeedetails.emp_personal_detail.address_detail.address : '',
				p_city: this.employeedetails.emp_personal_detail && this.employeedetails.emp_personal_detail.address_detail ? this.employeedetails.emp_personal_detail.address_detail.city.cit_name : '',
				p_state: this.employeedetails.emp_personal_detail && this.employeedetails.emp_personal_detail.address_detail && this.employeedetails.emp_personal_detail.address_detail.state.sta_id ?
					this.employeedetails.emp_personal_detail.address_detail.state.sta_id.toString() : '',
				p_pincode: this.employeedetails.emp_personal_detail && this.employeedetails.emp_personal_detail.address_detail ? this.employeedetails.emp_personal_detail.address_detail.pin : '',
				r_address: this.employeedetails.emp_personal_detail && this.employeedetails.emp_personal_detail.residential_address_detail ? this.employeedetails.emp_personal_detail.residential_address_detail.address : '',
				r_city: this.employeedetails.emp_personal_detail && this.employeedetails.emp_personal_detail.residential_address_detail ? this.employeedetails.emp_personal_detail.residential_address_detail.city.cit_name : '',
				r_state: this.employeedetails.emp_personal_detail && this.employeedetails.emp_personal_detail.residential_address_detail && this.employeedetails.emp_personal_detail.residential_address_detail.state.sta_id ?
					this.employeedetails.emp_personal_detail.residential_address_detail.state.sta_id.toString() : '',
				r_pincode: this.employeedetails.emp_personal_detail && this.employeedetails.emp_personal_detail.residential_address_detail ? this.employeedetails.emp_personal_detail.residential_address_detail.pin : '',
				pri_mobile: this.employeedetails.emp_personal_detail && this.employeedetails.emp_personal_detail.contact_detail ? this.employeedetails.emp_personal_detail.contact_detail.primary_mobile_no : '',
				sec_mobile: this.employeedetails.emp_personal_detail && this.employeedetails.emp_personal_detail.contact_detail ? this.employeedetails.emp_personal_detail.contact_detail.secondary_mobile_no : '',
				whatsapp_no: this.employeedetails.emp_personal_detail && this.employeedetails.emp_personal_detail.contact_detail ? this.employeedetails.emp_personal_detail.contact_detail.whatsup_no : '',
				email_id: this.employeedetails.emp_personal_detail && this.employeedetails.emp_personal_detail.contact_detail ? this.employeedetails.emp_personal_detail.contact_detail.email_id : '',
				emp_status: this.employeedetails.emp_status ? this.employeedetails.emp_status : 'live',
				gender: this.employeedetails.emp_personal_detail && this.employeedetails.emp_personal_detail.gender ? this.employeedetails.emp_personal_detail && this.employeedetails.emp_personal_detail.gender : '',
				dob: this.employeedetails.emp_personal_detail && this.employeedetails.emp_personal_detail.dob ? this.employeedetails.emp_personal_detail && this.employeedetails.emp_personal_detail.dob : '',
			});
			if (this.employeedetails.emp_personal_detail.same_as_residential) {
				this.addressFlag = false;
				this.requiredOnly = false;
			} else {
				this.addressFlag = true;
				// if(this.editOnly){
				// 	this.requiredOnly = true;
				// }
			}
		}

	}

	saveForm() {
		if (this.personalDetails.valid) {
			this.disabledApiButton = true;
			if (this.addressFlag) {
				this.personaldetails['emp_personal_detail'] = {
					same_as_residential: false,
					residential_address_detail: {
						address: this.personalDetails.value.r_address,
						city: {
							cit_id: this.cityId2,
							cit_name: this.personalDetails.value.r_city
						},
						state: {
							sta_id: this.personalDetails.value.r_state,
							sta_name: this.getStateName(this.personalDetails.value.r_state)
						},
						country: {
							ct_id: 101,
							ct_name: "India"
						},
						pin: this.personalDetails.value.r_pincode
					},
					address_detail: {
						address: this.personalDetails.value.p_address,
						city: {
							cit_id: this.cityId,
							cit_name: this.personalDetails.value.p_city
						},
						state: {
							sta_id: this.personalDetails.value.p_state,
							sta_name: this.getStateName(this.personalDetails.value.p_state)
						},
						country: {
							ct_id: 101,
							ct_name: "India"
						},
						pin: this.personalDetails.value.p_pincode
					},
					contact_detail: {
						primary_mobile_no: this.personalDetails.value.pri_mobile,
						secondary_mobile_no: this.personalDetails.value.sec_mobile,
						whatsup_no: this.personalDetails.value.whatsapp_no,
						email_id: this.personalDetails.value.email_id
					},
					gender: this.personalDetails.value.gender,
					dob: this.personalDetails.value.dob,
				};
			} else {
				this.personaldetails['emp_personal_detail'] = {
					same_as_residential: true,
					residential_address_detail: {
						address: this.personalDetails.value.p_address,
						city: {
							cit_id: this.cityId,
							cit_name: this.personalDetails.value.p_city
						},
						state: {
							sta_id: this.personalDetails.value.p_state,
							sta_name: this.getStateName(this.personalDetails.value.p_state)
						},
						country: {
							ct_id: 101,
							ct_name: "India"
						},
						pin: this.personalDetails.value.p_pincode
					},
					address_detail: {
						address: this.personalDetails.value.p_address,
						city: {
							cit_id: this.cityId,
							cit_name: this.personalDetails.value.p_city
						},
						state: {
							sta_id: this.personalDetails.value.p_state,
							sta_name: this.getStateName(this.personalDetails.value.p_state)
						},
						country: {
							ct_id: 101,
							ct_name: "India"
						},
						pin: this.personalDetails.value.p_pincode
					},
					contact_detail: {
						primary_mobile_no: this.personalDetails.value.pri_mobile,
						secondary_mobile_no: this.personalDetails.value.sec_mobile,
						whatsup_no: this.personalDetails.value.whatsapp_no,
						email_id: this.personalDetails.value.email_id
					},
					gender: this.personalDetails.value.gender,
					dob: this.personalDetails.value.dob
				};
			}
			this.personaldetails['emp_personal_contact'] = {
				relationship_personal_detail: {
					rel_category: '',
					rel_full_name: '',
					rel_occupation: '',
					rel_organisation: '',
					rel_designation: '',
					rel_contact_detail: {
						rel_mobile_no: '',
						rel_email: ''
					},
					rel_address_detail: {
						address: '',
						city: {
							cit_id: '',
							cit_name: ''
						},
						state: {
							sta_id: '',
							sta_name: ''
						},
						country: {
							ct_id: '',
							ct_name: ''
						},
						pin: ''
					},
					rel_reference_detail: {
						ref_person_name: ''
					}
				}
			};
			this.personaldetails['emp_salary_detail'] = {
				account_docment_detail: {
					pan_no: '',
					aadhar_no: '',
					pf_acc_no: '',
					esi_ac_no: ''
				},
				nominee_detail: {
					name: ''
				},
				emp_organisation_relation_detail: {
					doj: '',
					pf_joining_date: '',
					esic_joining_date: '',
					probation_till_date: ''
				},
				emp_job_detail: {
					category_1: {
						cat_id: '',
						cat_name: ''
					},
					category_2: {
						cat_id: '',
						cat_name: ''
					},
					category_3: {
						cat_id: '',
						cat_name: ''
					},
					contact_period: ''
				},
				emp_incremental_month_detail: {
					month_data: {
						month_id: '',
						month_name: ''
					}
				},
				emp_bank_detail: [
					{
						bnk_detail: {
							bnk_id: '',
							bnk_name: '',
							bnk_ifsc: '',
							bnk_acc_no: ''
						}
					}
				],
				emp_salary_structure: {
					emp_pay_scale: {
						pc_id: '',
						pc_name: ''
					},
					emp_pay_mode: {
						pm_id: '',
						pm_name: ''
					},
					emp_basic_pay_scale: {
						bps_id: '',
						bps_name: ''
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
							pf_deduction: '',
							esic_deduction: '',
							tds_deduction: ''
						}
					],
					emp_net_salary: '',
					emp_total_earning: ''
				}
			};
			this.personaldetails['emp_remark_detail'] = {
				management_remark: '',
				interview_remark: '',
				skills: ''
			};
			this.personaldetails['emp_class_section_detail'] = [
				{
					class_detail: {
						class_id: '',
						class_name: ''
					},
					section_detail: {
						sec_id: '',
						sec_name: ''
					},
					subject_detail: {
						sub_id: '',
						sub_name: ''
					},
					class_teacher_staus: false,
					status: ''
				}
			];
			this.personaldetails['emp_document_detail'] = [
				{
					document_id: '',
					document_name: '',
					document_data: {
						verified_staus: false,
						files_data: [
							{
								file_id: '',
								file_name: '',
								file_url: ''
							}
						]
					}
				}
			];
			this.employeedetails['emp_status'] = 'enquiry';
			this.employeedetails['emp_personal_detail'] = this.personaldetails['emp_personal_detail'];
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
			this.commonAPIService.insertEmployeeDetails(this.employeedetails).subscribe((result: any) => {
				if (result) {
					this.disabledApiButton = false;
					this.commonAPIService.showSuccessErrorMessage('Employee Personal Details Inserted Successfully', 'success');
					this.commonAPIService.renderTab.next({ tabMove: true, renderForAdd: true });
				} else {
					this.disabledApiButton = false;
					this.commonAPIService.showSuccessErrorMessage('Error while inserting Employee Personal Detail', 'error');
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all Required field', 'error');
		}
	}

	updateForm(moveStatus) {
		if (this.personalDetails.valid) {
			this.disabledApiButton = true;
			if (this.addressFlag) {
				this.personaldetails['emp_personal_detail'] = {
					same_as_residential: false,
					residential_address_detail: {
						address: this.personalDetails.value.r_address,
						city: {
							cit_id: this.cityId2,
							cit_name: this.personalDetails.value.r_city
						},
						state: {
							sta_id: this.personalDetails.value.r_state,
							sta_name: this.getStateName(this.personalDetails.value.r_state)
						},
						country: {
							ct_id: 101,
							ct_name: "India"
						},
						pin: this.personalDetails.value.r_pincode
					},
					address_detail: {
						address: this.personalDetails.value.p_address,
						city: {
							cit_id: this.cityId,
							cit_name: this.personalDetails.value.p_city
						},
						state: {
							sta_id: this.personalDetails.value.p_state,
							sta_name: this.getStateName(this.personalDetails.value.p_state)
						},
						country: {
							ct_id: 101,
							ct_name: "India"
						},
						pin: this.personalDetails.value.p_pincode
					},
					contact_detail: {
						primary_mobile_no: this.personalDetails.value.pri_mobile,
						secondary_mobile_no: this.personalDetails.value.sec_mobile,
						whatsup_no: this.personalDetails.value.whatsapp_no,
						email_id: this.personalDetails.value.email_id
					},
					gender: this.personalDetails.value.gender,
					dob: this.personalDetails.value.dob
				};
			} else {
				this.personaldetails['emp_personal_detail'] = {
					same_as_residential: true,
					residential_address_detail: {
						address: this.personalDetails.value.p_address,
						city: {
							cit_id: this.cityId,
							cit_name: this.personalDetails.value.p_city
						},
						state: {
							sta_id: this.personalDetails.value.p_state,
							sta_name: this.getStateName(this.personalDetails.value.p_state)
						},
						country: {
							ct_id: 101,
							ct_name: "India"
						},
						pin: this.personalDetails.value.p_pincode
					},
					address_detail: {
						address: this.personalDetails.value.p_address,
						city: {
							cit_id: this.cityId,
							cit_name: this.personalDetails.value.p_city
						},
						state: {
							sta_id: this.personalDetails.value.p_state,
							sta_name: this.getStateName(this.personalDetails.value.p_state)
						},
						country: {
							ct_id: 101,
							ct_name: "India"
						},
						pin: this.personalDetails.value.p_pincode
					},
					contact_detail: {
						primary_mobile_no: this.personalDetails.value.pri_mobile,
						secondary_mobile_no: this.personalDetails.value.sec_mobile,
						whatsup_no: this.personalDetails.value.whatsapp_no,
						email_id: this.personalDetails.value.email_id
					},
					gender: this.personalDetails.value.gender,
					dob: this.personalDetails.value.dob
				};
			}
			this.employeedetails['emp_personal_detail'] = this.personaldetails['emp_personal_detail'];
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
			if (!moveStatus) {
				this.commonAPIService.updateEmployee(this.employeedetails).subscribe((result: any) => {
					if (result) {
						this.disabledApiButton = false;
						this.commonAPIService.showSuccessErrorMessage('Employee Personal Details Updated Successfully', 'success');
						this.commonAPIService.renderTab.next({ tabMove: true });
					} else {
						this.disabledApiButton = false;
						this.commonAPIService.showSuccessErrorMessage('Error while updating Employee Personal Detail', 'error');
					}
				});
			} else {
				this.commonAPIService.updateEmployee(this.employeedetails).subscribe((result: any) => {
					if (result) {
						this.disabledApiButton = false;
						this.commonAPIService.showSuccessErrorMessage('Employee Personal Details Updated Successfully', 'success');
						this.getPersonalDetailsdata();
						this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
					} else {
						this.disabledApiButton = false;
						this.commonAPIService.showSuccessErrorMessage('Error while updating Employee Personal Detail', 'error');
					}
				});
			}

		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all Required field', 'error');
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


	isExistUserAccessMenu(actionT) {
		// if (this.context && this.context.studentdetails) {
		// 	return this.context.studentdetails.isExistUserAccessMenu(actionT); 
		// }
	}
	editConfirm() { }

	address_change(event) {
		if (event.checked) {
			this.requiredOnly = true;
			this.addressFlag = true;
		} else {
			this.addressFlag = false;
			this.requiredOnly = false;
		}
	}
	filterCityStateCountry($event) {
		// keyCode
		if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
			if ($event.target.value !== '' && $event.target.value.length >= 3) {
				this.cityCountryArray = [];
				this.sisService.getStateCountryByCity({ cit_name: $event.target.value }).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.cityCountryArray = result.data;
					}
				});
			}
		}
	}
	getCityResId(item: any) {
		this.cityId2 = item.cit_id;
		this.personalDetails.patchValue({
			r_city: this.getCityName(item.cit_id),
			r_state: item.sta_id
		});
	}
	getCityPerId(item: any) {
		this.cityId = item.cit_id;
		this.personalDetails.patchValue({
			p_city: this.getCityName(item.cit_id),
			p_state: item.sta_id,
		});
	}

	getCityName(id) {
		const findIndex = this.cityCountryArray.findIndex(f => f.cit_id === id);
		if (findIndex !== -1) {
			return this.cityCountryArray[findIndex].cit_name;
		}
	}
	getStateName(id) {
		const findIndex = this.arrayState.findIndex(f => f.sta_id === id);
		if (findIndex !== -1) {
			return this.arrayState[findIndex].sta_name;
		}
	}
	getState() {
		this.sisService.getState().subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					this.arrayState = result.data;
				}
			}
		);
	}
	cancelForm() {
		if (this.addOnly) {
			this.commonAPIService.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
		} else if (this.saveFlag || this.editRequestFlag) {
			this.getPersonalDetailsdata();
			this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
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
	copyForWhatsapp(value) {
		if (value === 'primary') {
			this.personalDetails.patchValue({
				whatsapp_no: this.personalDetails.value.pri_mobile
			});
		} else {
			this.personalDetails.patchValue({
				whatsapp_no: this.personalDetails.value.sec_mobile
			});
		}
	}
}
