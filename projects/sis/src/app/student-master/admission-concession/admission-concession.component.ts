import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { FormEnabledService } from '../../sharedmodule/dynamic-content/formEnabled.service';
import { ErrorStateMatcher } from '@angular/material';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
@Component({
	selector: 'app-admission-concession',
	templateUrl: './admission-concession.component.html',
	styleUrls: ['./admission-concession.component.scss']
})
export class AdmissionConcessionComponent extends DynamicComponent implements OnInit {
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	@ViewChild('picker_parent') picker_parent;
	@ViewChild('picker') picker;
	generalRemarkForm: FormGroup;
	parentRemarkForm: FormGroup;
	generalRemarkUpdateFlag = false;
	parentRemarkUpdateFlag = false;
	authorityArray: any[] = [];
	areaArray: any[] = [];
	generalRemarkValue: any;
	parentRemarkValue: any;
	finalGeneralRemarkArray: any[] = [];
	finalParentRemarkArray: any[] = [];
	currentUser: any;
	events: string[] = [];
	remarksData: any;
	formEditable = false;
	addOnly = false;
	viewOnly = false;
	editOnly = false;
	editFlag = false;
	saveFlag = false;
	generalAddToList = false;
	parentAddToList = false;
	minDate = new Date();
	savedSettingsArray: any[] = [];
	settingsArray: any[] = [];
	constructor(private fbuild: FormBuilder, private notif: CommonAPIService, private sisService: SisService,
		private formEnabledService: FormEnabledService, private processtypeService: ProcesstypeService) {
		super();
	}

	ngOnInit() {
		this.notif.studentData.subscribe((data: any) => {
			if (data && data.au_login_id) {
				this.currentUser = data.au_login_id;
				const processType = this.processtypeService.getProcesstype();
				if (processType === '3' || processType === '4') {
					this.getRemarks(this.currentUser);
				}

			}
		});

		this.notif.reRenderForm.subscribe((data: any) => {
			if (data && data.addMode) {
				this.buildForm();
				this.viewOnly = false;
				this.addOnly = true;
			}
			if (data && data.viewMode) {
				this.viewOnly = true;
				this.addOnly = false;
				this.editOnly = false;
				this.saveFlag = false;
			}
			if (data && data.editMode) {
				this.viewOnly = false;
				this.saveFlag = true;
				this.editFlag = true;
			}
		});


		this.buildForm();
		this.getAuthority();
		this.getArea();
		this.getConfigureSetting();

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
		this.parentRemarkForm = this.fbuild.group({
			era_type: 'parent',
			era_doj: new Date(),
			era_aut_id: '',
			era_ar_id: '',
			era_teachers_remark: '',
			era_login_id: ''
		});
	}

	addGeneralRemarkList() {
		if (this.generalRemarkForm.valid) {
			this.generalRemarkForm.value.era_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
			this.finalGeneralRemarkArray.push(this.generalRemarkForm.value);
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
		this.generalRemarkValue = value;
		this.generalAddToList = true;
		this.generalRemarkForm.patchValue({
			'era_doj': this.finalGeneralRemarkArray[value].era_doj,
			'era_aut_id': this.finalGeneralRemarkArray[value].era_aut_id,
			'era_ar_id': this.finalGeneralRemarkArray[value].era_ar_id,
			'era_teachers_remark': this.finalGeneralRemarkArray[value].era_teachers_remark
		});
	}

	updateGeneralRemarkList() {
		this.finalGeneralRemarkArray[this.generalRemarkValue] = this.generalRemarkForm.value;
		this.notif.showSuccessErrorMessage('General Remark List Updated', 'success');
		this.generalRemarkForm.reset();
		this.generalRemarkUpdateFlag = false;
		this.generalAddToList = false;
	}

	deleteGeneralRemarkList(value) {
		this.finalGeneralRemarkArray.splice(value, 1);
		this.notif.showSuccessErrorMessage('General Remark Deleted Successfully From List', 'success');
	}


	addParentRemarkList() {
		if (this.parentRemarkForm.valid) {
			this.parentRemarkForm.value.era_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
			this.finalParentRemarkArray.push(this.parentRemarkForm.value);
			this.parentRemarkForm.patchValue({
				'era_doj': new Date(),
				'era_aut_id': '',
				'era_ar_id': '',
				'era_teachers_remark': ''
			});
		} else {
			this.notif.showSuccessErrorMessage('Please fill all required fields', 'error');
		}
	}

	editParentRemarkList(value) {
		this.parentRemarkUpdateFlag = true;
		this.parentRemarkValue = value;
		this.parentAddToList = true;
		this.parentRemarkForm.patchValue({
			'era_doj': this.finalParentRemarkArray[value].era_doj,
			'era_aut_id': this.finalParentRemarkArray[value].era_aut_id,
			'era_ar_id': this.finalParentRemarkArray[value].era_ar_id,
			'era_teachers_remark': this.finalParentRemarkArray[value].era_teachers_remark
		});
	}

	updateParentRemarkList() {
		this.finalParentRemarkArray[this.parentRemarkValue] = this.parentRemarkForm.value;
		this.notif.showSuccessErrorMessage('General Remark List Updated', 'success');
		this.parentRemarkForm.reset();
		this.parentRemarkUpdateFlag = false;
		this.parentAddToList = false;
	}

	deleteParentRemarkList(value) {
		this.finalParentRemarkArray.splice(value, 1);
		this.notif.showSuccessErrorMessage('Parent Remark Deleted Successfully From List', 'success');
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
		for (const item of this.authorityArray) {
			if (item.aut_id === value) {
				return item.aut_name;
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


	insertRemarks() {
		// this.currentUser
		if (this.finalGeneralRemarkArray || this.finalParentRemarkArray) {
			for (const item of this.finalGeneralRemarkArray) {
				item.era_doj = this.notif.dateConvertion(item.era_doj, 'yyyy-MM-dd');
			}
			for (const item of this.finalParentRemarkArray) {
				item.era_doj = this.notif.dateConvertion(item.era_doj, 'yyyy-MM-dd');
			}
		}
		const insertGeneralRemarkJson = {
			'login_id': this.currentUser,
			'generalRemarks': this.finalGeneralRemarkArray,
			'parentRemarks': this.finalParentRemarkArray
		};

		this.sisService.insertGeneralRemarks(
			insertGeneralRemarkJson
		).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.notif.showSuccessErrorMessage('General Remarks Added Successfully', 'success');
				this.notif.renderTab.next({ tabMove: true });
			}
		});
	}

	resetGeneralRemarkList() {
		this.generalRemarkForm.reset();
		this.generalRemarkUpdateFlag = false;
	}

	resetParentRemarkList() {
		this.parentRemarkForm.reset();
		this.parentRemarkUpdateFlag = false;
	}

	getRemarks(login_id) {
		if (login_id) {
			// this.currentUser
			const getJson = { 'era_type': 'general', 'login_id': login_id };
			this.sisService.getGeneralRemarks(getJson).subscribe((result: any) => {
				if (result) {
					this.remarksData = result;
					this.finalGeneralRemarkArray = result.generalRemarks ? result.generalRemarks : [];
					this.finalParentRemarkArray = result.parentRemarks ? result.parentRemarks : [];
					// if (this.finalGeneralRemarkArray.length > 0 || this.finalParentRemarkArray.length > 0)   {
					// 	this.generalAddToList = true;

					// } else {
					// 	this.generalRemarkUpdateFlag = true;
					// 	this.parentRemarkUpdateFlag = true;
					// }

				}
			});
		}
	}

	updateRemarks(isview) {
		if (this.finalGeneralRemarkArray || this.finalParentRemarkArray) {
			for (const item of this.finalGeneralRemarkArray) {
				item.era_doj = this.notif.dateConvertion(item.era_doj, 'yyyy-MM-dd');
			}
			for (const item of this.finalParentRemarkArray) {
				item.era_doj = this.notif.dateConvertion(item.era_doj, 'yyyy-MM-dd');
			}
			const updateGeneralRemarkJson = {
				'login_id': this.context.studentdetails.studentdetailsform.value.au_login_id,
				'generalRemarks': this.finalGeneralRemarkArray,
				'parentRemarks': this.finalParentRemarkArray
			};
			this.sisService.updateGeneralRemarks(
				updateGeneralRemarkJson
			).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.notif.showSuccessErrorMessage('General Remarks Updated Successfully', 'success');
					this.getRemarks(this.context.studentdetails.studentdetailsform.value.au_login_id);
					if (isview) {
						// this.commonAPIService.studentData.next(this.context.studentdetails.studentdetailsform.value.au_enrollment_id);
						this.notif.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
					}
				} else {
					this.notif.showSuccessErrorMessage(result.data, 'error');
				}
			});
		} else {
			this.notif.showSuccessErrorMessage('Remarks Entry Should be in List', 'error');
		}
	}



	deleteGeneralRemarks() {
		const deleteGeneralRemarkJson = {
			'login_id': this.currentUser
		};
		this.sisService.updateGeneralRemarks(
			deleteGeneralRemarkJson
		).subscribe((result: any) => {
			if (result) {
				this.notif.showSuccessErrorMessage('General Remarks Deleted Successfully', 'success');
			}
		});
	}

	addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
		this.events.push(`${type}: ${event.value}`);
		this.picker._dateAdapter.locale = 'en-in';
		const datePipe = new DatePipe('en-in');
		const convertedDate = datePipe.transform(this.generalRemarkForm.value.era_doj, 'yyyy-MM-dd');
		this.generalRemarkForm.patchValue({
			'era_doj': convertedDate
		});
	}

	addEventParent(type: string, event: MatDatepickerInputEvent<Date>) {
		this.events.push(`${type}: ${event.value}`);
		this.picker_parent._dateAdapter.locale = 'en-in';
		const datePipe = new DatePipe('en-in');
		const convertedDate = datePipe.transform(this.parentRemarkForm.value.era_doj, 'yyyy-MM-dd');
		this.parentRemarkForm.patchValue({
			'era_doj': convertedDate
		});
	}
	cancelForm() {
		if (this.addOnly) {
			this.notif.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
		} else if (this.saveFlag) {
			this.notif.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
		}

	}
	getConfigureSetting() {
		this.savedSettingsArray = [];
		this.settingsArray = [];
		this.sisService.getConfigureSetting({
			cos_process_type: this.processtypeService.getProcesstype()
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.savedSettingsArray = result.data;
				for (const item of this.savedSettingsArray) {
					if (item.cos_tb_id === '10') {
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
}
// export class ConfirmValidParentMatcher implements ErrorStateMatcher {
// 	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
// 		return control && control.invalid && (control.dirty || control.touched || form.submitted);
// 	}
// }
