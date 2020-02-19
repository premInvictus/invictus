import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { ChildDetailsThemeTwoComponent } from '../child-details-theme-two/child-details-theme-two.component';
import { ParentDetailsThemeTwoComponent } from '../parent-details-theme-two/parent-details-theme-two.component';
import { MedicalInformationThemeTwoComponent } from '../medical-information-theme-two/medical-information-theme-two.component';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';


@Component({
	selector: 'app-theme-two-tab-one-container',
	templateUrl: './theme-two-tab-one-container.component.html',
	styleUrls: ['./theme-two-tab-one-container.component.scss']
})
export class ThemeTwoTabOneContainerComponent extends DynamicComponent implements OnInit, OnChanges {

	panelOpenState = true;
	addOnly = false;
	disabledApiCall = false;
	editOnly = false;
	viewOnly = true;
	saveFlag = false;
	editRequestFlag = false;
	taboneform: any = {};
	login_id = '';
	studentdetails: any = {};
	parentDetails2: any = {};
	addressDetails: any[] = [];
	parentJson: any[] = [];
	reqParamArray = [];
	finalSibReqArray = [];
	finalSibReqArray2 = [];
	checkChangedFieldsArray: any = [];
	finalArray: any = [];
	settingsArray: any[] = [];
	parentId;
	@ViewChild(ChildDetailsThemeTwoComponent) childDetails: ChildDetailsThemeTwoComponent;
	@ViewChild(ParentDetailsThemeTwoComponent) parentDetails: ParentDetailsThemeTwoComponent;
	@ViewChild(MedicalInformationThemeTwoComponent) medicalDetails: MedicalInformationThemeTwoComponent;
	@ViewChild('editReference') editReference;

	constructor(public commonAPIService: CommonAPIService,
		private sisService: SisService,
		private processTypeService: ProcesstypeService) {

		super();
	}

	setActionControls(data) {
		if (data.addMode) {
			this.addOnly = true;
			this.viewOnly = false;
			this.resetForm();
		}
		if (data.editMode) {
			this.editOnly = true;
			this.viewOnly = false;
			this.saveFlag = true;
		}
		if (data.viewMode) {
			this.viewOnly = true;
			this.saveFlag = false;
			this.editRequestFlag = false;

			if (this.addOnly) {
				this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
					if (result.status === 'ok') {
						this.commonAPIService.studentData.next(result.data[0]);
						this.addOnly = false;
					}
				});
			} else {
				this.commonAPIService.studentData.next(this.context.studentdetails.studentdetailsform.value.au_enrollment_id);
			}
		}
	}

	ngOnInit() {
		this.settingsArray = this.context.configSetting;
		const processType = this.processTypeService.getProcesstype();
		if (processType === '1') {
			this.parentId = '157';
		}
		if (processType === '2') {
			this.parentId = '158';
		}
		if (processType === '3') {
			this.parentId = '159';
		}
		if (processType === '4') {
			this.parentId = '160';
		}
		if (processType === '5') {
			this.parentId = '161';
		}

		this.commonAPIService.studentData.subscribe((data: any) => {
			if (data && data.au_login_id) {
				this.login_id = data.au_login_id;
				this.getStudent(this.login_id);
			}
		});
		this.commonAPIService.reRenderForm.subscribe((data: any) => {
			this.setActionControls(data);
		});

		// this.getConfigureSetting();
	}
	ngOnChanges() {
	}

	saveForm() {
		this.validateParent();
		if (this.context.studentdetails.studentdetailsform.valid &&
			this.childDetails.baseform.valid &&
			this.childDetails.paddressform.valid && this.parentDetails.finalFormParentStatus === true) {
				this.disabledApiCall = true;
			if (this.childDetails.raddressform.value.ea_same_residential_address === false ||
				(this.childDetails.raddressform.value.ea_same_residential_address === true && this.childDetails.raddressform.valid)) {
					this.disabledApiCall = true;
				this.taboneform = this.context.studentdetails.studentdetailsform.value;
				this.childDetails.baseform.value.upd_doj =
					this.commonAPIService.dateConvertion(this.childDetails.baseform.value.upd_doj, 'yyyy-MM-dd');
				this.childDetails.baseform.value.upd_dob =
					this.commonAPIService.dateConvertion(this.childDetails.baseform.value.upd_dob, 'yyyy-MM-dd');
				this.taboneform.personalDetails = this.childDetails.baseform.value;
				this.childDetails.paddressform.patchValue({
					'ea_city': this.childDetails.cityId
				});
				this.childDetails.raddressform.patchValue({
					'ea_city': this.childDetails.cityId2
				});
				this.childDetails.paddressform.patchValue({
					'ea_same_residential_address': this.childDetails.paddressform.value.ea_same_residential_address ? 'Y' : 'N'
				});
				this.childDetails.raddressform.patchValue({
					'ea_same_residential_address': this.childDetails.raddressform.value.ea_same_residential_address ? 'Y' : 'N'
				});
				this.taboneform.personalDetails.addressDetails = [this.childDetails.paddressform.value, this.childDetails.raddressform.value];
				this.taboneform.personalDetails.siblingDetails = [];
				if (this.childDetails.siblingArray.length > 0) {
					this.taboneform.personalDetails.siblingDetails = this.childDetails.siblingArray;
				}
				this.taboneform.parentDetails = this.parentDetails ? this.parentJson : this.parentJson;
				// this.medicalDetails.addMedicalInfo();
				this.taboneform.medicalDetails = this.medicalDetails ? this.medicalDetails.medicalform.value : '';
				if (this.context.studentdetails.studentdetailsform.value.au_login_id) {
					this.taboneform.au_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
				}
				this.sisService.addStudent(this.taboneform).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.context.studentdetails.studentdetailsform.patchValue({
							au_login_id: result.data.au_login_id,
							au_enrollment_id: result.data.au_enrollment_id
						});
						this.commonAPIService.showSuccessErrorMessage('Student Details Inserted Successfully', 'success');
						this.disabledApiCall = false;
						this.commonAPIService.renderTab.next({ tabMove: true });
					} else {
						this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
						this.disabledApiCall = false;
					}
				});
			} else {
				this.disabledApiCall = false;
				this.commonAPIService.showSuccessErrorMessage('Please fill all required fields', 'error');
			}
		} else {
			this.disabledApiCall = false;
			this.commonAPIService.showSuccessErrorMessage('Please fill all required fields', 'error');
		}
	}
	cancelForm() {
		if (this.addOnly) {
			this.commonAPIService.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
		} else if (this.saveFlag || this.editRequestFlag) {
			this.context.studentdetails.getStudentInformation(this.context.studentdetails.studentdetailsform.value.au_enrollment_id);
			this.getStudent(this.login_id);
			this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
		}
	}
	getStudent(au_login_id) {
		if (au_login_id) {
			this.parentDetails2 = {};
			this.sisService.getStudent({ au_login_id: au_login_id }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.viewOnly = true;
					// this.tb_id = this.formEnabledService.getTabid('Personal Details');
					this.studentdetails = result.data[0];
					this.parentDetails2 = this.studentdetails.parentDetails;
					if (this.childDetails) {
						this.childDetails.patchPersonalDetails(this.studentdetails.personalDetails);
					}
					if (this.medicalDetails) {
						this.medicalDetails.patchMedicaldetails(this.studentdetails.medicalDetails);
					}
					// this.enablecategoryothers();
				} else if (result.status === 'error') {
					this.resetForm();
				}
			});
		}
	}
	updateForm(isview) {
		this.validateParent();
		if (this.context.studentdetails.studentdetailsform.valid &&
			this.childDetails.baseform.valid &&
			this.childDetails.paddressform.valid && this.parentDetails.finalFormParentStatus === true) {
			this.taboneform = this.context.studentdetails.studentdetailsform.value;
			this.childDetails.baseform.value.upd_doj =
				this.commonAPIService.dateConvertion(this.childDetails.baseform.value.upd_doj, 'yyyy-MM-dd');
			this.childDetails.baseform.value.upd_dob =
				this.commonAPIService.dateConvertion(this.childDetails.baseform.value.upd_dob, 'yyyy-MM-dd');
			this.taboneform.personalDetails = this.childDetails.baseform.value;
			this.childDetails.paddressform.patchValue({
				'ea_city': this.childDetails.cityId
			});
			this.childDetails.raddressform.patchValue({
				'ea_city': this.childDetails.cityId2
			});
			this.childDetails.paddressform.patchValue({
				'ea_same_residential_address': this.childDetails.paddressform.value.ea_same_residential_address ? 'Y' : 'N'
			});
			this.childDetails.raddressform.patchValue({
				'ea_same_residential_address': this.childDetails.raddressform.value.ea_same_residential_address ? 'Y' : 'N'
			});
			this.taboneform.personalDetails.addressDetails = [this.childDetails.paddressform.value, this.childDetails.raddressform.value];
			this.taboneform.personalDetails.siblingDetails = [];
			if (this.childDetails.siblingArray.length > 0) {
				this.taboneform.personalDetails.siblingDetails = this.childDetails.siblingArray;
			}
			this.taboneform.parentDetails = this.parentDetails ? this.parentJson : this.parentJson;
			// this.medicalDetails.addMedicalInfo();
			this.taboneform.medicalDetails = this.medicalDetails ? this.medicalDetails.medicalform.value : '';
			if (this.context.studentdetails.studentdetailsform.value.au_login_id) {
				this.taboneform.au_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
			}
			// this.context.studentdetails.studentdetailsform.value.au_process_type = this.context.processType;
			this.sisService.addStudent(this.taboneform).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage('Student Details Updated Successfully', 'success');
					if (isview) {
						this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
						this.getStudent(this.login_id);
					} else {
						this.commonAPIService.renderTab.next({ tabMove: true });
					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all required fields', 'error');
		}
	}
	resetForm() {
		this.childDetails.resetForm();
		this.resetParentForm();
		if (this.medicalDetails) {
			this.medicalDetails.medicalform.reset();
			this.medicalDetails.finalFamilyInfoArray = [];
			this.medicalDetails.finalMedicineArray = [];
			this.medicalDetails.medicineDetailArray = [];
			this.medicalDetails.vaccinationArray = [];
		}
	}
	validateParent() {
		this.parentDetails.finalFormParentStatus = true;
		this.parentJson = [];
		let ctr = 0;
		for (const item of this.parentDetails.formGroupArray) {
			console.log('active parent', item)
			if (item.formGroup.value.epd_status) {
				if (item.formGroup.value.epd_status === '' || item.formGroup.value.epd_status === '0') {
					ctr++;
				} else {
					break;
				}
				break;
			} else {
				ctr++;
			}
		}
		if (ctr === 3) {
			this.commonAPIService.showSuccessErrorMessage('Atleast there Should be one active parent selected', 'error');
			this.parentDetails.finalFormParentStatus = false;
		}
		let checkRequiredFieldCounter = 0, checkAluminiFieldCounter = 0;
		if (!this.parentDetails.showHideGuardianField) {
			for (let i = 0; i < 2; i++) {
				if (!this.parentDetails.formGroupArray[i].formGroup.get('epd_parent_name').valid) {
					checkRequiredFieldCounter++;
				} else {
					continue;
				}
			}
			if (checkRequiredFieldCounter > 0) {
				this.commonAPIService.showSuccessErrorMessage('Please Fill required fields in parent details', 'error');
				this.parentDetails.finalFormParentStatus = false;
			}
			for (let i = 0; i < 2; i++) {
				if (this.parentDetails.aluminiStatusArray[i] === true) {
					if (!this.parentDetails.formGroupArray[i].formGroup.value.epd_parent_alumni_last_class ||
						!this.parentDetails.formGroupArray[i].formGroup.value.epd_parent_alumni_last_year) {
						checkAluminiFieldCounter++;
					} else {
						continue;
					}
				}
			}
			if (checkAluminiFieldCounter > 0) {
				this.commonAPIService.showSuccessErrorMessage('Please Fill Alumini Details', 'error');
				this.parentDetails.finalFormParentStatus = false;
			}
		}
		let checkRequiredFieldCounter2 = 0, checkAluminiFieldCounter2 = 0;
		if (this.parentDetails.showHideGuardianField) {
			for (let i = 0; i < 3; i++) {
				if (!this.parentDetails.formGroupArray[i].formGroup.get('epd_parent_name').valid) {
					checkRequiredFieldCounter2++;
				} else {
					continue;
				}
			}
			if (checkRequiredFieldCounter2 > 0) {
				this.commonAPIService.showSuccessErrorMessage('Please Fill required fields in parent details', 'error');
				this.parentDetails.finalFormParentStatus = false;
			}
			for (let i = 0; i < 3; i++) {
				if (this.parentDetails.aluminiStatusArray[i] === true) {
					if (!this.parentDetails.formGroupArray[i].formGroup.value.epd_parent_alumni_last_class ||
						!this.parentDetails.formGroupArray[i].formGroup.value.epd_parent_alumni_last_year) {
						checkAluminiFieldCounter2++;
					} else {
						continue;
					}
				}
			}
			if (checkAluminiFieldCounter2 > 0) {
				this.commonAPIService.showSuccessErrorMessage('Please Fill Alumini Details', 'error');
				this.parentDetails.finalFormParentStatus = false;
			}
			if (!this.parentDetails.formGroupArray[2].formGroup.value.epd_guard_child_rel) {
				this.commonAPIService.showSuccessErrorMessage('Please Fill Guardian Child Details', 'error');
				this.parentDetails.finalFormParentStatus = false;
			}
		}
		const datePipe = new DatePipe('en-in');
		if (this.parentDetails.finalFormParentStatus === true) {
			for (const item of this.parentDetails.formGroupArray) {
				this.parentJson.push({
					epd_id: item.formGroup.value.epd_id,
					epd_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
					epd_parent_name: item.formGroup.value.epd_parent_name,
					epd_parent_honorific: item.formGroup.value.epd_parent_honorific,
					epd_parent_dob: datePipe.transform(item.formGroup.value.epd_parent_dob, 'yyyy-MM-dd'),
					epd_parent_nationality: item.formGroup.value.epd_parent_nationality,
					epd_contact_no: item.formGroup.value.epd_contact_no,
					epd_whatsapp_no: item.formGroup.value.epd_whatsapp_no,
					epd_pan_no: item.formGroup.value.epd_pan_no,
					epd_aadhar_no: item.formGroup.value.epd_aadhar_no,
					epd_email: item.formGroup.value.epd_email,
					epd_status: item.formGroup.value.epd_status,
					epd_parent_alumni: item.formGroup.value.epd_parent_alumni ? 'Y' : 'N',
					epd_parent_type: item.formGroup.value.epd_parent_type,
					epd_parent_alumni_last_class: item.formGroup.value.epd_parent_alumni_last_class,
					epd_parent_alumni_last_year: item.formGroup.value.epd_parent_alumni_last_year,
					epd_parent_admission_no: item.formGroup.value.epd_parent_admission_no,
					epd_qualification: item.formGroup.value.epd_qualification,
					epd_parent_occupation_type: item.formGroup.value.epd_parent_occupation_type,
					epd_parent_staff_of_organisation: item.formGroup.value.epd_parent_staff_of_organisation ? 'Y' : 'N',
					epd_organisation: item.formGroup.value.epd_organisation,
					epd_designation: item.formGroup.value.epd_designation,
					epd_income: item.formGroup.value.epd_income,
					epd_guard_child_rel: item.formGroup.value.epd_guard_child_rel,
					epd_is_transferable: item.formGroup.value.epd_is_transferable ? 'Y' : 'N',
					epd_custody_of_guardian: item.formGroup.value.epd_custody_of_guardian ? 'Y' : 'N',
					epd_profile_image: item.formGroup.value.epd_profile_image,
					addressDetails: [
						{
							ea_id: item.ea_office_address.value.ea_id,
							ea_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
							ea_address_type: item.ea_office_address.value.ea_address_type,
							ea_address_for: item.ea_office_address.value.ea_address_for,
							ea_address1: item.ea_office_address.value.ea_address1,
							ea_address2: item.ea_office_address.value.ea_address2,
							ea_city: this.parentDetails.getCityId(item.ea_office_address.value.ea_city, item.ea_office_address.value.ea_country),
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
							ea_same_residential_address: item.ea_res_address.value.ea_same_residential_address ? 'Y' : 'N',
							ea_address_for: item.ea_res_address.value.ea_address_for,
							ea_address1: item.ea_res_address.value.ea_address1,
							ea_address2: item.ea_res_address.value.ea_address2,
							ea_city: this.parentDetails.getCityId(item.ea_res_address.value.ea_city, item.ea_res_address.value.ea_country),
							ea_state: item.ea_res_address.value.ea_state,
							ea_country: item.ea_res_address.value.ea_country,
							ea_pincode: item.ea_res_address.value.ea_pincode,
							ea_email: item.ea_res_address.value.ea_email,
							ea_mobile: item.ea_res_address.value.ea_mobile,
							ea_status: '1'
						}
					]
				});
			}
		}
	}

	// edit request

	editRequest() {
		this.viewOnly = false;
		this.editOnly = false;
		this.editRequestFlag = true;
		this.saveFlag = false;
		this.context.studentdetails.viewOnly = false;
	}
	checkFormChangedValue() {
		this.checkChangedFieldsArray = [];
		let param: any = {};
		const params: any[] = [];
		const datalist: any[] = [];
		if (this.context.studentdetails.studentdetailsform.dirty) {
			Object.keys(this.context.studentdetails.studentdetailsform.controls).forEach((keys) => {
				const formControl = <FormControl>this.context.studentdetails.studentdetailsform.controls[keys];
				if (formControl.dirty && formControl.touched) {
					this.checkChangedFieldsArray.push(
						{
							rff_where_id: 'au_login_id',
							rff_where_value: this.context.studentdetails.studentdetailsform.value.au_login_id,
							rff_field_name: keys,
							rff_new_field_value: formControl.value,
							rff_old_field_value: this.studentdetails[keys]
						});
				}
			});
			if (this.checkChangedFieldsArray.length > 0) {
				param.req_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
				param.req_process_type = this.context.processType;
				param.req_tab_id = '1';
				param.req_priority = '';
				param.req_remarks = '';
				param.req_reason = '';
				param.req_param = [];
				param.req_date = this.commonAPIService.dateConvertion(new Date, 'yyyy-MM-dd');
				param.req_param = this.checkChangedFieldsArray;
				params.push(param);
				datalist.push(this.checkChangedFieldsArray);
			}
		}
		this.checkChangedFieldsArray = [];
		param = {};
		if (this.childDetails.baseform.dirty) {
			Object.keys(this.childDetails.baseform.controls).forEach((keys) => {
				const tablePrefix = keys.split('_', 1);
				const tableKey = tablePrefix[0] + '_id';
				const tableKeyValue = this.childDetails.baseform.value[tableKey];
				const formControl = <FormControl>this.childDetails.baseform.controls[keys];
				if (formControl.dirty && formControl.touched) {
					if (keys === 'upd_dob' || 'upd_doj') {
						this.checkChangedFieldsArray.push({
							rff_where_id: tableKey,
							rff_where_value: tableKeyValue,
							rff_field_name: keys,
							rff_new_field_value: this.commonAPIService.dateConvertion(formControl.value, 'd-MMM-y'),
							rff_old_field_value: this.commonAPIService.dateConvertion(this.studentdetails.personalDetails[0][keys], 'd-MMM-y')
						});
					} else {
						this.checkChangedFieldsArray.push({
							rff_where_id: tableKey,
							rff_where_value: tableKeyValue,
							rff_field_name: keys,
							rff_new_field_value: formControl.value,
							rff_old_field_value: this.studentdetails.personalDetails[0][keys]
						});
					}
				}
			});
			if (this.checkChangedFieldsArray.length > 0) {
				param.req_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
				param.req_process_type = this.context.processType;
				param.req_tab_id = '2';
				param.req_priority = '';
				param.req_remarks = '';
				param.req_reason = '';
				param.req_param = [];
				param.req_date = this.commonAPIService.dateConvertion(new Date, 'yyyy-MM-dd');
				params.push(param);
				datalist.push(this.checkChangedFieldsArray);
			}
		}
		this.checkChangedFieldsArray = [];
		param = {};
		if (this.childDetails.paddressform.dirty) {
			Object.keys(this.childDetails.paddressform.controls).forEach((keys) => {
				const tablePrefix = keys.split('_', 1);
				const tableKey = tablePrefix[0] + '_id';
				const tableKeyValue = this.childDetails.paddressform.value[tableKey];
				const formControl = <FormControl>this.childDetails.paddressform.controls[keys];
				if (formControl.dirty && formControl.touched) {
					this.checkChangedFieldsArray.push({
						rff_where_id: tableKey,
						rff_where_value: tableKeyValue,
						rff_field_name: keys,
						rff_new_field_value: formControl.value,
						rff_old_field_value: this.studentdetails[keys]
					});
				}
			});
			if (this.checkChangedFieldsArray.length > 0) {
				param.req_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
				param.req_process_type = this.context.processType;
				param.req_tab_id = '2';
				param.req_priority = '';
				param.req_remarks = '';
				param.req_reason = '';
				param.req_param = [];
				param.req_date = this.commonAPIService.dateConvertion(new Date, 'yyyy-MM-dd');
				params.push(param);
				datalist.push(this.checkChangedFieldsArray);
			}
		}
		this.checkChangedFieldsArray = [];
		param = {};
		if (this.childDetails.raddressform.dirty) {
			Object.keys(this.childDetails.raddressform.controls).forEach((keys) => {
				const tablePrefix = keys.split('_', 1);
				const tableKey = tablePrefix[0] + '_id';
				const tableKeyValue = this.childDetails.raddressform.value[tableKey];
				const formControl = <FormControl>this.childDetails.raddressform.controls[keys];
				if (formControl.dirty && formControl.touched) {
					this.checkChangedFieldsArray.push({
						rff_where_id: tableKey,
						rff_where_value: tableKeyValue,
						rff_field_name: keys,
						rff_new_field_value: formControl.value,
						rff_old_field_value: this.studentdetails[keys]
					});
				}
			});
			if (this.checkChangedFieldsArray.length > 0) {
				param.req_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
				param.req_process_type = this.context.processType;
				param.req_tab_id = '2';
				param.req_priority = '';
				param.req_remarks = '';
				param.req_reason = '';
				param.req_param = [];
				param.req_date = this.commonAPIService.dateConvertion(new Date, 'yyyy-MM-dd');
				params.push(param);
				datalist.push(this.checkChangedFieldsArray);
			}
		}

		// sibling edit request
		this.checkChangedFieldsArray = [];
		param = {};
		if (this.childDetails.siblingArray.length > 0) {
			for (let i = 0; i < this.childDetails.siblingArray.length; i++) {
				if (this.childDetails.siblingArray[i].esd_id) {
					// tslint:disable-next-line:forin
					for (const keys in this.childDetails.siblingArray[i]) {
						const tablePrefix = keys.split('_', 1);
						const tableKey = tablePrefix[0] + '_id';
						const tableKeyValue = this.childDetails.siblingArray[i][tableKey];
						if (this.childDetails.siblingArray[i][keys] !== this.childDetails.unchangedsiblingArray[i][keys]) {
							this.checkChangedFieldsArray.push({
								rff_where_id: tableKey,
								rff_where_value: tableKeyValue,
								rff_field_name: keys,
								rff_new_field_value: this.childDetails.siblingArray[i][keys],
								rff_old_field_value: this.childDetails.unchangedsiblingArray[i][keys]
							});
						}
					}
				} else {
					const fieldArray: any[] = [];
					const oldFieldValue: any[] = [];
					const newFieldValue: any[] = [];
					for (const key in this.childDetails.siblingArray[i]) {
						if (key !== 'esd_id' &&
							key !== 'esd_login_id' &&
							key !== 'class_name' &&
							key !== 'sec_name' &&
							key !== 'esd_status') {
							fieldArray.push(key);
							oldFieldValue.push('');
							newFieldValue.push(this.childDetails.siblingArray[i][key]);
						}
					}
					this.checkChangedFieldsArray.push({
						rff_where_id: 'esd_id',
						rff_where_value: '',
						rff_field_name: fieldArray,
						rff_new_field_value: newFieldValue,
						rff_old_field_value: oldFieldValue
					});
				}

			}
			if (this.checkChangedFieldsArray.length > 0) {
				param.req_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
				param.req_process_type = this.context.processType;
				param.req_tab_id = '';
				param.req_priority = '';
				param.req_remarks = '';
				param.req_reason = '';
				param.req_param = [];
				param.req_date = this.commonAPIService.dateConvertion(new Date, 'yyyy-MM-dd');
				params.push(param);
				datalist.push(this.checkChangedFieldsArray);
			}
		}

		// parent edit request

		this.reqParamArray = [];
		this.finalSibReqArray = [];
		this.finalSibReqArray2 = [];
		// tslint:disable-next-line:no-shadowed-variable
		for (let i = 0; i < 3; i++) {
			const req_param: any[] = [];
			if (this.parentDetails2[i]) {
				Object.keys(this.parentDetails.formGroupArray[i].formGroup.controls).forEach((key: any) => {
					const formControl = <FormControl>this.parentDetails.formGroupArray[i].formGroup.controls[key];
					if (key !== 'epd_id' && key !== 'addressDetails' || key !== 'epd_login_id') {
						if ((formControl.value !== this.parentDetails2[i][key]) && formControl.dirty) {
							req_param.push({
								rff_where_id: 'epd_id',
								rff_where_value: this.parentDetails2[i]['epd_id'],
								rff_field_name: key,
								rff_new_field_value: formControl.value,
								rff_old_field_value: this.parentDetails2[i][key]
							});
						}
					}
				});
			}
			if (this.parentDetails2[i] && this.parentDetails2[i].addressDetails[0]) {
				Object.keys(this.parentDetails.formGroupArray[i].ea_office_address.controls).forEach((key: any) => {
					const formControl = <FormControl>this.parentDetails.formGroupArray[i].ea_office_address.controls[key];
					if (key !== 'ea_id' || key !== 'ea_login_id') {
						if (formControl.dirty) {
							req_param.push({
								rff_where_id: 'ea_id',
								rff_where_value: this.parentDetails2[i].addressDetails[0] ? this.parentDetails2[i].addressDetails[0]['ea_id'] : '',
								rff_field_name: key,
								rff_new_field_value: formControl.value,
								rff_old_field_value: this.parentDetails2[i].addressDetails[0] ? this.parentDetails2[i].addressDetails[0][key] : ''
							});
						}
					}
				});
			}
			if (this.parentDetails2[i] && this.parentDetails2[i].addressDetails[1]) {
				Object.keys(this.parentDetails.formGroupArray[i].ea_res_address.controls).forEach((key: any) => {
					const formControl = <FormControl>this.parentDetails.formGroupArray[i].ea_res_address.controls[key];
					if (key !== 'ea_id' || key !== 'ea_login_id') {
						if (formControl.dirty) {
							req_param.push({
								rff_where_id: 'ea_id',
								rff_where_value: this.parentDetails2[i].addressDetails[1] ? this.parentDetails2[i].addressDetails[1]['ea_id'] : '',
								rff_field_name: key,
								rff_new_field_value: formControl.value,
								rff_old_field_value: this.parentDetails2[i].addressDetails[1] ? this.parentDetails2[i].addressDetails[1][key] : ''
							});
						}
					}
				});
			}
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
		if (this.finalArray.length > 0) {
			param.req_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
			param.req_process_type = this.context.processType;
			param.req_tab_id = '3';
			param.req_priority = '';
			param.req_remarks = '';
			param.req_reason = '';
			param.req_param = [];
			param.req_date = this.commonAPIService.dateConvertion(new Date, 'yyyy-MM-dd');
			params.push(param);
			datalist.push(this.finalArray);
		}
		// medical edit request
		if (this.medicalDetails) {
			this.checkChangedFieldsArray = [];
			param = {};
			if (this.medicalDetails.medicalform.dirty) {
				Object.keys(this.medicalDetails.medicalform.controls).forEach((keys) => {
					const tablePrefix = keys.split('_', 1);
					const tableKey = tablePrefix[0] + '_id';
					const tableKeyValue = this.medicalDetails.medicalform.value[tableKey];
					const formControl = <FormControl>this.medicalDetails.medicalform.controls[keys];
					if (formControl.dirty && formControl.touched) {
						this.checkChangedFieldsArray.push({
							rff_where_id: tableKey,
							rff_where_value: tableKeyValue,
							rff_field_name: keys,
							rff_new_field_value: formControl.value,
							rff_old_field_value: this.studentdetails[keys]
						});
					}
				});
				if (this.checkChangedFieldsArray.length > 0) {
					param.req_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
					param.req_process_type = this.context.processType;
					param.req_tab_id = '4';
					param.req_priority = '';
					param.req_remarks = '';
					param.req_reason = '';
					param.req_param = [];
					param.req_date = this.commonAPIService.dateConvertion(new Date, 'yyyy-MM-dd');
					params.push(param);
					datalist.push(this.checkChangedFieldsArray);
				}
			}
		}
		this.openEditDialog({ data: datalist, reqParam: params });
		this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
	}
	openEditDialog = (data) => this.editReference.openModal(data);
	resetParentForm() {
		let j = 0;
		for (const item of this.parentDetails.formGroupArray) {
			item.formGroup.reset();
			item.ea_office_address.reset();
			item.ea_res_address.reset();
			if (j === 0) {
				item.formGroup.patchValue({
					epd_parent_type: 'F'
				});
			}
			if (j === 1) {
				item.formGroup.patchValue({
					epd_parent_type: 'M'
				});
			}
			if (j === 2) {
				item.formGroup.patchValue({
					epd_parent_type: 'G'
				});
			}
			j++;
		}
		this.parentDetails.addressStatusArray = [false, false, false];
		this.parentDetails.aluminiStatus = ['No', 'No', 'No'];
		this.parentDetails.staffStatus = ['No', 'No', 'No'];
		this.parentDetails.addressStatus = ['No', 'No', 'No'];
		this.parentDetails.aluminiStatusArray = [false, false, false];
		this.parentDetails.showHideGuardianField = false;
		this.parentDetails.profileImageArray = ['https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png',
			'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.png',
			'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png'];
	}

	isExistUserAccessMenu(actionT) {
		if (this.context && this.context.studentdetails) {
			return this.context.studentdetails.isExistUserAccessMenu(actionT);
		}
	}
	editConfirm() { }
}
