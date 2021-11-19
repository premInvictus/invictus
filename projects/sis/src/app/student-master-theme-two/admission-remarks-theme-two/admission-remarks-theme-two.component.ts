import { Component, OnInit, ViewChild, AfterViewInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonAPIService, ProcesstypeService } from '../../_services/index';
import { SisService } from '../../_services/index';

@Component({
	selector: 'app-admission-remarks-theme-two',
	templateUrl: './admission-remarks-theme-two.component.html',
	styleUrls: ['./admission-remarks-theme-two.component.scss']
})
export class AdmissionRemarksThemeTwoComponent implements OnInit, OnChanges {

	// tslint:disable-next-line:no-input-rename
	@Input('addOnly') addOnly: boolean;
	// tslint:disable-next-line:no-input-rename
	@Input('editOnly') editOnly: boolean;
	// tslint:disable-next-line:no-input-rename
	@Input('viewOnly') viewOnly: boolean;
	// tslint:disable-next-line:no-input-rename
	@Input('formData') formData: any;
	@Input() configSetting: any;
	admissionRemarkForm: FormGroup;
	learnForm: FormGroup;
	settingsArray: any[] = [];
	inputTypeArray: any[] = [{ id: 1, name: 'Input' }, { id: 2, name: 'Textarea' }, { id: 3, name: 'CheckBox' }];
	admissionRemarkFieldArray: any[] = [];
	learnFieldArray: any[] = [];

	constructor(private fbuild: FormBuilder, public sanitizer: DomSanitizer,
		private notif: CommonAPIService, private sisService: SisService,
		private processtypeService: ProcesstypeService) { }

	ngOnInit() {
		this.settingsArray = this.configSetting;
		this.buildForm();
		this.setFormDataAndState();
	}

	ngOnChanges() {
		this.setFormDataAndState();
	}

	buildForm() {
		this.admissionRemarkForm = this.fbuild.group({
			admission_array: this.fbuild.array([]),
			learn_array: this.fbuild.array([])
		});
	}

	get admissionRemarkFields() {
		if (this.admissionRemarkForm) {
			return this.admissionRemarkForm.get('admission_array') as FormArray;
		}
	}

	get learnFields() {
		if (this.admissionRemarkForm) {
			return this.admissionRemarkForm.get('learn_array') as FormArray;
		}
	}

	setFormDataAndState() {
		console.log("i am here", this.formData);
		
		this.admissionRemarkFieldArray = this.formData && this.formData.remarkQuestion ? this.formData.remarkQuestion : [];
		this.learnFieldArray = this.formData && this.formData.remarkLearn ? this.formData.remarkLearn : [];
		console.log("i am here 2", this.learnFieldArray, this.admissionRemarkFieldArray);
		if (this.admissionRemarkFields) {
			for (let ri = this.admissionRemarkFields.length - 1; ri >= 0; ri--) {
				this.admissionRemarkFields.removeAt(ri);
			}
		}

		if (this.learnFields) {
			for (let ri = this.learnFields.length - 1; ri >= 0; ri--) {
				this.learnFields.removeAt(ri);
			}
		}

		for (const arfa of this.admissionRemarkFieldArray) {
			if (this.admissionRemarkFields) {
				this.admissionRemarkFields.push(this.fbuild.group(arfa));
			}
		}

		for (const arfa of this.learnFieldArray) {
			if (this.learnFields) {
				this.learnFields.push(this.fbuild.group(arfa));
			}
		}

		console.log("i am here", this.learnFieldArray);
		

		this.addOnly = this.addOnly ? this.addOnly : false;
		this.editOnly = this.editOnly ? this.editOnly : false;
		this.viewOnly = this.viewOnly ? this.viewOnly : false;
	}

}
