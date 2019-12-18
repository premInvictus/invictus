import { Component, OnInit, ViewChild } from '@angular/core';
import { ErpCommonService } from 'src/app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonAPIService, InventoryService } from '../../_services';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-barcode-print',
  templateUrl: './barcode-print.component.html',
  styleUrls: ['./barcode-print.component.css']
})
export class BarcodePrintComponent implements OnInit {

  barCodePrintForm: FormGroup;
  barCodeArray: any[] = [];
  printformat: any = '';
  printTypeArray: any[] = [{
    id: '1',
    name: 'ST-48 A4100'
  },
  {
    id: '2',
    name: 'ST-84 A4100'
  }];
  @ViewChild('searchModal') searchModal;
  constructor(
    private common: ErpCommonService, 
    private fbuild: FormBuilder,
    private commonAPIService: CommonAPIService,
    private inventoryService: InventoryService
    ) { }

  ngOnInit() {
    this.buildForm();
  }
  openSearchDialog = (data) => { this.barCodePrintForm.reset(); this.searchModal.openModal(data); this.barCodeArray = []; }
  buildForm() {
    this.barCodePrintForm = this.fbuild.group({
      item_code: ''
    })
  }
  getBarCode() {
    if (this.barCodePrintForm.value.item_code) {
      let inputJson = { 'filters': [{ 'filter_type': 'item_code', 'filter_value': this.barCodePrintForm.value.item_code, 'type': 'text' }]};
      this.inventoryService.filterItemsFromMaster(inputJson).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          this.barCodeArray = [];
          this.barCodeArray = res.data;
          this.barCodeArray.reverse();
        }
      });
    }
  }
  printbars() {
    this.inventoryService.generatePdfOfBarcode(this.barCodeArray).subscribe((result: any) => {
      if(result && result.status == 'ok') {
        console.log(result.data);
        this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				const length = result.data.fileUrl.split('/').length;
				saveAs(result.data.fileUrl, result.data.fileUrl.split('/')[length - 1]);
				//window.open(result.data.fileUrl, '_blank');
      }
    })
  }

  searchOk($event) {
    localStorage.removeItem('invoiceBulkRecords');
    if ($event) {
      this.common.getReservoirDataBasedOnFilter({
        filters: $event.filters,
        generalFilters: $event.generalFilters,
        search_from: 'master'
      }).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          this.barCodeArray = [];
          this.barCodeArray = res.data.resultData;
          this.barCodePrintForm.reset();
        }
      });
    }
  }
  getClass(index) {
    if (index > 47) {
      if (index % 48 === 0 || index % 48 === 1 || index % 48 === 2 || index % 48 === 3) {
        return 'barcode-div-print barcode-margin-div';
      } else {
        return 'barcode-div-print barcode-margin-div2';
      }
    } else {
      return 'barcode-div-print';
    }
  }
  getClass2(index) {
    if (index > 83) {
      if (index % 84 === 0 || index % 84 === 1 || index % 84 === 2 || index % 84 === 3) {
        return 'barcode-div-print-2 barcode-margin-div3';
      } else {
        return 'barcode-div-print-2 barcode-margin-div4';
      }
    } else {
      return 'barcode-div-print-2';
    }
  }
  changePrintFormat($event) {
    this.printformat = $event.value;
  }

}
