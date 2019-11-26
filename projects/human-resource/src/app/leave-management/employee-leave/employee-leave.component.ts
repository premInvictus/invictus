import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { CommonAPIService } from '../../_services/index';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EmployeeLeave } from './employee-leave.model';
import { ChangeSupervisorComponent } from './change-supervisor/change-supervisor.component';

@Component({
  selector: 'app-employee-leave',
  templateUrl: './employee-leave.component.html',
  styleUrls: ['./employee-leave.component.scss']
})
export class EmployeeLeaveComponent implements OnInit {
  @ViewChild('myLeavePaginator') myLeavePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currentUser: any;
  employeeArray: any[] = [];
  myLeaveDisplayedColumns: string[] = ['srno', 'leave_date', 'leave_type', 'leave_no_of_days', 'leave_reason', 'leave_to', 'action'];
  MY_LEAVE_ELEMENT_DATA: EmployeeLeave[] = [];
  myLeaveDataSource = new MatTableDataSource<EmployeeLeave>(this.MY_LEAVE_ELEMENT_DATA);
  constructor(
    private common: CommonAPIService,
    public dialog: MatDialog
  ) { this.currentUser = JSON.parse(localStorage.getItem('currentUser')); }

  ngOnInit() {
    this.getMyLeave();
    this.getAllEpmployeeList();
  }
  ngAfterViewInit() {
    this.myLeaveDataSource.paginator = this.myLeavePaginator;
  }

  myLeaveFilter(value: any) {
    this.myLeaveDataSource.filter = value.trim().toLowerCase();
  }
  getMyLeave() {
    const datePipe = new DatePipe('en-in');
    this.MY_LEAVE_ELEMENT_DATA = [];
    this.myLeaveDataSource = new MatTableDataSource<EmployeeLeave>(this.MY_LEAVE_ELEMENT_DATA);
    this.common.getAllEmployeeLeaveData().subscribe((result: any) => {
      if (result) {
        let pos = 1;
        for (const item of result) {
          var leave_request_schedule_data = item.leave_request_schedule_data;
          var dataJson = {
            srno: pos,
            leave_date: datePipe.transform(item.leave_start_date, 'MMMM d, y') + ' - ' + datePipe.transform(item.leave_end_date, 'MMMM d, y'),
            leave_type: item.leave_type.leave_type_name,
            leave_no_of_days: leave_request_schedule_data.length,
            status: 'Pending',
            leave_reason: item.leave_reason,
            leave_to: item.leave_to,
            action: item
          };
          this.MY_LEAVE_ELEMENT_DATA.push(dataJson);
          pos++;
        }
        this.myLeaveDataSource = new MatTableDataSource<EmployeeLeave>(this.MY_LEAVE_ELEMENT_DATA);
        this.myLeaveDataSource.paginator = this.myLeavePaginator;
        if (this.sort) {
          this.sort.sortChange.subscribe(() => this.myLeavePaginator.pageIndex = 0);
          this.myLeaveDataSource.sort = this.sort;
        }
      }
    });
  }
  editLeave(item) {
    const dialogRef = this.dialog.open(ChangeSupervisorComponent, {
      width: '20%',
      height: '25%',
      data: item
    });
    dialogRef.afterClosed().subscribe(dresult => {
      this.update(dresult.data);

    });
  }
  update(result) {
    var inputJson = {};
    inputJson['leave_to'] = result.change_supervisor;
    inputJson['leave_from'] = result.emp_login_id;
    inputJson['leave_id'] = result.leave_id;
    this.common.updateEmployeeLeaveData(inputJson).subscribe((result: any) => {
      if (result) {
        this.common.showSuccessErrorMessage('Supervisor Changed Successfully', 'success');
        this.getMyLeave();
      } else {
        this.common.showSuccessErrorMessage('Error While Changed Supervisor', 'error');
      }
    });
  }

  getAllEpmployeeList() {
    this.common.getAllEmployee({ 'emp_status': 'live' }).subscribe((result: any) => {
      if (result && result.length > 0) {
        this.employeeArray = result;
      }
    });
  }
  getSupervisorName(id) {
    const findIndex = this.employeeArray.findIndex(f => Number(f.emp_login_id) === Number(id));
    if (findIndex !== -1) {
      return this.employeeArray[findIndex].emp_name;
    }
  }
}
