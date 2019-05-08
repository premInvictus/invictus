import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';

@Component({
	selector: 'app-bulk-updates',
	templateUrl: './bulk-updates.component.html',
	styleUrls: ['./bulk-updates.component.scss']
})
export class BulkUpdatesComponent implements OnInit {
	@ViewChild('inputFile') myInputVariable: ElementRef;
	constructor(
		private sisService: SisService,
		private commonAPIService: CommonAPIService
	) { }

	ngOnInit() {
	}
	bulkupdate(event) {
		const file = event.target.files[0];
		const fileReader = new FileReader();
		fileReader.onload = (e) => {
			this.auxillarybulkupdate(file.name, fileReader.result);
		};
		fileReader.readAsDataURL(file);
	}
	auxillarybulkupdate(fileName, imagebase64) {
		this.sisService.uploadBulkDocuments([
			{ fileName: fileName, imagebase64: imagebase64, module: 'auxillary' }]).subscribe((result: any) => {
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
