import { Component, OnInit, OnChanges, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormGroupDirective, FormControl, NgForm } from '@angular/forms';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService, ProcesstypeExamService } from '../../_services';
import { Router, ActivatedRoute, NavigationEnd, RouterStateSnapshot } from '@angular/router';
import { ErrorStateMatcher, MatDialog } from '@angular/material';
import { StudentRouteMoveStoreService } from '../student-route-move-store.service';
import { element } from '@angular/core/src/render3/instructions';
import { DatePipe } from '@angular/common';
import { isNgTemplate } from '@angular/compiler';
import { dateFilterCondition } from 'angular-slickgrid/app/modules/angular-slickgrid/filter-conditions/dateFilterCondition';
import * as Highcharts from 'highcharts';
import { roundToNearest } from 'angular-calendar/modules/common/util';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);

@Component({
  selector: 'app-student-academic-profile',
  templateUrl: './student-academic-profile.component.html',
  styleUrls: ['./student-academic-profile.component.css']
})
export class StudentAcademicProfileComponent implements OnInit {
  @Input() loginId: any;
  @Input() feeRenderId: any;
  @Output() next = new EventEmitter();
  @Output() prev = new EventEmitter();
  @Output() first = new EventEmitter();
  @Output() last = new EventEmitter();
  @Output() key = new EventEmitter();
  @Output() next2 = new EventEmitter();
  @Output() prev2 = new EventEmitter();
  @Output() first2 = new EventEmitter();
  @Output() last2 = new EventEmitter();
  @Output() key2 = new EventEmitter();
  @Output() processTypeEmit = new EventEmitter();
  @ViewChild('enrollmentFocus') enrollmentFocus: ElementRef;
  @ViewChild('myInput') myInput: ElementRef;
  currentDate = new Date();
  studentdetailsform: FormGroup;
  accountsForm: FormGroup;
  studentdetails: any = {};
  lastStudentDetails: any = {};
  lastrecordFlag = true;
  navigation_record: any = {};
  au_profileimage: any;
  minDate = new Date();
  maxDate = new Date();
  login_id;
  previousB = true;
  nextB = true;
  firstB = true;
  lastB = true;
  viewOnly = true;
  deleteOnly = true;
  editOnly = true;
  divFlag = false;
  stopFlag = false;
  addOnly = true;
  iddesabled = true;
  backOnly = false;
  defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
  classArray = [];
  sectionArray = [];
  houseArray = [];
  feeOtherCategory: any[] = [];
  feeStructureArray: any[] = [];
  conGroupArray: any[] = [];
  multipleFileArray: any[] = [];
  savedSettingsArray: any[] = [];
  settingsArray: any[] = [];
  enrolmentPlaceholder = 'Enrollment Id';
  deleteMessage = 'Are you sure, you want to delete ?';
  studentdetailsflag = false;
  firstGauge = false;
  lastRecordId;
  nextFlag = false;
  prevFlag = false;
  firstFlag = false;
  lastFlag = false;
  keyFlag = false;
  studentLoginId: any;
  processType: any = '';
  previousProcessType: any = '';
  previousAdmno: any = '';
  previousLoginId = '';
  class_name: any;
  section_name: any;
  class_sec: any;
  gender: any;
  absent = 0;
  present = 0;
  attendancePercentage = 0;
  gaugeOptions: any;
  startDate: any;
  studentClass: any;
  totalWorkingDay = 0;
  processTypeArray: any[] = [
    { id: '1', name: 'Enquiry No.' },
    { id: '2', name: 'Registration No.' },
    { id: '3', name: 'Provisional Admission No.' },
    { id: '4', name: 'Admission No.' }
  ];

  constructor(
    private fbuild: FormBuilder,
    private sisService: SisService,
    private router: Router,
    private route: ActivatedRoute,
    private examService: ExamService,
    private commonAPIService: CommonAPIService,
    private smartService: SmartService,
    public processtypeService: ProcesstypeExamService,
    public studentRouteMoveStoreService: StudentRouteMoveStoreService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.buildForm();
    if (this.studentRouteMoveStoreService.getProcesRouteType()) {
      this.processType = this.studentRouteMoveStoreService.getProcesRouteType();
    } else {
      this.processType = '4';
    }
    this.processtypeService.setProcesstype(this.processType);
    const currentUrl = this.route.snapshot.routeConfig.path;
    if (currentUrl !== '') {
      if (currentUrl === 'invoice-creation-individual') {
      } else if (currentUrl === 'student-profile') {
      } else if (currentUrl === 'fee-ledger') {
      } else if (currentUrl === 'fee-transaction-entry-individual') {
      }
    }
    // document.getElementById('blur_id').focus();
    const fe = <HTMLInputElement>this.enrollmentFocus.nativeElement;
    fe.focus();
    fe.select();
  }
  goToPage(url) {
    this.router.navigate([`../${url}`], { relativeTo: this.route });
  }
  ngOnChanges() {
    if (this.loginId) {
      this.studentdetailsflag = true;
      this.getStudentInformation(this.loginId);
    }
    if (this.feeRenderId) {
      this.studentdetailsflag = true;
      this.getStudentInformation(this.feeRenderId);
    }
    // document.getElementById('blur_id').focus();
    const fe = <HTMLInputElement>this.enrollmentFocus.nativeElement;
    fe.focus();
    fe.select();
  }
  buildForm() {
    this.studentdetailsform = this.fbuild.group({
      au_profileimage: '',
      au_enrollment_id: '',
      au_login_id: '',
      au_full_name: '',
      au_class_id: '',
      au_mobile: '',
      au_email: '',
      au_hou_id: '',
      au_sec_id: '',
      epd_parent_name: '',
      epd_contact_no: '',
      epd_whatsapp_no: '',
      mi_emergency_contact_name: '',
      mi_emergency_contact_no: ''
    });
  }
  HighChartOption() {
    this.gaugeOptions = {
      chart: {
        type: 'solidgauge',
        height: 120,
        width: 120,
        events: {
          render: ''
        }
      },

      title: {
        text: '',
        style: {
          fontSize: '10px'
        }
      },

      tooltip: {
        borderWidth: 0,
        backgroundColor: 'none',
        shadow: false,
        style: {
          fontSize: '14px'
        },
        pointFormat: '{series.name}<br><span style="font-size:16px; color: {point.color}; font-weight: bold;">{point.y}</span>',
        positioner: function (labelWidth) {
          return {
            x: (this.chart.chartWidth - labelWidth) / 40,
            y: (this.chart.plotHeight / 2) - 117
          };
        }
      },

      pane: {
        startAngle: 0,
        endAngle: 360,
        background: [{ // Track for Highest
          outerRadius: '100%',
          innerRadius: '80%',
          backgroundColor: '#E5E5E5',
          borderWidth: 0
        }]
      },

      yAxis: {
        min: 0,
        max: '',
        lineWidth: 0,
        tickPositions: []
      },

      plotOptions: {
        solidgauge: {
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          linecap: '',
          stickyTracking: false,
        }
      },

      series: [{
        name: 'Attendance',
        data: [{
          color: '#4DB848',
          radius: '100%',
          innerRadius: '80%',
          y: ''
        }]
      }]
    };
  }
  getStudentInformation(au_login_id) {
    this.studentLoginId = '';
    if (au_login_id && this.studentdetailsflag) {
      this.studentdetailsflag = false;
      this.sisService
        .getStudentInformation({ au_login_id: au_login_id, au_status: '1' })
        .subscribe((result: any) => {
          if (result && result.status === 'ok') {
            this.studentRouteMoveStoreService.setProcessTypePrev(this.processType);
            this.nextB = true;
            this.firstB = true;
            this.lastB = true;
            this.previousB = true;
            this.studentdetails = [];
            if (result && result.data && result.data[0]) {
              this.studentdetails = result.data[0];
              this.previousLoginId = this.studentdetails.au_login_id;
              this.gender = this.studentdetails.au_gender;
              this.studentClass = this.studentdetails.au_class_id;
              this.getStudentAttendance(this.previousLoginId);
              this.getGlobalSetting();
              if (this.gender === 'M') {
                this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png';
              } else if (this.gender === 'F') {
                this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.png';
              } else {
                this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
              }
              this.class_name = this.studentdetails.class_name;
              this.section_name = this.studentdetails.sec_name;
              if (this.section_name !== ' ') {
                this.class_sec = this.class_name + ' - ' + this.section_name;
              } else {
                this.class_sec = this.class_name;
              }
              if (Number(this.processType) === 4) {
                this.studentRouteMoveStoreService.setRouteStore(
                  this.studentdetails.em_admission_no,
                  this.studentdetails.au_login_id
                );
                this.studentRouteMoveStoreService.setProcessRouteType(
                  this.processType
                );
              } else if (Number(this.processType) === 3) {
                this.studentRouteMoveStoreService.setRouteStore(
                  this.studentdetails.em_provisional_admission_no,
                  this.studentdetails.au_login_id
                );
                this.studentRouteMoveStoreService.setProcessRouteType(
                  this.processType
                );
              } else if (Number(this.processType) === 2) {
                this.studentRouteMoveStoreService.setRouteStore(
                  this.studentdetails.em_regd_no,
                  this.studentdetails.au_login_id
                );
                this.studentRouteMoveStoreService.setProcessRouteType(
                  this.processType
                );
              } else if (Number(this.processType) === 1) {
                this.studentRouteMoveStoreService.setRouteStore(
                  this.studentdetails.em_enq_no,
                  this.studentdetails.au_login_id
                );
                this.studentRouteMoveStoreService.setProcessRouteType(
                  this.processType
                );
              } else if (Number(this.processType) === 5) {
                this.studentRouteMoveStoreService.setRouteStore(
                  this.studentdetails.em_alumini_no,
                  this.studentdetails.au_login_id
                );
                this.studentRouteMoveStoreService.setProcessRouteType(
                  this.processType
                );
              }
              this.studentLoginId = this.studentdetails.au_login_id;
              if (Number(this.processType) === 4) {
                this.previousAdmno = this.studentdetails.em_admission_no;
                if (this.nextFlag) {
                  this.next.emit(this.studentLoginId);
                  this.next2.emit(this.studentdetails.em_admission_no);
                }
                if (this.prevFlag) {
                  this.prev.emit(this.studentLoginId);
                  this.prev2.emit(this.studentdetails.em_admission_no);
                }
                if (this.firstFlag) {
                  this.first.emit(this.studentLoginId);
                  this.first2.emit(this.studentdetails.em_admission_no);
                }
                if (this.lastFlag) {
                  this.last.emit(this.studentLoginId);
                  this.last2.emit(this.studentdetails.em_admission_no);
                }
                if (this.keyFlag) {
                  this.key.emit(this.studentLoginId);
                  this.key2.emit(this.studentdetails.em_admission_no);
                }
              } else if (Number(this.processType) === 2) {
                this.previousAdmno = this.studentdetails.em_regd_no;
                if (this.nextFlag) {
                  this.next.emit(this.studentLoginId);
                  this.next2.emit(this.studentdetails.em_regd_no);
                }
                if (this.prevFlag) {
                  this.prev.emit(this.studentLoginId);
                  this.prev2.emit(this.studentdetails.em_regd_no);
                }
                if (this.firstFlag) {
                  this.first.emit(this.studentLoginId);
                  this.first2.emit(this.studentdetails.em_regd_no);
                }
                if (this.lastFlag) {
                  this.last.emit(this.studentLoginId);
                  this.last2.emit(this.studentdetails.em_regd_no);
                }
                if (this.keyFlag) {
                  this.key.emit(this.studentLoginId);
                  this.key2.emit(this.studentdetails.em_regd_no);
                }
              } else if (Number(this.processType) === 3) {
                this.previousAdmno = this.studentdetails.em_provisional_admission_no;
                if (this.nextFlag) {
                  this.next.emit(this.studentLoginId);
                  this.next2.emit(
                    this.studentdetails.em_provisional_admission_no
                  );
                }
                if (this.prevFlag) {
                  this.prev.emit(this.studentLoginId);
                  this.prev2.emit(
                    this.studentdetails.em_provisional_admission_no
                  );
                }
                if (this.firstFlag) {
                  this.first.emit(this.studentLoginId);
                  this.first2.emit(
                    this.studentdetails.em_provisional_admission_no
                  );
                }
                if (this.lastFlag) {
                  this.last.emit(this.studentLoginId);
                  this.last2.emit(
                    this.studentdetails.em_provisional_admission_no
                  );
                }
                if (this.keyFlag) {
                  this.key.emit(this.studentLoginId);
                  this.key2.emit(
                    this.studentdetails.em_provisional_admission_no
                  );
                }
              } else if (Number(this.processType) === 1) {
                this.previousAdmno = this.studentdetails.em_enq_no;
                if (this.nextFlag) {
                  this.next.emit(this.studentLoginId);
                  this.next2.emit(this.studentdetails.em_enq_no);
                }
                if (this.prevFlag) {
                  this.prev.emit(this.studentLoginId);
                  this.prev2.emit(this.studentdetails.em_enq_no);
                }
                if (this.firstFlag) {
                  this.first.emit(this.studentLoginId);
                  this.first2.emit(this.studentdetails.em_enq_no);
                }
                if (this.lastFlag) {
                  this.last.emit(this.studentLoginId);
                  this.last2.emit(this.studentdetails.em_enq_no);
                }
                if (this.keyFlag) {
                  this.key.emit(this.studentLoginId);
                  this.key2.emit(this.studentdetails.em_enq_no);
                }
              } else if (Number(this.processType) === 5) {
                this.previousAdmno = this.studentdetails.em_alumini_no;
                if (this.nextFlag) {
                  this.next.emit(this.studentLoginId);
                  this.next2.emit(this.studentdetails.em_alumini_no);
                }
                if (this.prevFlag) {
                  this.prev.emit(this.studentLoginId);
                  this.prev2.emit(this.studentdetails.em_alumini_no);
                }
                if (this.firstFlag) {
                  this.first.emit(this.studentLoginId);
                  this.first2.emit(this.studentdetails.em_alumini_no);
                }
                if (this.lastFlag) {
                  this.last.emit(this.studentLoginId);
                  this.last2.emit(this.studentdetails.em_alumini_no);
                }
                if (this.keyFlag) {
                  this.key.emit(this.studentLoginId);
                  this.key2.emit(this.studentdetails.em_alumini_no);
                }
              }
            }
            if (result && result.data && result.data[0].navigation[0]) {
              this.navigation_record = result.data[0].navigation[0];
            }
            if (this.processtypeService.getProcesstype() === '4') {
              this.studentdetailsform.patchValue({
                au_enrollment_id: this.studentdetails.em_admission_no
              });
            } else if (this.processtypeService.getProcesstype() === '2') {
              this.studentdetailsform.patchValue({
                au_enrollment_id: this.studentdetails.em_regd_no
              });
            } else if (this.processtypeService.getProcesstype() === '1') {
              this.studentdetailsform.patchValue({
                au_enrollment_id: this.studentdetails.em_enq_no
              });
            } else if (this.processtypeService.getProcesstype() === '3') {
              this.studentdetailsform.patchValue({
                au_enrollment_id: this.studentdetails
                  .em_provisional_admission_no
              });
            }
            this.studentdetailsform.patchValue({
              au_profileimage: this.studentdetails.au_profileimage
                ? this.studentdetails.au_profileimage
                : this.defaultsrc,
              au_login_id: this.studentdetails.au_login_id
            });
            this.defaultsrc =
              this.studentdetails.au_profileimage !== ''
                ? this.studentdetails.au_profileimage
                : this.defaultsrc;
            if (this.navigation_record) {
              this.viewOnly = true;
              if (
                this.navigation_record.first_record &&
                this.navigation_record.first_record !==
                this.studentdetailsform.value.au_enrollment_id &&
                this.viewOnly
              ) {
                this.firstB = false;
              }
              if (
                this.navigation_record.last_record &&
                this.navigation_record.last_record !==
                this.studentdetailsform.value.au_enrollment_id &&
                this.viewOnly
              ) {
                this.lastB = false;
              }
              if (this.navigation_record.next_record && this.viewOnly) {
                this.nextB = false;
              }
              if (this.navigation_record.prev_record && this.viewOnly) {
                this.previousB = false;
              }
            }
            this.loginId = '';
            this.feeRenderId = '';

            //myInput.select()
            const inputElem = <HTMLInputElement>this.myInput.nativeElement;
            inputElem.select();
          } else {
            // this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
            this.processtypeService.setProcesstype(this.studentRouteMoveStoreService.getProcessTypePrev());
            this.processType = this.studentRouteMoveStoreService.getProcessTypePrev();
            this.nextId(this.previousAdmno);
            this.next.emit(this.previousLoginId);
          }
        });
    }
  }
  loadOnEnrollmentId($event) {
    this.keyFlag = false;
    this.keyFlag = true;
    $event.preventDefault();
    this.getStudentDetailsByAdmno($event.target.value);
    document.getElementById('blur_id').blur();
  }
  getStudentDetailsByAdmno(admno) {
    this.studentdetailsflag = true;
    this.getStudentInformation(admno);
  }
  nextId(admno) {
    console.log(admno);
    this.nextFlag = false;
    this.prevFlag = false;
    this.firstFlag = false;
    this.lastFlag = false;
    this.nextFlag = true;
    this.getStudentDetailsByAdmno(admno);
    // this.studentRouteMoveStoreService.setRouteStore(admno, null);
  }
  prevId(admno) {
    this.nextFlag = false;
    this.prevFlag = false;
    this.firstFlag = false;
    this.lastFlag = false;
    this.prevFlag = true;
    this.getStudentDetailsByAdmno(admno);
    // this.studentRouteMoveStoreService.setRouteStore(admno, null);
  }
  firstId(admno) {
    this.nextFlag = false;
    this.prevFlag = false;
    this.firstFlag = false;
    this.lastFlag = false;
    this.firstFlag = true;
    this.getStudentDetailsByAdmno(admno);
    // this.studentRouteMoveStoreService.setRouteStore(admno, null);
  }
  lastId(admno) {
    this.nextFlag = false;
    this.prevFlag = false;
    this.firstFlag = false;
    this.lastFlag = false;
    this.lastFlag = true;
    this.getStudentDetailsByAdmno(admno);
    // this.studentRouteMoveStoreService.setRouteStore(admno, null);
  }
  changeProcessType($event) {
    this.processType = $event.value;
    this.processtypeService.setProcesstype(this.processType);
    this.processTypeEmit.emit(this.processType);
  }
  parent_type_fun(type: any) {
    if (type.parentinfo && type.parentinfo.length > 0 && type.parentinfo[0].epd_parent_type === 'F') {
      return 'Father\'s Name';
    } else if (type.parentinfo && type.parentinfo.length > 0 && type.parentinfo[0].epd_parent_type === 'M') {
      return 'Mother\'s Name';
    } else if (type.parentinfo && type.parentinfo.length > 0 && type.parentinfo[0].epd_parent_type === 'G') {
      return 'Guardian\'s Name';
    } else {
      return 'Active Parent Name';
    }
  }
  getGlobalSetting() {
    let param: any = {};
    param.gs_name = ['school_session_start_date'];
    this.examService.getGlobalSetting(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.startDate = result.data[0]['gs_value'];
        let workingDayParam: any = {};
        workingDayParam.datefrom = this.startDate;
        workingDayParam.dateto =  this.commonAPIService.dateConvertion(this.currentDate);
        workingDayParam.class_id = this.studentClass;
        this.smartService.GetHolidayDays(workingDayParam).subscribe((result: any) => {
          if (result && result.status === 'ok') {
              this.totalWorkingDay = result.data.workingDay;
          }
        }
        );
      }
    });
  }

  getStudentAttendance(au_login_id) {
    this.firstGauge = false;
    this.present = 0;
    this.absent = 0;
    this.attendancePercentage = 0;
    this.savedSettingsArray
    this.examService.getStudentAttendance({ login_id: au_login_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.HighChartOption();
        for (const item of result.data) {
          if (Number(item.ma_attendance) === 1) {
            this.present = Number(item.count);
          } else {
            this.absent = Number(item.count);
          }
        }
        this.attendancePercentage = Math.round((this.present * 100) / (this.totalWorkingDay));
        this.gaugeOptions.yAxis.max = this.totalWorkingDay;
        this.gaugeOptions.series[0].data[0].y = this.present;
        this.firstGauge = true;
      }
    });
  }

}
