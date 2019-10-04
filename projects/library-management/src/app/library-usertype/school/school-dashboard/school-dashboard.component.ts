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
  issuedBookchartflag = false;
  issuedBookchart: any = {};
  result: any = {};
  constructor(private common: CommonAPIService,
    private erpCommonService: ErpCommonService, public dialog: MatDialog, ) { }

  ngOnInit() {
    this.getReservoirData();
    this.getIssueBookData();
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
          var issuedToTeacher = 0;
          var issuedToStudent = 0;
          var issuedToStaff = 0;
          var reissued = 0;

          totalBookIssued = Number(this.dashboardIssueBookData.teachers) + Number(this.dashboardIssueBookData.students) + Number(this.dashboardIssueBookData.staff) + Number(this.dashboardIssueBookData.reissue);
          issuedToTeacher = Number(this.dashboardIssueBookData.teachers);
          issuedToStudent = Number(this.dashboardIssueBookData.students);
          issuedToStaff = Number(this.dashboardIssueBookData.staff);
          reissued = Number(this.dashboardIssueBookData.reissue);

					this.issueBookChart(issuedToTeacher,issuedToStudent, issuedToStaff, reissued, totalBookIssued  );
        
          this.issuedBookchartflag = true;

      } else {

      }
    })
  }

  issueBookChart(issuedToTeacher,issuedToStudent, issuedToStaff, reissued, totalBookIssued) {
		console.log(issuedToTeacher,issuedToStudent, issuedToStaff, reissued, totalBookIssued);
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
				text: '<b>' + (Number(totalBookIssued)) + '<b><br><b>Total Book Issued <b>',
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
						'#45aaf2',
						'#FFA502',
						'#F93434',
            '#F93434',
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


}