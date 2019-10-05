import { Component, OnInit } from '@angular/core';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { MatDialog } from '@angular/material/dialog';
import { AdvancedSearchModalComponent } from '../../../library-shared/advanced-search-modal/advanced-search-modal.component';


@Component({
  selector: 'app-school-dashboard',
  templateUrl: './school-dashboard.component.html',
  styleUrls: ['./school-dashboard.component.css']
})
export class SchoolDashboardComponent implements OnInit {
  bookDetailsArray: any[] = [];
  dashboardReservoirData: any;
  dashboardIssueBookData: any;
  dashboardDueReservoirData: any;
  issuedBookchartflag = false;
  issuedBookchart: any = {};
  issuedToTeacher = 0;
  issuedToStudent = 0;
  issuedToStaff = 0;
  reissued = 0;
  currentDate = new Date();
  result: any = {};
  constructor(private common: CommonAPIService,
    private erpCommonService: ErpCommonService, public dialog: MatDialog, ) { }

  ngOnInit() {
    this.getReservoirData();
    this.getIssueBookData();
    this.getDueReservoir();
  }


  openAdvanceSearchDialog(): void {
    const dialogRef = this.dialog.open(AdvancedSearchModalComponent, {
      width: '750px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  getReservoirData() {
    this.erpCommonService.getDashboardReservoirData({}).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.dashboardReservoirData = res.data;
      } else {

      }
    })
  }

  getIssueBookData() {
    this.erpCommonService.getDashboardIssueBookData({}).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        console.log('res', res);
        this.dashboardIssueBookData = res.data;


        var totalBookIssued = 0;
        this.issuedToTeacher = 0;
        this.issuedToStudent = 0;
        this.issuedToStaff = 0;
        this.reissued = 0;

        totalBookIssued = Number(this.dashboardIssueBookData.teachers) + Number(this.dashboardIssueBookData.students) + Number(this.dashboardIssueBookData.staff) + Number(this.dashboardIssueBookData.reissue);
        this.issuedToTeacher = Number(this.dashboardIssueBookData.teachers);
        this.issuedToStudent = Number(this.dashboardIssueBookData.students);
        this.issuedToStaff = Number(this.dashboardIssueBookData.staff);
        this.reissued = Number(this.dashboardIssueBookData.reissue);

        this.issueBookChart(this.issuedToTeacher, this.issuedToStudent, this.issuedToStaff, this.reissued, totalBookIssued);

        this.issuedBookchartflag = true;

      } else {

      }
    })
  }

  getDueReservoir() {
    this.erpCommonService.getDashboardDueReservoirData({}).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        console.log('due reservoir', res.data);
        this.dashboardDueReservoirData = res.data;
      } else {

      }
    })
  }

  issueBookChart(issuedToTeacher, issuedToStudent, issuedToStaff, reissued, totalBookIssued) {
    console.log(issuedToTeacher, issuedToStudent, issuedToStaff, reissued, totalBookIssued);
    this.issuedBookchart = {
      chart: {
        type: 'pie',
        height: '300px',
        options3d: {
          enabled: false,
          alpha: 45
        }
      },
      title: {
        text: '<b><span class="bookIssuedCountFont">' + (Number(totalBookIssued)) + '</span><b><br><span>Book Issued <span>',
        align: 'center',
        verticalAlign: 'middle',
        y: 25
      },
      plotOptions: {
        pie: {
          innerSize: 200,
          depth: 45,
          dataLabels: {
            enabled: false
          },
          colors: [
            '#9932cc',
            '#EE82EE',
            '#FFA500',
            '#808080',
          ],
        }
      },
      series: [{
        name: 'Book Issued',
        data: [
          ['issuedToTeacher', issuedToTeacher],
          ['issuedToStudent', issuedToStudent],
          ['issuedToStaff', issuedToStaff],
          ['reissued', reissued],

        ]
      }]
    };

  }

  parseDate(str) {
    var mdy = str.split('-');
    return new Date(mdy[0], mdy[1] - 1, mdy[2]);
  }

  getDaysDiff(dueDate) {
    if (dueDate) {
      var date1 = this.common.dateConvertion(new Date(), 'yyyy-MM-dd');
      var date2 = this.common.dateConvertion(dueDate, 'yyyy-MM-dd');
      var parsedDate2: any = this.parseDate(date2);
      var parsedDate1: any = this.parseDate(date1);
      return Math.round((parsedDate2 - parsedDate1) / (1000 * 60 * 60 * 24));
    }
  }
  
}