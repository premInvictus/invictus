import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonAPIService } from '../../_services/index';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import { SearchViaNameComponent } from '../../misc-shared/search-via-name/search-via-name.component';
import { CallRemarksComponent } from '../../misc-shared/call-remarks/call-remarks.component';
import { CallLogRemarksModalComponent } from '../../misc-shared/call-log-remarks-modal/call-log-remarks-modal.component';
import { CapitalizePipe } from '../../_pipes';

@Component({
  selector: 'app-call-logs',
  templateUrl: './call-logs.component.html',
  styleUrls: ['./call-logs.component.css']
})
export class CallLogsComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  USER_ELEMENT_DATA: any[] = [];
  selectedUserArr: any[] = [];
  allUserSelectFlag = false;
  currentTab = 0;
  currentUser: any;
  url: any;
  displayedColumns = ['no', 'start_time', 'call_id', 'destination', 'from_caller', 'call_duration', 'to_DID', 'call_type', 'remarks', 'media_s3_url'];
  DataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);
  constructor(
    private commonAPIService: CommonAPIService,
    public dialog: MatDialog
  ) { this.currentUser = JSON.parse(localStorage.getItem('currentUser')); }


  ngOnInit() {
    this.DataSource.sort = this.sort;
    this.getCallLogs('Incoming');
  }

  changeTab(event) {
    this.currentTab = event.index;
    console.log(this.currentTab);
    if (this.currentTab) {
      this.getCallLogs('Outgoing');
    } else {
      this.getCallLogs('Incoming');
    }
  }

  getCallLogs(value) {
    this.USER_ELEMENT_DATA = [];
    this.commonAPIService.getCallLogs({ 'call_type': value }).subscribe((result: any) => {
      if (result && result.data) {
        this.DataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);
        let counter = 1;
        for (let item of result.data) {
          const tempObj = {};
          tempObj['no'] = counter;
          tempObj['call_id'] = item.call_id ? item.call_id : '';
          tempObj['destination'] = item.destination ? item.destination : '';
          tempObj['from_caller'] = item.from_caller ? item.from_caller : '';
          tempObj['media_s3_url'] = item.media_s3_url ? item.media_s3_url : '';
          tempObj['start_time'] = item.start_time ? item.start_time : '';
          tempObj['call_duration'] = item.call_duration ? item.call_duration : '';
          tempObj['to_DID'] = item.to_DID ? item.to_DID : '';
          tempObj['call_type'] = item.call_type ? item.call_type : '';
          tempObj['remarks'] = item.from_caller ? item.from_caller : '';
          this.USER_ELEMENT_DATA.push(tempObj);
          counter++;
        }
        this.DataSource = new MatTableDataSource(this.USER_ELEMENT_DATA);
        this.DataSource.paginator = this.paginator;
        if (this.sort) {
          this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
          this.DataSource.sort = this.sort;
        }
      }
    });
  }

  applyFilterUser(filterValue: string) {
    if (filterValue) {
      this.DataSource.filter = filterValue.trim();
    }
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
    diaogRef.afterClosed().subscribe((result_m: any) => {
      if (result_m) {
        this.commonAPIService.getAllEmployeeDetail({ "emp_login_id": this.currentUser.login_id }).subscribe((result: any) => {
          if (result[0] && result[0].emp_personal_detail && result[0].emp_personal_detail.contact_detail &&
            result[0].emp_personal_detail.contact_detail.primary_mobile_no) {
            const parm: any = {
              user_no: result_m.contact_no,
              agent_no: result[0].emp_personal_detail.contact_detail.primary_mobile_no,
              start_time: new Date().getTime() / 1000,
              login_id: this.currentUser.login_id
            }
            this.commonAPIService.callToStudent(parm).subscribe((result_n: any) => {
              if (result_n) {
                const diaogRef = this.dialog.open(CallRemarksComponent, {
                  width: '30%',
                  height: '35%',
                  disableClose: true,
                  position: {
                    top: '10%'
                  },
                });
                diaogRef.afterClosed().subscribe((result_o: any) => {
                  if (result_o) {
                    this.commonAPIService.callRemarksUpdate({ 'id': result_n._id, 'remarks': result_o.req_reason_text }).subscribe((result_p: any) => {
                      this.getCallLogs('Outgoing');
                      this.commonAPIService.showSuccessErrorMessage('Call Logs Updated Successfully', 'success');
                    });
                  }
                })
              }
            });
          } else {
            this.commonAPIService.showSuccessErrorMessage('Agent Number is not available', 'error');
          }
        });
      }
    });
  }
  openRemarkDialog(from_caller) {
    const diaogRef = this.dialog.open(CallLogRemarksModalComponent, {
      width: '50%',
      height: '50%',
      position: {
        top: '10%'
      },
      data: { 'from_caller': from_caller }
    });
  }
}



