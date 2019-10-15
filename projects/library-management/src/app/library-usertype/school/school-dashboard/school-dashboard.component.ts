import { Component, OnInit, ViewChild } from '@angular/core';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { MatDialog } from '@angular/material/dialog';
import { AdvancedSearchModalComponent } from '../../../library-shared/advanced-search-modal/advanced-search-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  prevIndex = 0;
  searchForm: FormGroup;
  @ViewChild('searchModal') searchModal;
  @ViewChild('bookDet')bookDet;
  constructor(private fbuild: FormBuilder, private common: CommonAPIService,
    private erpCommonService: ErpCommonService, public dialog: MatDialog, private route: ActivatedRoute,
		private router: Router,) { }

  ngOnInit() {
    this.buildForm();
    this.getReservoirData();
    this.getIssueBookData();
    this.getDueReservoir();
  }

  openSearchDialog = (data) => { this.searchModal.openModal(data); }


  openAdvanceSearchDialog(): void {
    const dialogRef = this.dialog.open(AdvancedSearchModalComponent, {
      width: '750px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  buildForm() {
    this.searchForm = this.fbuild.group({
      searchId : ''
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
    this.issuedBookchart = {
      chart: {
        type: 'pie',
        height: '300px',
        options3d: {
          enabled: false,
          alpha: 35
        }
      },
      title: {
        text: '<b><span class="bookIssuedCountFont">' + (Number(totalBookIssued)) + '</span><b><br><br><span class="bookIssuedText">Books Issued <span>',
        align: 'center',
        verticalAlign: 'middle',
        y: 25
      },
      plotOptions: {
        pie: {
          innerSize: 220,
          depth: 35,
          dataLabels: {
            enabled: false
          },
          colors: [
           
            {
              radialGradient: { cx: 0.5, cy: 0.3, r: 0.87 },
              stops: [
                [0, '#A2A5F9'],
                [1, '#8774F3']
              ]
            },            
            {
              radialGradient: { cx: 0.5, cy: 0.3, r: 0.87 },
              stops: [
                [0, '#EBEBEB'],
                [1, '#D2D2D2']
              ]
            },
            {
              radialGradient: { cx: 0.5, cy: 0.3, r: 0.87 },
              stops: [
                [0, '#FDC830'],
                [1, '#F37335']
              ]
            },
            {
              radialGradient: { cx: 0.5, cy: 0.3, r: 0.87 },
              stops: [
                [0, '#FF839D'],
                [1, '#F50B9A']
              ]
            },
          ],
        }
      },
      series: [{
        name: 'Book Issued',
        data: [          
          ['Students', issuedToStudent],         
          ['Reissued', reissued],
          ['Staff', issuedToStaff],
          ['Teachers', issuedToTeacher],

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

  // getMainLoopLength(i) {
  //   var tot_length = 0;
  //   for (var l=0; l<=i-1;l++) {
  //     if (this.dashboardDueReservoirData['all'] && this.dashboardDueReservoirData['all'][l]) {
  //       tot_length = tot_length +this.dashboardDueReservoirData['all'][l].reserv_user_logs.length;
               
        
  //     }
  //   }
  //   return tot_length;
    
    
  // }

  searchOk($event) {
    this.common.setDashboardSearchData({	filters: $event.filters,
      generalFilters: $event.generalFilters});
      this.router.navigate(['../auxillary/book-search'], {relativeTo: this.route });	
  }
  
  search() {
    console.log(this.searchForm.value.searchId);
    this.common.setDashboardSearchData({search:this.searchForm.value.searchId});
      this.router.navigate(['../auxillary/book-search'], {relativeTo: this.route });	
  }
  
  openBookModal(book_no) {
		this.bookDet.openModal(book_no);
  }

  viewAllDue() {
    this.router.navigate(['../books-issued'], {relativeTo: this.route });	
  }
  
}