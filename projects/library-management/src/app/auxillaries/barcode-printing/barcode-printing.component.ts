import { Component, OnInit, ViewChild } from '@angular/core';
import { ErpCommonService } from 'src/app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonAPIService } from '../../_services';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-barcode-printing',
  templateUrl: './barcode-printing.component.html',
  styleUrls: ['./barcode-printing.component.scss']
})
export class BarcodePrintingComponent implements OnInit {
  barCodePrintForm: FormGroup;
  barCodeArray: any[] = [];
  printformat: any = '';
  inputJson:any = {};
  printTypeArray: any[] = [{
    id: '1',
    name: 'ST-48 A4100'
  },
  {
    id: '2',
    name: 'ST-84 A4100'
  }];
  @ViewChild('searchModal') searchModal;
  constructor(private common: ErpCommonService, private fbuild: FormBuilder,
    private com: CommonAPIService) { }

  ngOnInit() {
    this.buildForm();
  }
  openSearchDialog = (data) => { this.barCodePrintForm.reset(); this.searchModal.openModal(data); this.barCodeArray = []; }
  buildForm() {
    this.barCodePrintForm = this.fbuild.group({
      reserv_id: ''
    })
  }
  getBarCode() {
    if (this.barCodePrintForm.value.reserv_id) {
      console.log("i am here");
      
      this.inputJson = { 'filters': [{ 'filter_type': 'reserv_no', 'filter_value': this.barCodePrintForm.value.reserv_id, 'type': 'text' }], search_from: 'master' };
      console.log("i am this.inputjson", this.inputJson);
      
      this.common.getReservoirDataBasedOnFilter(this.inputJson).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          this.barCodeArray = [];
          this.barCodeArray = res.data.resultData;
          this.barCodeArray.reverse();
        }
      });
      
    }
  }
  printbars() {
    console.log("i am this.inputjson", this.inputJson);
    
    if (this.printformat && Number(this.printformat) === 1) {
      this.common.getReservoirDataPdf(this.inputJson).subscribe((result:any) => {
        if (result && result.status === 'ok') {
          console.log('result', result.data);
          // this.familyDetailArr = result.data;
          const length = result.data.split('/').length;
          saveAs(result.data, result.data.split('/')[length - 1]);
          window.open(result.data, '_blank');
        }
      } )
    } else if (this.printformat && Number(this.printformat) === 2) {
      this.common.getReservoirDataPdf84(this.inputJson).subscribe((result:any) => {
        if (result && result.status === 'ok') {
          console.log('result', result.data);
          // this.familyDetailArr = result.data;
          const length = result.data.split('/').length;
          saveAs(result.data, result.data.split('/')[length - 1]);
          window.open(result.data, '_blank');
        }
      } )
    } else {
        this.com.showSuccessErrorMessage('Please select print format', 'error');
      }
    
   
  }

  searchOk($event) {
    localStorage.removeItem('invoiceBulkRecords');
    if ($event) {
      this.inputJson = {
        filters: $event.filters,
        generalFilters: $event.generalFilters,
        search_from: 'master'
      }
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
