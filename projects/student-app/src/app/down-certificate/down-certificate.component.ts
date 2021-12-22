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
  gradeDetails: any = {};
  settings: any[] = [];
  showGradeCardFlag = false;
  constructor(private erp: ErpCommonService, private commonApiService: CommonAPIService) { }

  ngOnInit() {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getGlobalSetting();
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

  printGradecard() {
    const printData: any[] = [];
    printData.push(this.currentUser.login_id);
    const param: any = {};
    param.login_id = printData;
    param.class_id = this.gradeDetails.class_id;
    param.sec_id = (this.studentDetails.sec_id);
    param.term_id = this.gradeDetails.term_id;
    param.exam_id = this.gradeDetails.exam_id;
    param.se_id = this.gradeDetails.sub_exam_id;
    this.erp.printGradecard(param).subscribe((result: any) => {
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
        console.log("in-studentDetails",this.studentDetails);
        console.log("in-this.settings",this.settings);
        this.gradeDetails = {};
          if (this.settings && this.settings.length > 0) {
            const findex = this.settings.findIndex(f => Number(f.class_id) === Number(this.studentDetails.class_id)
              && f.status === '1');
              console.log("11",findex);
            if (findex !== -1) {
              if (this.settings[findex].sec_id && this.settings[findex].sec_id.length > 0) {
                const findex2 = this.settings[findex].sec_id.findIndex(f => Number(f) === Number(this.studentDetails.sec_id));
                if (findex2 !== -1) {
                  this.showGradeCardFlag = true;
                  this.gradeDetails = this.settings[findex];
                }
              } else {
                this.showGradeCardFlag = true;
                this.gradeDetails = this.settings[findex]; 
              }
            }
            
          }
      }
    });
  }
  getGlobalSetting() {
    this.erp.getGlobalSetting({ 'gs_alias': 'gradecard_report_settings_app' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.settings = (result.data[0] && result.data[0]['gs_value']) ? JSON.parse(result.data[0] && result.data[0]['gs_value']) : [];
      }
    });
  }
}
