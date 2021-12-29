import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
import { saveAs } from 'file-saver';
import * as Excel from 'exceljs/dist/exceljs';

@Component({
	selector: 'app-bulk-updates',
	templateUrl: './bulk-updates.component.html',
	styleUrls: ['./bulk-updates.component.scss']
})
export class BulkUpdatesComponent implements OnInit {
	@ViewChild('inputFile') myInputVariable: ElementRef;
	uploadComponent: any = '';
	constructor(
		private sisService: SisService,
		private commonAPIService: CommonAPIService
	) { }

	ngOnInit() {
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
			formData.append('module', 'auxillary');
			formData.append('component', component);
			const options = { content: formData, module: 'auxillary', component: this.uploadComponent };
			this.sisService.uploadBulkDocuments(formData).subscribe((result: any) => {
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
				if (files[i]['type'] === 'application/vnd.ms-excel' || files[i]['type'] === 'application/octet-stream' || (files[i]['type'] === '' && files[i]['size'] > 0)) {
					formData.append('uploadFile', files[i], files[i].name);
				} else if ((files[i]['type'] === 'application/zip' || files[i]['type'] === 'application/x-zip-compressed') && files[i]['size'] > 0) {
					formData.append('zipFile', files[i], files[i].name);
				}
			}
			formData.append('module', 'auxillary');
			formData.append('component', component);
			const options = { content: formData, module: 'auxillary', component: this.uploadComponent };
			this.sisService.uploadBulkDocuments(formData).subscribe((result: any) => {
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
		}  else {
			this.sisService.downloadBulkUpdateTemplate([
				{ component: this.uploadComponent }]).subscribe((result: any) => {
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
