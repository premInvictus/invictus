import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
import { saveAs } from 'file-saver';
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
			formData.append('module' , 'auxillary');
			formData.append('component', component);
			// return this._http.post(environment.apiAxiomUrl + '/bulkupload/classUpload', formData)
			// fileReader.onload = (e) => {
			// 	this.auxillarybulkupdate(file.name, fileReader.result);
			// };
			// fileReader.readAsDataURL(file);
			const options = { content: formData,  module : 'auxillary', component : this.uploadComponent };
			this.sisService.uploadBulkDocuments(formData).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage('Uploaded Successfully', 'success');
					this.myInputVariable.nativeElement.value = '';
				} else {
					this.commonAPIService.showSuccessErrorMessage('Error While Uploading File', 'error');
					this.myInputVariable.nativeElement.value = '';
				}
				this.myInputVariable.nativeElement.value = '';
			});
		}
	}
	auxillarybulkupdate(fileName, imagebase64) {
		this.sisService.uploadBulkDocuments([
			{ fileName: fileName, imagebase64: imagebase64, module: 'auxillary', 'component': this.uploadComponent }]).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage('Uploaded Successfully', 'success');
					this.myInputVariable.nativeElement.value = '';
				} else {
					this.commonAPIService.showSuccessErrorMessage('Error While Uploading File', 'error');
					this.myInputVariable.nativeElement.value = '';
				}
			});
	}

	loadComponent(event) {
		this.uploadComponent = event.value;
		console.log('this.uploadModule', this.uploadComponent);
	}

	downloadTemplate() {
		if (this.uploadComponent === '') {
			this.commonAPIService.showSuccessErrorMessage('Please choose one component for which do you wish to download template', 'error');
		} else {
			this.sisService.downloadBulkUpdateTemplate([
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
