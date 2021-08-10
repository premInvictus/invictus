import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { FormEnabledService } from '../../sharedmodule/dynamic-content/formEnabled.service';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { ConfirmValidParentMatcher } from '../ConfirmValidParentMatcher';

@Component({
	selector: 'app-child-details',
	templateUrl: './child-details.component.html',
	styleUrls: ['./child-details.component.scss']
})
export class ChildDetailsComponent extends DynamicComponent implements OnInit, AfterViewInit {

	childdetialsform: FormGroup;
	@ViewChild('editReference') editReference;
	@ViewChild('picker') picker;
	@ViewChild('picker1') picker1;
	nationlityothers: any;
	nationalityothers = false;
	editRequestFlag = false;
	saveFlag = false;
	categoryothers = false;
	studentdetails: any = {};
	login_id;
	dobDate = new Date();
	minDate = new Date();
	maxDate = new Date();
	viewOnly = true;
	editOnly = false;
	addOnly = false;

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
	constructor(
		private formEnabledService: FormEnabledService,
		private fbuild: FormBuilder,
		private el: ElementRef,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private processtypeService: ProcesstypeService
	) {
		super();
	}

	ngOnInit() {
		this.getConfigureSetting();
		this.dobDate.setFullYear(this.dobDate.getFullYear() - 3);
		this.buildForm();
		// if (this.context.config.login_id) {
		//   this.login_id = this.context.config.login_id;
		//   this.getStudentDetails(this.login_id);
		//   this.viewOnly = true;
		// }
		this.getCity();
		this.getCountry();
		this.getState();
		this.getReligionDetails();
		this.getMotherTongue();
		this.commonAPIService.studentData.subscribe((data: any) => {
			if (data && data.au_login_id) {
				this.login_id = data.au_login_id;
				this.getStudentDetails(this.login_id);
			}
		});
		this.commonAPIService.reRenderForm.subscribe((data: any) => {
			// if(data && data.addMode) {
			//   this.childdetialsform.reset();
			//   this.viewOnly = false;
			// } else if(data && data.editMode) {
			//   this.editOnly = true;
			//   this.viewOnly = false;
			// }
			this.setActionControls(data);
		});
	}
	ngAfterViewInit() {
	}
	setActionControls(data) {
		if (data.addMode) {
			this.addOnly = true;
			this.viewOnly = false;
			this.childdetialsform.reset();
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
	getConfigureSetting() {
		this.sisService.getConfigureSetting({
			cos_process_type: this.processtypeService.getProcesstype()
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.savedSettingsArray = result.data;
				for (const item of this.savedSettingsArray) {
					if (item.cos_tb_id === '2') {
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
	setFormData() {
		this.patchPersoanlDetails();
		this.context.studentdetails.patchStudentDetails();
		// if(this.addOnly) {
		//   this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
		//     if(result.status === 'ok'){
		//       this.commonAPIService.studentData.next(result.data[0].au_login_id);
		//     }

		//   })
		// }
	}
	buildForm() {
		this.childdetialsform = this.fbuild.group({
			upd_login_id: '',
			upd_id: '',
			ea_id: '',
			upd_aadhaar_no: '',
			upd_dob: '',
			upd_religion_id: '',
			upd_nationality: '',
			upd_nationality_other: '',
			upd_gender: '',
			upd_special_need: '',
			upd_category: '',
			upd_category_other: '',
			upd_doj: '',
			upd_mt_id: '',
			ea_address1: '',
			ea_address2: '',
			ea_city: '',
			ea_state: '',
			ea_country: '',
			ea_pincode: ''
		});
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
	saveForm() {
		if (this.context.studentdetails.studentdetailsform.valid && this.childdetialsform.valid) {
			this.context.studentdetails.studentdetailsform.value.au_process_type = this.context.processType;
			if (this.context.studentdetails.studentdetailsform.value.au_enrollment_id) {
				this.sisService.getStudentPersonalDetails({ upd_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id })
					.subscribe((result: any) => {
						if (result.status === 'ok') {
							this.childdetialsform.patchValue({
								upd_login_id: result.data[0].upd_login_id,
								upd_id: result.data[0].upd_id,
								ea_id: result.data[0].ea_id,
							});
							this.updateForm(false);
							this.commonAPIService.renderTab.next({ tabMove: true });
						}
					});
			} else {
				this.sisService.insertStudentDetails(this.context.studentdetails.studentdetailsform.value).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.context.studentdetails.studentdetailsform.patchValue({
							au_login_id: result.data.au_login_id,
							au_enrollment_id: result.data.au_enrollment_id
						});
						// this.commonAPIService.showSuccessErrorMessage(result.message, 'success');

						this.childdetialsform.controls.upd_login_id.setValue(result.data.au_login_id);
						this.childdetialsform.value.upd_doj = this.commonAPIService.dateConvertion(this.childdetialsform.value.upd_doj, 'yyyy-MM-dd');
						this.childdetialsform.value.upd_dob = this.commonAPIService.dateConvertion(this.childdetialsform.value.upd_dob, 'yyyy-MM-dd');
						if (this.childdetialsform.value.upd_nationality === 'Others') {
							this.childdetialsform.patchValue({
								upd_nationality: this.childdetialsform.value.upd_nationality_other
							});
						}
						if (this.childdetialsform.value.upd_category === 'Others') {
							this.childdetialsform.patchValue({
								upd_category: this.childdetialsform.value.upd_category_other
							});
						}
						this.sisService.insertStudentPersonalDetails(this.childdetialsform.value).subscribe((result1: any) => {
							if (result1.status === 'ok') {
								if (this.childdetialsform.value.upd_nationality_other !== '') {
									this.childdetialsform.patchValue({
										upd_nationality: 'Others'
									});
								}
								if (this.childdetialsform.value.upd_category_other !== '') {
									this.childdetialsform.patchValue({
										upd_category: 'Others'
									});
								}
								this.commonAPIService.showSuccessErrorMessage(result1.data, 'success');
								this.commonAPIService.renderTab.next({ tabMove: true });
							} else {
								this.commonAPIService.showSuccessErrorMessage(result1.data, 'error');
							}
						});
					}
				});
			}
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all required filed', 'error');
		}
	}

	cancelForm() {
		if (this.addOnly) {
			this.commonAPIService.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
		} else if (this.saveFlag || this.editRequestFlag) {
			this.getStudentDetails(this.login_id);
			this.context.studentdetails.getStudentDetails(this.login_id);
			this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
		}
	}
	updateForm(isview) {
		if (this.childdetialsform.value.upd_login_id &&
			this.childdetialsform.value.upd_id &&
			this.context.studentdetails.studentdetailsform.valid &&
			this.childdetialsform.valid) {
			if (this.context.studentdetails.studentdetailsform.valid) {
				this.context.studentdetails.studentdetailsform.value.au_process_type = this.context.processType;
				this.sisService.updateStudentDetails(this.context.studentdetails.studentdetailsform.value).subscribe((result1: any) => {
					if (result1.status === 'ok') {
						// this.commonAPIService.showSuccessErrorMessage(result1.message, 'success');
						// this.getStudentDetailsByAdmno(admno);
					}
				});
			}
			this.childdetialsform.patchValue({
				upd_nationality: Number(this.childdetialsform.value.upd_nationality) !== 91 ?
					this.childdetialsform.value.upd_nationality_other : this.childdetialsform.value.upd_nationality,
				upd_category: (this.childdetialsform.value.upd_category !== 'ST/SC' && this.childdetialsform.value.upd_category !== 'OBC'
					&& this.childdetialsform.value.upd_category !== 'GEN') ?
					this.childdetialsform.value.upd_category_other : this.childdetialsform.value.upd_category
			});
			if (this.childdetialsform.value.upd_nationality === 'Others') {
				this.childdetialsform.patchValue({
					upd_nationality: this.childdetialsform.value.upd_nationality_other
				});
			}
			if (this.childdetialsform.value.upd_category === 'Others') {
				this.childdetialsform.patchValue({
					upd_category: this.childdetialsform.value.upd_category_other
				});
			}
			this.childdetialsform.value.upd_doj = this.commonAPIService.dateConvertion(this.childdetialsform.value.upd_doj, 'yyyy-MM-dd');
			this.childdetialsform.value.upd_dob = this.commonAPIService.dateConvertion(this.childdetialsform.value.upd_dob, 'yyyy-MM-dd');
			this.sisService.updateStudentPersonalDetails(this.childdetialsform.value).subscribe((result1: any) => {
				if (result1.status === 'ok') {
					if (this.childdetialsform.value.upd_nationality_other !== '') {
						this.childdetialsform.patchValue({
							upd_nationality: 'Others'
						});
					}
					if (this.childdetialsform.value.upd_category_other !== '') {
						this.childdetialsform.patchValue({
							upd_category: 'Others'
						});
					}
					this.commonAPIService.showSuccessErrorMessage(result1.data, 'success');
					if (isview) {
						// this.commonAPIService.studentData.next(this.context.studentdetails.studentdetailsform.value.au_enrollment_id);
						this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result1.data, 'error');
				}
			});
		}


	}
	getStudentDetails(au_login_id) {
		if (au_login_id) {
			this.sisService.getStudentPersonalDetails({ upd_login_id: au_login_id }).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.viewOnly = true;
					this.tb_id = this.formEnabledService.getTabid('Personal Details');
					this.studentdetails = result.data[0];
					this.patchPersoanlDetails();
					this.enablenationalityothers();
					this.enablecategoryothers();
				} else if (result.status === 'error') {
					this.resetForm();
				}
			});
		}
	}
	patchPersoanlDetails() {
		this.childdetialsform.patchValue({
			upd_login_id: this.studentdetails.upd_login_id,
			upd_id: this.studentdetails.upd_id,
			ea_id: this.studentdetails.ea_id,
			upd_aadhaar_no: this.studentdetails.upd_aadhaar_no,
			upd_dob: this.studentdetails.upd_dob,
			upd_religion_id: this.studentdetails.upd_religion_id,
			upd_nationality_other: this.studentdetails.upd_nationality,
			upd_nationality: this.studentdetails.upd_nationality !== '91' ? 'Others' : this.studentdetails.upd_nationality,
			upd_gender: this.studentdetails.upd_gender,
			upd_special_need: this.studentdetails.upd_special_need,
			upd_category_other: (this.studentdetails.upd_category !== 'ST/SC' &&
				this.studentdetails.upd_category !== 'OBC' && this.studentdetails.upd_category !== 'GEN') ?
				this.studentdetails.upd_category : '',
			upd_category: (this.studentdetails.upd_category !== 'ST/SC' && this.studentdetails.upd_category !== 'OBC' &&
				this.studentdetails.upd_category !== 'GEN') ? 'Others' : this.studentdetails.upd_category,
			upd_doj: this.studentdetails.upd_doj,
			upd_mt_id: this.studentdetails.upd_mt_id,
			ea_address1: this.studentdetails.ea_address1,
			ea_address2: this.studentdetails.ea_address2,
			ea_city: this.studentdetails.ea_city,
			ea_state: this.studentdetails.ea_state,
			ea_country: this.studentdetails.ea_country,
			ea_pincode: this.studentdetails.ea_pincode
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
	getCity() {
		this.sisService.getCity().subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					this.arrayCity = result.data;
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
	resetForm() {
		this.childdetialsform.reset();
	}
	validateStr(patternstr, str) {
		return patternstr.test(String(str).toLowerCase());
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
				param.req_tab_id = this.formEnabledService.getTabid('Student Details');
				param.req_priority = 'high';
				const datepipe = new DatePipe('en-US');
				param.req_date = datepipe.transform(new Date, 'yyyy-MM-dd');
				param.req_param = this.checkChangedFieldsArray;
				params.push(param);
				datalist.push(this.checkChangedFieldsArray);
			}
		}
		this.checkChangedFieldsArray = [];
		param = {};
		if (this.childdetialsform.dirty) {
			Object.keys(this.childdetialsform.controls).forEach((keys) => {
				const tablePrefix = keys.split('_', 1);
				const tableKey = tablePrefix[0] + '_id';
				const tableKeyValue = this.childdetialsform.value[tableKey];
				const formControl = <FormControl>this.childdetialsform.controls[keys];
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
				param.req_tab_id = this.formEnabledService.getTabid('Personal Details');
				param.req_priority = '';
				param.req_remarks = '';
				param.req_reason = '';
				const datepipe = new DatePipe('en-US');
				param.req_date = datepipe.transform(new Date, 'yyyy-MM-dd');
				params.push(param);
				datalist.push(this.checkChangedFieldsArray);
				this.openEditDialog({ data: datalist, reqParam: params });
			}
		}
		this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
	}

	editRequest() {
		this.viewOnly = false;
		this.editOnly = false;
		this.editRequestFlag = true;
		this.saveFlag = false;
		this.context.studentdetails.viewOnly = false;
	}

	editConfirm(event) {
	}
	addEvent(type: string, event: MatDatepickerInputEvent<Date>, index) {
		this.events.push(`${type}: ${event.value}`);
		const datePipe = new DatePipe('en-in');
		const convertedDate = datePipe.transform(this.childdetialsform.value.upd_dob, 'yyyy-MM-dd');
		this.childdetialsform.patchValue({
			'upd_dob': convertedDate
		});
	}
	addEvent1(type: string, event: MatDatepickerInputEvent<Date>, index) {
		this.events.push(`${type}: ${event.value}`);
		const datePipe = new DatePipe('en-in');
		const convertedDate = datePipe.transform(this.childdetialsform.value.upd_doj, 'yyyy-MM-dd');
		this.childdetialsform.patchValue({
			'upd_doj': convertedDate
		});
	}
	isExistUserAccessMenu(actionT) {
		return this.context.studentdetails.isExistUserAccessMenu(actionT);
	}
}
