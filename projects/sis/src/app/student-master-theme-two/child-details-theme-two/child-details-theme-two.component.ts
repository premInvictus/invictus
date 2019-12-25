import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FormEnabledTwoService } from '../../sharedmodule/dynamic-content-theme-two/formEnabledTwo.service';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';

@Component({
	selector: 'app-child-details-theme-two',
	templateUrl: './child-details-theme-two.component.html',
	styleUrls: ['./child-details-theme-two.component.scss']
})
export class ChildDetailsThemeTwoComponent implements OnInit, OnChanges, AfterViewInit {

	@Input() addOnly: boolean;
	@Input() editOnly: boolean;
	@Input() viewOnly: boolean;
	@Input() configSetting: any;
	childdetialsform: FormGroup;
	baseform: FormGroup;
	paddressform: FormGroup;
	raddressform: FormGroup;
	siblingform: FormGroup;
	raddressviewonly = true;
	@ViewChild('editReference') editReference;
	@ViewChild('picker') picker;
	@ViewChild('picker1') picker1;
	nationlityothers: any;
	nationalityothers = false;
	editRequestFlag = false;
	saveFlag = false;
	categoryothers = false;
	studentdetails: any = {};
	userDetailForSibling: any = {};
	siblingArray: any[] = [];
	unchangedsiblingArray: any[] = [];
	classArray: any[] = [];
	sectionArray: any[] = [];
	gender: any[] = [];
	category: any[] = [];
	nationality: any[] = [];
	siblingArrayIndex = -1;
	schoolInfo: any = {};
	login_id;
	dobDate = new Date();
	minDate = new Date();
	maxDate = new Date();
	siblingdetailsdiv = false;
	siblingedit = false;
	checkReadOnlyStatus = false;
	arrayCountry: any[] = [];
	arrayState: any[] = [];
	arrayCity: any[] = [];
	arrayReligion: any[] = [];
	arrayMotherTongue: any[] = [];
	events: string[] = [];
	checkChangedFieldsArray = [];
	tb_id;
	savedSettingsArray: any[] = [];
	settingsArray: any[] = [];
	showAddressFlag = false;
	addressStatus = 'No';
	siblingStaus = 'No';
	datePlaceHolder: any;
	cityCountryArray: any[] = [];
	cityId: any;
	cityId2: any;
	opacityClass = '';
	studentTags: any[] = [];
	constructor(
		private formEnabledTwoService: FormEnabledTwoService,
		private fbuild: FormBuilder,
		private el: ElementRef,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private processtypeService: ProcesstypeService
	) {
	}

	ngOnInit() {
		this.dobDate.setFullYear(this.dobDate.getFullYear() - 1);
		this.buildForm();
		this.getNationality();
		this.getGender();
		this.getCategory();
		// this.getClass();
		// this.getSchool();
		this.getCountry();
		this.getState();
		this.getReligionDetails();
		this.getMotherTongue();
		this.getStudentTags();
		this.settingsArray = this.configSetting;
		// this.getConfigureSetting();
		this.addressStatus = 'No';
		this.siblingStaus = 'No';
		if (this.processtypeService.getProcesstype() === '1') {
			this.datePlaceHolder = 'Date of Enquiry';
		} else if (this.processtypeService.getProcesstype() === '2') {
			this.datePlaceHolder = 'Date of Registration';
		} else if (this.processtypeService.getProcesstype() === '3') {
			this.datePlaceHolder = 'Date of Provisional Admission';
		} else if (this.processtypeService.getProcesstype() === '4') {
			this.datePlaceHolder = 'Date of Admission';
		} else if (this.processtypeService.getProcesstype() === '5') {
			this.datePlaceHolder = 'Date of Alumini';
		}
	}
	ngAfterViewInit() {
	}

	ngOnChanges() {
	}

	getNationality() {
		this.nationality = [];
		this.sisService.getNationality().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.nationality = result.data;
			}
		});
	}

	getStudentTags() {
		this.studentTags = [];
		this.sisService.getstudenttags({tag_status:'1'}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.studentTags = result.data;
			}
		});
	}

	getGender() {
		this.gender = [];
		this.sisService.getGender().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.gender = result.data;
			}
		});
	}

	getCategory() {
		this.category = [];
		this.sisService.getCategory().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.category = result.data;
			}
		});
	}

	ea_same_residential_address_change($event) {
		if ($event.checked) {
			this.addressStatus = 'Yes';
			this.paddressform.patchValue({
				ea_same_residential_address: true
			});
			this.raddressform.patchValue({
				ea_same_residential_address: true
			});
			this.showAddressFlag = true;
			this.raddressviewonly = false;
			this.opacityClass = '';
		} else {
			this.addressStatus = 'No';
			this.paddressform.patchValue({
				ea_same_residential_address: false
			});
			this.raddressform.patchValue({
				ea_same_residential_address: false
			});
			this.showAddressFlag = false;
			this.raddressviewonly = true;
			this.opacityClass = 'opacity-class';
		}
	}

	siblingdetailsdiv_change(event) {
		if (event.checked) {
			this.siblingdetailsdiv = true;
			this.siblingStaus = 'Yes';
			this.getSchool();
			this.getClass();

		} else {
			this.siblingdetailsdiv = false;
			this.siblingStaus = 'No';
		}
	}

	// getConfigureSetting() {
	// 	this.sisService.getConfigureSetting({
	// 		cos_process_type: this.processtypeService.getProcesstype()
	// 	}).subscribe((result: any) => {
	// 		if (result.status === 'ok') {
	// 			// this.savedSettingsArray = result.data;
	// 			this.settingsArray = result.data;
	// 			/* for (const item of this.savedSettingsArray) {
	//        if (item.cos_tb_id === '2') {
	//        this.settingsArray.push({
	//          cos_tb_id: item.cos_tb_id,
	//          cos_ff_id: item.cos_ff_id,
	//          cos_status: item.cos_status,
	//          ff_field_name: item.ff_field_name
	//        });
	//       }
	//      } */
	// 		}
	// 	});
	// }

	checkIfFieldExist(value) {
		const findex = this.settingsArray.findIndex(f => f.ff_field_name === value);
		if (findex !== -1 && this.settingsArray[findex]['cos_status'] === 'Y') {
			return true;
		} else {
			return false;
		}
	}

	buildForm() {
		this.baseform = this.fbuild.group({
			upd_id: '',
			upd_aadhaar_no: '',
			upd_dob: '',
			upd_doj: '',
			upd_religion_id: '',
			upd_nationality: '',
			upd_gender: '',
			upd_category: '',
			upd_mt_id: '',
			upd_tag_id: ''
		});
		this.paddressform = this.fbuild.group({
			ea_id: '',
			ea_login_id: '',
			ea_address_type: 'permanent',
			ea_same_residential_address: false,
			ea_address_for: 'S',
			ea_address1: '',
			ea_city: '',
			ea_state: '',
			ea_country: '',
			ea_pincode: ''
		});
		this.raddressform = this.fbuild.group({
			ea_id: '',
			ea_login_id: '',
			ea_address_type: 'present',
			ea_same_residential_address: false,
			ea_address_for: 'S',
			ea_address1: '',
			ea_city: '',
			ea_state: '',
			ea_country: '',
			ea_pincode: ''
		});
		this.siblingform = this.fbuild.group({
			esd_login_id: '',
			esd_id: '',
			esd_is_have_sibling: '',
			esd_student_of_same_school: '',
			esd_admission_no: '',
			esd_name: '',
			esd_class: '',
			class_name: '',
			esd_section: '',
			sec_name: '',
			esd_school_name: '',
			esd_age: '',
			esd_status: ''
		});
	}

	resetpaddressform() {
		this.paddressform.patchValue({
			ea_address_type: 'permanent',
			ea_same_residential_address: false,
			ea_address_for: 'S',
			ea_address1: '',
			ea_city: '',
			ea_state: '',
			ea_country: '',
			ea_pincode: ''
		});
	}

	resetraddressform() {
		this.raddressform.patchValue({
			ea_address_type: 'present',
			ea_same_residential_address: false,
			ea_address_for: 'S',
			ea_address1: '',
			ea_city: '',
			ea_state: '',
			ea_country: '',
			ea_pincode: ''
		});
	}

	resetForm() {
		this.baseform.reset();
		this.resetpaddressform();
		this.resetraddressform();
		this.siblingform.reset();
		this.siblingArray = [];
		this.siblingdetailsdiv = false;
	}

	openEditDialog = (data) => this.editReference.openModal(data);
	enablenationalityothers() {
		this.nationalityothers = false;
		if (this.childdetialsform.value.upd_nationality === 'Others') {
			this.nationalityothers = true;
		}
	}
	enablecategoryothers() {
		this.categoryothers = false;
		if (this.childdetialsform.value.upd_category === 'Others') {
			this.categoryothers = true;
		}
	}

	set_upd_nationality() {
		/* this.childdetialsform.patchValue({
      upd_nationality : this.childdetialsform.value.upd_nationality_other
    }); */
	}

	set_upd_category() {
		/* this.childdetialsform.patchValue({
      upd_category : this.childdetialsform.value.upd_category_other
    }); */
	}

	getClass() {
		this.classArray = [];
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result) {
				this.classArray = result.data;
			}
		});
	}

	getSectionsByClass() {
		this.sectionArray = [];
		this.sisService.getSectionsByClass({ class_id: this.siblingform.value.esd_class }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.sectionArray = result.data;
			}
		});
	}

	getCountry() {
		this.sisService.getCountry().subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					this.arrayCountry = result.data;
				}
			}
		);
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

	getReligionDetails() {
		this.sisService.getReligionDetails({}).subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					this.arrayReligion = result.data;
				}
			}
		);
	}
	getMotherTongue() {
		this.sisService.getMotherTongue({}).subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					this.arrayMotherTongue = result.data;
				}
			}
		);
	}

	getTabDetails() {
	}

	validateStr(patternstr, str) {
		return patternstr.test(String(str).toLowerCase());
	}

	getSchool() {
		this.sisService.getSchool().subscribe((result: any) => {
			if (result) {
				this.schoolInfo = result.data[0];
			}
		});
	}

	getSiblingDetails(value) {
		this.checkReadOnlyStatus = false;
		this.siblingform.patchValue({
			esd_admission_no: '',
			esd_name: '',
			esd_class: '',
			esd_section: '',
			esd_school_name: ''
		});
		const param: any = {};
		param.admission_no = value;
		param.au_process_type = '4';
		param.pmap_status = '1';
		if (value !== '') {
			this.sisService.getStudent(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.userDetailForSibling = result.data[0].personalDetails[0].studentDetails;
					this.siblingform.patchValue({
						'esd_is_have_sibling': 'Y',
						'esd_student_of_same_school': 'Y',
						'esd_admission_no': value,
						'esd_name': this.userDetailForSibling.au_full_name,
						'esd_class': this.userDetailForSibling.au_class_id,
						'esd_section': this.userDetailForSibling.au_sec_id,
						'esd_age': this.userDetailForSibling.esd_age,
						'esd_status': '1',
						'esd_school_name': this.schoolInfo.school_name
					});
					this.getSectionsByClass();
					this.checkReadOnlyStatus = true;
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}
	}

	getClassNameById(id) {
		for (const item of this.classArray) {
			if (item.class_id === id) {
				return item.class_name;
			}
		}
		return '';
	}

	getSectionNameById(id) {
		for (const item of this.sectionArray) {
			if (item.sec_id === id) {
				return item.sec_name;
			}
		}
		return '';
	}

	addSiblingDetails() {
		if (this.siblingform.valid) {
			this.siblingform.patchValue({
				class_name: this.getClassNameById(this.siblingform.value.esd_class),
				sec_name: this.getSectionNameById(this.siblingform.value.esd_section)
			});
			this.siblingArray.push(this.siblingform.value);
			this.siblingform.reset();
		}
	}

	deleteSiblingDetails(si) {
		if (si > -1) {
			this.siblingArray.splice(si, 1);
			this.siblingform.reset();
		}
	}

	editSiblingDetails(si) {
		this.siblingArrayIndex = si;
		if (si > -1) {
			this.siblingform.patchValue({
				esd_login_id: this.siblingArray[si].esd_login_id,
				esd_id: this.siblingArray[si].esd_id,
				esd_is_have_sibling: this.siblingArray[si].esd_is_have_sibling,
				esd_student_of_same_school: this.siblingArray[si].esd_student_of_same_school,
				esd_admission_no: this.siblingArray[si].esd_admission_no,
				esd_name: this.siblingArray[si].esd_name,
				esd_class: this.siblingArray[si].esd_class,
				class_name: this.siblingArray[si].class_name,
				esd_section: this.siblingArray[si].esd_section,
				sec_name: this.siblingArray[si].sec_name,
				esd_school_name: this.siblingArray[si].esd_school_name,
				esd_age: this.siblingArray[si].esd_age,
				esd_status: this.siblingArray[si].esd_status
			});
			this.getSectionsByClass();
			this.siblingedit = true;
		}
	}

	updateSiblingDetails() {
		if (this.siblingArrayIndex > -1) {
			this.siblingform.patchValue({
				class_name: this.getClassNameById(this.siblingform.value.esd_class),
				sec_name: this.getSectionNameById(this.siblingform.value.esd_section)
			});
			this.siblingArray[this.siblingArrayIndex] = this.siblingform.value;
			this.siblingedit = false;
			this.siblingform.reset();
		}
	}

	fetchSiblingParentDetails() {
		// code
	}

	filterCityStateCountry($event) {
		// keyCode
		if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
			if ($event.target.value !== '' && $event.target.value.length >= 3 && !(this.viewOnly)) {
				this.cityCountryArray = [];
				this.sisService.getStateCountryByCity({ cit_name: $event.target.value }).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.cityCountryArray = result.data;
					}
				});
			}
		}
	}

	patchPersonalDetails(personalDetails) {
		this.cityCountryArray = [];
		if (personalDetails.length > 0) {
			this.baseform.patchValue({
				upd_id: personalDetails[0].upd_id,
				upd_aadhaar_no: personalDetails[0].upd_aadhaar_no,
				upd_dob: personalDetails[0].upd_dob,
				upd_doj: personalDetails[0].upd_doj,
				upd_religion_id: personalDetails[0].upd_religion_id,
				upd_nationality: personalDetails[0].upd_nationality,
				upd_gender: personalDetails[0].upd_gender,
				upd_category: personalDetails[0].upd_category,
				upd_mt_id: personalDetails[0].upd_mt_id,
				upd_tag_id: personalDetails[0].upd_tag_id
			});
			if (personalDetails[0].addressDetails.length > 0) {
				personalDetails[0].addressDetails.forEach(element => {
					if (element.ea_address_type === 'permanent') {
						if (element.cit_name) {
							this.sisService.getStateCountryByCity({ cit_name: element.cit_name }).subscribe((result: any) => {
								if (result.status === 'ok') {
									this.cityCountryArray = result.data;
								}
							});
						}
						this.paddressform.patchValue({
							ea_id: element.ea_id,
							ea_login_id: element.ea_login_id,
							ea_address_type: 'permanent',
							ea_same_residential_address: element.ea_same_residential_address === 'Y' ? true : false,
							ea_address_for: 'S',
							ea_address1: element.ea_address1,
							ea_city: element.cit_name,
							ea_state: element.ea_state,
							ea_country: element.ea_country,
							ea_pincode: element.ea_pincode
						});
						if (element.ea_same_residential_address === 'N') {
							this.showAddressFlag = false;
							this.addressStatus = 'Yes';
							this.opacityClass = 'opacity-class';
						} else {
							this.opacityClass = '';
							this.showAddressFlag = true;
							this.addressStatus = 'No';
						}
					} else if (element.ea_address_type === 'present') {
						this.raddressform.patchValue({
							ea_id: element.ea_id,
							ea_login_id: element.ea_login_id,
							ea_address_type: 'present',
							ea_same_residential_address: element.ea_same_residential_address === 'Y' ? true : false,
							ea_address_for: 'S',
							ea_address1: element.ea_address1,
							ea_city: element.cit_name,
							ea_state: element.ea_state,
							ea_country: element.ea_country,
							ea_pincode: element.ea_pincode
						});

					}
				});
			} else {
				this.resetpaddressform();
				this.resetraddressform();
			}
			if (personalDetails[0].siblingDetails.length > 0) {
				this.siblingdetailsdiv = true;
				this.siblingStaus = 'Yes';
				this.siblingArray = personalDetails[0].siblingDetails;
				this.unchangedsiblingArray = personalDetails[0].siblingDetails;
				this.getClass();
				this.getSchool();
			} else {
				this.siblingdetailsdiv = false;
				this.siblingStaus = 'No';
				this.siblingArray = [];
			}
		} else {
			this.resetForm();
		}
	}

	getCityResId(item: any) {
		this.cityId2 = item.cit_id;
		this.raddressform.patchValue({
			ea_city: this.getCityName(item.cit_id),
			ea_state: item.sta_id,
			ea_country: item.cou_id
		});
	}
	getCityPerId(item: any) {
		this.cityId = item.cit_id;
		this.paddressform.patchValue({
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
}
