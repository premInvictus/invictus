import { Component, OnInit } from '@angular/core';
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
  constructor(private common: ErpCommonService, private fbuild: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.barCodePrintForm = this.fbuild.group({
      reserv_id_from: '',
      reserv_id_to: ''
    })
  }
  getBarCode() {
    if (this.barCodePrintForm.value.reserv_id_from || this.barCodePrintForm.value.reserv_id_to) {
      this.common.getBarcodePrint(this.barCodePrintForm.value).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          this.barCodeArray = [];
          this.barCodeArray = res.data;
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
}
