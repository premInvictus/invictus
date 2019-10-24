import { Component, OnInit, ViewChild, OnChanges, Input } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';

// import { ChildDetailsEmployeeComponent } from '../child-details-theme-two/child-details-theme-two.component';
// import { ParentDetailsEmployeeComponent } from '../parent-details-theme-two/parent-details-theme-two.component';
// import { MedicalInformationEmployeeComponent } from '../medical-information-theme-two/medical-information-theme-two.component';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';


@Component({
	selector: 'app-employee-tab-one-container',
	templateUrl: './employee-tab-one-container.component.html',
	styleUrls: ['./employee-tab-one-container.component.scss']
})
export class EmployeeTabOneContainerComponent implements OnInit, OnChanges {
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	@Input() employeedetails;
	personalDetails: FormGroup;
	personaldetails: any = {};
	cityId: any;
	cityId2: any;
	addressFlag = false;
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
	// @ViewChild(ChildDetailsEmployeeComponent) childDetails: ChildDetailsEmployeeComponent;
	// @ViewChild(ParentDetailsEmployeeComponent) parentDetails: ParentDetailsEmployeeComponent;
	// @ViewChild(MedicalInformationEmployeeComponent) medicalDetails: MedicalInformationEmployeeComponent;
	@ViewChild('editReference') editReference;

	constructor(public commonAPIService: CommonAPIService,
		private sisService: SisService, private fbuild: FormBuilder, ) {

	}
	setActionControls(data) {
		if (data.addMode) {
			this.addOnly = true;
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
				same_as_residential: false
			});
			this.addressFlag= false;
		}
		if (data.editMode) {
			this.editOnly = true;
			//this.viewOnly = false;
			this.saveFlag = true;
		}
		if (data.viewMode) {
			this.viewOnly = true;
			this.saveFlag = false;
			this.editRequestFlag = false;

			
		}
	}

	ngOnInit() {
		this.buildForm();
		this.getState();
		this.getPersonalDetailsdata();
		//console.log(this.employeedetails);
		this.commonAPIService.reRenderForm.subscribe((data: any) => {
			console.log('data', data);
			if (data) {
				if (data.addMode) {
					this.setActionControls({ addMode: true });
				} 
			}
		});
	}
	ngOnChanges() {
		console.log('this.employeedetails', this.employeedetails);
		this.buildForm();
		this.getState();
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
		});
	}
	getPersonalDetailsdata() {
		if (this.employeedetails) {
			this.personalDetails.patchValue({
				p_address: this.employeedetails.emp_personal_detail.address_detail.address,
				p_city: this.employeedetails.emp_personal_detail.address_detail.city.cit_name,
				p_state: this.employeedetails.emp_personal_detail.address_detail.state.sta_id,
				p_pincode: this.employeedetails.emp_personal_detail.address_detail.pin,
				r_address: this.employeedetails.emp_personal_detail.residential_address_detail.address,
				r_city: this.employeedetails.emp_personal_detail.residential_address_detail.city.cit_name,
				r_state: this.employeedetails.emp_personal_detail.residential_address_detail.state.sta_id,
				r_pincode: this.employeedetails.emp_personal_detail.residential_address_detail.pin,
				pri_mobile: this.employeedetails.emp_personal_detail.contact_detail.primary_mobile_no,
				sec_mobile: this.employeedetails.emp_personal_detail.contact_detail.secondary_mobile_no,
				whatsapp_no: this.employeedetails.emp_personal_detail.contact_detail.whatsup_no,
				email_id: this.employeedetails.emp_personal_detail.contact_detail.email_id,
			});
			if (this.employeedetails.emp_personal_detail.same_as_residential) {
				this.addressFlag = true;
			} else {
				this.addressFlag = false;
			}
		}
		
	}
	saveForm() {
		this.personaldetails['emp_id'] = '';
		this.personaldetails['emp_name'] = '';
		this.personaldetails['emp_honorific_detail'] = {
			hon_id: '',
			hon_name: ''
		};
		this.personaldetails['emp_designation_detail'] = {
			des_id: '',
			des_name: ''
		};
		this.personaldetails['emp_department_detail'] = {
			dpt_id: '',
			des_name: ''
		};
		this.personaldetails['emp_wing_detail'] = {
			wing_id: '',
			wing_name: ''
		};
		if (this.addressFlag) {
			this.personaldetails['emp_personal_detail'] = {
				same_as_residential: false,
				residential_address_detail: {
					address: this.personalDetails.value.r_address,
					city: {
						cit_id: this.personalDetails.value.r_city,
						cit_name: this.getCityName(this.personalDetails.value.r_city)
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
						cit_id: this.personalDetails.value.p_city,
						cit_name: this.getCityName(this.personalDetails.value.p_city)
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
				}
			};
		} else {
			this.personaldetails['emp_personal_detail'] = {
				same_as_residential: true,
				residential_address_detail: {
					address: this.personalDetails.value.p_address,
					city: {
						cit_id: this.personalDetails.value.p_city,
						cit_name: this.getCityName(this.personalDetails.value.p_city)
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
						cit_id: this.personalDetails.value.p_city,
						cit_name: this.getCityName(this.personalDetails.value.p_city)
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
				}
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
		console.log(this.personaldetails);
		this.commonAPIService.insertEmployeeDetails(this.personaldetails).subscribe((result: any) => {
			if (result.status === 'ok') {

			}
		});

	}
	isExistUserAccessMenu(actionT) {
		// if (this.context && this.context.studentdetails) {
		// 	return this.context.studentdetails.isExistUserAccessMenu(actionT); 
		// }
	}
	editConfirm() { }

	address_change(event) {
		if (event.checked) {
			this.addressFlag = true;
		} else {
			this.addressFlag = false;
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
			//this.context.studentdetails.getStudentInformation(this.context.studentdetails.studentdetailsform.value.au_enrollment_id);
			this.getPersonalDetailsdata();
			this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
		}
	}
}
