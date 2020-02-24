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
	currentUser: any;

	@ViewChild('editReference') editReference;

	constructor(public commonAPIService: CommonAPIService,
		private sisService: SisService, private fbuild: FormBuilder) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

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
				pri_mobile: '',
				sec_mobile: '',
				whatsapp_no: '',
				email_id: '',
				enq_status: 'enquiry',
				gender: '',
				dob: '',
				enq_married_status: '',
				enq_father_name: ''
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
		this.getState();
		this.getPersonalDetailsdata();
	}
	buildForm() {
		this.personalDetails = this.fbuild.group({
			p_address: '',
			p_city: '',
			p_state: '',
			p_pincode: '',
			pri_mobile: '',
			sec_mobile: '',
			whatsapp_no: '',
			email_id: '',
			gender: '',
			dob: '',
			enq_status: 'enquiry',
			enq_married_status: '',
			enq_father_name: ''
		});
	}
	getPersonalDetailsdata() {
		if (this.employeedetails && this.employeedetails.enq_personal_detail) {
			//console.log(this.employeedetails.enq_personal_detail);
			this.personalDetails.patchValue({
				p_address: this.employeedetails.enq_address_detail ? this.employeedetails.enq_address_detail[0].address : '',
				p_city: this.employeedetails.enq_address_detail && this.employeedetails.enq_address_detail[0].city ? this.employeedetails.enq_address_detail[0].city.cit_name : '',
				p_state: this.employeedetails.enq_address_detail && this.employeedetails.enq_address_detail[0].state ?
					this.employeedetails.enq_address_detail[0].state.sta_id.toString() : '',
				p_pincode: this.employeedetails.enq_address_detail ? this.employeedetails.enq_address_detail[0].pincode : '',
				pri_mobile: this.employeedetails.enq_communication_detail ? this.employeedetails.enq_communication_detail[0].primary_mobile_no : '',
				sec_mobile: this.employeedetails.enq_communication_detail ? this.employeedetails.enq_communication_detail[0].secondary_mobile_no : '',
				whatsapp_no: this.employeedetails.enq_communication_detail ? this.employeedetails.enq_communication_detail[0].whatsup_no : '',
				email_id: this.employeedetails.enq_communication_detail ? this.employeedetails.enq_communication_detail[0].email_id : '',
				enq_status: this.employeedetails.enq_status ? this.employeedetails.enq_status : 'enquiry',
				gender: this.employeedetails.enq_personal_detail ? this.employeedetails.enq_personal_detail.enq_gender : '',
				dob: this.employeedetails.enq_personal_detail ? this.employeedetails.enq_personal_detail.enq_dob : '',
				enq_married_status: this.employeedetails.enq_personal_detail ? this.employeedetails.enq_personal_detail.enq_married_status : '',
				enq_father_name: this.employeedetails.enq_personal_detail ? this.employeedetails.enq_personal_detail.enq_father_name : '',
			});
		}
	}

	saveForm() {
		if (this.personalDetails.valid) {
			this.personaldetails['enq_address_detail'] = [{
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
				pincode: this.personalDetails.value.p_pincode,
				address_type: "communication"
			}];
			this.personaldetails['enq_communication_detail'] = [{
				primary_mobile_no: this.personalDetails.value.pri_mobile,
				secondary_mobile_no: this.personalDetails.value.sec_mobile,
				whatsup_no: this.personalDetails.value.whatsapp_no,
				email_id: this.personalDetails.value.email_id
			}];
			this.personaldetails['enq_applied_job_detail'] = [
				{
					enq_applied_for: {
						post_id: "",
						post_name: ""
					},
					enq_department: {
						dept_id: "",
						dept_name: ""
					},
					enq_subject: [
						{
							sub_id: "",
							sub_name: ""
						}
					]
				}];
			this.personaldetails['enq_academic_detail'] = [
				{
					qualification: "",
					university: "",
					year: "",
					division: "",
					percentage: "",
					subjects: ""
				}
			];
			this.personaldetails['enq_work_experience_detail'] = [
				{
					organisation: "",
					designation: "",
					salary_drawn: "",
					from_date: "",
					to_date: ""
				}
			];
			this.personaldetails['enq_skills_detail'] = [
				{
					skill_id: "",
					skill_name: ""
				}
			];
			this.personaldetails['enq_status_log'] = [
				{
					status_id: "",
					status_name: "",
					created_id: "",
					created_by: "",
					remarks: {
						remark_id: "",
						remark_name: ""
					}
				}
			];
			this.personaldetails['enq_remarks'] = [
				{
					remark_name: "",
					remark: ""
				}
			];
			this.personaldetails['enq_documents'] = [
				{
					doc_id: "",
					doc_name: "",
					doc_url: ""
				}
			];
			this.personaldetails['enq_question_answer_data'] = [
				{
					question_id: "",
					question_name: "",
					question_answer: ""
				}
			];
			this.personaldetails['enq_personal_detail'] = {
				enq_full_name: this.employeeCommonDetails.employeeDetailsForm.value.enq_name,
				enq_dob: this.personalDetails.value.dob,
				enq_age: "",
				enq_father_name: this.personalDetails.value.enq_father_name,
				enq_married_status: this.personalDetails.value.enq_married_status,
				enq_gender: this.personalDetails.value.gender,
				enq_profile_pic: this.employeeCommonDetails.employeeDetailsForm.value.enq_profile_pic,
				enq_category: {
					cat_id: "",
					cat_name: ""
				}
			};

			this.employeedetails['enq_personal_detail'] = this.personaldetails['enq_personal_detail'];
			this.employeedetails['enq_communication_detail'] = this.personaldetails['enq_communication_detail'];
			this.employeedetails['enq_address_detail'] = this.personaldetails['enq_address_detail'];
			this.employeedetails['enq_question_answer_data'] = this.personaldetails['enq_question_answer_data'];
			this.employeedetails['enq_documents'] = this.personaldetails['enq_documents'];
			this.employeedetails['enq_remarks'] = this.personaldetails['enq_remarks'];
			this.employeedetails['enq_status_log'] = this.personaldetails['enq_status_log'];
			this.employeedetails['enq_skills_detail'] = this.personaldetails['enq_skills_detail'];
			this.employeedetails['enq_work_experience_detail'] = this.personaldetails['enq_work_experience_detail'];
			this.employeedetails['enq_academic_detail'] = this.personaldetails['enq_academic_detail'];
			this.employeedetails['enq_applied_job_detail'] = this.personaldetails['enq_applied_job_detail'];

			if (this.employeedetails) {
				this.employeedetails.enq_id = this.employeeCommonDetails.employeeDetailsForm.value.enq_id;
				this.employeedetails.enq_status = "enquiry";
				this.employeedetails.enq_present_salary = "";
				this.employeedetails.enq_expected_salary = "";
				this.employeedetails.enq_cover_letter_detail = "";
				this.employeedetails.enq_prefix = "";
				this.employeedetails.enq_created_by = this.currentUser.login_id;
			}

			this.commonAPIService.insertCareerEnq(this.employeedetails).subscribe((result: any) => {
				if (result) {
					this.disabledApiButton = false;
					this.commonAPIService.showSuccessErrorMessage('Enquiry Personal Details Inserted Successfully', 'success');
					this.commonAPIService.renderTab.next({ tabMove: true, renderForAdd: true });
				} else {
					this.disabledApiButton = false;
					this.commonAPIService.showSuccessErrorMessage('Error while inserting Enquiry Personal Detail', 'error');
				}
			});
			console.log(this.employeedetails, 'wwwewe');
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all Required field', 'error');
		}
	}

	updateForm(moveStatus) {
		if (this.personalDetails.valid) {
			//this.disabledApiButton = true;
			this.personaldetails['enq_address_detail'] = [{
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
				pincode: this.personalDetails.value.p_pincode,
				address_type: "communication"
			}];
			this.personaldetails['enq_communication_detail'] = [{
				primary_mobile_no: this.personalDetails.value.pri_mobile,
				secondary_mobile_no: this.personalDetails.value.sec_mobile,
				whatsup_no: this.personalDetails.value.whatsapp_no,
				email_id: this.personalDetails.value.email_id
			}];
			this.personaldetails['enq_personal_detail'] = {
				enq_full_name: this.employeeCommonDetails.employeeDetailsForm.value.enq_name,
				enq_dob: this.personalDetails.value.dob,
				enq_age: "",
				enq_father_name: "",
				enq_married_status: "",
				enq_gender: this.personalDetails.value.gender,
				enq_profile_pic: this.employeeCommonDetails.employeeDetailsForm.value.enq_profile_pic
			};

			this.employeedetails['enq_personal_detail'] = this.personaldetails['enq_personal_detail'];
			this.employeedetails['enq_communication_detail'] = this.personaldetails['enq_communication_detail'];
			this.employeedetails['enq_address_detail'] = this.personaldetails['enq_address_detail'];
			if (this.employeedetails) {
				this.employeedetails.enq_id = this.employeeCommonDetails.employeeDetailsForm.value.enq_id;
				this.employeedetails.emp_name = this.employeeCommonDetails.employeeDetailsForm.value.emp_name;
				this.employeedetails.enq_profile_pic = this.employeeCommonDetails.employeeDetailsForm.value.enq_profile_pic;
			}
			console.log(this.employeedetails, 'hdgj ds');
			if (!moveStatus) {
				this.commonAPIService.updateCareerEnq(this.employeedetails).subscribe((result: any) => {
					if (result) {
						this.disabledApiButton = false;
						this.commonAPIService.showSuccessErrorMessage('Emquiry Personal Details Updated Successfully', 'success');
						this.commonAPIService.renderTab.next({ tabMove: true });
					} else {
						this.disabledApiButton = false;
						this.commonAPIService.showSuccessErrorMessage('Error while updating Emquiry Personal Detail', 'error');
					}
				});
			} else {
				this.commonAPIService.updateCareerEnq(this.employeedetails).subscribe((result: any) => {
					if (result) {
						this.disabledApiButton = false;
						this.commonAPIService.showSuccessErrorMessage('Emquiry Personal Details Updated Successfully', 'success');
						this.getPersonalDetailsdata();
						this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
					} else {
						this.disabledApiButton = false;
						this.commonAPIService.showSuccessErrorMessage('Error while updating Emquiry Personal Detail', 'error');
					}
				});
			}

		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all Required field', 'error');
		}
	}


	isExistUserAccessMenu(actionT) {
		// if (this.context && this.context.studentdetails) {
		// 	return this.context.studentdetails.isExistUserAccessMenu(actionT); 
		// }
	}
	editConfirm() { }

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
