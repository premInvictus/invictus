import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService } from 'src/app/_services';
import { SisService, CommonAPIService,SmartService } from 'projects/sis/src/app/_services';

@Component({
  selector: 'app-bar-code-report',
  templateUrl: './bar-code-report.component.html',
  styleUrls: ['./bar-code-report.component.css']
})
export class BarCodeReportComponent implements OnInit {
  classForm: FormGroup;
  classArray: any[] = [];
  secArray: any[] = [];
  sessionArray: any[] = [];
  sessionPromote: any;
  sessionDemote: any;
  promoteSessionId: any;
  demoteSessionId: any;
  session; any = {};
  prev: any;
  next: any;
  barcodeArray: any[] = [];
  constructor(private fbuild: FormBuilder,
    private common: CommonAPIService,
    private sisService: SisService,
    private SmartService: SmartService,
    private erp: ErpCommonService) { }

  ngOnInit() {
    this.session = JSON.parse(localStorage.getItem('session'));
    this.buildForm();
    this.getClassAll();
    this.getSession();
  }
  buildForm() {
    this.classForm = this.fbuild.group({
      'class_id': '',
      'sec_id': ''
    });
  }
  getClassAll() {
    this.SmartService.getClassData({}).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.classArray = [];
        this.classArray = res.data;
      }
    });
  }
  getSectionsByClass() {
    this.barcodeArray = [];
    this.sisService.getSectionsByClass({
      class_id: this.classForm.value.class_id
    }).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.secArray = [];
        this.secArray = res.data;
      }
    });
  }
  getSession() {
    this.sisService.getSession().subscribe((result: any) => {
      if (result.status === 'ok') {
        this.sessionArray = result.data;
        for (const item of this.sessionArray) {
          const findex = this.sessionArray.findIndex(f => f.ses_id === this.session.ses_id);
          if (findex !== -1) {
            this.promoteSessionId = this.session.ses_id;
          }
        }
      }
    });
  }
  getBarCode() {
    if (this.classForm.value.class_id) {
      this.sisService.getStudentsPromotionTool({
        class_id: this.classForm.value.class_id,
        ses_id: this.promoteSessionId,
        sec_id: this.classForm.value.sec_id,
        enrollment_type: '4',
        order_by: '',
      }).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          this.barcodeArray = [];
          this.barcodeArray = res.data;
        }
      });
    } else {
      this.common.showSuccessErrorMessage('Please choose class', 'error');
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
  printbars() {
    const barRow = document.getElementById('print-bars2').innerHTML;
    let popupWin: any = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
    popupWin.document.open();
    popupWin.document.write('<html><link rel="stylesheet" href="../../../../../../assets/css/barcode-print-lib2.css">' +
      '<link rel="stylesheet" href="https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/css/bootstrap.min.css"' +
      'integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">' +
      '<body onload="window.print()">' + barRow + '</body></html>');
    popupWin.document.close();
  }


}
