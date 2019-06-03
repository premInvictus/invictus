import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-bulk-insert',
	templateUrl: './bulk-insert.component.html',
	styleUrls: ['./bulk-insert.component.scss']
})
export class BulkInsertComponent implements OnInit {
	@ViewChild('inputFile') myInputVariable: ElementRef;
	header1: any = 'Choose a file';
	header2: any = 'or drag it here !';
	header3: any = 'Upload';
	header4: any = 'Zip File';
	buildId: any = '';
	validateFlag = false;
	constructor(
		private sisService: SisService,
		private commonAPIService: CommonAPIService
	) { }

	ngOnInit() {
	}
	bulkUpdateValidate($event) {
		this.sisService.validateUploadBulkData($event.target.files).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage('File is valid', 'success');
				this.validateFlag = true;
				this.header1 = 'File Uploaded Successfully';
				this.buildId = result.data.bul_id;
				this.header2 = '';
				this.myInputVariable.nativeElement.value = '';
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				this.myInputVariable.nativeElement.value = '';
				this.header1 = 'Invalid File';
				this.header2 = 'Please chose a valid one';
				this.validateFlag = false;
			}
		});
	}
	downloadExcel() {
		this.sisService.generateExcelForBulkUpload().subscribe((result: any) => {
			if (result.status === 'ok') {
				if (result.data) {
					const length = result.data.split('/').length;
					saveAs(result.data, result.data.split('/')[length - 1]);
				}
			}
		});
	}
	bulkInsert($event) {
		const fileList: FileList = $event.target.files;
		if (fileList.length > 0) {
			const file: File = fileList[0];
			const formData: FormData = new FormData();
			formData.append('zip_file', file, file.name);
			formData.append('bul_id', this.buildId);
		this.sisService.uploadBulkData(formData).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage('File is valid', 'success');
				this.header1 = 'Choose a file';
				this.header2 = 'or drag it here !';
				this.myInputVariable.nativeElement.value = '';
				this.validateFlag = false;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				this.header1 = 'Choose a file';
				this.header2 = 'or drag it here !';
				this.validateFlag = false;
				this.myInputVariable.nativeElement.value = '';
			}
		});
	}
}

}
