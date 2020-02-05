import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonAPIService } from '../../_services/index';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

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
  displayedColumns = ['no', 'start_time', 'call_id', 'destination', 'from_caller', 'call_duration', 'to_DID', 'call_type', 'media_s3_url'];
  DataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);
  constructor(
    private commonAPIService: CommonAPIService
  ) { }

  ngOnInit() {
    this.DataSource.sort = this.sort;
    this.getCallLogs();
  }

  getCallLogs() {
    this.commonAPIService.getCallLogs().subscribe((result: any) => {
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
    this.DataSource.filter = filterValue.trim().toLowerCase();
  }
}



