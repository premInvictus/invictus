import { Component, Input, OnInit, ViewChild, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { FormEnabledService } from '../../sharedmodule/dynamic-content/formEnabled.service';
import { ErrorStateMatcher } from '@angular/material';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';

@Component({
	selector: 'app-general-remarks-theme-two',
	templateUrl: './general-remarks-theme-two.component.html',
	styleUrls: ['./general-remarks-theme-two.component.scss']
})
export class GeneralRemarksThemeTwoComponent implements OnInit, OnChanges {
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	@ViewChild('picker_parent') picker_parent;
	@ViewChild('picker') picker;
	generalRemarkForm: FormGroup;
	generalRemarkUpdateFlag = false;
	authorityArray: any[] = [];
	areaArray: any[] = [];
	generalRemarkValue: any;
	parentRemarkValue: any;
	finalGeneralRemarkArray: any[] = [];
	currentUser: any;
	events: string[] = [];
	remarksData: any;
	generalAddToList = false;
	minDate = new Date();
	savedSettingsArray: any[] = [];
	settingsArray: any[] = [];
	htmlFinalGeneralRemarkArray: any[] = [];
	// tslint:disable-next-line:no-input-rename
	@Input('addOnly') addOnly: boolean;
	// tslint:disable-next-line:no-input-rename
	@Input('editOnly') editOnly: boolean;
	// tslint:disable-next-line:no-input-rename
	@Input('viewOnly') viewOnly: boolean;
	// tslint:disable-next-line:no-input-rename
	@Input('formData') formData: any;
	@Input() configSetting: any;

	constructor(private fbuild: FormBuilder, private notif: CommonAPIService, private sisService: SisService,
		private formEnabledService: FormEnabledService, private processtypeService: ProcesstypeService) {

	}

	ngOnInit() {
		this.settingsArray = this.configSetting;
		this.buildForm();
		this.setFormDataAndState();
		this.getAuthority();
		this.getArea();

	}

	ngOnChanges() {
		this.setFormDataAndState();
	}

	setFormDataAndState() {
		this.finalGeneralRemarkArray = this.formData ? this.formData : [];
		this.prepareGroupAuthorityData(this.formData);
		this.addOnly = this.addOnly ? this.addOnly : false;
		this.editOnly = this.editOnly ? this.editOnly : false;
		this.viewOnly = this.viewOnly ? this.viewOnly : false;
	}

	prepareGroupAuthorityData(formData) {
		const groupedArr = [];
		const newAuthority = {};

		formData.forEach(item => {
			newAuthority[item.era_aut_id] ?
				newAuthority[item.era_aut_id].push(item) :
				(
					newAuthority[item.era_aut_id] = [],
					newAuthority[item.era_aut_id].push(item)
				);
		}
		);
		for (let i = 0; i < Object.keys(newAuthority).length; i++) {
			const col = Object.keys(newAuthority)[i];
			const result = newAuthority[col];
			groupedArr.push(result);
		}
		this.htmlFinalGeneralRemarkArray = groupedArr;
	}

	buildForm() {
		this.generalRemarkForm = this.fbuild.group({
			era_type: 'general',
			era_doj: new Date(),
			era_aut_id: '',
			era_ar_id: '',
			era_teachers_remark: '',
			era_login_id: ''
		});
	}

	addGeneralRemarkList() {
		if (this.generalRemarkForm.valid) {
			this.finalGeneralRemarkArray.push(this.generalRemarkForm.value);
			this.prepareGroupAuthorityData(this.finalGeneralRemarkArray);
			this.generalRemarkForm.patchValue({
				'era_doj': new Date(),
				'era_aut_id': '',
				'era_ar_id': '',
				'era_teachers_remark': ''
			});
		} else {
			this.notif.showSuccessErrorMessage('Please fill all required fields', 'error');
		}
	}

	editGeneralRemarkList(value) {
		this.generalRemarkUpdateFlag = true;
		this.generalAddToList = true;
		const index = this.getIdMatch(value);
		this.generalRemarkValue = index;
		this.generalRemarkForm.patchValue({
			'era_doj': this.finalGeneralRemarkArray[index].era_doj,
			'era_aut_id': this.finalGeneralRemarkArray[index].era_aut_id,
			'era_ar_id': this.finalGeneralRemarkArray[index].era_ar_id,
			'era_teachers_remark': this.finalGeneralRemarkArray[index].era_teachers_remark
		});
	}

	getIdMatch(value) {
		return this.finalGeneralRemarkArray.map(function (x) { return x.era_id; }).indexOf(value);
	}

	updateGeneralRemarkList() {
		this.finalGeneralRemarkArray[this.generalRemarkValue] = this.generalRemarkForm.value;
		this.prepareGroupAuthorityData(this.finalGeneralRemarkArray);
		this.notif.showSuccessErrorMessage('General Remark List Updated', 'success');
		this.generalRemarkForm.reset();
		this.generalRemarkUpdateFlag = false;
		this.generalAddToList = false;
	}

	deleteGeneralRemarkList(value) {
		const index = this.getIdMatch(value);
		this.finalGeneralRemarkArray.splice(index, 1);
		this.prepareGroupAuthorityData(this.finalGeneralRemarkArray);
		this.notif.showSuccessErrorMessage('General Remark Deleted Successfully From List', 'success');
		this.generalRemarkForm.reset();
		this.generalAddToList = false;
	}

	getAuthority() {
		this.sisService.getAuthority().subscribe((result: any) => {
			if (result) {
				this.authorityArray = result.data;
			}
		});
	}

	getArea() {
		this.sisService.getArea().subscribe((result: any) => {
			if (result) {
				this.areaArray = result.data;
			}
		});
	}

	getAuthorityName(value) {
		if (value) {
			for (const item of this.authorityArray) {
				if (item.aut_id === value) {
					return item.aut_name;
				}
			}
		}

	}

	getAreaName(value) {
		for (const item of this.areaArray) {
			if (item.ar_id === value) {
				return item.ar_name;
			}
		}
	}

	resetGeneralRemarkList() {
		this.generalRemarkForm.reset();
		this.generalRemarkUpdateFlag = false;
	}

	addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
		this.events.push(`${type}: ${event.value}`);
		this.picker._dateAdapter.locale = 'en-in';
		const datePipe = new DatePipe('en-in');
		const convertedDate = datePipe.transform(this.generalRemarkForm.value.era_doj, 'yyyy-MM-dd');
		this.generalRemarkForm.patchValue({ 'era_doj': convertedDate });
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

	capitalizeRemarks($event) {
		let remark: any = '';
		for (let i = 0; i < $event.target.value.length; i++) {
			if (i === 0) {
				remark = $event.target.value.charAt(i).toUpperCase();
			} else {
				remark = remark + $event.target.value;
			}
		}
		this.generalRemarkForm.patchValue({
			'era_teachers_remark': remark
		});
	}
}

// export class ConfirmValidParentMatcher implements ErrorStateMatcher {
// 	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
// 		return control && control.invalid && (control.dirty || control.touched || form.submitted);
// 	}
// }
