import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ExamService, SmartService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms'
import { saveAs } from 'file-saver';

@Component({
	selector: 'app-upload-marks',
	templateUrl: './upload-marks.component.html',
	styleUrls: ['./upload-marks.component.css']
})
export class UploadMarksComponent implements OnInit {

	@ViewChild('inputFile') myInputVariable: ElementRef;
	uploadComponent: any = '';
	paramform: FormGroup;
	classArray: any[] = [];
	gcssArray: any[] = [];
	termsArray: any[] = [];
	constructor(
		private examService: ExamService,
		private smartService: SmartService,
		private commonAPIService: CommonAPIService, 
		private fbuild: FormBuilder
	) { }

	ngOnInit() {
		this.buildForm();
		this.getGlobalClassSectionSubject();

	}

	buildForm() {
		this.paramform = this.fbuild.group({
			gcss_entry_id: '',
			term_id: ''
		});
	}
	getClassTerm() {
		this.termsArray = [];
		if(this.paramform.value.gcss_entry_id) {
			const tempcg = this.gcssArray.find(e => e.gcss_entry_id === this.paramform.value.gcss_entry_id);
			console.log(tempcg);
			this.examService.getClassTerm({ class_id: tempcg.gcss_gc_id[0]}).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					result.data.ect_no_of_term.split(',').forEach(element => {
						this.termsArray.push({ id: element, name: result.data.ect_term_alias + ' ' + element });
					});
				}
			  });
		}
	  }
	async getGlobalClassSectionSubject() {
		this.classArray = [];
		this.gcssArray = [];
		await this.smartService.getClass({}).toPromise().then((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
			}
		});
		await this.smartService.getGlobalClassSectionSubject({}).toPromise().then((result: any) => {
			if (result && result.status === 'ok') {
				this.gcssArray = result.data;
				this.gcssArray.forEach(element => {
					const class_name_arr: any[] = [];
					element.gcss_gc_id.forEach(element1 => {
						class_name_arr.push((this.classArray.find(e => e.class_id === element1)).class_name);
					});
					element.gcss_gc_name = class_name_arr;
				});
			}
		});
		console.log(this.gcssArray);
	}
	bulkupdate(event) {
		const file: File = event.target.files[0];
		const formData = new FormData();
		if (this.paramform.value.gcss_entry_id && this.paramform.value.term_id) {
			if (true) {
				formData.append('uploadFile', file, file.name);
				formData.append('gcss_entry_id', this.paramform.value.gcss_entry_id);
				formData.append('term_id', this.paramform.value.term_id);
				formData.append('examEntryStatus', '1');
				formData.append('module', 'auxillary');
				this.examService.uploadMarkEntryTemplate(formData).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.commonAPIService.showSuccessErrorMessage('Uploaded Successfully', 'success');
						this.myInputVariable.nativeElement.value = '';
					} else {
						this.commonAPIService.showSuccessErrorMessage('Error While Uploading File', 'error');
						this.myInputVariable.nativeElement.value = '';
					}
				});
			}
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please select all required filed', 'error');
		}

		console.log('file--', file);
		this.myInputVariable.nativeElement.value = '';

	}

	downloadTemplate() {
		if (this.paramform.value.gcss_entry_id) {
			this.examService.downloadMarkEntryTemplate(this.paramform.value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage('Download Successfully', 'success');
					const length = result.data.split('/').length;
					saveAs(result.data, result.data.split('/')[length - 1]);
				} else {
					this.commonAPIService.showSuccessErrorMessage('Error While Downloading File', 'error');
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please select class group', 'error');
		}
	}

}
