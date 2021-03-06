import { ErpCommonService } from 'src/app/_services';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonAPIService, SisService } from '../../_services'
@Component({
  selector: 'app-repot-container',
  templateUrl: './repot-container.component.html',
  styleUrls: ['./repot-container.component.scss']
})
export class RepotContainerComponent implements OnInit {

  accountFlag = false;
  reportFlag = true;
  previousIndex = 0;
  reportTypeArray: any[] = [];
  feeReportArray: any[] = [
    {
      report_id: '1',
      report_name: 'Employee Master',
      report_image: '/assets/images/Fee Reports/collection_report.png',
      main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
      report_main_image_class: '',
      report_middle_class: 'inline-flex',
      report_check_icon_class: ''
    },
    {
      report_id: '3',
      report_name: 'Accumulated Deduction',
      report_image: '/assets/images/Fee Reports/collection_report.png',
      main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
      report_main_image_class: '',
      report_middle_class: 'inline-flex',
      report_check_icon_class: ''
    },
    {
      report_id: '4',
      report_name: 'Career Enquiries',
      report_image: '/assets/images/Fee Reports/collection_report.png',
      main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
      report_main_image_class: '',
      report_middle_class: 'inline-flex',
      report_check_icon_class: ''
    }
  ];
  reportType: string;
  reportHeader: any;
  userArray: any[] = [];
  userName: any = '';
  currentUser: any = {};
  constructor(private erpCommonService: ErpCommonService, private CommonAPIService: CommonAPIService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getGlobalSettings();
  }
  getGlobalSettings() {
    this.erpCommonService.getGlobalSetting({ gs_alias: 'attendance_calculation' }).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        if (res.data[0] && res.data[0].gs_value) {
          let attendance_calculation = res.data[0].gs_value;
          if (attendance_calculation == 'daily manual') {
            this.feeReportArray.push({
              report_id: '2',
              report_name: 'Attendance Report',
              report_image: '/assets/images/Fee Reports/collection_report.png',
              main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
              report_main_image_class: '',
              report_middle_class: 'inline-flex',
              report_check_icon_class: ''
            })
            // let findex = this.feeReportArray.findIndex(e => e.report_id == 5);
            // if(findex != -1){
            //   this.feeReportArray.splice(findex,1);
            // }
          } else if (attendance_calculation == 'biometric') {
            this.feeReportArray.push({
              report_id: '5',
              report_name: 'Shift Attendance',
              report_image: '/assets/images/Fee Reports/collection_report.png',
              main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
              report_main_image_class: '',
              report_middle_class: 'inline-flex',
              report_check_icon_class: ''
            });
            // let findex = this.feeReportArray.findIndex(e => e.report_id == 2);
            // if(findex != -1){
            //   this.feeReportArray.splice(findex,1);
            // }
          }
        }
      }
    });

  }
  checkEnable(report_id) {
    return 'report-card mat-card';
  }
  executeReport(report_id) {
    this.reportTypeArray = [];
    this.reportFlag = true;
    this.accountFlag = false;
    this.reportType = '';
    if (this.previousIndex >= 0) {
      this.feeReportArray[this.previousIndex].main_text_class = 'text-left inline-flex margin-top-5 icon-spacer';
      this.feeReportArray[this.previousIndex].report_main_image_class = '';
      this.feeReportArray[this.previousIndex].report_middle_class = 'inline-flex';
      this.feeReportArray[this.previousIndex].report_check_icon_class = '';
    }
    const findex = this.feeReportArray.findIndex(
      f => Number(f.report_id) === Number(report_id)
    );
    if (findex !== -1) {
      this.feeReportArray[findex].main_text_class =
        'text-left inline-flex main-text-container';
      this.feeReportArray[findex].report_main_image_class = 'report-main-image';
      this.feeReportArray[findex].report_middle_class = 'report-middle inline-flex';
      this.feeReportArray[findex].report_check_icon_class =
        'report-check-icon fas fa-check-circle';
      this.reportHeader = this.feeReportArray[findex].report_name;
      this.reportType = report_id;
    }
    this.previousIndex = findex;
    setTimeout(() => this.reportFlag = false, 500);
    setTimeout(() => this.accountFlag = true, 500);
  }
  switchReport() {
    this.accountFlag = false;
    this.reportFlag = true;
  }
  getClassPerIndex(index) {
    if (index === 0 || index === 5 || index === 10) {
      return 'col-12 col-lg-2  col-md-6 col-sm-6';
    } else {
      return 'col-12 col-lg-2  col-md-6 col-sm-6';
    }
  }
  displyRep($event) {
    this.reportHeader = $event.report_name;
  }
  isExistUserAccessMenu(actionT) {
    if (actionT === '1') {
      return this.CommonAPIService.isExistUserAccessMenu('492');
    }
    if (actionT === '2') {
      return this.CommonAPIService.isExistUserAccessMenu('592');
    }
    if (actionT === '3') {
      return this.CommonAPIService.isExistUserAccessMenu('616');
    }
    if (actionT === '4') {
      return this.CommonAPIService.isExistUserAccessMenu('640');
    }
    if (actionT === '5') {
      return this.CommonAPIService.isExistUserAccessMenu('968');
    }
  }
}
