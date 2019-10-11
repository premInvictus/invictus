import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { DatePipe } from '@angular/common';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { AdvancedSearchModalComponent } from '../../../library-shared/advanced-search-modal/advanced-search-modal.component';
@Component({
  selector: 'app-view-all-due',
  templateUrl: './view-all-due.component.html',
  styleUrls: ['./view-all-due.component.css']
})
export class ViewAllDueComponent implements OnInit, AfterViewInit {


  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dueListData: any = [];
  currentSubscriptionId = '';
  DUE_LIST_ELEMENT: DueListElement[] = [];
  duelistdataSource = new MatTableDataSource<DueListElement>(this.DUE_LIST_ELEMENT);
  displayedDueListColumns: string[] = ['srno', 'reserv_id', 'title', 'issued_to', 'issued_on', 'due_date', 'late_by'];
  // subscriptionListPageIndex = 0;
  // subscriptionListPageSize = 10;
  // subscriptionListPageSizeOptions = [10, 25, 50, 100];
  showButtonStatus = true;
  pageEvent: any;
  @ViewChild('searchModal') searchModal;
  @ViewChild('bookDet')bookDet;
  constructor(public dialog: MatDialog,
    private fbuild: FormBuilder,
    private common: CommonAPIService,
    private erpCommonService: ErpCommonService) { }

  ngOnInit() {
    this.getDueReservoir('');
  }

  ngAfterViewInit() {
		this.duelistdataSource.sort = this.sort;
		this.duelistdataSource.paginator = this.paginator;
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


  getDueReservoir(bookArr) {
    const datePipe = new DatePipe('en-in');
    let inputJson =  {'viewAll': true};
    if (bookArr && bookArr.length > 0) {
      inputJson['bookData'] = bookArr;
    }

    this.erpCommonService.getDashboardDueReservoirData(inputJson).subscribe((result: any) => {
      let element: any = {};
      let recordArray = [];
      this.DUE_LIST_ELEMENT = [];
      this.duelistdataSource = new MatTableDataSource<DueListElement>(this.DUE_LIST_ELEMENT);
      if (result && result.status === 'ok') {
        let pos = 1;
        this.dueListData = recordArray = result.data.all;
        for (const item of recordArray) {
          element = {
            srno: pos,
            reserv_id: item.reserv_user_logs.reserv_id,
            title: item.reserv_user_logs.title,
            issued_to: item.user_full_name,
            issued_on: item.reserv_user_logs.issued_on,
            due_date:  item.reserv_user_logs.due_date,
            late_by: item

          };
          this.DUE_LIST_ELEMENT.push(element);
          pos++;

        }
        this.duelistdataSource = new MatTableDataSource<DueListElement>(this.DUE_LIST_ELEMENT);
        this.duelistdataSource.paginator = this.paginator;
        if (this.sort) {
          this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
          this.duelistdataSource.sort = this.sort;
        }
        
      }
    });
  }

 
  applyFilterDue(filterValue: string) {
    this.duelistdataSource.filter = filterValue.trim().toLowerCase();
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

  searchOk($event) {
    let inputJSON = {	filters: $event.filters,
      generalFilters: $event.generalFilters,
      search_from: 'master'
    };

      this.erpCommonService.getReservoirDataBasedOnFilter(inputJSON).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          let bookArr:any[] = [];
          for (const item of res.data.resultData) {
            bookArr.push(item.reserv_id);
          }

          if (bookArr.length > 0) {
            this.getDueReservoir(bookArr);
          }
        }
      });
  }

  openBookModal(book_no) {
		this.bookDet.openModal(book_no);
  }

  resetSearch() {
    this.getDueReservoir('');
  }

}


export interface DueListElement {
  srno: number;
  reserv_id: string;
  title: string;
  issued_to: string;
  issued_on: string;
  due_date: string;
  late_by: string;
}
