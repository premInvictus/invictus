import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonAPIService } from '../../_services/index';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import { SearchViaNameComponent } from '../../misc-shared/search-via-name/search-via-name.component';
import { CallRemarksComponent } from '../../misc-shared/call-remarks/call-remarks.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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
  url: any;
  displayedColumns = ['no', 'start_time', 'call_id', 'destination', 'from_caller', 'call_duration', 'to_DID', 'call_type', 'media_s3_url'];
  DataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);
  constructor(
    private commonAPIService: CommonAPIService,
    public http: HttpClient,
    public dialog: MatDialog
  ) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

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
      console.log(result);

      if (result) {
        this.url = 'http://ex4.zeotel.com/c2c?key=ossPBYWFI0XtCKiWGH0K0A-1580734293&ac=4000357&ph=8800214267&user_vars=AGENTNUMBER=9911291573&df=json';

        this.http.get(this.url).subscribe((logReturn: any) => {
          console.log('logReturn', logReturn);
        });

        const diaogRef = this.dialog.open(CallRemarksComponent, {
          width: '30%',
          height: '35%',
          position: {
            top: '10%'
          },
          data: {}
        });
      }
      // if (result) {
      //   let url = '';
      //   if (Number(result.process_type) === 1) {
      //     url = 'enquiry';
      //   } else if (Number(result.process_type) === 2) {
      //     url = 'registration';
      //   } else if (Number(result.process_type) === 3) {
      //     url = 'provisional';
      //   } else if (Number(result.process_type) === 4) {
      //     url = 'admission';
      //   } else if (Number(result.process_type) === 5) {
      //     url = 'alumini';
      //   }
      //   this.commonAPIService.setStudentData(result.adm_no, result.process_type);
      //   if ((Number(result.process_type) === 1 && this.route.snapshot.routeConfig.path === 'enquiry')
      //     || (Number(result.process_type) === 2 && this.route.snapshot.routeConfig.path === 'registration')
      //     || (Number(result.process_type) === 3 && this.route.snapshot.routeConfig.path === 'provisional')
      //     || (Number(result.process_type) === 4 && this.route.snapshot.routeConfig.path === 'admission')
      //     || (Number(result.process_type) === 5 && this.route.snapshot.routeConfig.path === 'alumini')) {
      //     this.getStudentDetailsByAdmno(result.adm_no);
      //   } else {
      //     this.router.navigate(['../' + url], { relativeTo: this.route });
      //   }
      // }

    });
  }


  // HttpClient API get() method => Fetch employees list
  // getEmployees(): Observable<CallLogsComponent> {
  //   return this.http.get<CallLogsComponent>(this.apiURL + '/employees')
  //     .pipe(
  //       retry(1),
  //       catchError(this.handleError)
  //     )
  // }
}



