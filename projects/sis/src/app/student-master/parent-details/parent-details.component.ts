import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { CommonAPIService } from '../../_services/commonAPI.service';
import { SisService, ProcesstypeService } from '../../_services/index';
import { MatDatepickerInputEvent, ErrorStateMatcher } from '@angular/material';
import { DatePipe } from '@angular/common';
import { FormEnabledService } from '../../sharedmodule/dynamic-content/formEnabled.service';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
@Component({
	selector: 'app-parent-details',
	templateUrl: './parent-details.component.html',
	styleUrls: ['./parent-details.component.scss']
})
export class ParentDetailsComponent extends DynamicComponent implements OnInit {
	@ViewChild('editReference') editReference;
	@ViewChild('picker') picker;
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	formArray: any[] = [{ formId: 1, formHeader: 'Father Information', formInfo: 'Father' },
	{ formId: 2, formHeader: 'Mother Information', formInfo: 'Mother' },
	{ formId: 3, formHeader: 'Guardian Information', formInfo: 'Guardian' }];
	showHideGuardianField = false;
	showSiblingDiv = false;
	aluminiStatusArray: any[] = [false, false, false];
	addressStatusArray: any[] = [false, false, false];
	formGroupArray: any[] = [];
	qualificationArray: any[] = [];
	annualIncomeArray: any[] = [];
	occupationTypeArray: any[] = [];
	classArray: any[] = [];
	showSiblingField = true;
	siblingForm: FormGroup;
	currentUser: any;
	userDetail: any;
	checkReadOnlyStatus = false;
	sameSchoolArray: any[] = [];
	diffSchoolArray: any[] = [];
	schoolInfo: any;
	finalFormParentStatus = false;
	finalFormSiblingStatus = false;
	events: any[] = [];
	parentDetails: any[] = [];
	countryArray: any[] = [];
	cityArray: any[] = [];
	stateArray: any[] = [];
	parentAddressDetails: any[] = [];
	parentSiblingDetails: any[] = [];
	parentDetailsArray: any = {};
	siblingDetailsArray: any[] = [];
	login_id: any;
	addOnly = false;
	viewOnly = false;
	editOnly = false;
	editFlag = false;
	editRequestFlag = false;
	saveFlag = false;
	maxDate = new Date();
	studentDetailsArray: any[] = [];
	reqParamArray: any[] = [];
	finalSibReqArray: any[] = [];
	finalSibReqArray2: any[] = [];
	finalArray: any[] = [];
	sectionArray: any[] = [];
	reqObj: any = {};
	savedSettingsArray: any[] = [];
	settingsArray: any[] = [];
	constructor(private fbuild: FormBuilder, private notif: CommonAPIService, private sisService: SisService,
		private formEnabledService: FormEnabledService, private processtypeService: ProcesstypeService) { super(); }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.buildForm();
		this.buildForm2();
		this.getQualifications();
		this.getAnnualIncome();
		this.getOccupationType();
		this.getClass();
		this.getSection();
		this.getSchool();
		this.getCountry();
		this.getCity();
		this.getState();
		this.showSiblingDiv = false;
		this.siblingForm.patchValue({
			'esd_student_of_same_school': '1'
		});
		this.notif.studentData.subscribe((data: any) => {
			if (data && data.au_login_id) {
				this.login_id = data.au_login_id;
				this.getParentDetails(this.login_id);
			}
		});

		this.notif.reRenderForm.subscribe((data: any) => {
			if (data && data.addMode) {
				this.buildForm();
				this.buildForm2();
				this.viewOnly = false;
				this.addOnly = true;
			}
			if (data && data.viewMode) {
				this.viewOnly = true;
				this.addOnly = false;
				this.editOnly = false;
				this.saveFlag = false;
				this.editRequestFlag = false;
			}
			if (data && data.editMode) {
				this.viewOnly = false;
				this.saveFlag = true;
			}
		});
		this.addressStatusArray = [false, false, false];
		this.getConfigureSetting();
	}
	openEditDialog = (data) => this.editReference.openModal(data);
	getQualifications() {
		this.sisService.getQualifications().subscribe((result: any) => {
			if (result) {
				this.qualificationArray = result.data;
			}
		});
	}
	getAnnualIncome() {
		this.sisService.getAnnualIncome().subscribe((result: any) => {
			if (result) {
				this.annualIncomeArray = result.data;
			}
		});
	}
	getOccupationType() {
		this.sisService.getOccupationType().subscribe((result: any) => {
			if (result) {
				this.occupationTypeArray = result.data;
			}
		});
	}
	getClass() {
		const param: any = {};
		param.login_id = this.currentUser.login_id;
		this.sisService.getClass(param).subscribe((result: any) => {
			if (result) {
				this.classArray = result.data;
			}
		});
	}
	getSection() {
		this.sisService.getSectionAll().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.sectionArray = result.data;
			}
		});
	}
	buildForm() {
		this.formGroupArray = [{
			form_id: 1, formGroup: this.fbuild.group({
				epd_id: '',
				epd_login_id: '',
				epd_profile_image: '',
				epd_parent_name: '',
				epd_parent_dob: '',
				epd_parent_nationality: '',
				epd_status: '',
				epd_parent_alumni: 'N',
				epd_parent_alumni_last_class: '',
				epd_parent_alumni_last_year: '',
				epd_qualification: [],
				epd_parent_occupation_type: '',
				epd_parent_staff_of_organisation: 'N',
				epd_parent_type: 'F',
				epd_organisation: '',
				epd_designation: '',
				epd_income: '',
				epd_is_transferable: '',
				epd_custody_of_guardian: '',
				epd_guard_child_rel: ''
			}),
			ea_office_address: this.fbuild.group({
				ea_id: '',
				ea_login_id: '',
				ea_address_for: 'F',
				ea_address_type: 'office',
				ea_address1: '',
				ea_address2: '',
				ea_city: '',
				ea_state: '',
				ea_country: '',
				ea_pincode: '',
				ea_status: '',
				ea_email: '',
				ea_mobile: ''
			}),
			ea_res_address: this.fbuild.group({
				ea_id: '',
				ea_login_id: '',
				ea_address_for: 'F',
				ea_address_type: 'permanent',
				ea_address1: '',
				ea_same_residential_address: 'N',
				ea_address2: '',
				ea_city: '0',
				ea_state: '0',
				ea_country: '0',
				ea_pincode: '0',
				ea_status: '',
				ea_email: '',
				ea_mobile: ''
			}),
		},
		{
			form_id: 2, formGroup: this.fbuild.group({
				epd_id: '',
				epd_login_id: '',
				epd_profile_image: '',
				epd_parent_name: '',
				epd_parent_dob: '',
				epd_parent_nationality: '',
				epd_status: '',
				epd_parent_alumni: 'N',
				epd_parent_alumni_last_class: '',
				epd_parent_alumni_last_year: '',
				epd_qualification: [],
				epd_parent_occupation_type: '',
				epd_parent_staff_of_organisation: 'N',
				epd_parent_type: 'M',
				epd_organisation: '',
				epd_designation: '',
				epd_income: '',
				epd_is_transferable: '',
				epd_custody_of_guardian: '',
				epd_guard_child_rel: ''
			}),
			ea_office_address: this.fbuild.group({
				ea_id: '',
				ea_login_id: '',
				ea_address_for: 'M',
				ea_address_type: 'office',
				ea_address1: '',
				ea_address2: '',
				ea_city: '',
				ea_state: '',
				ea_country: '',
				ea_pincode: '',
				ea_status: '',
				ea_email: '',
				ea_mobile: ''
			}),
			ea_res_address: this.fbuild.group({
				ea_id: '',
				ea_login_id: '',
				ea_address_for: 'M',
				ea_address_type: 'permanent',
				ea_address1: '',
				ea_same_residential_address: 'N',
				ea_address2: '',
				ea_city: '0',
				ea_state: '0',
				ea_country: '0',
				ea_pincode: '0',
				ea_status: '',
				ea_email: '',
				ea_mobile: ''
			}),
		},
		{
			form_id: 3, formGroup: this.fbuild.group({
				epd_id: '',
				epd_login_id: '',
				epd_profile_image: '',
				epd_parent_name: '',
				epd_parent_dob: '',
				epd_parent_nationality: '',
				epd_status: '',
				epd_parent_alumni: 'N',
				epd_parent_alumni_last_class: '',
				epd_parent_alumni_last_year: '',
				epd_qualification: [],
				epd_parent_occupation_type: '',
				epd_parent_staff_of_organisation: 'N',
				epd_parent_type: 'G',
				epd_organisation: '',
				epd_designation: '',
				epd_income: '',
				epd_is_transferable: '',
				epd_custody_of_guardian: 'N',
				epd_guard_child_rel: ''
			}),
			ea_office_address: this.fbuild.group({
				ea_id: '',
				ea_login_id: '',
				ea_address_for: 'G',
				ea_address_type: 'office',
				ea_address1: '',
				ea_address2: '',
				ea_city: '',
				ea_state: '',
				ea_country: '',
				ea_pincode: '',
				ea_status: '',
				ea_email: '',
				ea_mobile: ''
			}),
			ea_res_address: this.fbuild.group({
				ea_id: '',
				ea_login_id: '',
				ea_address_for: 'G',
				ea_address_type: 'permanent',
				ea_address1: '',
				ea_address2: '',
				ea_same_residential_address: 'N',
				ea_city: '0',
				ea_state: '0',
				ea_country: '0',
				ea_pincode: '0',
				ea_status: '',
				ea_email: '',
				ea_mobile: ''
			}),
		}];
	}
	buildForm2() {
		this.siblingForm = this.fbuild.group({
			esd_login_id: '',
			esd_id: '',
			esd_is_have_sibling: 'N',
			esd_student_of_same_school: '',
			esd_admission_no: '',
			esd_name: '',
			esd_class: '',
			esd_section: '',
			esd_school_name: '',
			esd_status: ''
		});
	}
	showDetailsDiv(value) {
		if (Number(value) !== 2) {
			return true;
		} else if (this.showHideGuardianField === true) {
			return true;
		}
	}
	enableDisableGuardian($event) {
		if ($event.value === 'Y') {
			this.formGroupArray[2].formGroup.epd_custody_of_guardian = 'Y';
			this.showHideGuardianField = true;
		} else {
			this.showHideGuardianField = false;
		}
	}
	enableDisableSibling($event) {
		if ($event.value === 'Y') {
			this.showSiblingDiv = true;
			this.siblingForm.value.esd_is_have_sibling = 'Y';
		} else {
			this.showSiblingDiv = false;
			this.siblingForm.value.esd_is_have_sibling = 'N';
		}
	}
	checkAluminiStatus(index, $event) {
		if ($event.value === 'Y') {
			this.aluminiStatusArray[index] = true;
		} else {
			this.aluminiStatusArray[index] = false;
		}
	}
	checkAddressStatus(index, $event) {
		this.formGroupArray[index].ea_res_address.patchValue({
			ea_address1: '',
			ea_address2: '',
			ea_city: '',
			ea_state: '',
			ea_country: '',
			ea_pincode: '',
			ea_status: '',
			ea_email: '',
			ea_mobile: ''
		});
		this.studentDetailsArray = [];
		if ($event.value === 'Y') {
			this.addressStatusArray[index] = true;
			this.formGroupArray[index].ea_res_address.patchValue({
				ea_same_residential_address: 'Y'
			});
			if (index === 0) {
				this.formGroupArray[index].ea_res_address.value.ea_address_for = 'F';
			}
			if (index === 1) {
				this.formGroupArray[index].ea_res_address.value.ea_address_for = 'M';
			}
			if (index === 2) {
				this.formGroupArray[index].ea_res_address.value.ea_address_for = 'G';
			}
		} else {
			this.addressStatusArray[index] = false;
			this.formGroupArray[index].ea_res_address.patchValue({
				ea_same_residential_address: 'N'
			});
			if (index === 0) {
				this.formGroupArray[index].ea_res_address.value.ea_address_for = 'F';
			}
			if (index === 1) {
				this.formGroupArray[index].ea_res_address.value.ea_address_for = 'M';
			}
			if (index === 2) {
				this.formGroupArray[index].ea_res_address.value.ea_address_for = 'G';
			}
		}
	}
	setActiveParent(index, $event) {
		if (Number($event.value) === 1) {
			this.formGroupArray[index].formGroup.value.epd_status = $event.value;
		}
	}
	checkSiblingStatus($event) {
		if ($event.value === 'Y') {
			this.showSiblingField = true;
			this.siblingForm.patchValue({
				esd_school_name: ''
			});
		} else {
			this.siblingForm.patchValue({
				esd_school_name: ''
			});
			this.showSiblingField = false;
		}
	}
	checkStaffStatus($event, index) {
		if ($event.value === 'Y') {
			this.formGroupArray[index].formGroup.patchValue({
				'epd_organisation': this.schoolInfo.school_name
			});
			this.formGroupArray[index].ea_office_address.patchValue({
				ea_address1: this.schoolInfo.school_address,
				ea_city: this.schoolInfo.school_city_id,
				ea_state: this.schoolInfo.school_state_id,
				ea_country: this.schoolInfo.school_country_id,
				ea_mobile: this.schoolInfo.school_phone,
				ea_pincode: ''
			});
		} else {
			this.formGroupArray[index].formGroup.patchValue({
				'epd_organisation': ''
			});
			this.formGroupArray[index].ea_office_address.patchValue({
				ea_address1: '',
				ea_city: '',
				ea_state: '',
				ea_country: '',
				ea_mobile: '',
				ea_pincode: ''
			});
		}
	}
	saveAndContinue() {
		this.parentDetails = [];
		this.parentAddressDetails = [];
		this.parentSiblingDetails = [];
		this.finalFormParentStatus = true;
		const datePipe = new DatePipe('en-US');
		let ctr = 0;
		for (const item of this.formGroupArray) {
			if (item.formGroup.value.epd_status === '') {
				ctr++;
			} else {
				break;
			}
		}
		if (ctr === 3) {
			this.notif.showSuccessErrorMessage('Atleast there Should be one active parent selected', 'error');
			this.finalFormParentStatus = false;
		}
		let checkRequiredFieldCounter = 0, checkAluminiFieldCounter = 0;
		if (!this.showHideGuardianField) {
			for (let i = 0; i < 2; i++) {
				if (!this.formGroupArray[i].formGroup.get('epd_parent_name').valid ||
					!this.formGroupArray[i].formGroup.get('epd_parent_nationality').valid ||
					!this.formGroupArray[i].formGroup.get('epd_qualification').valid) {
					checkRequiredFieldCounter++;
				} else {
					continue;
				}
			}
			if (checkRequiredFieldCounter > 0) {
				this.notif.showSuccessErrorMessage('Please Fill required fields', 'error');
				this.finalFormParentStatus = false;
			}
			for (let i = 0; i < 2; i++) {
				if (this.aluminiStatusArray[i] === true) {
					if (!this.formGroupArray[i].formGroup.value.epd_parent_alumni_last_class ||
						!this.formGroupArray[i].formGroup.value.epd_parent_alumni_last_year) {
						checkAluminiFieldCounter++;
					} else {
						continue;
					}
				}
			}
			if (checkAluminiFieldCounter > 0) {
				this.notif.showSuccessErrorMessage('Please Fill Alumini Details', 'error');
				this.finalFormParentStatus = false;
			}
			if (this.showSiblingDiv === false) {
				this.finalFormSiblingStatus = true;
			} else {
				if (this.sameSchoolArray.length > 0 || this.diffSchoolArray.length > 0) {
					this.finalFormSiblingStatus = true;
				} else {
				}
			}
		}
		let checkRequiredFieldCounter2 = 0, checkAluminiFieldCounter2 = 0;
		if (this.showHideGuardianField) {
			for (let i = 0; i < 3; i++) {
				if (!this.formGroupArray[i].formGroup.get('epd_parent_name').valid ||
					!this.formGroupArray[i].formGroup.get('epd_parent_nationality').valid ||
					!this.formGroupArray[i].formGroup.get('epd_qualification').valid) {
					checkRequiredFieldCounter2++;
				} else {
					continue;
				}
			}
			if (checkRequiredFieldCounter2 > 0) {
				this.notif.showSuccessErrorMessage('Please Fill required fields', 'error');
				this.finalFormParentStatus = false;
			}
			for (let i = 0; i < 3; i++) {
				if (this.aluminiStatusArray[i] === true) {
					if (!this.formGroupArray[i].formGroup.value.epd_parent_alumni_last_class ||
						!this.formGroupArray[i].formGroup.value.epd_parent_alumni_last_year) {
						checkAluminiFieldCounter2++;
					} else {
						continue;
					}
				}
			}
			if (checkAluminiFieldCounter2 > 0) {
				this.notif.showSuccessErrorMessage('Please Fill Alumini Details', 'error');
				this.finalFormParentStatus = false;
			}
			if (!this.formGroupArray[2].formGroup.value.epd_guard_child_rel) {
				this.notif.showSuccessErrorMessage('Please Fill Guardian Child Details', 'error');
				this.finalFormParentStatus = false;
			}
			if (this.showSiblingDiv === false) {
				this.finalFormSiblingStatus = true;
			} else {
				if (this.sameSchoolArray.length > 0 || this.diffSchoolArray.length > 0) {
					this.finalFormSiblingStatus = true;
				} else {
					this.finalFormSiblingStatus = false;
				}
			}
		}
		if (this.finalFormSiblingStatus === true && this.finalFormParentStatus === true) {
			for (const item of this.formGroupArray) {
				this.parentDetails.push({
					epd_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
					epd_parent_name: item.formGroup.value.epd_parent_name,
					epd_parent_dob: datePipe.transform(item.formGroup.value.epd_parent_dob, 'yyyy-MM-dd'),
					epd_parent_nationality: item.formGroup.value.epd_parent_nationality,
					epd_status: item.formGroup.value.epd_status,
					epd_parent_alumni: item.formGroup.value.epd_parent_alumni,
					epd_parent_type: item.formGroup.value.epd_parent_type,
					epd_parent_alumni_last_class: item.formGroup.value.epd_parent_alumni_last_class,
					epd_parent_alumni_last_year: item.formGroup.value.epd_parent_alumni_last_year,
					epd_qualification: item.formGroup.value.epd_qualification,
					epd_parent_occupation_type: item.formGroup.value.epd_parent_occupation_type,
					epd_parent_staff_of_organisation: item.formGroup.value.epd_parent_staff_of_organisation,
					epd_organisation: item.formGroup.value.epd_organisation,
					epd_designation: item.formGroup.value.epd_designation,
					epd_income: item.formGroup.value.epd_income,
					epd_guard_child_rel: item.formGroup.value.epd_guard_child_rel,
					epd_is_transferable: item.formGroup.value.epd_is_transferable,
					epd_custody_of_guardian: item.formGroup.value.epd_custody_of_guardian,
					epd_profile_image: item.formGroup.value.epd_profile_image
				});
				this.parentAddressDetails.push({
					ea_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
					ea_address_type: item.ea_office_address.value.ea_address_type,
					ea_address_for: item.ea_office_address.value.ea_address_for,
					ea_address1: item.ea_office_address.value.ea_address1,
					ea_address2: item.ea_office_address.value.ea_address2,
					ea_city: item.ea_office_address.value.ea_city,
					ea_state: item.ea_office_address.value.ea_state,
					ea_country: item.ea_office_address.value.ea_country,
					ea_pincode: item.ea_office_address.value.ea_pincode,
					ea_email: item.ea_office_address.value.ea_email,
					ea_mobile: item.ea_office_address.value.ea_mobile,
					ea_status: '1'
				},
					{
						ea_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
						ea_address_type: item.ea_res_address.value.ea_address_type,
						ea_same_residential_address: item.ea_res_address.value.ea_same_residential_address,
						ea_address_for: item.ea_res_address.value.ea_address_for,
						ea_address1: item.ea_res_address.value.ea_address1,
						ea_address2: item.ea_res_address.value.ea_address2,
						ea_city: item.ea_res_address.value.ea_city,
						ea_state: item.ea_res_address.value.ea_state,
						ea_country: item.ea_res_address.value.ea_country,
						ea_pincode: item.ea_res_address.value.ea_pincode,
						ea_email: item.ea_res_address.value.ea_email,
						ea_mobile: item.ea_res_address.value.ea_mobile,
						ea_status: '1'
					});
			}
			for (const item of this.sameSchoolArray) {
				item.esd_class = this.getClassId(item.esd_class);
				item.esd_section = this.getSecId(item.esd_section);
				this.parentSiblingDetails.push(item);
			}
			for (const item of this.diffSchoolArray) {
				item.esd_class = this.getClassId(item.esd_class);
				this.parentSiblingDetails.push(item);
			}
			if (this.context.studentdetails.studentdetailsform.valid) {
				this.context.studentdetails.studentdetailsform.value.au_process_type = this.context.processType;
				this.sisService.updateStudentDetails(this.context.studentdetails.studentdetailsform.value).subscribe((result1: any) => {
					if (result1.status === 'ok') {
					}
				});
			}
			this.sisService.insertParentDetails({
				parentDetails: this.parentDetails,
				parentSiblingDetails: this.parentSiblingDetails,
				parentAddressDetails: this.parentAddressDetails
			}).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.formEnabledService.setFormEnabled(this.formEnabledService.getLastValue() + 1);
					this.notif.showSuccessErrorMessage('Added SuccesFully', 'success');

					if (this.processtypeService.getProcesstype() === '1') {
						this.notif.reRenderForm.next({ reRenderForm: true, addMode: false, editMode: false, deleteMode: false });
					} else {
						this.notif.renderTab.next({ tabMove: true });
					}
				} else {
					this.notif.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}
	}
	getSiblingDetails(value) {
		this.checkReadOnlyStatus = false;
		this.siblingForm.patchValue({
			'esd_admission_no': '',
			'esd_name': '',
			'esd_class': '',
			'esd_section': ''
		});
		const param: any = {};
		param.admission_no = value;
		param.enrollment_type = '4';
		param.pmap_status = '1';
		if (value !== '') {
			this.sisService.getMasterStudentDetail(param).subscribe((result: any) => {
				if (result) {
					this.userDetail = result.data[0];
					this.siblingForm.patchValue({
						'esd_is_have_sibling': 'Y',
						'esd_student_of_same_school': 'Y',
						'esd_admission_no': value,
						'esd_name': this.userDetail.au_full_name,
						'esd_class': this.userDetail.class_name,
						'esd_section': this.userDetail.sec_name,
						'esd_status': '1',
						'esd_school_name': this.schoolInfo.school_name
					});
					this.checkReadOnlyStatus = true;
				}
			});
		}
	}
	addSiblingDetails() {
		if (this.showSiblingField) {
			if (this.siblingForm.get('esd_admission_no').valid && this.siblingForm.get('esd_class').valid &&
				this.siblingForm.get('esd_section').valid && this.siblingForm.get('esd_name').valid) {
				const findex = this.sameSchoolArray.findIndex(f => Number(f.esd_admission_no) === Number(this.siblingForm.value.esd_admission_no));
				if (findex === -1) {
					this.siblingForm.value.esd_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
					this.siblingForm.value.esd_id = '';
					this.siblingForm.value.esd_is_have_sibling = 'Y';
					this.siblingForm.value.esd_same_school = 'Y';
					this.siblingForm.value.esd_status = '1';
					this.siblingForm.value.esd_school_name = this.schoolInfo.school_name;
					this.sameSchoolArray.push(this.siblingForm.value);
					this.siblingForm.patchValue({
						'esd_admission_no': '',
						'esd_name': '',
						'esd_class': '',
						'esd_section': ''
					});
				} else {
					this.notif.showSuccessErrorMessage('Duplicate Entry not allowed', 'error');
				}
			} else {
				this.notif.showSuccessErrorMessage('Please enter required fields', 'error');
			}
		} else {
			if (this.siblingForm.get('esd_name').valid &&
				this.siblingForm.get('esd_class').valid && this.siblingForm.get('esd_school_name').valid) {
				this.siblingForm.value.esd_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
				this.siblingForm.value.esd_class = this.getClassName(this.siblingForm.value.esd_class);
				this.siblingForm.value.esd_id = '';
				this.diffSchoolArray.push(this.siblingForm.value);
				this.siblingForm.patchValue({
					'esd_name': '',
					'esd_class': '',
					'esd_school_name': ''
				});
			} else {
				this.notif.showSuccessErrorMessage('Please enter required fields', 'error');
			}
		}
	}
	deleteSibling(value) {
		const findex = this.sameSchoolArray.findIndex(f => Number(f.esd_admission_no) === Number(value));
		this.sameSchoolArray.splice(findex, 1);
		this.notif.showSuccessErrorMessage('Sibling details removed from the list', 'success');
	}
	deleteSiblingList2(value) {
		this.diffSchoolArray.splice(value, 1);
		this.notif.showSuccessErrorMessage('Sibling details removed from the list', 'success');
	}
	getClassName(value) {
		for (const item of this.classArray) {
			if (Number(item.class_id) === Number(value)) {
				return item.class_name;
			}
		}
	}
	getClassId(value) {
		for (const item of this.classArray) {
			if (item.class_name === value) {
				return item.class_id;
			}
		}
	}
	getSecId(value) {
		for (const item of this.sectionArray) {
			if (item.sec_name === value) {
				return item.sec_id;
			}
		}
	}
	getSecName(value) {
		for (const item of this.sectionArray) {
			if (item.sec_id === value) {
				return item.sec_name;
			}
		}
	}
	getSchool() {
		this.sisService.getSchool().subscribe((result: any) => {
			if (result) {
				this.schoolInfo = result.data[0];
			}
		});
	}
	addEvent(type: string, event: MatDatepickerInputEvent<Date>, index) {
		this.events.push(`${type}: ${event.value}`);
		this.picker._dateAdapter.locale = 'en-in';
		const datePipe = new DatePipe('en-in');
		const convertedDate = datePipe.transform(this.formGroupArray[index].formGroup.value.epd_parent_dob, 'yyyy-MM-dd');
		this.formGroupArray[index].formGroup.patchValue({
			'epd_parent_dob': convertedDate
		});
	}
	getCountry() {
		this.sisService.getCountry().subscribe((result: any) => {
			if (result) {
				this.countryArray = result.data;
			}
		});
	}
	getCity() {
		this.sisService.getCity().subscribe((result: any) => {
			if (result) {
				this.cityArray = result.data;
			}
		});
	}
	getState() {
		this.sisService.getState().subscribe((result: any) => {
			if (result) {
				this.stateArray = result.data;
			}
		});
	}
	getParentDetails(login_id) {
		if (login_id) {
			this.parentDetailsArray = [];
			this.parentDetails = [];
			this.parentAddressDetails = [];
			this.parentSiblingDetails = [];
			this.sameSchoolArray = [];
			this.diffSchoolArray = [];
			this.sisService.getParentDetails({
				epd_login_id: login_id
			}).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.parentDetailsArray = result.data;
					if (this.parentDetailsArray) {
						let i = 0;
						for (const item of this.formGroupArray) {
							if (this.parentDetailsArray.parent_details[i].epd_parent_alumni[i]
								&& this.parentDetailsArray.parent_details[i].epd_parent_alumni === 'Y') {
								this.aluminiStatusArray[i] = true;
							} else {
								this.aluminiStatusArray[i] = false;
							}
							if (this.parentDetailsArray.parent_details[i].epd_custody_of_guardian === 'Y') {
								this.showHideGuardianField = true;
							} else {
								this.showHideGuardianField = false;
							}
							this.picker._dateAdapter.locale = 'en-in';
							item.formGroup.patchValue({
								'epd_id': this.parentDetailsArray.parent_details[i].epd_id,
								'epd_login_id': this.parentDetailsArray.parent_details[i].epd_login_id,
								'epd_parent_name': this.parentDetailsArray.parent_details[i].epd_parent_name,
								'epd_parent_dob': this.parentDetailsArray.parent_details[i].epd_parent_dob,
								'epd_parent_nationality': this.parentDetailsArray.parent_details[i].epd_parent_nationality,
								'epd_status': this.parentDetailsArray.parent_details[i].epd_status,
								'epd_parent_alumni': this.parentDetailsArray.parent_details[i].epd_parent_alumni,
								'epd_parent_type': this.parentDetailsArray.parent_details[i].epd_parent_type,
								'epd_parent_alumni_last_class': this.parentDetailsArray.parent_details[i].epd_parent_alumni_last_class,
								'epd_parent_alumni_last_year': this.parentDetailsArray.parent_details[i].epd_parent_alumni_last_year !== '0000' ?
									this.parentDetailsArray.parent_details[i].epd_parent_alumni_last_year : '',
								'epd_qualification': this.parentDetailsArray.parent_details[i].epd_qualification ?
									JSON.parse(this.parentDetailsArray.parent_details[i].epd_qualification) : [],
								'epd_parent_occupation_type': this.parentDetailsArray.parent_details[i].epd_parent_occupation_type,
								'epd_parent_staff_of_organisation': this.parentDetailsArray.parent_details[i].epd_parent_staff_of_organisation,
								'epd_organisation': this.parentDetailsArray.parent_details[i].epd_organisation,
								'epd_designation': this.parentDetailsArray.parent_details[i].epd_designation,
								'epd_income': this.parentDetailsArray.parent_details[i].epd_income,
								'epd_guard_child_rel': this.parentDetailsArray.parent_details[i].epd_guard_child_rel,
								'epd_is_transferable': this.parentDetailsArray.parent_details[i].epd_is_transferable,
								'epd_custody_of_guardian': this.parentDetailsArray.parent_details[i].epd_custody_of_guardian,
								'epd_profile_image': this.parentDetailsArray.parent_details[i].epd_profile_image
							});
							i++;
							const addressDetails: any[] = [];
							for (const addItem of this.parentDetailsArray.parent_address_detail) {
								if (addItem && addItem.ea_address_type === 'office') {
									addressDetails.push({
										ea_address1: addItem.ea_address1,
										ea_address2: addItem.ea_address2,
										ea_address_for: addItem.ea_address_for,
										ea_address_type: addItem.ea_address_type,
										ea_city: addItem.ea_city,
										ea_country: addItem.ea_country,
										ea_email: addItem.ea_email,
										ea_id: addItem.ea_id,
										ea_login_id: addItem.ea_login_id,
										ea_mobile: addItem.ea_mobile,
										ea_pincode: addItem.ea_pincode !== '0' ? addItem.ea_pincode : '',
										ea_state: addItem.ea_state,
										ea_status: addItem.ea_status,
									});
								}
								if (addItem && addItem.ea_address_type === 'permanent') {
									addressDetails.push({
										ea_address1: addItem.ea_address1,
										ea_address2: addItem.ea_address2,
										ea_address_for: addItem.ea_address_for,
										ea_address_type: addItem.ea_address_type,
										ea_city: addItem.ea_city,
										ea_country: addItem.ea_country,
										ea_email: addItem.ea_email,
										ea_id: addItem.ea_id,
										ea_same_residential_address: addItem.ea_same_residential_address,
										ea_login_id: addItem.ea_login_id,
										ea_mobile: addItem.ea_mobile,
										ea_pincode: addItem.ea_pincode !== '0' ? addItem.ea_pincode : '',
										ea_state: addItem.ea_state,
										ea_status: addItem.ea_status,
									});
								}
							}
							let permAddressCounter = 0;
							for (const address of addressDetails) {
								if (address && address.ea_address_for !== 'S') {
									if (address.ea_address_type && address.ea_address_type === 'office'
										&& address.ea_address_for === 'F') {
										this.formGroupArray[0].ea_office_address.patchValue({
											ea_id: address.ea_id,
											ea_login_id: address.ea_login_id,
											ea_address_type: address.ea_address_type,
											ea_address_for: address.ea_address_for,
											ea_address1: address.ea_address1,
											ea_address2: address.ea_address2,
											ea_city: address.ea_city,
											ea_state: address.ea_state,
											ea_country: address.ea_country,
											ea_pincode: address.ea_pincode,
											ea_email: address.ea_email,
											ea_mobile: address.ea_mobile,
											ea_status: address.ea_status
										});
									}
									if (address.ea_address_type && address.ea_address_type === 'office'
										&& address.ea_address_for === 'M') {
										this.formGroupArray[1].ea_office_address.patchValue({
											ea_id: address.ea_id,
											ea_login_id: address.ea_login_id,
											ea_address_type: address.ea_address_type,
											ea_address_for: address.ea_address_for,
											ea_address1: address.ea_address1,
											ea_address2: address.ea_address2,
											ea_city: address.ea_city,
											ea_state: address.ea_state,
											ea_country: address.ea_country,
											ea_pincode: address.ea_pincode,
											ea_email: address.ea_email,
											ea_mobile: address.ea_mobile,
											ea_status: address.ea_status
										});
									}
									if (address.ea_address_type && address.ea_address_type === 'office'
										&& address.ea_address_for === 'G') {
										this.formGroupArray[2].ea_office_address.patchValue({
											ea_id: address.ea_id,
											ea_login_id: address.ea_login_id,
											ea_address_type: address.ea_address_type,
											ea_address_for: address.ea_address_for,
											ea_address1: address.ea_address1,
											ea_address2: address.ea_address2,
											ea_city: address.ea_city,
											ea_state: address.ea_state,
											ea_country: address.ea_country,
											ea_pincode: address.ea_pincode,
											ea_email: address.ea_email,
											ea_mobile: address.ea_mobile,
											ea_status: address.ea_status
										});
									}
									if (address.ea_address_type
										&& address.ea_address_type === 'permanent'
										&& address.ea_address_for === 'F') {
										this.formGroupArray[0].ea_res_address.patchValue({
											ea_id: address.ea_id,
											ea_login_id: address.ea_login_id,
											ea_address_type: address.ea_address_type,
											ea_address_for: address.ea_address_for,
											ea_same_residential_address: address.ea_same_residential_address,
											ea_address1: address.ea_address1,
											ea_address2: address.ea_address2,
											ea_city: address.ea_city,
											ea_state: address.ea_state,
											ea_country: address.ea_country,
											ea_pincode: address.ea_pincode,
											ea_email: address.ea_email,
											ea_mobile: address.ea_mobile,
											ea_status: address.ea_status
										});
									}
									if (address.ea_address_type
										&& address.ea_address_type === 'permanent'
										&& address.ea_address_for === 'M') {
										this.formGroupArray[1].ea_res_address.patchValue({
											ea_id: address.ea_id,
											ea_login_id: address.ea_login_id,
											ea_address_type: address.ea_address_type,
											ea_address_for: address.ea_address_for,
											ea_same_residential_address: address.ea_same_residential_address,
											ea_address1: address.ea_address1,
											ea_address2: address.ea_address2,
											ea_city: address.ea_city,
											ea_state: address.ea_state,
											ea_country: address.ea_country,
											ea_pincode: address.ea_pincode,
											ea_email: address.ea_email,
											ea_mobile: address.ea_mobile,
											ea_status: address.ea_status
										});
									}
									if (address.ea_address_type
										&& address.ea_address_type === 'permanent'
										&& address.ea_address_for === 'G') {
										this.formGroupArray[2].ea_res_address.patchValue({
											ea_id: address.ea_id,
											ea_login_id: address.ea_login_id,
											ea_address_type: address.ea_address_type,
											ea_address_for: address.ea_address_for,
											ea_same_residential_address: address.ea_same_residential_address,
											ea_address1: address.ea_address1,
											ea_address2: address.ea_address2,
											ea_city: address.ea_city,
											ea_state: address.ea_state,
											ea_country: address.ea_country,
											ea_pincode: address.ea_pincode,
											ea_email: address.ea_email,
											ea_mobile: address.ea_mobile,
											ea_status: address.ea_status
										});
									}
									if (address.ea_address_type === 'permanent') {
										if (address.ea_same_residential_address === 'Y') {
											this.addressStatusArray[permAddressCounter] = true;
										} else {
											this.addressStatusArray[permAddressCounter] = false;
										}
										permAddressCounter++;
									}
								}
							}
						}
						if (this.parentDetailsArray.parent_sibling_detail.length === 0) {
							this.siblingForm.patchValue({
								'esd_is_have_sibling': 'N'
							});
						} else {
							for (const item of this.parentDetailsArray.parent_sibling_detail) {
								if (item.esd_is_have_sibling === 'Y') {
									this.siblingForm.patchValue({
										'esd_is_have_sibling': item.esd_is_have_sibling
									});
									this.showSiblingDiv = true;
								}
								if (item.esd_student_of_same_school === 'Y') {
									item.esd_class = this.getClassName(item.esd_class);
									item.esd_section = this.getSecName(item.esd_section);
									this.sameSchoolArray.push(item);
								} else {
									item.esd_class = this.getClassName(item.esd_class);
									this.diffSchoolArray.push(item);
								}
							}
						}
					}
				} else {
					let i = 0;
					for (const item of this.formGroupArray) {
						item.formGroup.reset();
						item.ea_office_address.reset();
						item.ea_res_address.reset();
						if (i === 0) {
							item.formGroup.patchValue({
								epd_parent_type: 'F'
							});
						}
						if (i === 1) {
							item.formGroup.patchValue({
								epd_parent_type: 'M'
							});
						}
						if (i === 2) {
							item.formGroup.patchValue({
								epd_parent_type: 'G'
							});
						}
						i++;
					}
					this.parentDetailsArray = [];
					this.parentDetails = [];
					this.parentAddressDetails = [];
					this.parentSiblingDetails = [];
					this.sameSchoolArray = [];
					this.diffSchoolArray = [];
					this.siblingForm.reset();
					this.addressStatusArray = [false, false, false];
					this.showHideGuardianField = false;
					this.showSiblingDiv = false;
				}
			});
		}
	}
	enableEdit() {
		this.viewOnly = false;
		this.editFlag = true;
		this.saveFlag = true;
		this.context.studentdetails.viewOnly = false;
	}
	enableEditRequest() {
		this.viewOnly = false;
		this.editOnly = false;
		this.editRequestFlag = true;
		this.saveFlag = false;
		this.context.studentdetails.viewOnly = false;
	}
	updateAndContinue(isview) {
		const datePipe = new DatePipe('en-US');
		this.parentDetails = [];
		this.parentAddressDetails = [];
		this.parentSiblingDetails = [];
		this.finalFormParentStatus = true;
		let ctr = 0;
		for (const item of this.formGroupArray) {
			if (!item.formGroup.value.epd_status) {
				ctr++;
			} else {
				break;
			}
		}
		if (ctr === 3) {
			this.notif.showSuccessErrorMessage('Atleast there Should be one active parent selected', 'error');
			this.finalFormParentStatus = false;
		}
		let checkRequiredFieldCounter = 0, checkAluminiFieldCounter = 0;
		if (!this.showHideGuardianField) {
			for (let i = 0; i < 2; i++) {
				if (!this.formGroupArray[i].formGroup.get('epd_parent_name').valid ||
					!this.formGroupArray[i].formGroup.get('epd_parent_nationality').valid ||
					!this.formGroupArray[i].formGroup.get('epd_qualification').valid) {
					checkRequiredFieldCounter++;
				} else {
					continue;
				}
			}
			if (checkRequiredFieldCounter > 0) {
				this.notif.showSuccessErrorMessage('Please Fill required fields', 'error');
				this.finalFormParentStatus = false;
			}
			for (let i = 0; i < 2; i++) {
				if (this.aluminiStatusArray[i] === true) {
					if (!this.formGroupArray[i].formGroup.value.epd_parent_alumni_last_class ||
						!this.formGroupArray[i].formGroup.value.epd_parent_alumni_last_year) {
						checkAluminiFieldCounter++;
					} else {
						continue;
					}
				}
			}
			if (checkAluminiFieldCounter > 0) {
				this.notif.showSuccessErrorMessage('Please Fill Alumini Details', 'error');
				this.finalFormParentStatus = false;
			}
			if (this.showSiblingDiv === false) {
				this.finalFormSiblingStatus = true;
			} else {
				if (this.sameSchoolArray.length > 0 || this.diffSchoolArray.length > 0) {
					this.finalFormSiblingStatus = true;
				} else {
				}
			}
		}
		let checkRequiredFieldCounter2 = 0, checkAluminiFieldCounter2 = 0;
		if (this.showHideGuardianField) {
			for (let i = 0; i < 3; i++) {
				if (!this.formGroupArray[i].formGroup.get('epd_parent_name').valid ||
					!this.formGroupArray[i].formGroup.get('epd_parent_nationality').valid ||
					!this.formGroupArray[i].formGroup.get('epd_qualification').valid) {
					checkRequiredFieldCounter2++;
				} else {
					continue;
				}
			}
			if (checkRequiredFieldCounter2 > 0) {
				this.notif.showSuccessErrorMessage('Please Fill required fields', 'error');
				this.finalFormParentStatus = false;
			}
			for (let i = 0; i < 3; i++) {
				if (this.aluminiStatusArray[i] === true) {
					if (!this.formGroupArray[i].formGroup.value.epd_parent_alumni_last_class ||
						!this.formGroupArray[i].formGroup.value.epd_parent_alumni_last_year) {
						checkAluminiFieldCounter2++;
					} else {
						continue;
					}
				}
			}
			if (checkAluminiFieldCounter2 > 0) {
				this.notif.showSuccessErrorMessage('Please Fill Alumini Details', 'error');
				this.finalFormParentStatus = false;
			}
			if (!this.formGroupArray[2].formGroup.value.epd_guard_child_rel) {
				this.notif.showSuccessErrorMessage('Please Fill Guardian Child Details', 'error');
				this.finalFormParentStatus = false;
			}
			if (this.showSiblingDiv === false) {
				this.finalFormSiblingStatus = true;
			} else {
				if (this.sameSchoolArray.length > 0 || this.diffSchoolArray.length > 0) {
					this.finalFormSiblingStatus = true;
				} else {
					this.finalFormSiblingStatus = false;
				}
			}
		}
		if (this.finalFormSiblingStatus === true && this.finalFormParentStatus === true) {
			for (const item of this.formGroupArray) {
				this.parentDetails.push({
					epd_id: item.formGroup.value.epd_id,
					epd_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
					epd_parent_name: item.formGroup.value.epd_parent_name,
					epd_parent_dob: datePipe.transform(item.formGroup.value.epd_parent_dob, 'yyyy-MM-dd'),
					epd_parent_nationality: item.formGroup.value.epd_parent_nationality,
					epd_status: item.formGroup.value.epd_status,
					epd_parent_alumni: item.formGroup.value.epd_parent_alumni,
					epd_parent_type: item.formGroup.value.epd_parent_type,
					epd_parent_alumni_last_class: item.formGroup.value.epd_parent_alumni_last_class,
					epd_parent_alumni_last_year: item.formGroup.value.epd_parent_alumni_last_year,
					epd_qualification: item.formGroup.value.epd_qualification,
					epd_parent_occupation_type: item.formGroup.value.epd_parent_occupation_type,
					epd_parent_staff_of_organisation: item.formGroup.value.epd_parent_staff_of_organisation,
					epd_organisation: item.formGroup.value.epd_organisation,
					epd_designation: item.formGroup.value.epd_designation,
					epd_income: item.formGroup.value.epd_income,
					epd_guard_child_rel: item.formGroup.value.epd_guard_child_rel,
					epd_is_transferable: item.formGroup.value.epd_is_transferable,
					epd_custody_of_guardian: item.formGroup.value.epd_custody_of_guardian,
					epd_profile_image: item.formGroup.value.epd_profile_image
				});
				this.parentAddressDetails.push({
					ea_id: item.ea_office_address.value.ea_id,
					ea_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
					ea_address_type: item.ea_office_address.value.ea_address_type,
					ea_address_for: item.ea_office_address.value.ea_address_for,
					ea_address1: item.ea_office_address.value.ea_address1,
					ea_address2: item.ea_office_address.value.ea_address2,
					ea_city: item.ea_office_address.value.ea_city,
					ea_state: item.ea_office_address.value.ea_state,
					ea_country: item.ea_office_address.value.ea_country,
					ea_pincode: item.ea_office_address.value.ea_pincode,
					ea_email: item.ea_office_address.value.ea_email,
					ea_mobile: item.ea_office_address.value.ea_mobile,
					ea_status: '1'
				},
					{
						ea_id: item.ea_res_address.value.ea_id,
						ea_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
						ea_address_type: item.ea_res_address.value.ea_address_type,
						ea_same_residential_address: item.ea_res_address.value.ea_same_residential_address,
						ea_address_for: item.ea_res_address.value.ea_address_for,
						ea_address1: item.ea_res_address.value.ea_address1,
						ea_address2: item.ea_res_address.value.ea_address2,
						ea_city: item.ea_res_address.value.ea_city,
						ea_state: item.ea_res_address.value.ea_state,
						ea_country: item.ea_res_address.value.ea_country,
						ea_pincode: item.ea_res_address.value.ea_pincode,
						ea_email: item.ea_res_address.value.ea_email,
						ea_mobile: item.ea_res_address.value.ea_mobile,
						ea_status: '1'
					});
			}
			for (const item of this.sameSchoolArray) {
				item.esd_class = this.getClassId(item.esd_class);
				item.esd_section = this.getSecId(item.esd_section);
				this.parentSiblingDetails.push(item);
			}
			for (const item of this.diffSchoolArray) {
				item.esd_class = this.getClassId(item.esd_class);
				this.parentSiblingDetails.push(item);
			}
			if (this.context.studentdetails.studentdetailsform.valid) {
				this.context.studentdetails.studentdetailsform.value.au_process_type = this.context.processType;
				this.sisService.updateStudentDetails(this.context.studentdetails.studentdetailsform.value).subscribe((result1: any) => {
					if (result1.status === 'ok') {
					}
				});
			}
			this.sisService.updateParentDetails({
				parentDetails: this.parentDetails,
				parentSiblingDetails: this.parentSiblingDetails,
				parentAddressDetails: this.parentAddressDetails
			}).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.notif.showSuccessErrorMessage('Parent Details Updated SuccesFully', 'success');
					this.getParentDetails(this.context.studentdetails.studentdetailsform.value.au_login_id);
					if (this.processtypeService.getProcesstype() === '1' && this.addOnly) {
						this.notif.reRenderForm.next({ reRenderForm: true, formReset: false });
					}
					if (isview) {
						this.notif.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
					}
				} else {
					this.notif.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}
	}
	editConfirm() {
		this.viewOnly = true;
		this.editRequestFlag = false;
		this.saveFlag = false;
		this.context.studentdetails.viewOnly = true;
	}
	checkFormChangedValue() {
		const finalTestArray: any[] = [];
		this.reqParamArray = [];
		this.finalSibReqArray = [];
		this.finalSibReqArray2 = [];
		const datepipe = new DatePipe('en-US');
		let j = 0;
		let k = 1;
		// tslint:disable-next-line:no-shadowed-variable
		for (let i = 0; i < 3; i++) {
			const req_param: any[] = [];
			Object.keys(this.formGroupArray[i].formGroup.controls).forEach((key) => {
				const formControl = <FormControl>this.formGroupArray[i].formGroup.controls[key];
				if (key !== 'epd_id') {
					if ((formControl.value !== this.parentDetailsArray.parent_details[i][key]) && formControl.dirty) {
						req_param.push({
							rff_where_id: 'epd_id',
							rff_where_value: this.parentDetailsArray.parent_details[i]['epd_id'],
							rff_field_name: key,
							rff_new_field_value: formControl.value,
							rff_old_field_value: this.parentDetailsArray.parent_details[i][key]
						});
					}
				}
			});
			Object.keys(this.formGroupArray[i].ea_office_address.controls).forEach((key) => {
				const formControl = <FormControl>this.formGroupArray[i].ea_office_address.controls[key];
				if (key !== 'ea_id') {
					if (formControl.touched && formControl.dirty) {
						req_param.push({
							rff_where_id: 'ea_id',
							rff_where_value: this.parentDetailsArray.parent_address_detail[j]['ea_id'],
							rff_field_name: key,
							rff_new_field_value: formControl.value,
							rff_old_field_value: this.parentDetailsArray.parent_address_detail[j][key]
						});
					}
				}
			});
			Object.keys(this.formGroupArray[i].ea_office_address.controls).forEach((key) => {
				const formControl = <FormControl>this.formGroupArray[i].ea_res_address.controls[key];
				if (key !== 'ea_id') {
					if (formControl.touched && formControl.dirty) {
						req_param.push({
							rff_where_id: 'ea_id',
							rff_where_value: this.parentDetailsArray.parent_address_detail[k]['ea_id'],
							rff_field_name: key,
							rff_new_field_value: formControl.value,
							rff_old_field_value: this.parentDetailsArray.parent_address_detail[k][key]
						});
					}
				}
			});
			j = j + 2;
			k = k + 2;
			this.reqParamArray.push(req_param);
		}
		const finalReqParamArray: any[] = [];
		for (const item of this.reqParamArray) {
			finalReqParamArray.push({ item: item });
		}
		this.finalArray = [];
		for (const fi of finalReqParamArray) {
			for (const titem of fi.item) {
				this.finalArray.push(titem);
			}
		}
		let i = 0;
		for (const item of this.sameSchoolArray) {
			if (item.esd_id === '') {
				const sibReqArray: any[] = [];
				Object.keys(this.sameSchoolArray[i]).forEach(key => {
					sibReqArray.push({
						rff_where_id: 'esd_id',
						rff_where_value: '',
						rff_field_name: key,
						rff_new_field_value: this.sameSchoolArray[i][key],
						rff_old_field_value: '',
					});
				});
				this.finalSibReqArray.push({ item: sibReqArray });
			}
			i++;
		}
		for (const sib of this.finalSibReqArray) {
			for (const titem of sib.item) {
				this.finalArray.push(titem);
			}
		}
		let n = 0;
		for (const item of this.diffSchoolArray) {
			if (item.esd_id === '') {
				const sibReqArray: any[] = [];
				Object.keys(this.diffSchoolArray[n]).forEach(key => {
					sibReqArray.push({
						rff_where_id: 'esd_id',
						rff_where_value: '',
						rff_field_name: key,
						rff_new_field_value: this.diffSchoolArray[n][key],
						rff_old_field_value: '',
					});
				});
				this.finalSibReqArray2.push({ item: sibReqArray });
			}
			n++;
		}
		for (const sib of this.finalSibReqArray2) {
			for (const titem of sib.item) {
				this.finalArray.push(titem);
			}
		}
		finalTestArray.push({
			req_param: this.finalArray
		});
		this.reqObj = {
			req_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
			req_process_type: this.context.processType,
			req_tab_id: this.formEnabledService.getTabid('Parent Details'),
			req_priority: '',
			req_remarks: '',
			req_reason: '',
			req_date: datepipe.transform(new Date, 'yyyy-MM-dd'),
			req_param: []
		};
		this.notif.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
	}

	cancelForm() {
		if (this.addOnly) {
			this.notif.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
		} else if (this.saveFlag || this.editRequestFlag) {
			this.notif.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
			this.getParentDetails(this.context.studentdetails.studentdetailsform.value.au_login_id);
		}
	}
	getConfigureSetting() {
		this.sisService.getConfigureSetting({
			cos_process_type: this.processtypeService.getProcesstype()
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.savedSettingsArray = result.data;
				for (const item of this.savedSettingsArray) {
					if (item.cos_tb_id === '3') {
						this.settingsArray.push({
							cos_tb_id: item.cos_tb_id,
							cos_ff_id: item.cos_ff_id,
							cos_status: item.cos_status,
							ff_field_name: item.ff_field_name
						});
					}
				}
			}
		});
	}
	checkIfFieldExist(value) {
		const findex = this.settingsArray.findIndex(f => f.ff_field_name === value);
		if (findex !== -1 && this.settingsArray[findex]['cos_status'] === 'Y') {
			return true;
		} else if (findex !== -1 && this.settingsArray[findex]['cos_status'] === 'N') {
			return false;
		} else {
			return false;
		}
	}
	isExistUserAccessMenu(actionT) {
		return this.context.studentdetails.isExistUserAccessMenu(actionT);
	}
}

// export class ConfirmValidParentMatcher implements ErrorStateMatcher {
// 	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
// 		return control && control.invalid && (control.dirty || control.touched || form.submitted);
// 	}
// }
