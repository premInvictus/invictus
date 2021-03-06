import { Component, OnInit, ViewChild, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { CommonAPIService } from '../../_services/commonAPI.service';
import { SisService, ProcesstypeService, SmartService } from '../../_services/index';
import { MatDatepickerInputEvent, ErrorStateMatcher } from '@angular/material';
import { DatePipe } from '@angular/common';
import { FormEnabledService } from '../../sharedmodule/dynamic-content/formEnabled.service';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
@Component({
	selector: 'app-parent-details-theme-two',
	templateUrl: './parent-details-theme-two.component.html',
	styleUrls: ['./parent-details-theme-two.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ParentDetailsThemeTwoComponent implements OnInit, OnChanges {
	@ViewChild('cropModal') cropModal;
	@ViewChild('picker') picker;
	@Input() parentDet: any[];
	@Input() configSetting: any;
	@Input() siblings = null;
	value = 'Clear me';
	cropIndex: any;
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	formArray: any[] = [{ formId: 1, formHeader: 'Father\'s', formInfo: 'Father\'s' },
	{ formId: 2, formHeader: 'Mother\'s', formInfo: 'Mother\'s' },
	{ formId: 3, formHeader: 'Guardian\'s', formInfo: 'Guardian\'s' }];
	showHideGuardianField = false;
	showSiblingDiv = false;
	aluminiStatusArray: any[] = [false, false, false];
	addressStatusArray: any[] = [false, false, false];
	aluminiStatus: any[] = ['No', 'No', 'No'];
	formGroupArray: any[] = [];
	qualificationArray: any[] = [];
	annualIncomeArray: any[] = [];
	occupationTypeArray: any[] = [];
	occupationTypeArray2: any[] = [];
	classArray: any[] = [];
	showSiblingField = true;
	siblingForm: FormGroup;
	currentUser: any;
	userDetail: any;
	flagOccupation = false;
	flagQualification = false;
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
	profileImageArray: any[] = [];
	guardianStatus: any = 'No';
	showDeclarationDiv = false;
	staffStatus: any[] = ['No', 'No', 'No'];
	addressStatus: any[] = ['No', 'No', 'No'];
	jobStatus: any[] = ['No', 'No', 'No'];
	opacityClass = ['', '', ''];
	@Input() addOnly = false;
	@Input() viewOnly = false;
	@Input() editRequestFlag = false;
	defaultsrc: any;
	cityCountryArray: any[] = [];
	formFieldsO: any;
	formFieldsA: any;
	formFieldsP: any;
	optionalParentForm: any;
	optional_ea_office_address: any;
	optional_ea_res_address: any;
	constructor(public fbuild: FormBuilder, private notif: CommonAPIService, private sisService: SisService,
		private formEnabledService: FormEnabledService, private processtypeService: ProcesstypeService,
		public SmartService: SmartService) { }


	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
		this.getConfigureSetting();
		this.profileImageArray = ['https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png',
			'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.png',
			'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png'];
		this.getQualifications();
		this.getAnnualIncome();
		this.getOccupationType();
		this.getClass();
		this.getSection();
		this.getCountry();
		this.getState();
		this.getSchool();
		this.prepareFormFields();
		this.buildForm();
	}
	ngOnChanges() {
		if (this.viewOnly) {
			this.getParentDetails(this.parentDet);
			console.log(this.getParentDetails(this.parentDet));
		}
		console.log("this is from parent details");
		console.log(this.siblings[1]);
		this.parentDet = this.siblings[1];
		console.log("this sibling : "+this.siblings);
		if(this.siblings[0]){
			if(this.parentDet){
				console.log("i am trying to get the parent details");
				console.log(this.parentDet);
				this.getParentDetails(this.parentDet);
				this.viewOnly = true;
			}else{
				this.parentDet = null;
				this.parentDetailsArray = [];
				this.viewOnly = false;
				for (const item of this.formGroupArray) {
					item.formGroup.reset();
					item.ea_office_address.reset();
					item.ea_res_address.reset();
				}
			}
		}else if(this.siblings[1] == 0 && !this.siblings[0]){
			this.parentDet = null;
			this.parentDetailsArray = [];
			this.viewOnly = false;
			for (const item of this.formGroupArray) {
				item.formGroup.reset();
				item.ea_office_address.reset();
				item.ea_res_address.reset();
			}
		}
		console.log(this.parentDet);
	}

	buildForm() {
		this.formGroupArray = [{
			form_id: 1, formGroup: this.fbuild.group({
				epd_id: '',
				epd_login_id: '',
				epd_profile_image: '',
				epd_parent_honorific: '',
				epd_parent_name: '',
				epd_parent_dob: '',
				epd_parent_nationality: '',
				epd_contact_no: '',
				epd_whatsapp_no: '',
				epd_pan_no: '',
				epd_aadhar_no: '',
				epd_email: '',
				epd_status: '',
				epd_parent_alumni: 'N',
				epd_parent_alumni_last_class: '',
				epd_parent_alumni_last_year: '',
				epd_parent_admission_no: '',
				epd_qualification: [],
				epd_parent_occupation_type: '',
				epd_parent_staff_of_organisation: 'N',
				epd_parent_type: 'F',
				epd_organisation: '',
				epd_designation: '',
				epd_income: '',
				epd_is_transferable: 'N',
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
			}),
		},
		{
			form_id: 2, formGroup: this.fbuild.group({
				epd_id: '',
				epd_login_id: '',
				epd_profile_image: '',
				epd_parent_honorific: '',
				epd_parent_name: '',
				epd_parent_dob: '',
				epd_parent_nationality: '',
				epd_contact_no: '',
				epd_whatsapp_no: '',
				epd_email: '',
				epd_pan_no: '',
				epd_aadhar_no: '',
				epd_status: '',
				epd_parent_alumni: 'N',
				epd_parent_alumni_last_class: '',
				epd_parent_alumni_last_year: '',
				epd_parent_admission_no: '',
				epd_qualification: [],
				epd_parent_occupation_type: '',
				epd_parent_staff_of_organisation: 'N',
				epd_parent_type: 'M',
				epd_organisation: '',
				epd_designation: '',
				epd_income: '',
				epd_is_transferable: 'N',
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
			}),
		},
		{
			form_id: 3, formGroup: this.fbuild.group({
				epd_id: '',
				epd_login_id: '',
				epd_profile_image: '',
				epd_parent_honorific: '',
				epd_parent_name: '',
				epd_parent_dob: '',
				epd_parent_nationality: '',
				epd_contact_no: '',
				epd_whatsapp_no: '',
				epd_email: '',
				epd_pan_no: '',
				epd_aadhar_no: '',
				epd_status: '',
				epd_parent_alumni: 'N',
				epd_parent_alumni_last_class: '',
				epd_parent_alumni_last_year: '',
				epd_parent_admission_no: '',
				epd_qualification: [],
				epd_parent_occupation_type: '',
				epd_parent_staff_of_organisation: 'N',
				epd_parent_type: 'G',
				epd_organisation: '',
				epd_designation: '',
				epd_income: '',
				epd_is_transferable: 'N',
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
				ea_status: ''
			}),
		}];
	}
	


	prepareFormFields(){

		this.formFieldsP = [
			"epd_profile_image", "epd_parent_name", "epd_parent_dob",	"epd_parent_nationality", "epd_contact_no",	"epd_whatsapp_no",
			"epd_pan_no", "epd_aadhar_no", "epd_email", "epd_parent_alumni",	"epd_parent_alumni_last_class",	"epd_parent_alumni_last_year", "epd_parent_admission_no",
			"epd_qualification", "epd_parent_occupation_type", "epd_parent_staff_of_organisation",	"epd_parent_type",	"epd_organisation",	"epd_designation", "epd_income",
			"epd_is_transferable",	"epd_custody_of_guardian", "epd_guard_child_rel"
		];
		this.formFieldsO = [
			"ea_id", "ea_login_id",	"ea_address_for","ea_address_type",	"ea_address1","ea_address2","ea_city","ea_state","ea_country","ea_pincode",	"ea_status","ea_email",	"ea_mobile"
		];
		this.formFieldsA = [
			"ea_id", "ea_login_id",	"ea_address_for","ea_address_type",	"ea_address1","ea_address2","ea_city","ea_state","ea_country","ea_pincode",	"ea_status","ea_email",	"ea_mobile"
		];

		console.log("this.settingsArray ", this.settingsArray);


		// this.formFieldsO.forEach(element => {
		// 	if(this.checkIfFieldExist(element)){
		// 		ea_office_address.element = '';
		// 	}
		// });
		// this.formFieldsA.forEach(element => {
		// 	if(this.checkIfFieldExist(element)){
		// 		ea_res_address.element = '';
		// 	}
		// });
	}




	// buildForm() {

	// 	this.optionalParentForm = {
	// 		'epd_id' : '',
	// 		'epd_login_id' : '',
	// 		'epd_parent_honorific' : '',
	// 		'epd_status' : ''
	// 	};

	// 	this.formGroupArray = [{
	// 		form_id: 1, formGroup: this.fbuild.group(this.optionalParentForm),
	// 		ea_office_address: this.fbuild.group({
	// 			ea_id: '',
	// 			ea_login_id: '',
	// 			ea_address_for: 'F',
	// 			ea_address_type: 'office',
	// 			ea_address1: '',
	// 			ea_address2: '',
	// 			ea_city: '',
	// 			ea_state: '',
	// 			ea_country: '',
	// 			ea_pincode: '',
	// 			ea_status: '',
	// 			ea_email: '',
	// 			ea_mobile: ''
	// 		}),
	// 		ea_res_address: this.fbuild.group({
	// 			ea_id: '',
	// 			ea_login_id: '',
	// 			ea_address_for: 'F',
	// 			ea_address_type: 'permanent',
	// 			ea_address1: '',
	// 			ea_same_residential_address: 'N',
	// 			ea_address2: '',
	// 			ea_city: '0',
	// 			ea_state: '0',
	// 			ea_country: '0',
	// 			ea_pincode: '0',
	// 			ea_status: '',
	// 		}),
	// 	},
	// 	{
	// 		form_id: 2, formGroup: this.fbuild.group(this.optionalParentForm),
	// 		ea_office_address: this.fbuild.group({
	// 			ea_id: '',
	// 			ea_login_id: '',
	// 			ea_address_for: 'M',
	// 			ea_address_type: 'office',
	// 			ea_address1: '',
	// 			ea_address2: '',
	// 			ea_city: '',
	// 			ea_state: '',
	// 			ea_country: '',
	// 			ea_pincode: '',
	// 			ea_status: '',
	// 			ea_email: '',
	// 			ea_mobile: ''
	// 		}),
	// 		ea_res_address: this.fbuild.group({
	// 			ea_id: '',
	// 			ea_login_id: '',
	// 			ea_address_for: 'M',
	// 			ea_address_type: 'permanent',
	// 			ea_address1: '',
	// 			ea_same_residential_address: 'N',
	// 			ea_address2: '',
	// 			ea_city: '0',
	// 			ea_state: '0',
	// 			ea_country: '0',
	// 			ea_pincode: '0',
	// 			ea_status: '',
	// 		}),
	// 	},
	// 	{
	// 		form_id: 3, formGroup: this.fbuild.group(this.optionalParentForm),
	// 		ea_office_address: this.fbuild.group({
	// 			ea_id: '',
	// 			ea_login_id: '',
	// 			ea_address_for: 'G',
	// 			ea_address_type: 'office',
	// 			ea_address1: '',
	// 			ea_address2: '',
	// 			ea_city: '',
	// 			ea_state: '',
	// 			ea_country: '',
	// 			ea_pincode: '',
	// 			ea_status: '',
	// 			ea_email: '',
	// 			ea_mobile: ''
	// 		}),
	// 		ea_res_address: this.fbuild.group({ 
	// 			ea_id: '',
	// 			ea_login_id: '',
	// 			ea_address_for: 'G',
	// 			ea_address_type: 'permanent',
	// 			ea_address1: '',
	// 			ea_address2: '',
	// 			ea_same_residential_address: 'N',
	// 			ea_city: '0',
	// 			ea_state: '0',
	// 			ea_country: '0',
	// 			ea_pincode: '0',
	// 			ea_status: ''
	// 		}),
	// 	}];

	// 	// this.formGroupArray = [{
	// 	// 	form_id: 1, formGroup: this.fbuild.group(parentForm),
	// 	// 	ea_office_address: this.fbuild.group(ea_office_address),
	// 	// 	ea_res_address: this.fbuild.group(ea_res_address),
	// 	// },
	// 	// {
	// 	// 	form_id: 2, formGroup: this.fbuild.group(parentForm),
	// 	// 	ea_office_address: this.fbuild.group(ea_office_address),
	// 	// 	ea_res_address: this.fbuild.group(ea_res_address),
	// 	// },
	// 	// {
	// 	// 	form_id: 3, formGroup: this.fbuild.group(parentForm),
	// 	// 	ea_office_address: this.fbuild.group(ea_office_address),
	// 	// 	ea_res_address: this.fbuild.group(ea_res_address),
	// 	// }];
	// }
	
	filterCityStateCountry($event) {
		if ($event.target.value !== '' && $event.target.value.length >= 1) {
			this.cityCountryArray = [];
			this.sisService.getStateCountryByCity({ cit_name: $event.target.value }).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.cityCountryArray = result.data;
				}
			});
		}
	}
	openCropDialog = (imageFile, index) => this.cropModal.openModal(imageFile);
	getConfigureSetting() {
		this.sisService.getConfigureSetting({
			cos_process_type: this.processtypeService.getProcesstype()
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.savedSettingsArray = result.data;
				for (const item of this.savedSettingsArray) {
					if (item.cos_tb_id === '3') {
						// setTimeout(function() {
							this.settingsArray.push({
								cos_tb_id: item.cos_tb_id,
								cos_ff_id: item.cos_ff_id,
								cos_status: item.cos_status,
								ff_field_name: item.ff_field_name
							});
							// this.formFieldsP.forEach(element => {
							// 	var pass = false;
							// 	if(item.ff_field_name == element && item.cos_status =='Y' ) pass = true; 
							// 	// this.checkIfFieldExist(element);
							// 	console.log("parent form ", element);
							// 	if(pass){
							// 		console.log("parent form element passed ", element);
							// 		this.optionalParentForm[element] = '';
							// 	}else{
							// 		console.log("pass error ", pass);
							// 	}
							// });
						// }, 5000);
					}
				}
			}
		});
	}
	checkIfFieldExist(value) {
		// console.log("if field exist ", value);
		const findex = this.settingsArray.findIndex(f => f.ff_field_name === value);
		// console.log("if field exist findex ", findex);
		if (findex !== -1 && this.settingsArray[findex]['cos_status'] === 'Y') {
			return true;
		} else if (findex !== -1 && this.settingsArray[findex]['cos_status'] === 'N') {
			return false;
		} else {
			return false;
		}
	}
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
				this.occupationTypeArray2 = result.data;
			}
		});
	}
	getClass() {
		const param: any = {};
		param.login_id = this.currentUser.login_id;
		this.SmartService.getClassData(param).subscribe((result: any) => {
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
	getCountry() {
		this.sisService.getCountry().subscribe((result: any) => {
			if (result) {
				this.countryArray = result.data;
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
	getSchool() {
		this.sisService.getSchool().subscribe((result: any) => {
			if (result) {
				this.schoolInfo = result.data[0];
			}
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
		if ($event.checked === true) {
			this.formGroupArray[2].formGroup.patchValue({
				'epd_custody_of_guardian': 'Y'
			});
			this.showHideGuardianField = true;
			this.guardianStatus = 'Yes';
			this.showDeclarationDiv = true;
		} else {
			this.showHideGuardianField = false;
			this.guardianStatus = 'No';
			this.showDeclarationDiv = false;
		}
	}
	checkAluminiStatus(index, $event) {
		if ($event.checked === true) {
			this.formGroupArray[index].formGroup.patchValue({
				'epd_parent_alumni': 'Y'
			});
			this.aluminiStatusArray[index] = true;
			this.aluminiStatus[index] = 'Yes';
			this.opacityClass[index] = '';
		} else {
			this.aluminiStatusArray[index] = false;
			this.formGroupArray[index].formGroup.patchValue({
				'epd_parent_alumni': 'N'
			});
			this.aluminiStatus[index] = 'No';
			this.opacityClass[index] = 'opacity-class';
		}
	}
	checkJobStatus($event, index) {
		if ($event.checked === true) {
			this.formGroupArray[index].formGroup.patchValue({
				'epd_is_transferable': 'Y'
			});
			this.jobStatus[index] = 'Yes';
		} else {
			this.formGroupArray[index].formGroup.patchValue({
				'epd_is_transferable': 'N'
			});
			this.jobStatus[index] = 'No';
		}
	}
	checkStaffStatus($event, index) {
		if ($event.checked === true) {
			this.formGroupArray[index].formGroup.patchValue({
				'epd_organisation': this.schoolInfo.school_name
			});
			this.staffStatus[index] = 'Yes';
			this.formGroupArray[index].ea_office_address.patchValue({
				ea_address1: this.schoolInfo.school_address,
			});
		} else {
			this.staffStatus[index] = 'No';
			this.formGroupArray[index].formGroup.patchValue({
				'epd_organisation': ''
			});
			this.formGroupArray[index].ea_office_address.patchValue({
				ea_address1: ''
			});
		}
	}

	changeFlafOcc(val) {

		if(val == 81 || val == 78) {
			this.flagOccupation = true;
		}
	}
	changeFlagQual(val) {

		if(val == 0 ) {
			this.flagQualification = true;
		}
	}
	setActiveParent(index, $event) {
		if (Number($event.value) === 1) {
			this.formGroupArray[index].formGroup.value.epd_status = $event.value;
			let i = 0;
			for (const item of this.formGroupArray) {
				if (i !== index) {
					item.formGroup.value.epd_status = '';
				}
				i++;
			}
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
		if ($event.checked === true) {
			this.addressStatusArray[index] = true;
			this.addressStatus[index] = 'Yes';
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
			this.addressStatus[index] = 'No';
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
	acceptCrop(result) {
		this.uploadImage(result.filename, result.base64, this.cropIndex);
	}
	acceptNo(event) {
		event.target.value = '';
	}
	bindImageToForm(event, index) {
		let files = event.target.files[0].name;
		var ext = files.substring(files.lastIndexOf('.') + 1);
		if (ext === 'svg') {
			this.notif.showSuccessErrorMessage('Only Jpeg and Png image allowed.', 'error');
		} else {
			this.cropIndex = index;
			this.openCropDialog(event, index);
		}
	}
	uploadImage(fileName, epd_profile_image, index) {
		this.sisService.uploadDocuments([
			{ fileName: fileName, imagebase64: epd_profile_image, module: 'profile' }]).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.defaultsrc = result.data[0].file_url;
					this.profileImageArray[index] = result.data[0].file_url;
					this.formGroupArray[index].formGroup.patchValue({
						epd_profile_image: this.profileImageArray[index]
					});
				}
			});
	}
	blurValue(e) {
		let val = {
			octp_name: this.formGroupArray[0].formGroup.value.epd_parent_occupation_type
		}

		this.sisService.addNewOccupation(val).subscribe((result:any) => {
			if(result.status === 'ok') {
				this.getOccupationType();
			}
		});
		this.flagOccupation = false;
		
	}
	getParentDetails(value: any[]) {
		let parent: any[] = [];
		let ind = 0;
		for (const item of value) {
			for (const titem of value) {
				if (ind === 0 && titem.epd_parent_type === 'F') {
					parent.push(titem);
					break;
				}
				if (ind === 1 && titem.epd_parent_type === 'M') {
					parent.push(titem);
					break;
				}
				if (ind === 2 && titem.epd_parent_type === 'G') {
					parent.push(titem);
					break;
				}
			}
			ind++;
		}
		value = [];
		value = parent;
		if (value.length > 0) {
			let j = 0;
			for (const item of this.formGroupArray) {
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
			this.addressStatusArray = [false, false, false];
			this.showHideGuardianField = false;
			let i = 0;
			for (const item of value) {
				if (value[i] && value[i].epd_parent_alumni
					&& value[i].epd_parent_alumni === 'Y') {
					this.aluminiStatusArray[i] = true;
					this.opacityClass[i] = '';
					this.aluminiStatus[i] = 'Yes';
				} else {
					this.aluminiStatusArray[i] = false;
					this.aluminiStatus[i] = 'No';
					this.opacityClass[i] = 'opacity-class';
				}
				if (value[i] && value[i].epd_custody_of_guardian === 'Y') {
					this.showHideGuardianField = true;
				} else {
					this.showHideGuardianField = false;
				}
				if (value[i] && value[i].epd_is_transferable === 'N') {
					this.jobStatus[i] = 'No';
				} else {
					this.jobStatus[i] = 'Yes';
				}
				if (value[i] && value[i].epd_parent_staff_of_organisation === 'N') {
					this.staffStatus[i] = 'No';
				} else {
					this.staffStatus[i] = 'Yes';
				}
				this.profileImageArray[i] = value[i].epd_profile_image ? value[i].epd_profile_image : this.profileImageArray[i];
				if (this.picker) {
					this.picker._dateAdapter.locale = 'en-in';
				}
				if (this.formGroupArray && this.formGroupArray[i]) {
					this.formGroupArray[i].formGroup.patchValue({
						'epd_id': value[i].epd_id,
						'epd_login_id': value[i].epd_login_id,
						'epd_parent_honorific': value[i].epd_parent_honorific,
						'epd_parent_name': value[i].epd_parent_name,
						'epd_parent_dob': value[i].epd_parent_dob,
						'epd_parent_nationality': value[i].epd_parent_nationality,
						'epd_status': value[i].epd_status,
						'epd_contact_no': value[i].epd_contact_no,
						'epd_whatsapp_no': value[i].epd_whatsapp_no,
						'epd_pan_no': value[i].epd_pan_no,
						'epd_aadhar_no': value[i].epd_aadhar_no,
						'epd_email': value[i].epd_email,
						'epd_parent_alumni': value[i].epd_parent_alumni === 'N' ? false : true,
						'epd_parent_type': value[i].epd_parent_type,
						'epd_parent_alumni_last_class': value[i].epd_parent_alumni_last_class,
						'epd_parent_alumni_last_year': value[i].epd_parent_alumni_last_year !== '0000' ?
							value[i].epd_parent_alumni_last_year : '',
						'epd_parent_admission_no': value[i].epd_parent_admission_no,
						'epd_qualification': value[i].epd_qualification ?
							value[i].epd_qualification : [],
						'epd_parent_occupation_type': value[i].epd_parent_occupation_type,
						'epd_parent_staff_of_organisation': value[i].epd_parent_staff_of_organisation === 'N' ? false : true,
						'epd_organisation': value[i].epd_organisation,
						'epd_designation': value[i].epd_designation,
						'epd_income': value[i].epd_income,
						'epd_guard_child_rel': value[i].epd_guard_child_rel,
						'epd_is_transferable': value[i].epd_is_transferable === 'N' ? false : true,
						'epd_custody_of_guardian': value[i].epd_custody_of_guardian === 'N' ? false : true,
						'epd_profile_image': value[i].epd_profile_image
					});
				}
				const addressDetails: any[] = [];
				for (const addItem of value[i].addressDetails) {
					if (addItem && addItem.ea_address_type === 'office') {
						addressDetails.push({
							ea_address1: addItem.ea_address1,
							ea_address2: addItem.ea_address2,
							ea_address_for: addItem.ea_address_for,
							ea_address_type: addItem.ea_address_type,
							ea_city: addItem.cit_name,
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
							ea_city: addItem.cit_name,
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
							&& address.ea_address_for === 'F' && this.formGroupArray[0]) {
							this.formGroupArray[0].ea_office_address.patchValue({
								ea_id: address.ea_id,
								ea_login_id: address.ea_login_id,
								ea_address_type: address.ea_address_type,
								ea_address_for: address.ea_address_for,
								ea_address1: address.ea_address1,
								ea_address2: address.ea_address2,
								ea_city: address.cit_name,
								ea_state: address.ea_state,
								ea_country: address.ea_country,
								ea_pincode: address.ea_pincode,
								ea_email: address.ea_email,
								ea_mobile: address.ea_mobile,
								ea_status: address.ea_status
							});
						}
						if (address.ea_address_type && address.ea_address_type === 'office'
							&& address.ea_address_for === 'M' && this.formGroupArray[1]) {
							this.formGroupArray[1].ea_office_address.patchValue({
								ea_id: address.ea_id,
								ea_login_id: address.ea_login_id,
								ea_address_type: address.ea_address_type,
								ea_address_for: address.ea_address_for,
								ea_address1: address.ea_address1,
								ea_address2: address.ea_address2,
								ea_city: address.cit_name,
								ea_state: address.ea_state,
								ea_country: address.ea_country,
								ea_pincode: address.ea_pincode,
								ea_email: address.ea_email,
								ea_mobile: address.ea_mobile,
								ea_status: address.ea_status
							});
						}
						if (address.ea_address_type && address.ea_address_type === 'office'
							&& address.ea_address_for === 'G' && this.formGroupArray[2]) {
							this.formGroupArray[2].ea_office_address.patchValue({
								ea_id: address.ea_id,
								ea_login_id: address.ea_login_id,
								ea_address_type: address.ea_address_type,
								ea_address_for: address.ea_address_for,
								ea_address1: address.ea_address1,
								ea_address2: address.ea_address2,
								ea_city: address.cit_name,
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
							&& address.ea_address_for === 'F' && this.formGroupArray[0]) {
							this.formGroupArray[0].ea_res_address.patchValue({
								ea_id: address.ea_id,
								ea_login_id: address.ea_login_id,
								ea_address_type: address.ea_address_type,
								ea_address_for: address.ea_address_for,
								ea_same_residential_address: address.ea_same_residential_address,
								ea_address1: address.ea_address1,
								ea_address2: address.ea_address2,
								ea_city: address.cit_name,
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
							&& address.ea_address_for === 'M' && this.formGroupArray[1]) {
							this.formGroupArray[1].ea_res_address.patchValue({
								ea_id: address.ea_id,
								ea_login_id: address.ea_login_id,
								ea_address_type: address.ea_address_type,
								ea_address_for: address.ea_address_for,
								ea_same_residential_address: address.ea_same_residential_address,
								ea_address1: address.ea_address1,
								ea_address2: address.ea_address2,
								ea_city: address.cit_name,
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
							&& address.ea_address_for === 'G' && this.formGroupArray[2]) {
							this.formGroupArray[2].ea_res_address.patchValue({
								ea_id: address.ea_id,
								ea_login_id: address.ea_login_id,
								ea_address_type: address.ea_address_type,
								ea_address_for: address.ea_address_for,
								ea_same_residential_address: address.ea_same_residential_address,
								ea_address1: address.ea_address1,
								ea_address2: address.ea_address2,
								ea_city: address.cit_name,
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
				i++;
			}
		} else {
			let j = 0;
			for (const item of this.formGroupArray) {
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
			this.addressStatusArray = [false, false, false];
			this.aluminiStatus = ['No', 'No', 'No'];
			this.staffStatus = ['No', 'No', 'No'];
			this.addressStatus = ['No', 'No', 'No'];
			this.aluminiStatusArray = [false, false, false];
			this.showHideGuardianField = false;
			this.profileImageArray = ['https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png',
				'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.png',
				'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png'];
		}
	}
	getCityPerId(item: any, index) {
		this.formGroupArray[index].ea_office_address.patchValue({
			ea_city: this.getCityName(item.cit_id),
			ea_state: item.sta_id,
			ea_country: item.cou_id
		});
	}
	getCityResId(item: any, index) {
		this.formGroupArray[index].ea_res_address.patchValue({
			ea_city: this.getCityName(item.cit_id),
			ea_state: item.sta_id,
			ea_country: item.cou_id
		});
	}
	getCityName(id) {
		const findIndex = this.cityCountryArray.findIndex(f => f.cit_id === id);
		if (findIndex !== -1) {
			return this.cityCountryArray[findIndex].cit_name;
		}
	}
	getCityId(city_name, cou_id) {
		const findIndex = this.cityCountryArray.findIndex(f => f.cit_name === city_name && f.cou_id === cou_id);
		if (findIndex !== -1) {
			return this.cityCountryArray[findIndex].cit_id;
		}
	}
	checkCssClass(index) {
		if (index === 0) {
			return 'col-12 border-bottom';
		} else {
			return 'col-12 border-bottom';
		}
	}
	filterOccupation(val) {
		const anotherArray: any[] = this.occupationTypeArray2;
		this.occupationTypeArray = anotherArray.filter(f => f.ocpt_name.toLowerCase().indexOf(val) > -1);
	}
	refillData() {
		this.occupationTypeArray = this.occupationTypeArray2;
	}
}
// export class ConfirmValidParentMatcher implements ErrorStateMatcher {
// 	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
// 		return control && control.invalid && (control.dirty || control.touched || form.submitted);
// 	}
// }
