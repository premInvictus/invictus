import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ExamService, SmartService, CommonAPIService } from '../../_services/index';
import {FormGroup, FormBuilder } from '@angular/forms'
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
  getClass(){
    this.classArray = [];
    
  }
  async getGlobalClassSectionSubject(){
    this.classArray = [];
    this.gcssArray = [];
    await this.smartService.getClass({}).toPromise().then((result: any) => {
      if(result && result.status === 'ok') {
        this.classArray = result.data;
      }
    });
    await this.smartService.getGlobalClassSectionSubject({}).toPromise().then((result: any) => {
      if(result && result.status === 'ok') {
        this.gcssArray = result.data;
        this.gcssArray.forEach(element => {
          element.gcss_gc_id.forEach(element1 => {
            element1 = this.classArray.find(e => e.class_id === element1).class_name;
          });
        });
      }
    });
    console.log(this.gcssArray);
  }
	bulkupdate(event) {
		console.log('this.uploadModule', this.uploadComponent);
		if (this.uploadComponent === '') {
			this.commonAPIService.showSuccessErrorMessage('Please choose one component for which do you wish to upload data', 'error');
		} else {
			const file = event.target.files[0];
			// const fileReader = new FileReader();
			const formData = new FormData();
			const component = this.uploadComponent;
			formData.append('uploadFile', file, file.name);
			formData.append('module' , 'auxillary');
			formData.append('component', component);
			const options = { content: formData,  module : 'auxillary', component : this.uploadComponent };
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
	}

	bulkDocumentUpdate(event) {
		const files = event.target.files;
		const formData = new FormData();
		const component = this.uploadComponent;
		console.log('file--', files);
		if (files.length > 1) {
			for (let i = 0; i < files.length; i++) {
				if (files[i]['type'] === 'application/vnd.ms-excel') {
					formData.append('uploadFile', files[i], files[i].name);
				}
				if (files[i]['type'] === 'application/zip') {
					formData.append('zipFile', files[i], files[i].name);
				}
			}
			formData.append('module' , 'auxillary');
			formData.append('component', component);
			const options = { content: formData,  module : 'auxillary', component : this.uploadComponent };
			this.examService.uploadMarkEntryTemplate(formData).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage('Uploaded Successfully', 'success');
					this.myInputVariable.nativeElement.value = '';
				} else {
					this.commonAPIService.showSuccessErrorMessage('Error While Uploading File', 'error');
					this.myInputVariable.nativeElement.value = '';
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please Choose one zip file and one excel file', 'error');
			this.myInputVariable.nativeElement.value = '';
		}
	}

	loadComponent(event) {
		this.uploadComponent = event.value;
		this.myInputVariable.nativeElement.value = '';
	}

	downloadTemplate() {
		if (this.uploadComponent === '') {
			this.commonAPIService.showSuccessErrorMessage('Please choose one component for which do you wish to download template', 'error');
		} else {
			this.examService.downloadMarkEntryTemplate([
				{ component: this.uploadComponent}]).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.commonAPIService.showSuccessErrorMessage('Download Successfully', 'success');
						const length = result.data.split('/').length;
						saveAs(result.data, result.data.split('/')[length - 1]);
					} else {
						this.commonAPIService.showSuccessErrorMessage('Error While Downloading File', 'error');
					}
				});
		}
	}

}
