import { Component, OnInit, ViewChild } from '@angular/core';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { MatDialog } from '@angular/material/dialog';
import { AdvancedSearchModalComponent } from '../../../inventory-shared/advanced-search-modal/advanced-search-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BranchChangeService } from 'src/app/_services/branchChange.service';
@Component({
  selector: 'app-school-dashboard',
  templateUrl: './school-dashboard.component.html',
  styleUrls: ['./school-dashboard.component.css']
})
export class SchoolDashboardComponent implements OnInit {
  itemDetailsArray: any[] = [];
  dashboardInventoryData: any;
  dashboardIssueItemData: any;
  dashboardDueItemData: any;
  issuedItemChartFlag = false;
  issuedItemChart: any = {};
  issuedToTeacher = 0;
  issuedToStudent = 0;
  issuedToStaff = 0;
  reissued = 0;
  currentDate = new Date();
  result: any = {};
  dashboardDueInventoryData: any[] = [];
  dashboardReservoirData: any[] = [];
  prevIndex = 0;
  searchForm: FormGroup;
  @ViewChild('searchModal') searchModal;
  @ViewChild('itemDet') itemDet;
  constructor(private fbuild: FormBuilder, private common: CommonAPIService,
    private erpCommonService: ErpCommonService, public dialog: MatDialog, private route: ActivatedRoute,
    private router: Router, private branchChangeService: BranchChangeService) { }

  ngOnInit() {
    this.buildForm();
    this.getReservoirData();
    this.getIssueBookData();
    this.getDueReservoir();
    this.branchChangeService.branchSwitchSubject.subscribe((data:any)=>{
			if(data) {
        this.buildForm();
        this.getReservoirData();
        this.getIssueBookData();
        this.getDueReservoir();
      }
    });
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
      searchId: ''
    });
  }
  getReservoirData() {
    // this.erpCommonService.getDashboardInventoryData({}).subscribe((res: any) => {
    //   if (res && res.status === 'ok') {
    //     this.dashboardInventoryData = res.data;
    //   } else {

    //   }
    // })
  }

  getIssueBookData() {
    // this.erpCommonService.getDashboardIssueItemData({}).subscribe((res: any) => {
    //   if (res && res.status === 'ok') {
    //     console.log('res', res);
    //     this.dashboardIssueItemData = res.data;


    //     var totalItemIssued = 0;
    //     this.issuedToTeacher = 0;
    //     this.issuedToStudent = 0;
    //     this.issuedToStaff = 0;
    //     this.reissued = 0;

    //     totalItemIssued = Number(this.dashboardIssueItemData.teachers) + Number(this.dashboardIssueItemData.students) + Number(this.dashboardIssueItemData.staff);

    //     this.issuedToTeacher = Number(this.dashboardIssueItemData.teachers);
    //     this.issuedToStudent = Number(this.dashboardIssueItemData.students);
    //     this.issuedToStaff = Number(this.dashboardIssueItemData.staff);
    //     this.reissued = Number(this.dashboardIssueItemData.reissue);

    //     this.issueBookChart(this.issuedToTeacher, this.issuedToStudent, this.issuedToStaff, this.reissued, totalItemIssued);

    //     this.issuedItemChartFlag = true;

    //   } else {

    //   }
    // })
  }

  getDueReservoir() {
    // this.erpCommonService.getDashboardDueItemData({}).subscribe((res: any) => {
    //   if (res && res.status === 'ok') {
    //     console.log('due reservoir', res.data);
    //     this.dashboardDueItemData = res.data;
    //   } else {

    //   }
    // })
  }

  issueBookChart(issuedToTeacher, issuedToStudent, issuedToStaff, reissued, totalItemIssued) {
    this.issuedItemChart = {
      chart: {
        type: 'pie',
        height: '300px',
        options3d: {
          enabled: false,
          alpha: 35
        }
      },
      title: {
        text: '<b><span class="bookIssuedCountFont">' + (Number(totalItemIssued)) + '</span><b><br><br><span class="bookIssuedText">Items Issued <span>',
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
        name: 'Item Issued',
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
  //     if (this.dashboardDueItemData['all'] && this.dashboardDueItemData['all'][l]) {
  //       tot_length = tot_length +this.dashboardDueItemData['all'][l].reserv_user_logs.length;


  //     }
  //   }
  //   return tot_length;


  // }

  searchOk($event) {
    this.common.setDashboardSearchData({
      filters: $event.filters,
      generalFilters: $event.generalFilters
    });
    this.router.navigate(['../auxillary/item-search'], { relativeTo: this.route });
  }

  search() {
    console.log(this.searchForm.value.searchId);
    this.common.setDashboardSearchData({ search: this.searchForm.value.searchId });
    this.router.navigate(['../auxillary/item-search'], { relativeTo: this.route });
  }

  openItemModal(item_no) {
    this.itemDet.openModal(item_no);
  }

  viewAllDue() {
    this.router.navigate(['../item-issued'], { relativeTo: this.route });
  }
  viewSyllabus() {
    this.router.navigate(['inventory/school/store-master/procurement-master']);
  }
}
