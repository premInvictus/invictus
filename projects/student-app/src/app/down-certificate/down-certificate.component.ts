import { Component, OnInit } from '@angular/core';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-down-certificate',
  templateUrl: './down-certificate.component.html',
  styleUrls: ['./down-certificate.component.css']
})
export class DownCertificateComponent implements OnInit {
  certificate_type_arr: any[] = [];
  currentUser: any = {};
  studentDetails: any = {};
  constructor(private erp: ErpCommonService, private commonApiService: CommonAPIService) { }

  ngOnInit() {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getSlcTcTemplateSetting();
    this.getStudentDetails();
  }
  getSlcTcTemplateSetting() {
    this.erp.getSlcTcTemplateSetting({ usts_certificate_type: '1' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.certificate_type_arr = [];
        const param: any = {};
        param.login_id = this.currentUser.login_id;
        this.erp.getCertificatesEnabled(param).subscribe((res: any) => {
          if (res && res.status == 'ok') {
            const certs: any[] = res.data;
            for (const it of certs) {
              for (const cer of result.data) {
                if (Number(it.acc_type) === Number(cer.usts_id)) {
                  this.certificate_type_arr.push(cer);
                }
              }
            }

          } else {
            this.certificate_type_arr = [];
          }
        });
      }
    })
  }
  certDownload(value) {
    const printData: any[] = [];
    printData.push(this.currentUser.login_id);
    const param: any = {};
    param.certificate_type = value.usts_id;
    param.class_id = this.studentDetails.class_id,
      param.sec_id = this.studentDetails.sec_id ? this.studentDetails.sec_id : '',
      param.printData = printData;

    this.erp.printAllCertificate({ param }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.commonApiService.showSuccessErrorMessage('Download Successfully', 'success');
        const length = result.data.split('/').length;
        saveAs(result.data, result.data.split('/')[length - 1]);
      }
    })

  }
  getStudentDetails() {
    this.erp.getStudentInformation({ login_id: this.currentUser.login_id, enrollment_type: '4' }).subscribe((resutl1: any) => {
      if (resutl1 && resutl1.status === 'ok') {
        this.studentDetails = {};
        this.studentDetails = resutl1.data[0];
      }
    });
  }
}
