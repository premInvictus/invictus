import { Component, OnInit, ViewChild } from '@angular/core';
import { ErpCommonService } from 'src/app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonAPIService } from '../../_services';
@Component({
  selector: 'app-barcode-printing',
  templateUrl: './barcode-printing.component.html',
  styleUrls: ['./barcode-printing.component.scss']
})
export class BarcodePrintingComponent implements OnInit {
  barCodePrintForm: FormGroup;
  barCodeArray: any[] = [];
  printformat: any = '';
  printTypeArray: any[] = [{
    id: '1',
    name: 'ST-48 A4100 Format'
  },
  {
    id: '2',
    name: 'ST-24 A4100 Format'
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
      let inputJson = { 'filters': [{ 'filter_type': 'reserv_id', 'filter_value': this.barCodePrintForm.value.reserv_id, 'type': 'text' }], search_from: 'master' };
      this.common.getReservoirDataBasedOnFilter(inputJson).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          this.barCodeArray = [];
          this.barCodeArray = res.data.resultData;
          this.barCodeArray.reverse();
        }
      });
    }
  }
  printbars() {
    if (this.printformat && Number(this.printformat) === 1) {
      const barRow = document.getElementById('print-bars').innerHTML;
      let popupWin: any = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
      popupWin.document.open();
      popupWin.document.write('<html><link rel="stylesheet" href="../../../../../../assets/css/barcode-print-lib.css">' +
        '<link rel="stylesheet" href="https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/css/bootstrap.min.css"' +
        'integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">' +
        '<body onload="window.print()">' + barRow + '</body></html>');
      popupWin.document.close();
    }if (this.printformat && Number(this.printformat) === 2) {
      const barRow = document.getElementById('print-bars2').innerHTML;
      let popupWin: any = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
      popupWin.document.open();
      popupWin.document.write('<html><link rel="stylesheet" href="../../../../../../assets/css/barcode-print-lib2.css">' +
        '<link rel="stylesheet" href="https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/css/bootstrap.min.css"' +
        'integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">' +
        '<body onload="window.print()">' + barRow + '</body></html>');
      popupWin.document.close();
    } else {
      this.com.showSuccessErrorMessage('Please select print format', 'error');
    }
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
  changePrintFormat($event) {
    this.printformat = $event.value;
  }
}
