import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonAPIService, SisService } from '../../_services/index';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss']
})
export class ChangeStatusComponent implements OnInit {
  changeEnrolmentStatusForm: FormGroup;
  changeEnrollmentNumberData: any[] = [];
  reasonDataArray: any[] = [];
  events: string[] = [];
  showCancelDate = false;
  enrolmentPlaceholder = 'Enrolment';
  enrollMentToArray: any[] = [];
  viewFlag = false;
  showCancel = false;
  showLeft = false;
  showActive = false;
  change_status = '';
  empDetails: any = {};
  currentUser: any;
  disabledApiButton = false;
  constructor(private fbuild: FormBuilder, public sanitizer: DomSanitizer,
    private notif: CommonAPIService, private sisService: SisService,
    private router: Router,
    private route: ActivatedRoute) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
  }

  ngOnInit() {
    this.buildForm();
    this.getReason(16);
    localStorage.removeItem('change_enrolment_status_last_state');
  }

  buildForm() {
    this.changeEnrolmentStatusForm = this.fbuild.group({
      emp_id: '',
      emp_name: '',
      emp_designation: '',
      dol: '',
      emp_type: '',
      emplyoee_to: '',
      reason_id: '',
      remarks: '',
      cancel_date: ''
    });
  }


  getEmployeeData(event) {
    this.enrollMentToArray = [];
    if (event) {
      event.stopPropagation();
    }
    if (this.changeEnrolmentStatusForm.value.emp_id === '') {
      this.notif.showSuccessErrorMessage('Please choose employee id to get data', 'error');
    } else {
      this.notif.getEmployeeDetail({ "emp_id": Number(this.changeEnrolmentStatusForm.value.emp_id) }).subscribe((result: any) => {
        if (result) {
          this.empDetails = result;
          this.viewFlag = true;
          this.changeEnrolmentStatusForm.patchValue({
            emp_id: result.emp_id,
            emp_name: result.emp_name,
            emp_designation: result.emp_designation_detail ? result.emp_designation_detail.name : '',
            emp_type: result.emp_category_detail ? result.emp_category_detail.cat_name : '',
          });
          this.change_status = '';
          if (this.empDetails.emp_status === 'live') {
            this.enrollMentToArray.push({ id: 0, name: 'Left' });
          } else if (this.empDetails.emp_status === 'left') {
            this.enrollMentToArray.push({ id: 0, name: 'Live' });
          }
        } else {
          this.notif.showSuccessErrorMessage('No Record found for this Employee', 'error');
          this.changeEnrolmentStatusForm.reset();
        }
      });

    }
  }

  getReason(reason_type) {
    this.sisService.getReason({ reason_type: reason_type }).subscribe((result: any) => {
      if (result.status !== 'error') {
        this.reasonDataArray = result.data;
      } 
    });
  }
  saveEnrolmentStatus() {
    if (this.changeEnrolmentStatusForm.valid) {
      this.disabledApiButton = true;
      let inputJson: any = {};
      if (this.empDetails.emp_status === 'live') {
        inputJson = {
          emp_status: "left",
          emp_id: this.changeEnrolmentStatusForm.value.emp_id,
          "emp_salary_detail.emp_organisation_relation_detail.dol":
            new DatePipe('en-in').transform(this.changeEnrolmentStatusForm.value.dol, 'yyyy-MM-dd'),
          emp_left_log: {
            created_by: this.currentUser.login_id,
            created_date: this.notif.dateConvertion(new Date()),
            reason_id: this.changeEnrolmentStatusForm.value.emp_id,
            remarks: this.changeEnrolmentStatusForm.value.remarks,
          }
  
        };
      } else  if (this.empDetails.emp_status === 'left') {
        inputJson = {
          emp_status: "live",
          emp_id: this.changeEnrolmentStatusForm.value.emp_id,
          "emp_salary_detail.emp_organisation_relation_detail.doj":
            new DatePipe('en-in').transform(this.changeEnrolmentStatusForm.value.dol, 'yyyy-MM-dd'),
          emp_left_log: {
            created_by: this.currentUser.login_id,
            created_date: this.notif.dateConvertion(new Date()),
            reason_id: this.changeEnrolmentStatusForm.value.emp_id,
            remarks: this.changeEnrolmentStatusForm.value.remarks,
          }
  
        };
      }
      this.notif.updateEmployee(inputJson).subscribe((result: any) => {
        this.disabledApiButton = false;
        if (result) {
          this.notif.showSuccessErrorMessage('Status Change Successfully', 'success');
          this.reset();
          this.enrollMentToArray = [];
        }
      });

    } else {
      this.notif.showSuccessErrorMessage('Please fill all required fields', 'error');
    }
  }

  reset() {
    this.changeEnrolmentStatusForm.reset();
  }
}
