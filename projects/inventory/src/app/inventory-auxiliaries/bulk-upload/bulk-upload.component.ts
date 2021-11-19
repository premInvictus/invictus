import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SisService, CommonAPIService, InventoryService } from '../../_services/index';
import { Workbook } from 'exceljs/dist/exceljs';
import * as fs from 'file-saver';
import { $ } from 'protractor';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit {
  @ViewChild('inputFile') myInputVariable: ElementRef;
  uploadComponent: any = '';
  locationArray : any = [];
  categoryArray: any;
  data: any;
  itemPriceList: FormGroup;
  constructor(
    private inventory: InventoryService,
    private commonAPIService: CommonAPIService,
		private fbuild: FormBuilder
  ) { }

  ngOnInit() {
    this.getAllLocation();
    this.getAllCategories();
    this.buildForm();
  }

  buildForm() {
		this.itemPriceList = this.fbuild.group({
			'location_name': ''
		});
	}

  getAllLocation(){
    this.inventory.getAllLocations({}).subscribe((result: any) => {
      if (result) {
        console.log("get all locations ",result);        
        this.locationArray = result;
      }
    });
  }

  getAllCategories(){
    this.inventory.getAllCategories({}).subscribe((result: any) => {
      if(result){
        this.categoryArray = result.data;
        console.log("get all categories ",result); 
      }
    });
  }

  generatePriceUploadTemplate(){
         
    let location = this.itemPriceList.value.location_name;
console.log("my location", location);

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Item Price');
   
    worksheet.columns = [
      { header: 'Item Code', key: 'id', width: 10 },
      { header: 'Item Name', key: 'name', width: 32 },
      { header: 'Item Location', key: 'brand', width: 30, default: "location"},
      { header: 'Price', key: 'price', width: 10, style: { font: { name: 'Arial Black', size:10} } },
    ];

    if(location != null || location != ""){
      // worksheet.getColumn(3).value = location;
    }
    // this.data.forEach(e => {
    //   worksheet.addRow({id: e.id, name: e.name, brand:e.brand, color:e.color, price:e.price },"n");
    // });
   
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'ItemPriceList.xlsx');
    });
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

  downloadTemplate(updCon) {
    if(updCon == '4'){
      this.generatePriceUploadTemplate();
      this.commonAPIService.showSuccessErrorMessage('Download Successfully', 'success');
    }else{
      if (this.uploadComponent === '') {
        this.commonAPIService.showSuccessErrorMessage('Please choose one component for which do you wish to download template', 'error');
      } else {
        this.inventory.downloadEmployeeExcel([
          { component: this.uploadComponent }]).subscribe((result: any) => {
            if (result) {
              this.commonAPIService.showSuccessErrorMessage('Download Successfully', 'success');
              const length = result.fileUrl.split('/').length;
              fs.saveAs(result.fileUrl, result.fileUrl.split('/')[length - 1]);
            } else {
              this.commonAPIService.showSuccessErrorMessage('Error While Downloading File', 'error');
            }
          });
      }

    }
  }

}

