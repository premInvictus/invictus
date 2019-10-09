import { Component, OnInit, ViewChild } from '@angular/core';
import { ErpCommonService } from 'src/app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-barcode-printing',
  templateUrl: './barcode-printing.component.html',
  styleUrls: ['./barcode-printing.component.scss']
})
export class BarcodePrintingComponent implements OnInit {
  barCodePrintForm: FormGroup;
  barCodeArray: any[] = [];
  @ViewChild('searchModal') searchModal;
  constructor(private common: ErpCommonService, private fbuild: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }
  openSearchDialog = (data) => { this.barCodePrintForm.reset();		this.searchModal.openModal(data);  this.barCodeArray = [];}
  buildForm() {
    this.barCodePrintForm = this.fbuild.group({
      reserv_id: ''
    })
  }
  getBarCode() {
    if (this.barCodePrintForm.value.reserv_id) {
      let inputJson = { 'filters': [{ 'filter_type': 'reserv_id', 'filter_value': this.barCodePrintForm.value.reserv_id, 'type': 'text' } ],search_from: 'master' };
      this.common.getReservoirDataBasedOnFilter(inputJson).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          this.barCodeArray = [];
          this.barCodeArray = res.data.resultData;
          console.log(this.barCodeArray);
        }
      });
    }
  }
  printbars() {
    const barRow = document.getElementById('print-bars').innerHTML;
    let popupWin: any = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
    popupWin.document.open();
    popupWin.document.write('<html><link rel="stylesheet" href="../../../../../../assets/css/barcode-print-lib.css">' +
      '<link rel="stylesheet" href="https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/css/bootstrap.min.css"' +
      'integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">' +
      '<body onload="window.print()">' + barRow + '</body></html>');
    popupWin.document.close();
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
}
