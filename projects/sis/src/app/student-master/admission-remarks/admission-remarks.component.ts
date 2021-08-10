import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonAPIService, ProcesstypeService } from '../../_services/index';
import { SisService } from '../../_services/index';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
@Component({
	selector: 'app-admission-remarks',
	templateUrl: './admission-remarks.component.html',
	styleUrls: ['./admission-remarks.component.scss']
})
export class AdmissionRemarksComponent extends DynamicComponent implements OnInit {

	dynamicForm: FormGroup;
	admissionRemarkForm: FormGroup;
	learnForm: FormGroup;
	inputTypeArray: any[] = [{ id: 1, name: 'Input' }, { id: 2, name: 'Textarea' }, { id: 3, name: 'CheckBox' }];
	dynamicFormArray: any[] = [];
	admissionRemarkFieldArray: any[] = [];
	learnFieldArray: any[] = [];
	addOnly = false;
	viewOnly = false;
	editOnly = false;
	editFlag = false;
	saveFlag = false;
	login_id: any;
	constructor(private fbuild: FormBuilder, public sanitizer: DomSanitizer,
		private notif: CommonAPIService, private sisService: SisService,
		private processtypeService: ProcesstypeService) { super(); }

	ngOnInit() {
		this.buildForm();
		// if (this.context.config.login_id) {
		//   this.login_id = this.context.config.login_id;
		//   this.viewOnly = true;
		//   this.getAdmissionRemarkFields(this.login_id);
		//   this.getLearnFields(this.login_id);
		// } else {
		//   this.getAdmissionRemarkFields('');
		//   this.getLearnFields('');
		// }
		// this.notif.studentData.subscribe(data => {
		//   this.login_id = data;
		//   this.getAdmissionRemarkFields(this.login_id);
		//   this.getLearnFields(this.login_id);

		// });
		this.notif.studentData.subscribe((data: any) => {
			if (data && data.au_login_id) {
				this.login_id = data.au_login_id;
				const processType = this.processtypeService.getProcesstype();
				if (processType === '3' || processType === '4') {
					this.getAdmissionRemarkFields(this.login_id);
					this.getLearnFields(this.login_id);
				}

			}
		});



		this.notif.reRenderForm.subscribe((data: any) => {
			if (data && data.addMode) {
				this.buildForm();
				this.viewOnly = false;
				this.addOnly = true;
				this.getAdmissionRemarkFields('');
				this.getLearnFields('');
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
			}

		});

	}


	buildForm() {
		this.admissionRemarkForm = this.fbuild.group({
			admission_array: this.fbuild.array([]),
			learn_array: this.fbuild.array([])
		});
	}

	get admissionRemarkFields() {
		return this.admissionRemarkForm.get('admission_array') as FormArray;
	}

	get learnFields() {
		return this.admissionRemarkForm.get('learn_array') as FormArray;
	}

	getAdmissionRemarkFields(login_id) {
		this.admissionRemarkFieldArray = [];
		for (let ri = this.admissionRemarkFields.length - 1; ri >= 0; ri--) {
			this.admissionRemarkFields.removeAt(ri);
		}
		// this.context.studentdetails.studentdetailsform.value.au_login_id
		if (login_id) {
			const inputJson = { 'login_id': login_id, 'equs_type': 'custom' };
			this.sisService.getAdmissionRemarks(inputJson).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.admissionRemarkFieldArray = result.data;
					for (const arfa of this.admissionRemarkFieldArray) {
						this.admissionRemarkFields.push(this.fbuild.group(arfa));
					}
				}
			});
		}
	}

	getLearnFields(login_id) {
		this.learnFieldArray = [];
		for (let ri = this.learnFields.length - 1; ri >= 0; ri--) {
			this.learnFields.removeAt(ri);
		}
		if (login_id) {
			const inputJson = { 'login_id': login_id, 'equs_type': 'learn' };
			this.sisService.getAdmissionRemarks(inputJson).subscribe((result: any) => {
				if (result) {
					this.learnFieldArray = result.data;
					// this.admissionRemarkFieldArray.concat(result.data);
					for (const arfa of this.learnFieldArray) {
						this.learnFields.push(this.fbuild.group(arfa));
					}
				}
			});
		}
	}

	insertAdmissionRemarks() {
		const admissionArray = this.admissionRemarkForm.value['admission_array'];
		const learnArray = this.admissionRemarkForm.value['learn_array'];
		const insertAdmissionRemarkJson = {
			'login_id': this.context.studentdetails.studentdetailsform.value.au_login_id,
			'admissionRemarks': admissionArray.concat(learnArray)
		};
		this.sisService.insertAdmissionRemarks(
			insertAdmissionRemarkJson
		).subscribe((result: any) => {
			if (result) {
				this.notif.showSuccessErrorMessage('Admission Remarks Added Successfully', 'success');
				if (this.processtypeService.getProcesstype() === '3' || this.processtypeService.getProcesstype() === '4') {
					this.notif.reRenderForm.next({ reRenderForm: true, addMode: false, editMode: false, deleteMode: false });
				}
			}
		});
	}
	updateAdmissionRemarks(isview) {
		const admissionArray = this.admissionRemarkForm.value['admission_array'];
		const learnArray = this.admissionRemarkForm.value['learn_array'];
		const insertAdmissionRemarkJson = {
			'login_id': this.context.studentdetails.studentdetailsform.value.au_login_id,
			'admissionRemarks': admissionArray.concat(learnArray)
		};
		this.sisService.insertAdmissionRemarks(
			insertAdmissionRemarkJson
		).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.notif.showSuccessErrorMessage('Admission Remarks Updated Successfully', 'success');
				if (isview) {
					// this.commonAPIService.studentData.next(this.context.studentdetails.studentdetailsform.value.au_enrollment_id);
					this.notif.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
				}
			} else {
				this.notif.showSuccessErrorMessage(result.data, 'error');
			}
		});
	}

	cancelForm() {
		if (this.addOnly) {
			this.notif.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
		} else if (this.saveFlag) {
			this.notif.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
		}

	}

}
