import { Component, OnInit, Output, Input, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonAPIService } from '../../_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SearchViaNameComponent } from '../../hr-shared/search-via-name/search-via-name.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-emp-common-profile',
  templateUrl: './emp-common-profile.component.html',
  styleUrls: ['./emp-common-profile.component.scss']
})
export class EmpCommonProfileComponent implements OnInit, OnChanges {
  @Input() loginId: any;
  employeeDetails: any = {}
  @Output() next = new EventEmitter();
  @Output() prev = new EventEmitter();
  @Output() first = new EventEmitter();
  @Output() last = new EventEmitter();
  @Output() key = new EventEmitter();
  previousB: boolean;
  nextB: boolean;
  balanceLeaves : any = 0;
  firstB: boolean;
  lastB: boolean;
  defaultsrc: any;
  navigation_record: any;
  @Input() total : any = {};
  viewOnly: boolean;
  @ViewChild('myInput') myInput: ElementRef;
  employeeDetailsForm: FormGroup;
  constructor(private commonAPIService: CommonAPIService,
    private dialog : MatDialog,
    private fbuild: FormBuilder) { }
  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.employeeDetailsForm = this.fbuild.group({
      emp_id: ''
    });

  }
  ngOnChanges() {
    if (this.loginId) {
      this.getEmployeeDetail(this.loginId);
    }
  }
  getEmployeeDetail(emp_id) {
    if (emp_id) {
      this.previousB = true;
      this.nextB = true;
      this.firstB = true;
      this.lastB = true;
      //this.setActionControls({viewMode : true})
      this.commonAPIService.getEmployeeDetail({ emp_id: Number(emp_id) }).subscribe((result: any) => {
        if (result) {
          this.employeeDetails = result;
          if (this.employeeDetails.emp_month_attendance_data && 
            this.employeeDetails.emp_month_attendance_data.month_data 
            && this.employeeDetails.emp_month_attendance_data.month_data.length > 0) {
              for (const item of this.employeeDetails.emp_month_attendance_data.month_data) {
                if (item.attendance_detail && item.attendance_detail.emp_balance_leaves) {
                  this.balanceLeaves = item.attendance_detail.emp_balance_leaves;
                }
              }
            }
          this.employeeDetailsForm.patchValue({
            emp_id: result.emp_id,
          });
          if (result.emp_profile_pic) {
            this.defaultsrc = this.employeeDetails.emp_profile_pic
          } else {
            this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
          }
          this.navigation_record = this.employeeDetails.navigation;
          //this.employeedetails['last_record'] = emp_id;
        }

        if (this.navigation_record) {
          if (this.navigation_record.first_record &&
            this.navigation_record.first_record !== this.employeeDetailsForm.value.emp_id) {
            this.firstB = false;
          }
          if (this.navigation_record.last_record &&
            this.navigation_record.last_record !== this.employeeDetailsForm.value.emp_id) {
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
  nextId(emp_id) {
    this.getEmployeeDetail(emp_id);
    this.next.emit(emp_id);
  }
  lastId(emp_id) {
    this.getEmployeeDetail(emp_id);
    this.last.emit(emp_id);
  }
  prevId(emp_id) {
    this.getEmployeeDetail(emp_id);
    this.prev.emit(emp_id);
  }
  firstId(emp_id) {
    this.getEmployeeDetail(emp_id);
    this.first.emit(emp_id);
  }
  openSearchDialog() {
		const diaogRef = this.dialog.open(SearchViaNameComponent, {
			width: '20%',
			height: '30%',
			position: {
				top: '10%'
			},
			data: {}
		});
		diaogRef.afterClosed().subscribe((result: any) => {
			if (result && result.emp_id) {
        this.getEmployeeDetail(result.emp_id);
        this.next.emit(result.emp_id);
			}
		});
	}
}
