import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FeeService, CommonAPIService, SisService, ProcesstypeFeeService } from '../../_services/index';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-bulk-updates',
	templateUrl: './bulk-updates.component.html',
	styleUrls: ['./bulk-updates.component.scss']
})
export class BulkUpdatesComponent implements OnInit {
	@ViewChild('inputFile') myInputVariable: ElementRef;
	uploadComponent: any = '';
	feePeriod: any[] = [];
	constructor(
		private sisService: SisService,
		private commonAPIService: CommonAPIService,
		public feeService : FeeService
	) { }

	ngOnInit() {
		this.getSchoolFeeMonth();
	}

	getSchoolFeeMonth() {
		this.feePeriod = [];
		this.feeService.getInvoiceFeeMonths({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feePeriod = result.data.fm_data;
				console.log('this.feePeriod', this.feePeriod);
			}
		});
	}

	bulkupdate(event) {
		if (this.uploadComponent === '') {
			this.commonAPIService.showSuccessErrorMessage('Please choose one Fee Month for which do you wish to upload data', 'error');
		} else {
			const file = event.target.files[0];
			// const fileReader = new FileReader();
			const formData = new FormData();
			const component = this.uploadComponent;
			formData.append('uploadFile', file, file.name);
			formData.append('module' , 'auxillary');
			formData.append('fee_period', component);
			const options = { content: formData,  module : 'auxillary', component : this.uploadComponent };
			this.feeService.uploadFeeTransactionExcel(formData).subscribe((result: any) => {
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

	loadComponent(event) {
		this.uploadComponent = event.value;
		this.myInputVariable.nativeElement.value = '';
	}

	downloadTemplate() {
		if (this.uploadComponent === '') {
			this.commonAPIService.showSuccessErrorMessage('Please choose one Fee Month for which do you wish to download template', 'error');
		} else {
			this.feeService.downloadFeeTransactionExcel([
				{ component: this.uploadComponent}]).subscribe((result: any) => {
					if (result) {
						this.commonAPIService.showSuccessErrorMessage('Download Successfully', 'success');
						const length = result.fileUrl.split('/').length;
						saveAs(result.fileUrl, result.fileUrl.split('/')[length - 1]);
					} else {
						this.commonAPIService.showSuccessErrorMessage('Error While Downloading File', 'error');
					}
				});
		}
	}

}
