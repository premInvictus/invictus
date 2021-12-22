import { Component, OnInit, Output, Input, EventEmitter, OnChanges, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AxiomService, SisService, SmartService, CommonAPIService,TransportService } from '../../../_services';

@Component({
  selector: 'app-vehicle-common-profile',
  templateUrl: './vehicle-common-profile.component.html',
  styleUrls: ['./vehicle-common-profile.component.scss']
})
export class VehicleCommonProfileComponent implements OnInit {

  @Input() vehicleDetails: any;
  @Output() next = new EventEmitter();
  @Output() prev = new EventEmitter();
  @Output() first = new EventEmitter();
  @Output() last = new EventEmitter();
  @Output() key = new EventEmitter();
  previousB: boolean;
  nextB: boolean;
  balanceLeaves: any = 0;
  currentEmployeeCode = 0;
  firstB: boolean;
  lastB: boolean;
  defaultsrc: any;
  navigation_record: any;
  navigation_record_sec: any;
  remaining_security_deposit = 0;
  security_session = '0';
  present_session = '0';
  @Input() total: any = {};
  viewOnly: boolean;
  @ViewChild('myInput') myInput: ElementRef;
  vehicleDetailsForm: FormGroup;
  @ViewChild('busnoref') busnoref: ElementRef;
  constructor(private commonAPIService: CommonAPIService,
    private dialog: MatDialog,
    private fbuild: FormBuilder,
    private router: Router,
    private transportService : TransportService
    ) { }
  ngOnInit() {
    
    // this.buildForm();
    this.present_session = JSON.parse(localStorage.getItem('session')).ses_id;
  }
  buildForm() {
    this.vehicleDetailsForm = this.fbuild.group({
      tv_id: '',
      bus_number: ''
    });

  }
  ngOnChanges() {
    // if (this.loginId) {
    //   this.getEmployeeDetail(this.loginId);
    // }
    this.buildForm();
    console.log('vehicleDetails',this.vehicleDetails);
    this.prepareDetails()
  }
  prepareDetails(){
    this.previousB = true;
    this.nextB = true;
    this.firstB = true;
    this.lastB = true;
    this.vehicleDetailsForm.patchValue({
      tv_id: this.vehicleDetails.tv_id,
      bus_number: this.vehicleDetails.bus_number
    });
    if (this.vehicleDetails.bus_image) {
      this.defaultsrc = this.vehicleDetails.bus_image
    } else {
      this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
    }
    this.navigation_record = this.vehicleDetails.navigation;
    this.navigation_record_sec = this.vehicleDetails.navigation_sec;
    
    if (this.navigation_record) {
      if (this.navigation_record.first_record &&
        this.navigation_record.first_record !== this.vehicleDetailsForm.value.bus_number) {
        this.firstB = false;
      }
      if (this.navigation_record.last_record &&
        this.navigation_record.last_record !== this.vehicleDetailsForm.value.bus_number) {
        this.lastB = false;
      }
      if (this.navigation_record.next_record) {
        this.nextB = false;
      }
      if (this.navigation_record.prev_record) {
        this.previousB = false;
      }
    }
    const inputElem = <HTMLInputElement>this.myInput.nativeElement;
    inputElem.select();
  }
  getEmployeeDetail2(bus_number) {

    if (bus_number) {
      this.currentEmployeeCode = bus_number;
      this.previousB = true;
      this.nextB = true;
      this.firstB = true;
      this.lastB = true;
      //this.setActionControls({viewMode : true})
      this.commonAPIService.getEmployeeDetail({ bus_number: Number(bus_number) }).subscribe((result: any) => {
        if (result) {
          this.key.emit(
            {
              tv_id: result.tv_id,
              bus_number: result.bus_number,
            }
          );
          this.vehicleDetails = result;
          if (this.vehicleDetails.emp_month_attendance_data &&
            this.vehicleDetails.emp_month_attendance_data.month_data
            && this.vehicleDetails.emp_month_attendance_data.month_data.length > 0) {
            for (const item of this.vehicleDetails.emp_month_attendance_data.month_data) {
              if (item.attendance_detail && item.attendance_detail.emp_balance_leaves) {
                this.balanceLeaves = item.attendance_detail.emp_balance_leaves;
              }
            }
          }
          this.vehicleDetailsForm.patchValue({
            tv_id: result.tv_id,
            bus_number: result.bus_number
          });
          if (result.bus_image) {
            this.defaultsrc = this.vehicleDetails.bus_image
          } else {
            this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
          }
          this.navigation_record = this.vehicleDetails.navigation;
          this.navigation_record_sec = this.vehicleDetails.navigation_sec;
          //this.vehicleDetails['last_record'] = tv_id;

        }

        if (this.navigation_record) {
          if (this.navigation_record.first_record &&
            this.navigation_record.first_record !== this.vehicleDetailsForm.value.bus_number) {
            this.firstB = false;
          }
          if (this.navigation_record.last_record &&
            this.navigation_record.last_record !== this.vehicleDetailsForm.value.bus_number) {
            this.lastB = false;
          }
          if (this.navigation_record.next_record) {
            this.nextB = false;
          }
          if (this.navigation_record.prev_record) {
            this.previousB = false;
          }
        }

        const inputElem = <HTMLInputElement>this.myInput.nativeElement;
        inputElem.select();

      });
    }
  }
  nextId(tv_id, em_id) {
    // this.getEmployeeDetail(tv_id);
    this.next.emit({
      tv_id: em_id,
      bus_number: tv_id
    });
  }
  loadOnEnrollmentId($event) {
    // this.getEmployeeDetail2($event.target.value);
  }
  lastId(tv_id, em_id) {
    // this.getEmployeeDetail(tv_id);
    this.last.emit(
      {
        tv_id: em_id,
        bus_number: tv_id
      }
    );
  }
  prevId(bus_number) {
    console.log('inside vehicle-common',bus_number);
    // this.getEmployeeDetail(tv_id);
    this.prev.emit(
      {
        bus_number: bus_number,
      }
    );
  }
  firstId(tv_id, em_id) {
    // this.getEmployeeDetail(tv_id);
    this.first.emit(
      {
        tv_id: em_id,
        bus_number: tv_id
      }
    );
  }

  goToEmployee() {
    console.log('currentEmployeeCode--', this.currentEmployeeCode)
    // this.commonAPIService.setSubscribedEmployee(this.currentEmployeeCode);
    this.router.navigateByUrl('hr/school/employee/employee-details');
  }

  goToLeave() {
    this.router.navigateByUrl('hr/school/leave-management/my-leave');
  }

}
