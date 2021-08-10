import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { SisService, CommonAPIService, ProcesstypeService,SmartService } from '../../_services/index';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { FormEnabledService } from '../../sharedmodule/dynamic-content/formEnabled.service';
import { ConfirmValidParentMatcher } from '../ConfirmValidParentMatcher';


@Component({
	selector: 'app-education-details',
	templateUrl: './education-details.component.html',
	styleUrls: ['./education-details.component.scss']
})
export class EducationDetailsComponent extends DynamicComponent implements OnInit {

	@ViewChild('editReference') editReference;
	Education_Form: FormGroup;
	fa: FormArray;
	events: string[] = [];
	login_id;
	classArray = [];
	reasonArray = [];
	addOnly = false;
	viewOnly = false;
	editOnly = false;
	editFlag = false;
	editRequestFlag = false;
	saveFlag = false;
	eed_array: any[] = [];
	checkChangedFieldsArray: any[] = [];
	savedSettingsArray: any[] = [];
	settingsArray: any[] = [];
	maxDate = new Date();
	constructor(
		private fbuild: FormBuilder,
		private sisService: SisService,
		private SmartService: SmartService,
		private commonAPIService: CommonAPIService,
		private formEnabledService: FormEnabledService,
		private processtypeService: ProcesstypeService
	) { super(); }

	ngOnInit() {
		this.getConfigureSetting();
		this.buildForm();
		this.getClass();
		this.getReason();
		console.log("-------------------------");
		
		/*
    if (this.context.config.login_id) {
      this.login_id = this.context.config.login_id;
      this.getEducationDetails(this.login_id);
      this.viewOnly = true;
    } else {
      this.addPreviousEducations();
    } */
		this.commonAPIService.studentData.subscribe((data: any) => {
			if (data && data.au_login_id) {
				this.login_id = data.au_login_id;
				const processType = this.processtypeService.getProcesstype();
				if (processType === '1' ||processType === '2' || processType === '3' || processType === '4' || processType === '5') {
					this.resetPreviousEducations();
					this.getEducationDetails(this.login_id);
				}

			}
		});

		this.commonAPIService.reRenderForm.subscribe((data: any) => {
			if (data && data.addMode) {
				this.buildForm();
				this.viewOnly = false;
				this.addOnly = true;
				this.resetPreviousEducations();
				this.addPreviousEducations();
			}
			if (data && data.viewMode) {
				this.viewOnly = true;
				this.addOnly = false;
				this.editOnly = false;
				this.saveFlag = false;
				this.editRequestFlag = false;
				// this.commonAPIService.studentData.next(this.context.studentdetails.studentdetailsform.value.au_enrollment_id);
			}
			if (data && data.editMode) {
				this.viewOnly = false;
				this.saveFlag = true;
			}
		});
	}
	getConfigureSetting() {
		this.sisService.getConfigureSetting({
			cos_process_type: this.processtypeService.getProcesstype()
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.savedSettingsArray = result.data;
				for (const item of this.savedSettingsArray) {
					if (item.cos_tb_id === '6') {
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
	buildForm() {
		this.Education_Form = this.fbuild.group({
			eed_array: this.fbuild.array([])
		});
	}
	get previousEducations() {
		return this.Education_Form.get('eed_array') as FormArray;
	}
	resetPreviousEducations() {
		// this.Education_Form.controls.eed_array.setValue([]);
		this.Education_Form.controls['eed_array'] = this.fbuild.array([]);
	}
	checkLastEducation() {
		const lastRecord = this.previousEducations.value[this.previousEducations.length - 1];
		let validformflag = true;
		if (lastRecord) {
			if (lastRecord.eed_previous_school_name === '' ||
				lastRecord.eed_reason_of_leaving === '' ||
				lastRecord.eed_specify_reason === '' ||
				lastRecord.eed_joining_from === '' ||
				lastRecord.eed_admitted_class === '' ||
				lastRecord.eed_current_class === '' ||
				lastRecord.eed_joining_to === '') {
				validformflag = false;
			}
		}
		return validformflag;
	}

	addPreviousEducations() {

		const lastRecord = this.previousEducations.value[this.previousEducations.length - 1];
		let addflag = true;
		if (lastRecord) {
			if (lastRecord.eed_previous_school_name === '' ||
				lastRecord.eed_reason_of_leaving === '' ||
				lastRecord.eed_specify_reason === '' ||
				lastRecord.eed_joining_from === '' ||
				lastRecord.eed_admitted_class === '' ||
				lastRecord.eed_current_class === '' ||
				lastRecord.eed_joining_to === '') {
				addflag = false;
			}
		}
		if (addflag) {
			this.previousEducations.push(this.fbuild.group({
				eed_login_id: '',
				eed_id: '',
				eed_previous_school_name: '',
				eed_reason_of_leaving: '',
				eed_specify_reason: '',
				eed_joining_from: '',
				eed_admitted_class: '',
				eed_current_class: '',
				eed_joining_to: ''
			}));
		}
	}

	deletePreviousEducations(index) {
		this.previousEducations.removeAt(index);
	}
	saveForm() {
		if (this.previousEducations.length > 0 && this.checkLastEducation()) {
			for (const eed of this.previousEducations.value) {
				eed.eed_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
				eed.eed_joining_from = this.dateConversion(eed.eed_joining_from);
				eed.eed_joining_to = this.dateConversion(eed.eed_joining_to);
			}
			this.Education_Form.value.eed_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
			this.Education_Form.value.eed_array = this.previousEducations.value;
			if (this.context.studentdetails.studentdetailsform.valid) {
				this.context.studentdetails.studentdetailsform.value.au_process_type = this.context.processType;
				this.sisService.updateStudentDetails(this.context.studentdetails.studentdetailsform.value).subscribe((result1: any) => {
					if (result1.status === 'ok') {
						// this.commonAPIService.showSuccessErrorMessage(result1.message, 'success');
					}
				});
			}
			this.sisService.insertEducationDetails(this.Education_Form.value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.formEnabledService.setFormEnabled(this.formEnabledService.getLastValue() + 1);
					this.commonAPIService.showSuccessErrorMessage(result.data, 'success');
					if (this.processtypeService.getProcesstype() === '5') {
						this.commonAPIService.reRenderForm.next({ reRenderForm: true, addMode: false, editMode: false, deleteMode: false });
					} else {
						this.commonAPIService.renderTab.next({ tabMove: true });
					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}
	}
	editForm() {
		this.viewOnly = false;
		this.editOnly = true;
	}
	updateForm(isview) {
		if (this.previousEducations.length > 0 && this.checkLastEducation()) {
			for (const eed of this.previousEducations.value) {
				eed.eed_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
				eed.eed_joining_from = this.dateConversion(eed.eed_joining_from);
				eed.eed_joining_to = this.dateConversion(eed.eed_joining_to);
			}
			this.Education_Form.value.eed_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
			this.Education_Form.value.eed_array = this.previousEducations.value;
			if (this.context.studentdetails.studentdetailsform.valid) {
				this.context.studentdetails.studentdetailsform.value.au_process_type = this.context.processType;
				this.sisService.updateStudentDetails(this.context.studentdetails.studentdetailsform.value).subscribe((result1: any) => {
					if (result1.status === 'ok') {
						// this.commonAPIService.showSuccessErrorMessage(result1.message, 'success');
					}
				});
			}
			this.sisService.updateEducationDetails(this.Education_Form.value).subscribe((result1: any) => {
				if (result1.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result1.data, 'success');
					this.editOnly = false;
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
	getClass() {
		this.classArray = [];
		this.SmartService.getClassData({}).subscribe((result: any) => {
			if (result) {
				this.classArray = result.data;
			}
		});
	}
	getReason() {
		this.classArray = [];
		this.sisService.getReason({ reason_type: 4 }).subscribe((result: any) => {
			if (result) {
				this.reasonArray = result.data;
			}
		});
	}
	dateConversion(value) {
		const datePipe = new DatePipe('en-US');
		return datePipe.transform(value, 'yyyy-MM-dd');
	}
	getEducationDetails(au_login_id) {
		if (au_login_id) {
			this.sisService.getEducationDetails({ eed_login_id: au_login_id }).subscribe((result: any) => {
				if (result.status === 'ok') {
					if (result.data.length > 0) {
						this.eed_array = result.data;
						console.log("----------------------------------------");
						
						for (const eed of this.eed_array) {
							this.previousEducations.push(this.fbuild.group(eed));
						}
						/* this.Education_Form.patchValue({
              eed_array: this.previousEducations
            });
          } */
					} else if (result.status === 'error') {
						this.resetForm();
					}
				}
			});
		}
	}
	resetForm() {
		this.Education_Form.reset();
	}
	openEditDialog = (data) => this.editReference.openModal(data);
	checkFormChangedValue() {
		this.checkChangedFieldsArray = [];
		const param: any = {};
		if (this.Education_Form.controls.eed_array.dirty) {
			let count = -1;
			this.previousEducations.controls.forEach((item: FormGroup) => {
				count++;
				if (item.value.eed_id !== '') {
					Object.keys(item.controls).forEach((keys) => {
						const tablePrefix = keys.split('_', 1);
						const tableKey = tablePrefix[0] + '_id';
						const tableKeyValue = item.value[tableKey];
						const formControl = <FormControl>item.controls[keys];
						if (formControl.dirty) {

							this.checkChangedFieldsArray.push({
								rff_where_id: tableKey,
								rff_where_value: tableKeyValue,
								rff_field_name: keys,
								rff_new_field_value: formControl.value,
								rff_old_field_value: this.eed_array[count][keys]
							});
						}
					});
				} else {
					const fieldArray: any[] = [];
					const oldFieldValue: any[] = [];
					const newFieldValue: any[] = [];
					const datepipe = new DatePipe('en-US');
					Object.keys(item.controls).forEach((keys) => {
						const formControl = <FormControl>item.controls[keys];
						if (formControl.dirty) {
							fieldArray.push(keys);
							oldFieldValue.push('');
							newFieldValue.push((keys === 'eed_joining_to' || keys === 'eed_joining_from') ?
								datepipe.transform(formControl.value, 'yyyy-MM-dd') : formControl.value);
						}
					});
					this.checkChangedFieldsArray.push({
						rff_where_id: 'eed_id',
						rff_where_value: '',
						rff_field_name: fieldArray,
						rff_new_field_value: newFieldValue,
						rff_old_field_value: oldFieldValue
					});
				}
			});
			if (this.checkChangedFieldsArray.length > 0) {
				param.req_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
				param.req_process_type = this.context.processType;
				param.req_tab_id = this.formEnabledService.getTabid('Education Details');
				param.req_priority = 'high';
				const datepipe = new DatePipe('en-US');
				param.req_date = datepipe.transform(new Date, 'yyyy-MM-dd');
				this.openEditDialog({ data: [this.checkChangedFieldsArray], reqParam: [param] });
			}
		}
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
	cancelForm() {
		if (this.addOnly) {
			this.commonAPIService.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
		} else if (this.saveFlag || this.editRequestFlag) {
			this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
			this.Education_Form.controls['eed_array'] = this.fbuild.array([]);
			for (const eed of this.eed_array) {
				this.previousEducations.push(this.fbuild.group(eed));
			}
		}
	}
	isExistUserAccessMenu(actionT) {
		return this.context.studentdetails.isExistUserAccessMenu(actionT);
	}

}
