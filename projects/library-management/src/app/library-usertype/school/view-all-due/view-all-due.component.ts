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
  displayedDueListColumns: string[] = ['srno', 'issued_to_admission_no','user_class_name','user_sec_name', 'reserv_id', 'title', 'issued_to','issued_on','issued_by', 'due_date', 'late_by'];
  // subscriptionListPageIndex = 0;
  // subscriptionListPageSize = 10;
  // subscriptionListPageSizeOptions = [10, 25, 50, 100];
  showButtonStatus = true;
  pageEvent: any;
  @ViewChild('searchModal') searchModal;
  @ViewChild('bookDet')bookDet;
  accession_type;
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


  async getDueReservoir(bookArr) {
    const datePipe = new DatePipe('en-in');
    let inputJson =  {'viewAll': true};
    if (bookArr && bookArr.length > 0) {
      inputJson['bookData'] = bookArr;
    }
    await this.erpCommonService.getGlobalSetting({gs_alias:['accession_type']}).toPromise().then((result: any) => {
			if (result && result.status === 'ok') {
				const settings = result.data;
				for (let i=0; i< settings.length;i++) {
					if (settings[i]['gs_alias'] === 'accession_type') {
						this.accession_type = settings[i]['gs_value'];
					}
				}
			}
		});
    this.erpCommonService.getDashboardDueReservoirData(inputJson).toPromise().then((result: any) => {
      let element: any = {};
      let recordArray = [];
      this.DUE_LIST_ELEMENT = [];
      this.duelistdataSource = new MatTableDataSource<DueListElement>(this.DUE_LIST_ELEMENT);
      if (result && result.status === 'ok') {
        let pos = 1; 
        this.dueListData = recordArray = result.data.all;
        for (const item of recordArray) {
          let book_no;
          if(this.accession_type == 'single') {
            book_no = item.reserv_user_logs.reserv_no;
          } else {
            book_no = item.reserv_user_logs.accessionsequence + item.reserv_user_logs.reserv_no;
          }
          item['book_no'] = book_no;
          element = {
            srno: pos,
            book_no:book_no,
            reserv_id: item.reserv_user_logs && item.reserv_user_logs.reserv_id ? item.reserv_user_logs.reserv_id : '',
            title: item.reserv_user_logs && item.reserv_user_logs.title ? item.reserv_user_logs.title : '',
            issued_to: (item.user_role_id === 3) ? item.user_full_name + ' (T) ' : (item.user_role_id === 4) ? item.user_full_name + ' (S) ' :item.user_full_name + ' (A) ',
            issued_to_admission_no: item.user_admission_no ? item.user_admission_no : '-',
            user_class_name: item.user_class_name ? item.user_class_name : '-',
            user_sec_name: item.user_sec_name ? item.user_sec_name : '-',
            issued_on: item.reserv_user_logs && item.reserv_user_logs.issued_on ? item.reserv_user_logs.issued_on : '',
            issued_by: item.reserv_user_logs.issued_by && item.reserv_user_logs.issued_by.name ? item.reserv_user_logs.issued_by.name : '-',
            returned_by: item.reserv_user_logs.returned_by && item.reserv_user_logs.returned_by.name ? item.reserv_user_logs.returned_by.name : '-',
            due_date:  item.reserv_user_logs && item.reserv_user_logs.due_date ? item.reserv_user_logs.due_date : '',
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
      if (parsedDate2 < parsedDate1) {
        return Math.round((parsedDate2 - parsedDate1) / (1000 * 60 * 60 * 24))+' Days';
      } else {
        return '-'
      }      
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
  book_no:string;
  reserv_id: string;
  title: string;
  issued_to: string;
  issued_to_admission_no:string;
  user_class_name:string;
  user_sec_name:string;
  issued_on: string;
  issued_by:string;
  // returned_by:string;
  due_date: string;
  late_by: string;
}
