import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ErrorStateMatcher, MatDatepickerInputEvent } from '@angular/material';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
@Component({
	selector: 'app-education-details-theme-two',
	templateUrl: './education-details-theme-two.component.html',
	styleUrls: ['./education-details-theme-two.component.scss']
})
export class EducationDetailsThemeTwoComponent extends DynamicComponent implements OnInit, OnChanges {
	reasonArray: any[] = [];
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	settingsArray: any[] = [];
	savedSettingsArray: any[] = [];
	educationValue: any;
	constructor(private sisService: SisService,
		private common: CommonAPIService,
		private fbuild: FormBuilder,
		private processtypeService: ProcesstypeService) { super(); }
	Education_Form: FormGroup;
	previousEducations: any[] = [];
	classArray: any[] = [];
	educationUpdateFlag = false;
	maxDate = new Date();
	@Input() addOnly = false;
	@Input() viewOnly = false;
	@Input() educationFormData: any;
	@Input() configSetting: any;
	ngOnInit() {
		this.settingsArray = this.configSetting;
		this.buildForm();
		this.getClass();
		this.getReason();
		this.getEducations();
	}
	ngOnChanges() {
		this.getEducations();
	}
	getEducations() {
		this.previousEducations = this.educationFormData;
		for (const item of this.previousEducations) {
			item.eed_joining_from = this.dateConversion(item.eed_joining_from, 'd-MMM-y');
			item.eed_joining_to = this.dateConversion(item.eed_joining_to, 'd-MMM-y');
		}
	}

	buildForm() {
		this.Education_Form = this.fbuild.group({
			eed_login_id: '',
			eed_id: '',
			eed_previous_school_name: '',
			eed_reason_of_leaving: '',
			eed_joining_from: '',
			eed_joining_to: '',
			eed_specify_reason: '',
			eed_current_class: '',
			eed_admitted_class: '',
			eed_status: ''
		});
	}
	addPreviousEducations() {
		if (this.Education_Form.valid) {
			this.Education_Form.patchValue({
				'eed_joining_from': this.dateConversion(this.Education_Form.value.eed_joining_from, 'd-MMM-y'),
				'eed_joining_to': this.dateConversion(this.Education_Form.value.eed_joining_to, 'd-MMM-y'),
				'eed_status': '1'
			});
			this.previousEducations.push(this.Education_Form.value);
			this.Education_Form.patchValue({
				eed_previous_school_name: '',
				eed_reason_of_leaving: '',
				eed_joining_from: '',
				eed_joining_to: '',
				eed_specify_reason: '',
				eed_current_class: '',
				eed_admitted_class: '',
				eed_status: ''
			});
		} else {
			Object.keys(this.Education_Form.value).forEach(key => {
				const formControl = <FormControl>this.Education_Form.controls[key];
				if (formControl.invalid) {
					formControl.markAsDirty();
				}
			});
		}
	}
	getClass() {
		this.classArray = [];
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result) {
				this.classArray = result.data;
			}
		});
	}
	getReason() {
		this.classArray = [];
		this.sisService.getReason({ reason_type: '4' }).subscribe((result: any) => {
			if (result) {
				this.reasonArray = result.data;
			}
		});
	}
	dateConversion(value, format) {
		const datePipe = new DatePipe('en-in');
		return datePipe.transform(value, format);
	}
	deleteEducationList(index) {
		this.previousEducations.splice(index, 1);
		this.Education_Form.reset();
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
	editEducationList(value) {
		this.educationUpdateFlag = true;
		this.educationValue = value;
		this.Education_Form.patchValue({
			eed_previous_school_name: this.previousEducations[value].eed_previous_school_name,
			eed_reason_of_leaving: this.previousEducations[value].eed_reason_of_leaving,
			eed_specify_reason: this.previousEducations[value].eed_specify_reason,
			eed_joining_from: this.dateConversion(this.previousEducations[value].eed_joining_from, 'yyyy-MM-dd'),
			eed_joining_to: this.dateConversion(this.previousEducations[value].eed_joining_to, 'yyyy-MM-dd'),
			eed_current_class: this.previousEducations[value].eed_current_class,
			eed_admitted_class: this.previousEducations[value].eed_admitted_class,
			eed_status: this.previousEducations[value].eed_status,
			eed_login_id: this.previousEducations[value].eed_login_id,
		});
	}
	updatePreviousEducationList() {
		this.Education_Form.patchValue({
			'eed_joining_from': this.dateConversion(this.Education_Form.value.eed_joining_from, 'd-MMM-y')
		});
		this.Education_Form.patchValue({
			'eed_joining_to': this.dateConversion(this.Education_Form.value.eed_joining_to, 'd-MMM-y')
		});
		this.previousEducations[this.educationValue] = this.Education_Form.value;
		this.common.showSuccessErrorMessage('Education List Updated', 'success');
		this.Education_Form.reset();
		this.educationUpdateFlag = false;
	}
	getReasonName(res_id) {
		const findex = this.reasonArray.findIndex(f => f.reason_id === res_id);
		if (findex !== -1) {
			return this.reasonArray[findex].reason_title;
		}
	}
	getClassName(class_id) {
		const findex = this.classArray.findIndex(f => f.class_id === class_id);
		if (findex !== -1) {
			return this.classArray[findex].class_name;
		}
	}
}
// export class ConfirmValidParentMatcher implements ErrorStateMatcher {
// 	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
// 		return control && control.invalid && (control.dirty || control.touched || form.submitted);
// 	}
// }
