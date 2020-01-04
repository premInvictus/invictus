import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SisService, CommonAPIService, InventoryService } from '../../_services/index';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit {
  @ViewChild('inputFile') myInputVariable: ElementRef;
  uploadComponent: any = '';
  constructor(
    private inventory: InventoryService,
    private commonAPIService: CommonAPIService
  ) { }

  ngOnInit() {

  }

  bulkupdate(event) {
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
      this.inventory.uploadEmployeeExcel(formData).subscribe((result: any) => {
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
      this.commonAPIService.showSuccessErrorMessage('Please choose one component for which do you wish to download template', 'error');
    } else {
      this.inventory.downloadEmployeeExcel([
        { component: this.uploadComponent }]).subscribe((result: any) => {
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

